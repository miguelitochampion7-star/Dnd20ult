// Main Entry Point
import { state } from './core/state.js';
import { RACES, CLASSES, BUFFS, WEAPONS_DB, KEYS, STATS } from './config.js';
import { updateAll } from './modules/features/character_sheet.js';
import {
    toggleCompendium, addSpellFromDB, remSpell, toggleSpellCard,
    showSpellInfoCard, closeSpellInfoCard, toggleSpellSlot, resetSpellSlots
} from './modules/features/spell_compendium.js';
import { openGenerator, runGenerator } from './modules/features/archetypes/generator.js';
import { switchTab, toggleSidebar, toggleFullScreen } from './modules/ui/tabs.js';
import { showCustomAlert, showCustomConfirm, showToast } from './modules/ui/modals.js';
import { rollCustomDice, logRoll, rollDamage } from './modules/mechanics/dice.js';

// --- Initialization ---

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
