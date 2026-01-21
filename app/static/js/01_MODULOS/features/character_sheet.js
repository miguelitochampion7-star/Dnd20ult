// Character Sheet Logic (The Brain)
import { state } from '../../00_CORE/core/state.js';
import { STATS, KEYS, RACES, CLASSES, BUFFS, SKILLS_LIST, SYNERGY_MAP, WEAPONS_DB } from '../../00_CORE/config.js';
import { getCarryingCapacity, getSave, formatNum } from '../mechanics/stats.js';
import { rollD20, rollDice, logRoll, rollDamage } from '../mechanics/dice.js';
import { renderMagicUI } from './magic/ui.js';

// Re-export what is needed by main logic if not imported directly
// For updateAll, we need almost everything.

export function updateAll() {
    readInputs();

    // 1. Race & Effects (Buffs)
    const raceData = RACES[state.race] || RACES['Humano'];
    let eff = {};
    state.buffs.forEach(bid => {
        const b = BUFFS.find(x => x.id === bid);
        if (b && b.e) {
            for (let key in b.e) eff[key] = (eff[key] || 0) + b.e[key];
        }
    });

    // 2. Attribute Calc
    let mods = {};
    KEYS.forEach(k => {
        let total = state.stats[k] + (raceData.s[k] || 0) + (eff[k] || 0);
        let mod = Math.floor((total - 10) / 2);
        mods[k] = mod;

        // Update UI
        setDesc('tot_' + k, total);
        const mEl = document.getElementById('mod_' + k);
        if (mEl) {
            mEl.innerText = formatNum(mod);
            if ((eff[k] || 0) > 0) mEl.className = "text-2xl font-bold text-green-400 mb-1";
            else if ((eff[k] || 0) < 0) mEl.className = "text-2xl font-bold text-red-400 mb-1";
            else mEl.className = "text-2xl font-bold text-white mb-1";
        }
    });

    // 3. Carrying Capacity
    const invWeight = Math.floor(state.inventory.length * 0.1);
    const goldWeight = state.gold * 0.02;
    const totalWeight = invWeight + goldWeight;
    setDesc('weightDisplay', totalWeight.toFixed(1));

    const str = state.stats.str + (raceData.s.str || 0) + (eff.str || 0);
    const capacity = getCarryingCapacity(str);
    setDesc('maxLight', capacity.light);
    setDesc('maxMedium', capacity.medium);
    setDesc('maxHeavy', capacity.heavy);

    // Load Status
    let loadStatus = 'Ligera';
    let loadMaxDex = 999;
    let loadAcp = 0;
    const loadStatusEl = document.getElementById('loadStatus');

    if (totalWeight > capacity.heavy) {
        loadStatus = 'Sobrecarga';
        loadMaxDex = 0; loadAcp = -6;
        if (loadStatusEl) loadStatusEl.className = 'font-bold text-red-600';
    } else if (totalWeight > capacity.medium) {
        loadStatus = 'Pesada';
        loadMaxDex = 1; loadAcp = -6;
        if (loadStatusEl) loadStatusEl.className = 'font-bold text-red-400';
    } else if (totalWeight > capacity.light) {
        loadStatus = 'Media';
        loadMaxDex = 3; loadAcp = -3;
        if (loadStatusEl) loadStatusEl.className = 'font-bold text-yellow-400';
    } else {
        if (loadStatusEl) loadStatusEl.className = 'font-bold text-[#c5a059]';
    }

    setDesc('loadStatus', loadStatus);
    setDesc('loadMalus', `AC Pena: ${loadAcp}`);
    setDesc('maxDexLoad', `Max Des: ${loadMaxDex === 999 ? 'Sin Lim' : loadMaxDex}`);

    // Load Bar
    const pct = Math.min(100, (totalWeight / capacity.heavy) * 100);
    const lb = document.getElementById('loadBar');
    if (lb) {
        lb.style.width = pct + '%';
        if (pct > 100) lb.className = 'h-full bg-red-600';
        else if (pct > 66) lb.className = 'h-full bg-red-400';
        else if (pct > 33) lb.className = 'h-full bg-yellow-400';
        else lb.className = 'h-full bg-[#c5a059]';
    }

    // 4. Classes
    let totalLvl = 0, bab = 0, baseFort = 0, baseRef = 0, baseWill = 0, totalSkillPts = 0;
    state.classes.forEach((c, idx) => {
        const cd = CLASSES[c.id];
        totalLvl += c.lvl;
        bab += Math.floor(c.lvl * cd.bab);
        baseFort += getSave(cd.f, c.lvl);
        baseRef += getSave(cd.r, c.lvl);
        baseWill += getSave(cd.w, c.lvl);

        let pts = Math.max(1, cd.sp + mods.int + (raceData.sp || 0));
        totalSkillPts += (idx === 0 ? pts * 4 : pts) * c.lvl;
    });
    setDesc('totalLevel', totalLvl);
    renderClasses();

    // 5. Combat Stats
    const sizeMod = (raceData.sz || 0) + (eff.size || 0);
    let effDexAc = mods.dex;
    if (effDexAc > loadMaxDex) effDexAc = loadMaxDex;

    const acTotal = 10 + state.ac_manual.armor + state.ac_manual.shield + effDexAc + sizeMod + state.ac_manual.natural + state.ac_manual.deflect + (eff.ac || 0);
    const acTouch = 10 + effDexAc + sizeMod + state.ac_manual.deflect + (eff.ac || 0);
    const acFlat = 10 + state.ac_manual.armor + state.ac_manual.shield + sizeMod + state.ac_manual.natural + state.ac_manual.deflect + (eff.ac || 0);

    setDesc('valAC', acTotal);
    setDesc('valTouch', acTouch);
    setDesc('valFlat', acFlat);
    setDesc('valInit', formatNum(mods.dex + (eff.init || 0)));
    setDesc('valBAB', formatNum(bab));

    const grappleSize = (sizeMod * -4);
    const grapple = bab + mods.str + grappleSize;
    setDesc('valGrapple', formatNum(grapple));

    // HP
    let hpTotalMax = 0;
    state.classes.forEach((c, i) => {
        const hd = CLASSES[c.id].hd;
        hpTotalMax += (i === 0 ? hd : hd / 2 + 1) * c.lvl + (mods.con * c.lvl);
    });
    setDesc('hpMax', Math.max(1, hpTotalMax));

    // Saves
    setDesc('saveFort', formatNum(baseFort + mods.con + (eff.save || 0)));
    setDesc('saveRef', formatNum(baseRef + mods.dex + (eff.save || 0)));
    setDesc('saveWill', formatNum(baseWill + mods.wis + (eff.save || 0)));

    // 6. Skills
    const acpTotal = state.acp_manual + loadAcp;
    renderSkills(mods, totalLvl, totalSkillPts, acpTotal);

    // 7. Attacks
    renderAttacks(bab, mods, eff, sizeMod);

    // 8. Spells
    renderMagicUI();
}

