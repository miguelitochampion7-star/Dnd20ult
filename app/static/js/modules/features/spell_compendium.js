// Spell Compendium & Management Module
import { state, globalFlags } from '../../core/state.js';
import { SPELL_KNOWN, CLASSES, SPELLS_PER_DAY } from '../../config.js';
import { showToast } from '../ui/modals.js';

import { SPELL_DB } from '../data/spells.js';

// Global SPELL_DB access removed


// Helper from stats.js logic
import { calculateModifier } from '../mechanics/stats.js';
const getMod = calculateModifier;

// ========================================
// SPELL LEVEL & SLOTS CALCULATIONS
// ========================================

/**
 * Get maximum spell level accessible for a class
 */
export function getMaxSpellLevel(className, classLevel) {
    const spd = SPELLS_PER_DAY[className];
    if (!spd) return -1;
    const effectiveLevel = spd.startLevel ? classLevel - spd.startLevel + 1 : classLevel;
    if (effectiveLevel < 1) return -1;
    const row = spd.table[effectiveLevel - 1];
    return row ? row.length - 1 : -1;
}

/**
 * Get spell slots per day
 */
export function getSpellSlots(className, classLevel, attrMod = 0) {
    const spd = SPELLS_PER_DAY[className];
    if (!spd) return null;
    const effectiveLevel = spd.startLevel ? classLevel - spd.startLevel + 1 : classLevel;
    if (effectiveLevel < 1) return null;
    const baseSlots = spd.table[effectiveLevel - 1];
    if (!baseSlots) return null;
    return baseSlots.map((slots, lvl) => {
        if (lvl === 0) return slots;
        const bonus = attrMod >= lvl ? 1 + Math.floor((attrMod - lvl) / 4) : 0;
        return slots + bonus;
    });
}

// ========================================
// SPELL INFO
// ========================================

