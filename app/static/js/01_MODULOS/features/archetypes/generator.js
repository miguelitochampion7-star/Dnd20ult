import { state } from '../../../00_CORE/core/state.js';
import { updateAll } from '../character_sheet.js';
import { CLASSES, WEAPONS_DB, RACES, KEYS } from '../../../00_CORE/config.js';
import { showCustomConfirm, showCustomAlert, showToast } from '../../modals.js';
import { ARCHETYPES } from './data.js';
import { SPELL_DB } from '../../../02_DATOS/data/spells.js';

export function openGenerator() {
    let modal = document.getElementById('genModal');
    if (!modal) {
        const archKeys = Object.keys(ARCHETYPES);
        if (archKeys.length === 0) {
            showToast('Error: No se han cargado los arquetipos.', true);
            return;
        }

        const options = archKeys.map(c => `<option value="${c}">${c}</option>`).join('');

        const html = `
            <div id="genModal" class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center hidden"
                 onclick="document.getElementById('genModal').classList.add('hidden')">
                <div class="bg-[#111] border-2 border-[#c5a059] p-6 rounded-lg w-96 shadow-[0_0_30px_rgba(197,160,89,0.3)]"
                     onclick="event.stopPropagation()">
                    <h2 class="text-[#c5a059] text-xl font-bold mb-4 border-b border-[#333] pb-2">Generador de Arquetipos</h2>
                    
                    <div class="mb-4">
                        <label class="block text-gray-400 text-xs mb-1">Clase</label>
                        <select id="genClass" class="w-full bg-[#222] text-white border border-[#444] rounded p-2 focus:border-[#c5a059] outline-none">
                            ${options}
                        </select>
                    </div>

                    <div class="mb-6">
                        <label class="block text-gray-400 text-xs mb-1">Nivel: <span id="genLevelVal" class="text-white font-bold">1</span></label>
                        <input type="range" id="genLevel" min="1" max="20" value="1" class="w-full accent-[#c5a059]" 
                               oninput="document.getElementById('genLevelVal').innerText = this.value">
                    </div>

                    <div class="flex gap-2">
                        <button onclick="document.getElementById('genModal').classList.add('hidden')" class="flex-1 bg-gray-800 text-gray-300 py-2 rounded hover:bg-gray-700">Cancelar</button>
                        <button onclick="window.runGenerator()" class="flex-1 bg-[#c5a059] text-black font-bold py-2 rounded hover:bg-[#b08c45]">GENERAR</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
        modal = document.getElementById('genModal');
    }
    modal.classList.remove('hidden');
}

export async function runGenerator() {
    const cls = document.getElementById('genClass').value;
    const lvl = parseInt(document.getElementById('genLevel').value);

    // Close modal
    document.getElementById('genModal').classList.add('hidden');

    if (!await showCustomConfirm(`⚠️ ¿Crear ${cls} Nivel ${lvl}?\nEsto REEMPLAZARÁ tu personaje actual.`)) return;

    // Small delay to allow UI close
    setTimeout(() => {
        generateCharacter(cls, lvl);
    }, 50);
}

function generateCharacter(cls, lvl) {
    const ark = ARCHETYPES[cls];
    if (!ark) {
        showToast("Error: Arquetipo no encontrado", true);
        return;
    }

    // 1. Reset State
    Object.keys(state).forEach(key => delete state[key]);

    const newState = {
        name: `${cls} Nivel ${lvl}`,
        race: "Humano",
        classes: [{ id: cls, lvl: lvl }],
        stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
        hp_curr: 10,
        temp_hp: 0,
        ac_manual: { armor: 0, shield: 0, natural: 0, deflect: 0, dodge: 0, misc: 0 },
        acp_manual: 0,
        skills: {},
        weapons: [],
        inventory: [],
        spells: [],
        buffs: [],
        spellSlotsUsed: {},
        gold: 0,
        notes: ""
    };
    Object.assign(state, newState);

    // 2. Attributes
    const STANDARD = [15, 14, 13, 12, 10, 8];
    const prio = ark.priorities;

    prio.forEach((key, idx) => {
        state.stats[key] = STANDARD[idx];
    });

    const bumps = Math.floor(lvl / 4);
    if (bumps > 0) {
        state.stats[prio[0]] += bumps;
    }

    // 3. HP
    const cData = CLASSES[cls] || { hd: 8 };
    const hd = cData.hd;
    const conMod = Math.floor((state.stats.con - 10) / 2);

    let hp = hd + conMod;
    if (lvl > 1) {
        const avg = (hd / 2) + 1;
        hp += (avg + conMod) * (lvl - 1);
    }
    state.hp_curr = Math.max(1, Math.floor(hp));

    // 4. Gear
    const tiers = [1, 5, 10, 15, 20];
    let bestTier = 1;
    tiers.forEach(t => { if (lvl >= t) bestTier = t; });

    if (ark.gear && ark.gear[bestTier]) {
        ark.gear[bestTier].forEach(item => {
            state.inventory.push({ n: item, w: 0, q: 1 });
        });
    }

    // 5. Spells
    if (ark.spells) {
        const spellDB = SPELL_DB;

        for (const [sLvlStr, list] of Object.entries(ark.spells)) {
            const listArr = list || [];
            listArr.forEach(spellName => {
                const dbSpell = spellDB.find(x => x.n === spellName);
                if (dbSpell) {
                    state.spells.push({ n: spellName, l: `N${sLvlStr}`, d: dbSpell.d });
                } else {
                    state.spells.push({ n: spellName, l: `N${sLvlStr}`, d: "Descripción no disponible." });
                }
            });
        }
    }

    // 6. Update UI
    if (document.getElementById('charName')) document.getElementById('charName').value = state.name;
    KEYS.forEach(k => {
        const el = document.getElementById('base_' + k);
        if (el) el.value = state.stats[k];
    });

    updateAll();
    showToast(`✨ Personaje generado: ${cls} Nivel ${lvl}`);
}
