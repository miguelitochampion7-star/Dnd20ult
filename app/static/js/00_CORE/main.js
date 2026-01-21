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
import { APIClient, AutoSaver } from './api.js';

// --- Initialization ---

// Global Instances
const api = new APIClient();

// Expose Globals for Inline Scripts (index.html, etc.)
window.state = state;
window.api = api;
window.AutoSaver = AutoSaver;

window.loadDataFromJSON = function (data) {
    if (!data) return;

    // 1. Merge Data
    Object.assign(state, data);

    // 2. Update DOM Inputs
    if (document.getElementById('charName')) document.getElementById('charName').value = state.name || '';
    if (document.getElementById('raceSelect')) document.getElementById('raceSelect').value = state.race || 'Humano';
    if (document.getElementById('hpCurr')) document.getElementById('hpCurr').value = state.hp_curr || 0;
    if (document.getElementById('inventory')) document.getElementById('inventory').value = state.inventory || '';
    if (document.getElementById('gold')) document.getElementById('gold').value = state.gold || 0;

    // AC
    if (state.ac_manual) {
        if (document.getElementById('acArmor')) document.getElementById('acArmor').value = state.ac_manual.armor || 0;
        if (document.getElementById('acShield')) document.getElementById('acShield').value = state.ac_manual.shield || 0;
        if (document.getElementById('acNatural')) document.getElementById('acNatural').value = state.ac_manual.natural || 0;
        if (document.getElementById('acDeflect')) document.getElementById('acDeflect').value = state.ac_manual.deflect || 0;
    }

    // Stats
    KEYS.forEach(k => {
        if (document.getElementById('base_' + k)) document.getElementById('base_' + k).value = state.stats[k] || 10;
    });

    // 3. Trigger Logic
    updateAll();
    showToast("Ficha cargada correctamente");
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();
    try {
        initUI();
        initGestures();

        // Listen for internal state updates
        document.addEventListener('state:updated', () => updateAll());

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

    // Buffs List (Static from Config)
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
    // Simplified for robustness
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

window.updateAll = updateAll;
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

// Actions that need to be globally accessible for HTML onclicks
window.modLvl = function (i, val) {
    state.classes[i].lvl += val;
    if (state.classes[i].lvl <= 0) state.classes.splice(i, 1);
    updateAll();
};

window.setSkill = function (n, v) {
    state.skills[n] = parseInt(v) || 0;
    updateAll();
};

window.addWeapon = function () {
    state.weapons.push(document.getElementById('weaponSelect').value);
    updateAll();
};

window.remWeapon = function (i) {
    state.weapons.splice(i, 1);
    updateAll();
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
    updateAll();
};

window.addClass = function () {
    state.classes.push({ id: document.getElementById('addClassSelect').value, lvl: 1 });
    updateAll();
};

window.rollCheck = function (s) {
    // Simplified wrapper for legacy calls
    // Logic needs to find modifier from DOM or State
    let mod = 0;
    if (STATS.includes(s)) {
        // Find mod from state to be safe
        const key = KEYS[STATS.indexOf(s)];
        // We can't access computed mods easily without recalculating or reading DOM.
        // Reading DOM is safer for "what you see is what you get"
        const mEl = document.getElementById('mod_' + key);
        if (mEl) mod = parseInt(mEl.innerText.replace('+', ''));
    }
    // ... complete logic for other checks if needed, or rely on user to verify
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

    updateAll();
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
    updateAll();
    showToast("Puntos de habilidad distribuidos.");
};

// --- Roll Custom Dice (Global Wrapper) ---
window.rollCustomDice = rollCustomDice;
