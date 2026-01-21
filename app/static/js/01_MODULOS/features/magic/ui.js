import { state, globalFlags } from '../../../00_CORE/core/state.js';
import { SPELLS_PER_DAY } from '../../../00_CORE/config.js';
import { SPELL_DB } from '../../../02_DATOS/data/spells.js';
import { showToast, showCustomConfirm } from '../../modals.js';
import { getCasterClasses, getMaxSpellLevel, getSlotsForClass, getAvailableSpellsForClass } from './core.js';
import { getClassColor, getClassBg } from './data_parser.js';
import { showSpellInfoCard, closeSpellInfoCard } from './spell_card.js';

// --- STATE TRACKING ---
let selectedClassIndex = 0; // For multiclass UI toggle

export function toggleCompendium() {
    globalFlags.COMPENDIUM_OPEN = !globalFlags.COMPENDIUM_OPEN;
    renderMagicUI();
}

/**
 * Main Render Function for the Magic Tab and Compendium.
 * Called by main.js updateAll() or internal events.
 */
export function renderMagicUI() {
    const magicTab = document.getElementById('tab-Magic');
    if (magicTab && magicTab.classList.contains('hidden')) return; // Opt: Don't render if tab hidden? 
    // Actually engine renders everything.

    const div = document.getElementById('spellsList'); // The Grimoire Container
    if (!div) return;
    div.innerHTML = "";

    const casters = getCasterClasses();

    if (casters.length === 0) {
        div.innerHTML = `
            <div class="flex flex-col items-center justify-center p-8 border border-[#333] bg-black/40 rounded-lg text-center opacity-70">
                <i data-lucide="lock" class="w-12 h-12 text-gray-600 mb-4"></i>
                <h3 class="text-gray-400 font-bold text-lg mb-2">Sin Conocimientos Mágicos</h3>
                <p class="text-xs text-gray-500 max-w-md">Tu personaje no posee niveles en ninguna clase lanzadora de conjuros.</p>
            </div>`;

        // Hide compendium button/panel
        const compBtn = document.getElementById('btnCompendium');
        if (compBtn) compBtn.classList.add('hidden');
        document.getElementById('compendiumPanel')?.classList.add('hidden');
        return;
    }

    // Determine Active Class for View
    // If selected index out of bounds, reset
    if (selectedClassIndex >= casters.length) selectedClassIndex = 0;
    const activeClass = casters[selectedClassIndex];
    const spd = SPELLS_PER_DAY[activeClass.id];

    // --- RENDER CLASS SELECTOR (Multiclass) ---
    if (casters.length > 1) {
        const selector = document.createElement('div');
        selector.className = "flex gap-2 mb-4 overflow-x-auto";
        casters.forEach((c, idx) => {
            const isActive = idx === selectedClassIndex;
            const color = getClassColor(c.id).replace('text-', 'bg-');
            // Simplified styling
            selector.innerHTML += `
                <button onclick="window.magic_selectClass(${idx})" 
                        class="px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border transition-all
                               ${isActive ? 'border-white text-white ' + getClassBg(c.id) : 'border-gray-700 text-gray-500 hover:text-gray-300'}">
                    ${c.id} ${c.lvl}
                </button>
            `;
        });
        div.appendChild(selector);
    }

    // --- RENDER GRIMOIRE (Known Spells) ---
    // Filter user's known spells matching active class rules?
    // Current data model: `state.spells` is just a list. It doesn't tag which class learned it.
    // Issue: A lv1 Cleric / lv1 Wizard knows "Light". Is it Cleric Light or Wizard Light?
    // For now, we show ALL known spells, OR we attempt to categorize.
    // Categorizing is hard without metadata. 
    // Let's show all spells grouped by level, but styled by active class? 
    // BETTER: Show all spells, but Slots are strictly Active Class slots?
    // No, Slots must separate per class.

    // RENDER SLOTS & SPELLS
    renderClassGrimoire(div, activeClass);

    // --- RENDER COMPENDIUM BUTTON ---
    const compBtn = document.getElementById('btnCompendium');
    if (compBtn) {
        compBtn.classList.remove('hidden');
        const themeColor = getClassColor(activeClass.id);

        if (globalFlags.COMPENDIUM_OPEN) {
            compBtn.className = "w-full py-2 bg-[#c5a059] text-black font-bold uppercase rounded hover:brightness-110 mb-4 transition-colors flex items-center justify-center gap-2";
            compBtn.innerHTML = `<i data-lucide="book-open" class="w-4 h-4"></i> Cerrar Compendio`;
        } else {
            compBtn.className = "w-full py-2 border border-[#333] text-gray-400 hover:text-white hover:border-white rounded mb-4 transition-colors flex items-center justify-center gap-2";
            compBtn.innerHTML = `<i data-lucide="book" class="w-4 h-4"></i> Abrir Compendio de ${activeClass.id}`;
        }
    }

    // --- RENDER COMPENDIUM PANEL ---
    const compPanel = document.getElementById('compendiumPanel');
    if (compPanel) {
        if (globalFlags.COMPENDIUM_OPEN) {
            compPanel.classList.remove('hidden');
            renderClassCompendium(compPanel, activeClass);
        } else {
            compPanel.classList.add('hidden');
        }
    }

    lucide.createIcons();
}

