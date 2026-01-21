// Mechanics: Stats & Rules Calculations

export function getCarryingCapacity(str) {
    let heavy = 0;
    const lookup = { 10: 100, 11: 115, 12: 130, 13: 150, 14: 175, 15: 200, 16: 230, 17: 260, 18: 300 };

    if (str <= 10) heavy = str * 10;
    else if (lookup[str]) heavy = lookup[str];
    else if (str > 18) heavy = 300 + (str - 18) * 25; // Approx for high strength (simplified)
    else heavy = 100 + (str - 10) * 12.5; // Fallback approx

    const h = Math.floor(heavy);
    return { light: Math.floor(h / 3), medium: Math.floor(h * 2 / 3), heavy: h };
}

export function getSave(good, lvl) {
    return good ? 2 + Math.floor(lvl / 2) : Math.floor(lvl / 3);
}

export function calculateModifier(val) {
    return Math.floor((val - 10) / 2);
}

export function formatNum(n) {
    return (n >= 0 ? "+" : "") + n;
}

export function getClassLevel(slvl, cls) {
    // Basic logic: if class matches, return level?
    // This function was used in renderCompendium.
    // Checking original engine logic:
    // It parsed 'l' string: "Sor/Wiz 2, Clr 3" -> find user's class.
    return 0; // Placeholder, logic moved to compendium.js
}
