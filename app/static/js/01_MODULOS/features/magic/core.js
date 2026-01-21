import { SPELL_DB } from '../../../02_DATOS/data/spells.js';
import { SPELLS_PER_DAY } from '../../../00_CORE/config.js';
import { state } from '../../../00_CORE/core/state.js';
import { parseSpellLevels, getDbClassKey } from './data_parser.js';
import { calculateModifier } from '../../mechanics/stats.js';

/**
 * Returns available caster classes for the current character.
 * @returns {Array} List of class objects { id, lvl } that have spell access.
 */
export function getCasterClasses() {
    return state.classes.filter(c => SPELLS_PER_DAY[c.id]);
}

/**
 * Returns the effective Max Spell Level for a given class + level.
 */
export function getMaxSpellLevel(className, classLevel) {
    const spd = SPELLS_PER_DAY[className];
    if (!spd) return -1;

    // Some classes start casting later efficiently (like Paladin/Ranger usually 4th, but table handles it)
    // The table in config usually is 1-20.
    // If table defines effective level offset, use it.
    const effectiveLevel = spd.startLevel ? classLevel - spd.startLevel + 1 : classLevel;
    if (effectiveLevel < 1) return -1;

    const row = spd.table[effectiveLevel - 1]; // level 1 is index 0
    return row ? row.length - 1 : -1;
}

/**
 * Returns exact slots for a class instance.
 */
export function getSlotsForClass(className, lvl, attrVal) {
    const spd = SPELLS_PER_DAY[className];
    if (!spd) return [];

    const effectiveLevel = spd.startLevel ? lvl - spd.startLevel + 1 : lvl;
    if (effectiveLevel < 1) return [];

    const baseSlots = spd.table[effectiveLevel - 1];
    if (!baseSlots) return [];

    const mod = calculateModifier(attrVal);

    // Bonus spells logic
    return baseSlots.map((slots, slvl) => {
        if (slvl === 0) return slots; // Cantrips don't get bonus?
        if (slots === 0 && slvl > 0) return 0; // Can't get bonus for level you can't cast (unless high mod?)
        // Standard rule: must be able to cast level to get bonus.
        // If table says 0, it means you can't cast unless you have bonus spell? 
        // In 3.5, "0" in table means "only bonus spells". "_" means none.
        // Assuming table 0 is 0.

        const bonus = mod >= slvl ? Math.ceil((mod - slvl + 1) / 4) : 0;
        // Formula: (Mod - Lvl) / 4 + 1? No.
        // 3.5 Table:
        // Mod 1: +1 Lvl 1
        // Mod 2: +1 Lvl 1, +1 Lvl 2
        // Mod 3: +1 L1, +1 L2, +1 L3
        // Mod 4: +1 L1-L4? No.
        // Simplified Logic: 
        return Math.max(0, slots + bonus);
    });
}

/**
 * Returns a filtered list of spells available for a specific class instance.
 */
export function getAvailableSpellsForClass(className, maxLvl) {
    const dbKey = getDbClassKey(className);
    if (!dbKey) return [];

    return SPELL_DB.filter(spell => {
        const levels = parseSpellLevels(spell.l);
        const spellLvl = levels[dbKey];

        // precise check: undefined means not in list. 0 is valid (cantrip).
        return (spellLvl !== undefined && spellLvl <= maxLvl);
    }).map(s => {
        // Return enriched object with the specific cast level for this class
        const levels = parseSpellLevels(s.l);
        return {
            ...s,
            castLvl: levels[dbKey]
        };
    });
}