function readInputs() {
    state.name = getVal('charName') || state.name;
    state.race = getVal('raceSelect') || state.race;
    state.hp_curr = parseInt(getVal('hpCurr')) || 0;
    state.inventory = getVal('inventory') || "";
    state.gold = parseInt(getVal('gold')) || 0;

    state.ac_manual.armor = parseInt(getVal('acArmor')) || 0;
    state.ac_manual.shield = parseInt(getVal('acShield')) || 0;
    state.ac_manual.natural = parseInt(getVal('acNatural')) || 0;
    state.ac_manual.deflect = parseInt(getVal('acDeflect')) || 0;

    const acpEl = document.getElementById('acpArmor');
    state.acp_manual = acpEl ? (parseInt(acpEl.value) || 0) : 0;

    KEYS.forEach(k => {
        let val = parseInt(getVal('base_' + k));
        state.stats[k] = isNaN(val) ? 10 : val;
    });
}

function renderClasses() {
    const div = document.getElementById('classList');
    if (!div) return;
    div.innerHTML = "";
    state.classes.forEach((c, i) => {
        div.innerHTML += `
            <div class="flex justify-between items-center bg-black/20 px-2 py-1 rounded text-xs border border-[#333]">
                <span class="font-bold text-[#c5a059]">${c.id}</span>
                <div class="flex items-center gap-2">
                    <button onclick="window.modLvl(${i}, -1)" class="text-gray-500 hover:text-white">-</button>
                    <span class="text-white font-mono w-4 text-center">${c.lvl}</span>
                    <button onclick="window.modLvl(${i}, 1)" class="text-gray-500 hover:text-white">+</button>
                </div>
            </div>`;
    });
}