function renderClassGrimoire(container, classObj) {
    const spd = SPELLS_PER_DAY[classObj.id];
    const attrVal = state.stats[spd.attr] || 10;
    const slots = getSlotsForClass(classObj.id, classObj.lvl, attrVal);
    const maxLvl = getMaxSpellLevel(classObj.id, classObj.lvl);

    const themeText = getClassColor(classObj.id);
    const themeBg = getClassBg(classObj.id);

    // Slots UI
    // We only show slots for the active class logic. 
    // Warning: `state.spellSlotsUsed` uses global indices. 
    // Ideally, `spellSlotsUsed` should be `{ 'Mago': {1: 2}, 'Clerigo': {1: 0} }`. 
    // Current model is simple object `{ 1: 0, 2: 0 }`. It clashes for multiclass.
    // Refactor Plan: Separate usage? For now, shared usage is "ok" but risky.
    // Let's migrate to `state.spellSlotsUsed[classObj.id][lvl]` logic if possible.
    // Backward compat check:
    if (!state.spellSlotsUsed[classObj.id]) state.spellSlotsUsed[classObj.id] = {};

    // Group Known Spells by Level
    // TODO: Filter known spells relevant to this class?
    // Since we don't store "Class Source" in `state.spells`, we display ALL.
    // This is a limitation of current data model.
    const spellsByLvl = {};
    state.spells.forEach((s, i) => {
        // Parse "N1", "N2"
        const lvl = parseInt(s.l.replace('N', '')) || 0;
        if (!spellsByLvl[lvl]) spellsByLvl[lvl] = [];
        spellsByLvl[lvl].push({ ...s, idx: i });
    });

    // Iterate Levels from 0 to Max
    for (let l = 0; l <= maxLvl; l++) {
        const totalSlots = slots[l] || 0;
        const used = (state.spellSlotsUsed[classObj.id] || {})[l] || 0;
        const knownAtLvl = spellsByLvl[l] || [];

        // Skip empty levels (no slots, no spells)
        if (totalSlots === 0 && knownAtLvl.length === 0) continue;

        const section = document.createElement('div');
        section.className = "mb-4 border border-[#333] rounded bg-black/20 overflow-hidden";

        // Header
        const header = document.createElement('div');
        header.className = `px-3 py-2 flex justify-between items-center ${themeBg} border-b border-[#333]`;
        const dots = Array(totalSlots).fill(0).map((_, i) => i < used ? '●' : '○').join('');

        header.innerHTML = `
            <div class="font-bold ${themeText} text-xs uppercase tracking-widest">Nivel ${l}</div>
            <div class="text-[10px] text-gray-500 font-mono tracking-widest">${dots}</div>
        `;
        section.appendChild(header);

        // Slots Interaction
        if (totalSlots > 0) {
            const slotsRow = document.createElement('div');
            slotsRow.className = "p-2 flex gap-1 justify-end border-b border-[#333] bg-black/40";

            for (let s = 0; s < totalSlots; s++) {
                const isUsed = s < used;
                const btn = document.createElement('button');
                btn.className = `w-6 h-6 rounded border flex items-center justify-center transition-all hover:scale-110 
                                 ${isUsed ? 'bg-transparent border-gray-700 text-gray-600' : `${themeBg} ${themeText} border-transparent shadow`}`;
                btn.innerHTML = isUsed ? '' : '✦';
                btn.onclick = () => {
                    // Toggle Logic
                    const current = (state.spellSlotsUsed[classObj.id] || {})[l] || 0;
                    if (!state.spellSlotsUsed[classObj.id]) state.spellSlotsUsed[classObj.id] = {};

                    if (s < current) state.spellSlotsUsed[classObj.id][l] = s;
                    else state.spellSlotsUsed[classObj.id][l] = s + 1;

                    renderMagicUI(); // Redraw
                };
                slotsRow.appendChild(btn);
            }
            section.appendChild(slotsRow);
        }

        // List Known
        if (knownAtLvl.length > 0) {
            knownAtLvl.forEach(spell => {
                const row = document.createElement('div');
                row.className = "p-2 flex justify-between items-center border-b border-[#333] last:border-0 hover:bg-white/5 group";
                row.innerHTML = `
                    <div class="flex items-center gap-2 cursor-pointer" onclick="window.showSpellInfoCard('${spell.n.replace(/'/g, "\\'")}')">
                       <i data-lucide="scroll" class="w-3 h-3 text-gray-600"></i>
                       <span class="text-sm text-gray-300 font-medium group-hover:text-white transition-colors">${spell.n}</span>
                    </div>
                    <button onclick="window.remSpell(${spell.idx})" class="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 p-1">
                        <i data-lucide="trash" class="w-3 h-3"></i>
                    </button>
                `;
                section.appendChild(row);
            });
        } else {
            const empty = document.createElement('div');
            empty.className = "p-2 text-center text-[10px] text-gray-600 italic";
            empty.innerText = "Ningun hechizo memorizado";
            section.appendChild(empty);
        }

        container.appendChild(section);
    }
}

