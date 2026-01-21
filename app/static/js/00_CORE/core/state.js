// Core State Management

export const state = {
    name: "",
    race: "Humano",
    align: "Neutral",
    classes: [],
    stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    hp_curr: 10,
    skills: {},
    weapons: [],
    spells: [],
    buffs: [],
    feats: [], // New Feats Array
    inventory: "",
    gold: 0,
    ac_manual: { armor: 0, shield: 0, natural: 0, deflect: 0 },
    acp_manual: 0,
    used_slots: {} // Spell slots usage
};

export const globalFlags = {
    COMPENDIUM_OPEN: false
};

// Simple Observer/Event System can be added here if needed