function renderSkills(mods, maxRankLvl, totalPts, acp) {
    const list = document.getElementById('skillsBody');
    if (!list) return;
    list.innerHTML = "";

    let spent = 0;
    const maxRank = maxRankLvl + 3;

    let synergies = {};
    SKILLS_LIST.forEach(s => {
        const ranks = state.skills[s.n] || 0;
        if (ranks >= 5) {
            const gives = SYNERGY_MAP[s.n];
            if (gives) gives.forEach(target => synergies[target] = (synergies[target] || 0) + 2);
        }
    });

    let classSkills = new Set();
    state.classes.forEach(c => {
        const cData = CLASSES[c.id];
        if (cData && cData.cs) cData.cs.forEach(sk => classSkills.add(sk));
    });

    SKILLS_LIST.forEach(s => {
        let rank = state.skills[s.n] || 0;
        const isClassSkill = classSkills.has(s.n) || (s.n.startsWith('Saber') && classSkills.has('Saber (Todas)'));

        spent += rank;

        let misc = synergies[s.n] || 0;
        let acpVal = 0;
        if (s.acp) {
            acpVal = acp;
            if (s.doubleAcp) acpVal *= 2;
        }

        const total = rank + mods[s.a] + misc + acpVal;
        const rowClass = isClassSkill ? 'border-l-2 border-[#c5a059] bg-[#c5a059]/5' : 'border-l-2 border-transparent';

        list.innerHTML += `
            <div class="grid grid-cols-12 gap-1 items-center border-b border-[#222] py-2 px-2 group transition-all hover:bg-[#c5a059]/10 ${rowClass}">
                <div class="col-span-6 flex items-center gap-2 cursor-pointer" onclick="window.logRoll('${s.n}', ${total})">
                    <span class="text-xs ${isClassSkill ? 'text-[#c5a059] font-bold shadow-gold' : 'text-gray-400 font-medium'} group-hover:text-white transition-colors">${s.n}</span>
                    <span class="text-[9px] text-gray-600 uppercase font-mono">/ ${s.a}</span>
                    ${s.trained ? '<i data-lucide="graduation-cap" class="w-3 h-3 text-red-900 opacity-50" title="Solo Entrenada"></i>' : ''}
                    ${s.acp ? '<i data-lucide="shield" class="w-3 h-3 text-gray-700" title="ACP Afecta"></i>' : ''}
                </div>
                <div class="col-span-2 text-center relative">
                    <input type="number" class="w-full text-center bg-transparent text-white font-bold text-xs border-b border-[#333] focus:border-[#c5a059] focus:outline-none py-1"
                           min="0" max="${maxRank}" value="${rank}"
                           onchange="window.setSkill('${s.n}', this.value)">
                </div>
                <div class="col-span-2 text-center text-[10px] text-gray-500 font-mono">
                    ${(misc + acpVal) !== 0 ? formatNum(misc + acpVal) : '<span class="opacity-20">-</span>'}
                </div>
                <div class="col-span-2 text-right">
                    <span class="text-sm font-bold ${total > 0 ? 'text-[#c5a059]' : 'text-gray-600'} cursor-pointer hover:scale-125 inline-block transition-transform" onclick="window.logRoll('${s.n}', ${total})">
                        ${formatNum(total)}
                    </span>
                </div>
            </div>`;
    });

    const ptsRemaining = Math.max(0, totalPts - spent);
    setDesc('skillPts', ptsRemaining);

    // Auto Btn logic omitted for now to save space, easy to add back
}

function renderAttacks(bab, mods, eff, sizeMod) {
    const list = document.getElementById('attacksList');
    if (!list) return;
    list.innerHTML = "";

    state.weapons.forEach((wId, idx) => {
        const w = WEAPONS_DB[wId];
        if (!w) return;

        // Calc To Hit
        // Melee = BAB + Str + Size + Ench + Feats
        // Ranged = BAB + Dex + Size + Ench + Feats
        // Finesse = BAB + Dex + Size... (Not implemented yet, assumes standard)

        let statMod = mods[w.stat]; // str or dex from DB
        const toHit = bab + statMod + sizeMod + (eff.atk || 0);

        // Iterative Attacks
        let attacks = [];
        let iter = bab;
        if (iter < 1) attacks.push(formatNum(toHit));
        else {
            while (iter > 0) {
                attacks.push(formatNum(toHit - (bab - iter)));
                iter -= 5;
            }
        }

        // Damage
        // Str bonus: 1x for 1H, 1.5x for 2H (Generic simplified to 1x or passed via logic?)
        // Let's assume 1x unless 2H.
        let dmgBonus = (w.stat === 'str') ? mods.str : 0;
        if (w.h === 2 && w.stat === 'str') dmgBonus = Math.floor(mods.str * 1.5);
        dmgBonus += (eff.dmg || 0);

        list.innerHTML += `
             <div class="bg-black/40 border border-[#333] p-2 rounded relative group hover:border-[#c5a059] transition">
                <div class="flex justify-between items-start mb-1">
                    <span class="font-bold text-white text-sm">${w.n}</span>
                    <button class="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition" onclick="window.remWeapon(${idx})">×</button>
                </div>
                <div class="flex justify-between items-center text-xs">
                    <div class="flex gap-2">
                        <span class="font-mono text-[#c5a059 font-bold] py-1 px-2 bg-black/50 rounded cursor-pointer hover:bg-[#c5a059] hover:text-black transition" 
                              onclick="window.logRoll('Ataque (${w.n})', ${toHit})">
                            ${attacks.join('/')}
                        </span>
                        <span class="font-mono text-gray-400 py-1 px-2 bg-black/50 rounded cursor-pointer hover:text-white transition"
                              onclick="window.rollDamage(1, ${w.d.replace('1d', '')}, ${dmgBonus}, 'Daño ${w.n}')">
                            ${w.d} ${formatNum(dmgBonus)}
                        </span>
                    </div>
                </div>
                <div class="text-[9px] text-gray-600 mt-1 flex gap-2">
                   <span>Crit: ${w.c}</span>
                   <span>Tipo: ${w.t}</span>
                </div>
            </div>`;
    });
}


// UI Helpers
function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value : null;
}
function setDesc(id, val) {
    const el = document.getElementById(id);
    if (el) el.innerText = val;
}
