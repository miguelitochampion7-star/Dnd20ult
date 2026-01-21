// Dice & Logging System

export function rollDice(sides) {
    return Math.floor(Math.random() * sides) + 1;
}

export function rollD20() {
    return rollDice(20);
}

export function logRoll(label, mod, rawTotal, details = "") {
    let base = 0;
    let isCrit = false;
    let isFail = false;
    let displayDetails = details;

    if (rawTotal === undefined) {
        // Mode 1: Auto d20
        base = rollD20();
        isCrit = (base === 20);
        isFail = (base === 1);
        displayDetails = `[d20: ${base}]`;
    } else {
        // Mode 2: Custom passed value
        base = rawTotal;
    }

    const final = base + mod;
    const sign = mod >= 0 ? '+' : '-';
    const modAbs = Math.abs(mod);
    const colorClass = isCrit ? 'text-yellow-400 font-bold' : (isFail ? 'text-red-500 font-bold' : 'text-white');

    const log = document.getElementById('diceLog');
    if (log) {
        log.innerHTML += `
            <div class="border-b border-[#333] pb-1 mb-1 animate-pulse text-[10px]">
                 <div class="flex justify-between">
                    <span class="text-gray-400 font-bold">${label}</span>
                    <span class="text-xs font-mono text-gray-600">${displayDetails}</span>
                 </div>
                 <div class="mt-1">
                    <span class="${colorClass}">${base}</span>
                    <span class="text-gray-500">${sign} ${modAbs}</span>
                    = <span class="text-base text-green-400 font-bold">${final}</span>
                 </div>
            </div>`;
        log.scrollTop = log.scrollHeight;
    }
}

export function rollCustomDice(sides) {
    const res = rollDice(sides);
    logRoll(`d${sides}`, 0, res, `[d${sides}: ${res}]`);
}

export function rollDamage(n, d, bonus, label) {
    // Rolls n dice of d sides + bonus
    let total = 0;
    let rolls = [];
    for (let i = 0; i < n; i++) {
        const r = rollDice(d);
        total += r;
        rolls.push(r);
    }
    logRoll(label || "Daño", bonus, total, `[${n}d${d}: ${rolls.join('+')}]`);
}