function renderClassCompendium(container, classObj) {
    container.innerHTML = "";

    // Header Info
    const maxLvl = getMaxSpellLevel(classObj.id, classObj.lvl);
    const availableSpells = getAvailableSpellsForClass(classObj.id, maxLvl);
    const themeText = getClassColor(classObj.id);

    // Group by Level
    const byLvl = {};
    availableSpells.forEach(s => {
        if (!byLvl[s.castLvl]) byLvl[s.castLvl] = [];
        byLvl[s.castLvl].push(s);
    });

    const info = document.createElement('div');
    info.className = "mb-2 p-2 text-xs text-center border-b border-[#c5a059] text-[#c5a059]";
    info.innerHTML = `Viendo lista de <span class="font-bold uppercase ${themeText}">${classObj.id}</span> (Acceso hasta Nivel ${maxLvl})`;
    container.appendChild(info);

    Object.keys(byLvl).sort((a, b) => a - b).forEach(lvl => {
        const spells = byLvl[lvl];
        spells.sort((a, b) => a.n.localeCompare(b.n));

        const group = document.createElement('details');
        group.className = "mb-1 group/lvl";

        group.innerHTML = `
            <summary class="cursor-pointer bg-black/40 p-2 flex justify-between items-center border border-[#333] hover:border-gray-500">
                 <span class="font-bold text-gray-400 text-xs uppercase">Nivel ${lvl}</span>
                 <span class="text-[10px] text-gray-600">${spells.length}</span>
            </summary>
            <div class="bg-black/20 p-1 border-x border-b border-[#333] max-h-60 overflow-y-auto custom-scroll">
                ${spells.map(s => {
            const known = state.spells.some(x => x.n === s.n);
            return `
                    <div class="flex justify-between items-center p-1.5 hover:bg-white/5 rounded group/item">
                        <span class="text-xs text-gray-300 cursor-pointer" onclick="window.showSpellInfoCard('${s.n.replace(/'/g, "\\'")}')">${s.n}</span>
                        ${known
                    ? `<i data-lucide="check" class="w-3 h-3 text-green-500"></i>`
                    : `<button onclick="window.addSpellFromDB('${s.n.replace(/'/g, "\\'")}', ${lvl})" class="text-[#c5a059] hover:text-white"><i data-lucide="plus" class="w-3 h-3"></i></button>`
                }
                    </div>`
        }).join('')}
            </div>
        `;
        container.appendChild(group);
    });
}

// --- GLOBAL ACTIONS ---
window.magic_selectClass = function (idx) {
    selectedClassIndex = idx;
    renderMagicUI();
}

// showSpellInfoCard and closeSpellInfoCard are now imported from spell_card.js
// Re-export them for main.js compatibility
export { showSpellInfoCard, closeSpellInfoCard };

export function addSpellFromDB(name, lvl) {
    if (state.spells.some(s => s.n === name)) {
        showToast(`Ya conoces: ${name}`);
        return;
    }
    state.spells.push({ l: 'N' + lvl, n: name });
    showToast(`📖 ${name} aprendido`);
    renderMagicUI();
    document.dispatchEvent(new CustomEvent('state:updated'));
}

export function remSpell(i) {
    const spell = state.spells[i];
    if (spell) {
        state.spells.splice(i, 1);
        showToast(`Hechizo olvidado`);
        renderMagicUI();
        document.dispatchEvent(new CustomEvent('state:updated'));
    }
}

// Stubs for backward compatibility
export function toggleSpellCard(idx) { }
export function toggleSpellSlot(lvl, idx) { }

export function resetSpellSlots() {
    state.spellSlotsUsed = {};
    renderMagicUI();
    showToast('✨ Conjuros restaurados');
}