export function showSpellInfoCard(spellName) {
    const spell = SPELL_DB.find(s => s.n === spellName);
    if (!spell) {
        showToast(`Hechizo no encontrado: ${spellName}`);
        return;
    }
    const existing = document.getElementById('spellInfoModal');
    if (existing) existing.remove();

    const html = `
        <div id="spellInfoModal" class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onclick="closeSpellInfoCard()">
            <div class="bg-[#1a120b] border-2 border-[#c5a059] rounded-lg max-w-md w-full p-4 max-h-[80vh] overflow-y-auto custom-scroll shadow-2xl" onclick="event.stopPropagation()">
                <div class="flex justify-between items-start mb-3">
                    <h3 class="text-lg font-bold text-[#c5a059] flex items-center gap-2"><span class="text-blue-400">ⓘ</span> ${spell.n}</h3>
                    <button onclick="closeSpellInfoCard()" class="text-gray-400 hover:text-white text-xl leading-none">&times;</button>
                </div>
                <div class="space-y-1 text-sm text-gray-300">
                    ${spell.s ? `<p><span class="text-purple-400">📚 Escuela:</span> ${spell.s}</p>` : ''}
                    ${spell.l ? `<p><span class="text-yellow-400">⭐ Nivel:</span> ${spell.l}</p>` : ''}
                    ${spell.r ? `<p><span class="text-blue-400">🎯 Alcance:</span> ${spell.r}</p>` : ''}
                    ${spell.t ? `<p><span class="text-green-400">⏱ Lanzamiento:</span> ${spell.t}</p>` : ''}
                    ${spell.dur ? `<p><span class="text-cyan-400">⌛ Duración:</span> ${spell.dur}</p>` : ''}
                    ${spell.c ? `<p><span class="text-orange-400">📜 Componentes:</span> ${spell.c}</p>` : ''}
                    ${spell.sv ? `<p><span class="text-red-400">💪 Salvación:</span> ${spell.sv}</p>` : ''}
                    ${spell.sr ? `<p><span class="text-gray-400">🛡 R. Conjuros:</span> ${spell.sr}</p>` : ''}
                </div>
                ${spell.d ? `<hr class="my-3 border-[#333]"><p class="text-xs text-gray-400 whitespace-pre-wrap leading-relaxed">${spell.d}</p>` : ''}
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
}

export function closeSpellInfoCard() {
    const modal = document.getElementById('spellInfoModal');
    if (modal) modal.remove();
}

// ========================================
// RENDER & UI
// ========================================

export function toggleCompendium() {
    globalFlags.COMPENDIUM_OPEN = !globalFlags.COMPENDIUM_OPEN;
    renderSpells();
}

export function getNameFromLvl(lStr) {
    if (lStr.startsWith('N')) return lStr.substring(1);
    return lStr;
}

/**
 * Main Unified Render Function
 */
export function renderSpells() {
    const div = document.getElementById('spellsList');
    if (!div) return;
    div.innerHTML = "";

    // 1. Get Slots
    const casterClass = state.classes.find(c => SPELLS_PER_DAY[c.id]);
    let slotsByLevel = [];
    if (casterClass) {
        const spd = SPELLS_PER_DAY[casterClass.id];
        const attrMod = getMod(state.stats[spd.attr] || 10);
        slotsByLevel = getSpellSlots(casterClass.id, casterClass.lvl, attrMod) || [];
    }

    // 2. Group Spells
    const spellsByLevel = {};
    state.spells.forEach((s, idx) => {
        const lvl = parseInt(getNameFromLvl(s.l)) || 0;
        if (!spellsByLevel[lvl]) spellsByLevel[lvl] = [];
        spellsByLevel[lvl].push({ ...s, idx });
    });

    // 3. Union of Levels
    const allLevels = new Set([
        ...Object.keys(spellsByLevel).map(Number),
        ...slotsByLevel.map((val, idx) => val > 0 ? idx : -1).filter(x => x >= 0)
    ]);
    const sortedLevels = Array.from(allLevels).sort((a, b) => a - b);

    if (sortedLevels.length === 0) {
        div.innerHTML = `<div class="text-center p-4 text-gray-500 italic flex flex-col items-center">
                            <i data-lucide="scroll" class="w-8 h-8 opacity-20 mb-2"></i>
                            <p>Sin hechizos ni capacidad de lanzamiento.</p>
                            <p class="text-xs mt-1 text-gray-600">Añade una clase lanzadora o usa el compendio.</p>
                        </div>`;
    } else {
        sortedLevels.forEach(lvl => {
            const spells = spellsByLevel[lvl] || [];
            const maxSlots = slotsByLevel[lvl] || 0;
            const usedSlots = (state.spellSlotsUsed || {})[lvl] || 0;
            const remaining = Math.max(0, maxSlots - usedSlots);

            // Summary Header
            let summaryText = `<span class="text-blue-400 font-bold">NIVEL ${lvl}</span>`;
            if (maxSlots > 0) {
                const dots = Array(maxSlots).fill(0).map((_, i) => i < usedSlots ? '○' : '●').join('');
                summaryText += ` <span class="text-[10px] text-purple-400 ml-2 tracking-widest font-mono">${dots}</span>`;
            } else {
                summaryText += ` <span class="text-[10px] text-gray-500 ml-2">(${spells.length})</span>`;
            }

            const details = document.createElement('details');
            details.className = "group bg-black/20 rounded border border-[#333] mb-2 overflow-hidden";
            details.open = true;

            // Interactive Slots Panel
            let slotsHtml = "";
            if (maxSlots > 0) {
                slotsHtml = `
                    <div class="bg-black/40 p-2 border-b border-[#333] flex items-center justify-between">
                        <span class="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Espacios Diarios</span>
                        <div class="flex gap-1.5 flex-wrap justify-end max-w-[70%]">
                            ${Array(maxSlots).fill(0).map((_, i) => `
                                <button onclick="toggleSpellSlot(${lvl}, ${i})" 
                                        class="w-6 h-6 rounded border border-purple-900/50 transition-all hover:scale-110 flex items-center justify-center
                                               ${i < usedSlots ? 'bg-black/50 text-gray-600 border-gray-700' : 'bg-[#4c1d95] text-yellow-300 shadow-[0_0_8px_rgba(147,51,234,0.3)]'}">
                                    ${i < usedSlots ? '' : '✦'}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            // Spells List
            let spellsHtml = "";
            if (spells.length === 0) {
                spellsHtml = `<div class="p-3 text-center text-[10px] text-gray-600 italic">No hay hechizos memorizados.</div>`;
            } else {
                spellsHtml = spells.map(s => `
                    <div class="flex justify-between items-center hover:bg-white/5 p-2 border-b border-[#333]/30 last:border-0 group/spell transition-colors">
                        <div class="flex items-center gap-3 cursor-pointer flex-grow pl-1" onclick="showSpellInfoCard('${s.n.replace(/'/g, "\\'")}')">
                            <span class="text-blue-500/80 text-xs">ⓘ</span>
                            <span class="text-gray-300 text-sm font-medium group-hover/spell:text-[#c5a059] transition-colors">${s.n}</span>
                        </div>
                        <button class="text-red-500/40 hover:text-red-400 p-1.5 opacity-0 group-hover/spell:opacity-100 transition-all hover:bg-red-500/10 rounded" 
                                onclick="remSpell(${s.idx})" title="Olvidar hechizo">
                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>
                `).join('');
            }

            details.innerHTML = `
                <summary class="cursor-pointer p-2.5 bg-gradient-to-r from-white/5 to-transparent hover:from-white/10 flex justify-between items-center select-none transition-colors">
                    <div class="flex items-center">${summaryText}</div>
                    <i data-lucide="chevron-down" class="w-4 h-4 text-gray-500 transition-transform group-open:rotate-180"></i>
                </summary>
                <div class="bg-black/20 pb-1">
                    ${slotsHtml}
                    ${spellsHtml}
                </div>
            `;
            div.appendChild(details);
        });
    }

    // Update compendium button
    const compBtn = document.getElementById('btnCompendium');
    if (compBtn) {
        if (globalFlags.COMPENDIUM_OPEN) {
            compBtn.classList.add('bg-[#c5a059]', 'text-black');
            compBtn.innerHTML = `<i data-lucide="book-open" class="w-3 h-3"></i><span>Cerrar</span>`;
        } else {
            compBtn.classList.remove('bg-[#c5a059]', 'text-black');
            compBtn.innerHTML = `<i data-lucide="book" class="w-3 h-3"></i><span>+ Compendio</span>`;
        }
    }

    const compPanel = document.getElementById('compendiumPanel');
    if (compPanel) {
        if (globalFlags.COMPENDIUM_OPEN) {
            compPanel.classList.remove('hidden');
            setTimeout(renderCompendiumContent, 10);
        } else {
            compPanel.classList.add('hidden');
        }
    }

    if (window.lucide) window.lucide.createIcons();
}

export function renderCompendiumContent() {
    const l = document.getElementById('compendiumList');
    if (!l) return;
    l.innerHTML = "";

    const casterClass = state.classes.find(c => SPELLS_PER_DAY[c.id]);
    const cls = casterClass ? casterClass.id : 'Mago';
    const lvl = casterClass ? casterClass.lvl : 1;
    const maxSpellLvl = getMaxSpellLevel(cls, lvl);

    let available = SPELL_DB.map(s => {
        return { ...s, castLvl: getSpellLevelForClass(s.l, cls) };
    }).filter(s => s.castLvl !== null && s.castLvl !== undefined && s.castLvl <= maxSpellLvl);

    const spellsByLvl = {};
    available.forEach(s => {
        if (!spellsByLvl[s.castLvl]) spellsByLvl[s.castLvl] = [];
        spellsByLvl[s.castLvl].push(s);
    });

    const infoDiv = document.createElement('div');
    infoDiv.className = 'text-xs text-gray-500 p-2 border-b border-[#333] mb-1 bg-[#c5a059]/5';
    infoDiv.innerHTML = `<span class="text-[#c5a059] font-bold">${cls}</span> Nivel ${lvl} · Acceso hasta Nivel ${maxSpellLvl}`;
    l.appendChild(infoDiv);

    Object.keys(spellsByLvl).sort((a, b) => parseInt(a) - parseInt(b)).forEach(lvlKey => {
        const lvlInt = parseInt(lvlKey);
        const groupSpells = spellsByLvl[lvlInt];
        groupSpells.sort((a, b) => a.n.localeCompare(b.n));

        const details = document.createElement('details');
        details.className = "group bg-black/40 rounded border border-[#333] mb-1";
        const summary = document.createElement('summary');
        summary.className = "cursor-pointer p-2 font-bold text-[#c5a059] text-xs uppercase hover:bg-white/5 flex justify-between items-center select-none";
        summary.innerHTML = `<span>Nivel ${lvlInt}</span> <span class="text-[10px] text-gray-500">${groupSpells.length}</span>`;

        const content = document.createElement('div');
        content.className = "p-1 max-h-48 overflow-y-auto custom-scroll";

        let html = "";
        groupSpells.forEach(s => {
            const exists = state.spells.some(x => x.n === s.n);
            const icon = exists ? 'check' : 'plus';
            const color = exists ? 'text-green-500' : 'text-[#c5a059]';
            html += `
                <div class="flex justify-between items-center hover:bg-white/5 p-1 rounded ${exists ? 'opacity-50' : ''}">
                    <div class="flex items-center gap-2 cursor-pointer flex-grow" onclick="showSpellInfoCard('${s.n.replace(/'/g, "\\'")}')">
                        <span class="text-blue-400 text-xs">ⓘ</span>
                        <span class="text-gray-300 text-xs">${s.n}</span>
                    </div>
                    <button onclick="addSpellFromDB('${s.n.replace(/'/g, "\\'")}', ${lvlInt})" 
                            class="p-1 ${color} hover:scale-110 transition ${exists ? 'pointer-events-none' : ''}">
                        <i data-lucide="${icon}" class="w-3 h-3"></i>
                    </button>
                </div>`;
        });

        content.innerHTML = html;
        details.appendChild(summary);
        details.appendChild(content);
        l.appendChild(details);
    });

    if (window.lucide) window.lucide.createIcons();
}

function getSpellLevelForClass(levelString, className) {
    if (!levelString) return null;
    const map = {
        'Bardo': 'Brd', 'Clerigo': 'Clr', 'Druida': 'Drd',
        'Paladin': 'Pal', 'Explorador': 'Rgr',
        'Hechicero': 'Sor/Wiz', 'Mago': 'Sor/Wiz'
    };
    const abbr = map[className];
    if (!abbr) return null;
    const parts = levelString.split(', ');
    for (let p of parts) {
        const match = p.match(/^(\S+)\s+(\d+)$/);
        if (match) {
            const [, c, l] = match;
            if (c === abbr || (abbr === 'Sor/Wiz' && (c === 'Sor' || c === 'Wiz' || c === 'Sor/Wiz'))) {
                return parseInt(l);
            }
        }
    }
    return null;
}

// ========================================
// ACTION HANDLERS
// ========================================

export function toggleSpellSlot(level, slotIndex) {
    if (!state.spellSlotsUsed) state.spellSlotsUsed = {};
    const currentUsed = state.spellSlotsUsed[level] || 0;
    if (slotIndex < currentUsed) {
        state.spellSlotsUsed[level] = slotIndex;
    } else {
        state.spellSlotsUsed[level] = slotIndex + 1;
    }
    renderSpells();
    document.dispatchEvent(new CustomEvent('state:updated'));
}

export function resetSpellSlots() {
    state.spellSlotsUsed = {};
    renderSpells();
    showToast('✨ Conjuros restaurados');
    document.dispatchEvent(new CustomEvent('state:updated'));
}

export function addSpellFromDB(name, lvl) {
    if (state.spells.some(s => s.n === name)) {
        showToast(`Ya conoces: ${name}`);
        return;
    }
    state.spells.push({ l: 'N' + lvl, n: name });
    showToast(`📖 ${name} aprendido`);
    document.dispatchEvent(new CustomEvent('state:updated'));
}

export function remSpell(i) {
    const spell = state.spells[i];
    if (spell) {
        state.spells.splice(i, 1);
        showToast(`Hechizo borrado`);
        document.dispatchEvent(new CustomEvent('state:updated'));
    }
}

export function toggleSpellCard(idx) {
    // Deprecated? Keeping for compatibility if any html references it
}
