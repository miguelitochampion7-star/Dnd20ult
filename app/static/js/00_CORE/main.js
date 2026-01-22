// Main Entry Point
import { state } from './core/state.js';
import { RACES, CLASSES, BUFFS, WEAPONS_DB, KEYS, STATS } from './config.js';
import { updateAll } from '../01_MODULOS/features/character_sheet.js';
import {
    toggleCompendium, addSpellFromDB, remSpell, toggleSpellCard,
    showSpellInfoCard, closeSpellInfoCard, toggleSpellSlot, resetSpellSlots
} from '../01_MODULOS/features/magic/ui.js';
import { openGenerator, runGenerator } from '../01_MODULOS/features/archetypes/generator.js';
import { switchTab, toggleSidebar, toggleFullScreen } from '../01_MODULOS/ui/tabs.js';
import { showCustomAlert, showCustomConfirm, showToast } from '../01_MODULOS/modals.js';
import { rollCustomDice, logRoll, rollDamage } from '../01_MODULOS/mechanics/dice.js';
// import { APIClient, AutoSaver } from './api.js'; // REMOVED to fix import error
// -- INLINED API CLIENT & AUTOSAVER TO FIX LOAD ISSUES --

// API Client para comunicación con el backend
class APIClient {
    constructor() {
        this.baseURL = '/api';
    }

    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, error: error.message };
        }
    }

    // Obtener lista de fichas
    async getFichas() {
        return this.request('/fichas');
    }

    // Obtener una ficha específica
    async getFicha(id) {
        return this.request(`/fichas/${id}`);
    }

    // Crear nueva ficha
    async createFicha(data) {
        return this.request('/fichas', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Actualizar ficha
    async updateFicha(id, data) {
        return this.request(`/fichas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // Eliminar ficha
    async deleteFicha(id) {
        return this.request(`/fichas/${id}`, {
            method: 'DELETE'
        });
    }

    // Obtener usuario actual
    async getCurrentUser() {
        return this.request('/user');
    }
}

// Auto-guardado inteligente
class AutoSaver {
    constructor(saveFunction, interval = 10000) {
        this.saveFunction = saveFunction;
        this.interval = interval;
        this.timeoutId = null;
        this.isSaving = false;
        this.hasChanges = false;
    }

    // Marcar que hay cambios pendientes
    markDirty() {
        this.hasChanges = true;
        this.scheduleSave();
    }

    // Programar guardado
    scheduleSave() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }

        this.timeoutId = setTimeout(() => {
            this.save();
        }, this.interval);
    }

    // Guardar ahora
    async save() {
        if (!this.hasChanges || this.isSaving) return;

        this.isSaving = true;
        this.showStatus('saving');

        try {
            await this.saveFunction();
            this.hasChanges = false;
            this.showStatus('saved');
        } catch (error) {
            console.error('Error al guardar:', error);
            this.showStatus('error');
            // Reintentar en 5 segundos
            setTimeout(() => this.save(), 5000);
        } finally {
            this.isSaving = false;
        }
    }

    // Mostrar estado de guardado
    showStatus(status) {
        const indicator = document.getElementById('save-indicator');
        if (!indicator) return;

        const messages = {
            saving: { text: '💾 Guardando...', class: 'text-yellow-400' },
            saved: { text: '✅ Guardado', class: 'text-green-400' },
            error: { text: '⚠️ Error al guardar', class: 'text-red-400' }
        };

        const msg = messages[status];
        indicator.textContent = msg.text;
        indicator.className = `text-sm ${msg.class}`;

        // Ocultar mensaje de "guardado" después de 3 segundos
        if (status === 'saved') {
            setTimeout(() => {
                indicator.textContent = '';
            }, 3000);
        }
    }

    // Forzar guardado inmediato
    forceSave() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        return this.save();
    }
}
// -- END INLINED CLASSES --

// --- Global Instances ---
const api = new APIClient();
let autoSaver = null;

// Expose Globals for Inline Scripts
window.state = state;
window.api = api;

// --- Ficha Loading & Saving ---

function getFichaId() {
    // Get ficha ID from global variable set by template
    return window.FICHA_ID || null;
}

async function loadFichaFromDB() {
    const fichaId = getFichaId();

    if (!fichaId || fichaId === 'None') {
        console.log("No ficha ID found, skipping load");
        return;
    }

    if (fichaId === 'new') {
        // Create new ficha
        const result = await api.createFicha({
            nombre_personaje: 'Nuevo Personaje',
            data_json: state
        });

        if (result.success && result.ficha) {
            window.location.href = `/ficha/${result.ficha.id}`;
        } else {
            console.error('Error creating ficha:', result.error);
            showToast('Error creando ficha: ' + result.error, 'error');
        }
        return;
    }

    // Load existing ficha
    console.log("Loading ficha:", fichaId);
    const result = await api.getFicha(fichaId);

    if (result.success && result.ficha) {
        loadDataFromJSON(result.ficha.data_json);
        initAutoSaver(fichaId);
        showToast("Ficha cargada correctamente");
    } else {
        console.error('Error loading ficha:', result.error);
        showToast('Error cargando ficha: ' + result.error, 'error');
    }
}

function initAutoSaver(fichaId) {
    autoSaver = new AutoSaver(async () => {
        const nombre = state.name || document.getElementById('charName')?.value || 'Sin Nombre';

        await api.updateFicha(fichaId, {
            nombre_personaje: nombre,
            data_json: state
        });
    }, 10000); // Save every 10 seconds

    console.log("AutoSaver initialized for ficha:", fichaId);
}

window.loadDataFromJSON = function (data) {
    if (!data) return;

    // 1. Merge Data into state
    Object.assign(state, data);

    // 2. Update DOM Inputs
    setInputValue('charName', state.name);
    setInputValue('raceSelect', state.race);
    setInputValue('hpCurr', state.hp_curr);
    setInputValue('inventory', state.inventory);
    setInputValue('gold', state.gold);

    // AC
    if (state.ac_manual) {
        setInputValue('acArmor', state.ac_manual.armor);
        setInputValue('acShield', state.ac_manual.shield);
        setInputValue('acNatural', state.ac_manual.natural);
        setInputValue('acDeflect', state.ac_manual.deflect);
    }

    // Stats
    KEYS.forEach(k => {
        setInputValue('base_' + k, state.stats?.[k] || 10);
    });

    // 3. Trigger full UI update
    updateAll();
};

function setInputValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val !== undefined && val !== null ? val : '';
}

// --- Manual Save ---
window.manualSave = async function () {
    if (autoSaver) {
        autoSaver.hasChanges = true; // Force save even if no changes detected
        await autoSaver.forceSave();
        showToast('✅ Ficha guardada correctamente');
    } else {
        showToast('⚠️ Auto-guardado no inicializado', 'warning');
    }
};

// --- Delete Ficha ---
window.deleteFicha = async function () {
    const fichaId = getFichaId();

    if (!fichaId || fichaId === 'new' || fichaId === 'None') {
        showCustomAlert('No se puede eliminar una ficha no guardada');
        return;
    }

    if (!await showCustomConfirm('⚠️ ¿Estás seguro de eliminar esta ficha?\n\nEsta acción no se puede deshacer.')) {
        return;
    }

    const result = await api.deleteFicha(fichaId);
    if (result.success) {
        showToast('✅ Ficha eliminada correctamente');
        setTimeout(() => window.location.href = '/dashboard', 1000);
    } else {
        showToast('❌ Error al eliminar: ' + result.error, 'error');
    }
};

// --- Rest Character ---  
window.restCharacter = async function () {
    if (!await showCustomConfirm("¿Realizar Descanso Largo?\n(Recuperar PG, Hechizos y eliminar fatiga)")) return;

    // Heal HP
    const maxHP = parseInt(document.getElementById('hpMax')?.innerText) || 10;
    state.hp_curr = maxHP;
    const hpInput = document.getElementById('hpCurr');
    if (hpInput) hpInput.value = maxHP;

    // Clear Used Slots
    state.used_slots = {};

    // Clear Buffs
    state.buffs = [];

    updateAll();
    logRoll("Descanso Largo", 0, 0, "Recuperación completa");
};

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();

    try {
        initUI();
        initGestures();

        // Load ficha from database
        loadFichaFromDB();

        // Initial UI render
        updateAll();

        console.log("Abyssal Engine (Modular) Loaded 🚀");
    } catch (e) {
        console.error(e);
        showCustomAlert("Error iniciando interfaz: " + e.message, "Error Fatal");
    }
});

function initUI() {
    // Populate Selects
    const rSel = document.getElementById('raceSelect');
    if (rSel) Object.keys(RACES).forEach(r => rSel.add(new Option(r, r)));

    const acSel = document.getElementById('addClassSelect');
    if (acSel) Object.keys(CLASSES).forEach(c => acSel.add(new Option(c, c)));

    const wSel = document.getElementById('weaponSelect');
    if (wSel) WEAPONS_DB.forEach((w, i) => wSel.add(new Option(w.n, i)));

    // Setup Stats Grid
    const sGrid = document.getElementById('statsGrid');
    if (sGrid) {
        sGrid.innerHTML = '';
        KEYS.forEach(k => {
            const label = STATS[KEYS.indexOf(k)].substring(0, 3);
            sGrid.innerHTML += `
                <div class="bg-black/30 border border-[#333] rounded p-2 text-center hover:border-[#c5a059] transition group" title="Click para tirar">
                    <div class="text-[10px] uppercase text-gray-500 font-bold mb-1 cursor-pointer group-hover:text-[#c5a059]" onclick="window.rollCheck('${STATS[KEYS.indexOf(k)]}')">${label}</div>
                    <div class="text-2xl font-bold text-white mb-1" id="mod_${k}">+0</div>
                    <div class="flex justify-center">
                        <input type="number" id="base_${k}" value="10" class="w-8 text-center bg-transparent border-b border-[#555] text-xs text-gray-400 focus:text-white focus:border-[#c5a059] focus:outline-none" oninput="window.updateAll()">
                    </div>
                    <div class="text-[9px] text-[#555] mt-1">TOT: <span id="tot_${k}">10</span></div>
                </div>`;
        });
    }

    // Buffs List
    const bContainer = document.getElementById('buffsContainer');
    if (bContainer) {
        bContainer.innerHTML = '';
        BUFFS.forEach(b => {
            bContainer.innerHTML += `
                <div class="buff-item" onclick="window.toggleBuff('${b.id}')" id="buff_${b.id}">
                    <div class="flex items-center gap-2">
                        <div class="buff-indicator"></div>
                        <span class="text-gray-400 hover:text-white select-none text-xs font-bold">${b.n}</span>
                    </div>
                </div>`;
        });
    }
}

function initGestures() {
    const sb = document.getElementById('sidebar');
    if (!sb) return;

    let touchstartX = 0;
    let touchendX = 0;

    sb.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sb.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        if (touchendX < touchstartX - 50 && sb.classList.contains('open')) toggleSidebar();
    }, { passive: true });
}

// --- Expose Globals (Legacy Compatibility) ---

// Wrap updateAll to trigger autosave
const originalUpdateAll = updateAll;
window.updateAll = function () {
    originalUpdateAll();
    if (autoSaver) {
        autoSaver.markDirty();
    }
};

window.toggleCompendium = toggleCompendium;
window.addSpellFromDB = addSpellFromDB;
window.remSpell = remSpell;
window.toggleSpellCard = toggleSpellCard;
window.showSpellInfoCard = showSpellInfoCard;
window.closeSpellInfoCard = closeSpellInfoCard;
window.toggleSpellSlot = toggleSpellSlot;
window.resetSpellSlots = resetSpellSlots;
window.openGenerator = openGenerator;
window.runGenerator = runGenerator;

window.switchTab = switchTab;
window.toggleSidebar = toggleSidebar;
window.toggleFullScreen = toggleFullScreen;
window.showToast = showToast;
window.showCustomAlert = showCustomAlert;
window.showCustomConfirm = showCustomConfirm;
window.logRoll = logRoll;
window.rollDamage = rollDamage;
window.rollCustomDice = rollCustomDice;

// Actions that need to be globally accessible for HTML onclicks
window.modLvl = function (i, val) {
    state.classes[i].lvl += val;
    if (state.classes[i].lvl <= 0) state.classes.splice(i, 1);
    window.updateAll();
};

window.setSkill = function (n, v) {
    state.skills[n] = parseInt(v) || 0;
    window.updateAll();
};

window.addWeapon = function () {
    state.weapons.push(document.getElementById('weaponSelect').value);
    window.updateAll();
};

window.remWeapon = function (i) {
    state.weapons.splice(i, 1);
    window.updateAll();
};

window.toggleBuff = function (id) {
    const idx = state.buffs.indexOf(id);
    const el = document.getElementById('buff_' + id);
    if (idx === -1) {
        state.buffs.push(id);
        if (el) el.classList.add('active');
    } else {
        state.buffs.splice(idx, 1);
        if (el) el.classList.remove('active');
    }
    window.updateAll();
};

window.addClass = function () {
    state.classes.push({ id: document.getElementById('addClassSelect').value, lvl: 1 });
    window.updateAll();
};

window.rollCheck = function (s) {
    let mod = 0;
    if (STATS.includes(s)) {
        const key = KEYS[STATS.indexOf(s)];
        const mEl = document.getElementById('mod_' + key);
        if (mEl) mod = parseInt(mEl.innerText.replace('+', ''));
    }
    logRoll(s, mod);
};

// --- Standard Distribution ---
window.distributeAttributes = async function () {
    if (!await showCustomConfirm("¿Asignar automáticamente? Se sobrescribirán tus atributos actuales.")) return;

    const STANDARD = [15, 14, 13, 12, 10, 8];

    const PRIORITIES = {
        'Barbaro': ['str', 'con', 'dex', 'wis', 'int', 'cha'],
        'Bardo': ['cha', 'dex', 'int', 'con', 'wis', 'str'],
        'Clerigo': ['wis', 'con', 'str', 'cha', 'int', 'dex'],
        'Druida': ['wis', 'con', 'dex', 'int', 'str', 'cha'],
        'Guerrero': ['str', 'con', 'dex', 'wis', 'int', 'cha'],
        'Monje': ['wis', 'dex', 'str', 'con', 'int', 'cha'],
        'Paladin': ['str', 'cha', 'wis', 'con', 'int', 'dex'],
        'Explorador': ['dex', 'str', 'wis', 'con', 'int', 'cha'],
        'Picaro': ['dex', 'int', 'cha', 'con', 'wis', 'str'],
        'Hechicero': ['cha', 'dex', 'con', 'int', 'wis', 'str'],
        'Mago': ['int', 'dex', 'con', 'wis', 'cha', 'str']
    };

    const mainClass = state.classes.length > 0 ? state.classes[0].id : 'Guerrero';
    const prio = PRIORITIES[mainClass] || PRIORITIES['Guerrero'];

    prio.forEach((key, idx) => {
        state.stats[key] = STANDARD[idx];
        const el = document.getElementById('base_' + key);
        if (el) el.value = STANDARD[idx];
    });

    window.updateAll();
    showToast(`Atributos asignados para ${mainClass}.`);
};

// --- Auto Distribute Skills ---
window.autoDistributeSkills = function () {
    let totalLvl = 0;
    let totalPts = 0;

    const intMod = parseInt(document.getElementById('mod_int')?.innerText) || 0;
    const raceSp = (RACES[state.race] || {}).sp || 0;

    state.classes.forEach((c, idx) => {
        totalLvl += c.lvl;
        const cd = CLASSES[c.id];
        if (!cd) return;
        let pts = Math.max(1, cd.sp + intMod + raceSp);
        totalPts += (idx === 0 ? pts * 4 : pts) * c.lvl;
    });

    // Identify Class Skills
    let classSkills = [];
    state.classes.forEach(c => {
        const cData = CLASSES[c.id];
        if (cData && cData.cs) classSkills.push(...cData.cs);
    });
    classSkills = [...new Set(classSkills)];

    // Calculate remaining
    let remaining = totalPts;
    let currentSpent = 0;
    for (let k in state.skills) currentSpent += state.skills[k];
    remaining -= currentSpent;

    if (remaining <= 0) {
        showCustomAlert("No quedan puntos de habilidad por asignar.");
        return;
    }

    const maxRank = totalLvl + 3;
    let anyChange = true;

    while (remaining > 0 && anyChange) {
        anyChange = false;
        for (let skillName of classSkills) {
            if (remaining <= 0) break;

            const current = state.skills[skillName] || 0;
            if (current < maxRank) {
                state.skills[skillName] = current + 1;
                remaining--;
                anyChange = true;
            }
        }
    }
    window.updateAll();
    showToast("Puntos de habilidad distribuidos.");
};

// --- Export/Import JSON ---
window.saveData = function () {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.name || 'personaje'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Ficha exportada correctamente");
};

window.loadData = function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);
            window.loadDataFromJSON(data);
            showToast("Ficha importada correctamente");
        } catch (err) {
            showCustomAlert("Error al importar: " + err.message);
        }
    };
    reader.readAsText(file);
};

// --- Roll Formula (Dice Tray) ---
window.rollFormula = function () {
    const count = parseInt(document.getElementById('diceCount')?.value) || 1;
    const sides = parseInt(document.getElementById('diceType')?.value) || 20;
    const mod = parseInt(document.getElementById('diceMod')?.value) || 0;

    let total = 0;
    let rolls = [];
    for (let i = 0; i < count; i++) {
        const roll = Math.floor(Math.random() * sides) + 1;
        rolls.push(roll);
        total += roll;
    }
    total += mod;

    logRoll(`${count}d${sides}${mod >= 0 ? '+' : ''}${mod}`, mod, total, `Dados: [${rolls.join(', ')}]`);
};

// --- Roll D20 ---
window.rollD20 = function () {
    const roll = Math.floor(Math.random() * 20) + 1;
    logRoll("d20", 0, roll);
};
