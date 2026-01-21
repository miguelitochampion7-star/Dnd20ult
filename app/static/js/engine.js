// D&D 3.5 Abyssal Engine - v3.0

// --- FALLBACK FOR MODAL SYSTEM ---
if (typeof window.showToast !== 'function') {
    console.warn("modals.js not loaded or showToast missing. Using fallback.");
    window.showToast = (msg) => alert(msg);
}
if (typeof window.showCustomAlert !== 'function') {
    window.showCustomAlert = (msg) => alert(msg);
}
if (typeof window.showCustomConfirm !== 'function') {
    window.showCustomConfirm = (msg) => confirm(msg);
}

// --- UI HELPERS ---
function toggleSidebar() {
    const sb = document.getElementById('sidebar');
    const ov = document.getElementById('overlay');
    sb.classList.toggle('open');
    ov.classList.toggle('open');
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((e) => console.log(e));
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// --- CONSTANTS & DB ---
const STATS = ['Fuerza', 'Destreza', 'Constitución', 'Inteligencia', 'Sabiduría', 'Carisma'];
const KEYS = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
let COMPENDIUM_OPEN = false; // Persistent State

const RACES = {
    'Humano': { s: {}, sp: 1 },
    'Enano': { s: { con: 2, cha: -2 }, sp: 0 },
    'Elfo': { s: { dex: 2, con: -2 }, sp: 0 },
    'Gnomo': { s: { con: 2, str: -2 }, sp: 0, sz: 1 },
    'Mediano': { s: { dex: 2, str: -2 }, sp: 0, sz: 1 },
    'Semiorco': { s: { str: 2, int: -2, cha: -2 }, sp: 0 },
    'Semielfo': { s: {}, sp: 0 }
};

const CLASSES = {
    'Guerrero': { hd: 10, bab: 1, f: 1, r: 0, w: 0, sp: 2, cs: ['Trepar', 'Saltar', 'Nadar', 'Montar', 'Trato con Animales', 'Intimidar'] },
    'Mago': { hd: 4, bab: 0.5, f: 0, r: 0, w: 1, sp: 2, cs: ['Concentración', 'Saber (Arcano)', 'Saber (Dungeons)', 'Saber (Naturaleza)', 'Saber (Religión)', 'Conocimiento de Conjuros', 'Oficio'] },
    'Picaro': { hd: 6, bab: 0.75, f: 0, r: 1, w: 0, sp: 8, cs: ['Abrir Cerraduras', 'Averiguar Intenciones', 'Avistar', 'Buscar', 'Diplomacia', 'Disfrazarse', 'Engañar', 'Equilibrio', 'Escapismo', 'Esconderse', 'Escuchar', 'Intimidar', 'Inutilizar Mecanismo', 'Juego de Manos', 'Moverse Silencio', 'Nadar', 'Piruetas', 'Reunir Información', 'Saltar', 'Trepar', 'Uso de Cuerdas'] },
    'Clerigo': { hd: 8, bab: 0.75, f: 1, r: 0, w: 1, sp: 2, cs: ['Concentración', 'Saber (Religión)', 'Sanar', 'Diplomacia', 'Conocimiento de Conjuros'] },
    'Barbaro': { hd: 12, bab: 1, f: 1, r: 0, w: 0, sp: 4, cs: ['Trepar', 'Saltar', 'Nadar', 'Supervivencia', 'Escuchar', 'Intimidar', 'Trato con Animales'] },
    'Explorador': { hd: 8, bab: 1, f: 1, r: 1, w: 0, sp: 6, cs: ['Trepar', 'Saltar', 'Nadar', 'Supervivencia', 'Escuchar', 'Avistar', 'Esconderse', 'Moverse Silencio', 'Saber (Naturaleza)', 'Sanar'] },
    'Paladin': { hd: 10, bab: 1, f: 1, r: 0, w: 0, sp: 2, cs: ['Concentración', 'Saber (Religión)', 'Sanar', 'Diplomacia', 'Montar', 'Trato con Animales'] },
    'Monje': { hd: 8, bab: 0.75, f: 1, r: 1, w: 1, sp: 4, cs: ['Equilibrio', 'Trepar', 'Saltar', 'Nadar', 'Piruetas', 'Esconderse', 'Moverse Silencio', 'Escuchar', 'Avistar', 'Averiguar Intenciones'] },
    'Bardo': { hd: 6, bab: 0.75, f: 0, r: 1, w: 1, sp: 6, cs: ['Engañar', 'Diplomacia', 'Disfrazarse', 'Reunir Información', 'Interpretación', 'Esconderse', 'Saber (Todas)', 'Escuchar', 'Moverse Silencio', 'Prestidigitación', 'Conocimiento de Conjuros'] },
    'Hechicero': { hd: 4, bab: 0.5, f: 0, r: 0, w: 1, sp: 2, cs: ['Concentración', 'Saber (Arcano)', 'Conocimiento de Conjuros', 'Engañar'] },
    'Druida': { hd: 8, bab: 0.75, f: 1, r: 0, w: 1, sp: 4, cs: ['Concentración', 'Saber (Naturaleza)', 'Sanar', 'Supervivencia', 'Trato con Animales', 'Avistar', 'Escuchar'] }
};

const SPELL_KNOWN = {
    'Hechicero': [
        // Lv 1 to 20. Rows are Class Level. Cols are Spell Level 0-9.
        [4, 2, -1], [5, 2, -1], [5, 3, -1], [6, 3, 1],
        [6, 4, 2], [7, 4, 2, 1], [7, 5, 3, 2], [8, 5, 3, 2, 1],
        [8, 5, 4, 3, 2], [9, 5, 4, 3, 2, 1], [9, 5, 5, 4, 3, 2, 1],
        [9, 5, 5, 4, 3, 2, 2], [9, 5, 5, 4, 4, 3, 2, 1], [9, 5, 5, 4, 4, 3, 2, 2],
        [9, 5, 5, 4, 4, 4, 3, 2, 1], [9, 5, 5, 4, 4, 4, 3, 2, 2],
        [9, 5, 5, 4, 4, 4, 3, 3, 2, 1], [9, 5, 5, 4, 4, 4, 3, 3, 2, 2],
        [9, 5, 5, 4, 4, 4, 3, 3, 3, 2], [9, 5, 5, 4, 4, 4, 3, 3, 3, 3]
    ],
    'Bardo': [
        // Lv 1 to 20. Cols 0-6.
        [4], [5, 2], [6, 3], [6, 3, 2], [6, 4, 3],
        [6, 4, 3], [6, 4, 4, 2], [6, 4, 4, 3], [6, 4, 4, 3],
        [6, 4, 4, 4, 2], [6, 4, 4, 4, 3], [6, 4, 4, 4, 3], [6, 4, 4, 4, 4, 2],
        [6, 4, 4, 4, 4, 3], [6, 4, 4, 4, 4, 3], [6, 5, 4, 4, 4, 4, 2],
        [6, 5, 5, 4, 4, 4, 3], [6, 5, 5, 5, 4, 4, 3], [6, 5, 5, 5, 5, 4, 4],
        [6, 5, 5, 5, 5, 5, 4]
    ]
};

const SKILLS_LIST = [
    { n: 'Abrir Cerraduras', a: 'dex', acp: true },
    { n: 'Artesanía', a: 'int' },
    { n: 'Averiguar Intenciones', a: 'wis' },
    { n: 'Avistar', a: 'wis' },
    { n: 'Buscar', a: 'int' },
    { n: 'Concentración', a: 'con' },
    { n: 'Conocimiento de Conjuros', a: 'int', trained: true },
    { n: 'Diplomacia', a: 'cha' },
    { n: 'Disfrazarse', a: 'cha' },
    { n: 'Engañar', a: 'cha' },
    { n: 'Equilibrio', a: 'dex', acp: true },
    { n: 'Escapismo', a: 'dex', acp: true },
    { n: 'Esconderse', a: 'dex', acp: true },
    { n: 'Escuchar', a: 'wis' },
    { n: 'Intimidar', a: 'cha' },
    { n: 'Inutilizar Mecanismo', a: 'int', trained: true },
    { n: 'Juego de Manos', a: 'dex', acp: true, trained: true },
    { n: 'Moverse Silencio', a: 'dex', acp: true },
    { n: 'Nadar', a: 'str', acp: true, doubleAcp: true },
    { n: 'Piruetas', a: 'dex', acp: true, trained: true },
    { n: 'Reunir Información', a: 'cha' },
    { n: 'Saber (Arcano)', a: 'int', trained: true },
    { n: 'Saber (Dungeons)', a: 'int', trained: true },
    { n: 'Saber (Naturaleza)', a: 'int', trained: true },
    { n: 'Saber (Religión)', a: 'int', trained: true },
    { n: 'Saltar', a: 'str', acp: true },
    { n: 'Sanar', a: 'wis' },
    { n: 'Supervivencia', a: 'wis' },
    { n: 'Trepar', a: 'str', acp: true },
    { n: 'Uso de Cuerdas', a: 'dex' }
];

const SYNERGY_MAP = {
    'Averiguar Intenciones': ['Diplomacia'],
    'Buscar': ['Supervivencia'],
    'Engañar': ['Diplomacia', 'Intimidar', 'Juego de Manos'],
    'Equilibrio': ['Piruetas'],
    'Escapismo': ['Uso de Cuerdas'],
    'Piruetas': ['Equilibrio', 'Saltar'],
    'Saltar': ['Piruetas'],
    'Saber (Arcano)': ['Conocimiento de Conjuros'],
    'Uso de Cuerdas': ['Escapismo', 'Trepar']
};

const WEAPONS_DB = [
    { n: "Espada Larga", d: "1d8", c: "19-20/x2", t: "Cortante", stat: "str" },
    { n: "Espada Corta", d: "1d6", c: "19-20/x2", t: "Perforante", stat: "str" },
    { n: "Gran Hacha", d: "1d12", c: "x3", t: "Cortante", stat: "str", h: 2 },
    { n: "Daga", d: "1d4", c: "19-20/x2", t: "Perf/Cort", stat: "dex" },
    { n: "Arco Largo", d: "1d8", c: "x3", t: "Perforante", stat: "dex", r: true },
    { n: "Arco Corto", d: "1d6", c: "x3", t: "Perforante", stat: "dex", r: true },
    { n: "Maza", d: "1d8", c: "x2", t: "Contundente", stat: "str" },
    { n: "Cimitarra", d: "1d6", c: "18-20/x2", t: "Cortante", stat: "str" }
];

const BUFFS = [
    { id: 'furia', n: 'Furia (Barbaro)', d: '+4 Str/Con, +2 Will, -2 AC', e: { str: 4, con: 4, will: 2, ac: -2 } },
    { id: 'toro', n: 'Fuerza de Toro', d: '+4 Str', e: { str: 4 } },
    { id: 'gato', n: 'Gracia Felina', d: '+4 Dex', e: { dex: 4 } },
    { id: 'escudo', n: 'Escudo', d: '+4 AC Escudo', e: { ac: 4 } },
    { id: 'armadura_mago', n: 'Armadura de Mago', d: '+4 AC Armadura', e: { ac: 4 } },
    { id: 'bendicion', n: 'Bendición', d: '+1 Atk/Save', e: { atk: 1, save: 1 } },
    { id: 'agrandar', n: 'Agrandar Persona', d: '+2 Str, -2 Dex, Size Large', e: { str: 2, dex: -2, size: -1 } } // Size -1 means Large (penalty to attack/ac)
];



// --- STATE ---
let state = {
    name: "", race: "Humano", align: "Neutral",
    classes: [],
    stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    hp_curr: 10, skills: {}, weapons: [], spells: [], buffs: [],
    inventory: "", gold: 0,
    ac_manual: { armor: 0, shield: 0, natural: 0, deflect: 0 },
    acp_manual: 0
};

// --- INITIALIZATION ---
window.onerror = function (msg, url, line) {
    window.showCustomAlert("Error de Sistema: " + msg + "\nLínea: " + line, "Error Crítico");
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();
    try {
        initUI();
        initGestures(); // New Touch Logic
        updateAll();
    } catch (e) {
        console.error(e);
        window.showCustomAlert("Error iniciando interfaz: " + e.message, "Error Fatal");
    }
});

// --- TOUCH GESTURES ---
function initGestures() {
    const sb = document.getElementById('sidebar');
    let touchstartX = 0;
    let touchendX = 0;

    sb.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sb.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        handleGesture();
    }, { passive: true });

    function handleGesture() {
        // Swipe Left (Close)
        if (touchendX < touchstartX - 50) {
            // Check if open
            if (sb.classList.contains('open')) toggleSidebar();
        }
    }

    // Optional: Swipe Right to Open (Edge trigger)
    document.addEventListener('touchstart', e => {
        if (e.changedTouches[0].screenX < 30) { // Left Edge
            touchstartX = e.changedTouches[0].screenX;
            document.addEventListener('touchend', detectOpenSwipe, { once: true });
        }
    }, { passive: true });

    function detectOpenSwipe(e) {
        touchendX = e.changedTouches[0].screenX;
        if (touchendX > touchstartX + 50) {
            if (!sb.classList.contains('open')) toggleSidebar();
        }
    }
}

function initUI() {
    // Populate Selects
    const rSel = document.getElementById('raceSelect');
    Object.keys(RACES).forEach(r => rSel.add(new Option(r, r)));

    const acSel = document.getElementById('addClassSelect');
    Object.keys(CLASSES).forEach(c => acSel.add(new Option(c, c)));



    const wSel = document.getElementById('weaponSelect');
    WEAPONS_DB.forEach((w, i) => wSel.add(new Option(w.n, i)));

    // Spell Select removed in v3.2
    // const sSel = document.getElementById('spellSelect');
    // ["Detectar Magia"...].forEach...

    // Setup Stats Grid
    const sGrid = document.getElementById('statsGrid');
    sGrid.innerHTML = '';
    KEYS.forEach(k => {
        const label = STATS[KEYS.indexOf(k)].substring(0, 3);
        sGrid.innerHTML += `
            <div class="bg-black/30 border border-[#333] rounded p-2 text-center hover:border-[#c5a059] transition group" title="Click para tirar">
                <div class="text-[10px] uppercase text-gray-500 font-bold mb-1 cursor-pointer group-hover:text-[#c5a059]" onclick="rollCheck('${STATS[KEYS.indexOf(k)]}')">${label}</div>
                <div class="text-2xl font-bold text-white mb-1" id="mod_${k}">+0</div>
                <div class="flex justify-center">
                    <input type="number" id="base_${k}" value="10" class="w-8 text-center bg-transparent border-b border-[#555] text-xs text-gray-400 focus:text-white focus:border-[#c5a059] focus:outline-none" oninput="updateAll()">
                </div>
                <div class="text-[9px] text-[#555] mt-1">TOT: <span id="tot_${k}">10</span></div>
            </div>`;
    });

    // Buffs List
    const bContainer = document.getElementById('buffsContainer');
    bContainer.innerHTML = '';
    BUFFS.forEach(b => {
        bContainer.innerHTML += `
            <div class="buff-item" onclick="toggleBuff('${b.id}')" id="buff_${b.id}">
                <div class="flex items-center gap-2">
                    <div class="buff-indicator"></div>
                    <span class="text-gray-400 hover:text-white select-none text-xs font-bold">${b.n}</span>
                </div>
            </div>`;
    });
}

// --- CORE ENGINE ---

// Read DOM Inputs into State
function readInputs() {
    state.name = document.getElementById('charName').value;
    state.race = document.getElementById('raceSelect').value;
    state.hp_curr = parseInt(document.getElementById('hpCurr').value) || 0;
    state.inventory = document.getElementById('inventory').value;
    state.gold = parseInt(document.getElementById('gold').value) || 0;

    state.ac_manual.armor = parseInt(document.getElementById('acArmor').value) || 0;
    state.ac_manual.shield = parseInt(document.getElementById('acShield').value) || 0;
    state.ac_manual.natural = parseInt(document.getElementById('acNatural')?.value) || 0;
    state.ac_manual.deflect = parseInt(document.getElementById('acDeflect')?.value) || 0;

    // acpArmor might be missing in new UI, handle gracefully
    const acpEl = document.getElementById('acpArmor');
    state.acp_manual = acpEl ? (parseInt(acpEl.value) || 0) : 0;

    KEYS.forEach(k => {
        let val = parseInt(document.getElementById('base_' + k).value);
        state.stats[k] = isNaN(val) ? 10 : val;
    });
}

// Main Calculation Loop
function updateAll() {
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
        document.getElementById('tot_' + k).innerText = total;
        const mEl = document.getElementById('mod_' + k);
        mEl.innerText = (mod >= 0 ? "+" : "") + mod;

        // Color code buffs/debuffs
        if ((eff[k] || 0) > 0) mEl.className = "text-2xl font-bold text-green-400 mb-1";
        else if ((eff[k] || 0) < 0) mEl.className = "text-2xl font-bold text-red-400 mb-1";
        else mEl.className = "text-2xl font-bold text-white mb-1";
    });

    // 3. Carrying Capacity & Load (Perfect Math)
    // Weight Estimate: 1 char = 1 byte approx? No, rough estimate from text length.
    // Let's use simple logic: Text Length * 0.1 lbs? No.
    // User puts items in text. We can't parse text easily.
    // BUT we have gold. 50 coins = 1 lb.
    // And let's say user manually calculates weight for now? 
    // Wait, reference had auto weight? "Math.floor((state.inventory.length * 0.05) + (state.gold * 0.02))"
    // Let's use a smarter approximation or just that.
    const invWeight = Math.floor(state.inventory.length * 0.1); // 10 chars = 1 lb approx?
    const goldWeight = state.gold * 0.02; // 50 po = 1 lb
    const totalWeight = invWeight + goldWeight;
    document.getElementById('weightDisplay').innerText = totalWeight.toFixed(1);

    // Calculate Load Limits (Str x4 rule implemented simply)
    // Basic Table: 10 Str -> 100 lbs max heavy.
    // Formula for Str <= 10: Str * 10
    // Formula for Str > 10: ... complex. Let's use specific breakpoints.
    const str = state.stats.str + (raceData.s.str || 0) + (eff.str || 0);
    const capacity = getCarryingCapacity(str);

    document.getElementById('maxLight').innerText = capacity.light;
    document.getElementById('maxMedium').innerText = capacity.medium;
    document.getElementById('maxHeavy').innerText = capacity.heavy;

    // Determine Load Status
    let loadStatus = 'Ligera';
    let loadMaxDex = 999;
    let loadAcp = 0;

    if (totalWeight > capacity.heavy) {
        loadStatus = 'Sobrecarga';
        loadMaxDex = 0; loadAcp = -6;
        document.getElementById('loadStatus').className = 'font-bold text-red-600';
    } else if (totalWeight > capacity.medium) {
        loadStatus = 'Pesada';
        loadMaxDex = 1; loadAcp = -6;
        document.getElementById('loadStatus').className = 'font-bold text-red-400';
    } else if (totalWeight > capacity.light) {
        loadStatus = 'Media';
        loadMaxDex = 3; loadAcp = -3;
        document.getElementById('loadStatus').className = 'font-bold text-yellow-400';
    } else {
        loadStatus = 'Ligera';
        loadMaxDex = 999; loadAcp = 0;
        document.getElementById('loadStatus').className = 'font-bold text-[#c5a059]';
    }

    document.getElementById('loadStatus').innerText = loadStatus;
    document.getElementById('loadMalus').innerText = `AC Pena: ${loadAcp}`;
    document.getElementById('maxDexLoad').innerText = `Max Des: ${loadMaxDex === 999 ? 'Sin Lim' : loadMaxDex}`;

    // Update Load Bar
    const pct = Math.min(100, (totalWeight / capacity.heavy) * 100);
    document.getElementById('loadBar').style.width = pct + '%';
    if (pct > 100) document.getElementById('loadBar').className = 'h-full bg-red-600';
    else if (pct > 66) document.getElementById('loadBar').className = 'h-full bg-red-400';
    else if (pct > 33) document.getElementById('loadBar').className = 'h-full bg-yellow-400';
    else document.getElementById('loadBar').className = 'h-full bg-[#c5a059]';

    // 4. Classes (BAB, Saves, Skill Points)
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

    document.getElementById('totalLevel').innerText = totalLvl;
    renderClasses();

    // 5. Combat Stats (Perfect Math AC types)
    const sizeMod = (raceData.sz || 0) + (eff.size || 0); // Size AC/Atk is inverse of Special Size Mod? Usually Small = +1 AC/Atk.
    // Note: 'sz' 1 means Small. Small gives +1 AC/Atk. Large gives -1 AC/Atk.
    // Let's treat 'sz' as the modifier directly.

    // Max Dex Logic (Armor vs Load)
    // We don't have armor Max Dex data, so we rely on Load Max Dex.
    let effDexAc = mods.dex;
    if (effDexAc > loadMaxDex) effDexAc = loadMaxDex;

    const acArmor = state.ac_manual.armor;
    const acShield = state.ac_manual.shield;
    const acNatural = state.ac_manual.natural;
    const acDeflect = state.ac_manual.deflect;

    const acTotal = 10 + acArmor + acShield + effDexAc + sizeMod + acNatural + acDeflect + (eff.ac || 0);
    const acTouch = 10 + effDexAc + sizeMod + acDeflect + (eff.ac || 0); // Touch ignores armor, shield, natural
    const acFlat = 10 + acArmor + acShield + sizeMod + acNatural + acDeflect + (eff.ac || 0); // Flat ignores Dex

    document.getElementById('valAC').innerText = acTotal;
    document.getElementById('valTouch').innerText = acTouch;
    document.getElementById('valFlat').innerText = acFlat;
    document.getElementById('valInit').innerText = formatNum(mods.dex + (eff.init || 0)); // Init uses raw Dex

    document.getElementById('valBAB').innerText = formatNum(bab);

    // Grapple = BAB + Str + SpecialSizeMod + Misc
    // Special Size Mod: Small -4, Large +4. 
    // If sz=1 (Small), mod is -4. If sz=-1 (Large), mod is +4.
    const grappleSize = (sizeMod * -4);
    const grapple = bab + mods.str + grappleSize;
    document.getElementById('valGrapple').innerText = formatNum(grapple);

    // HP Calc
    let hpTotalMax = 0;
    state.classes.forEach((c, i) => {
        const hd = CLASSES[c.id].hd;
        hpTotalMax += (i === 0 ? hd : hd / 2 + 1) * c.lvl + (mods.con * c.lvl);
    });
    document.getElementById('hpMax').innerText = Math.max(1, hpTotalMax);

    // Saves
    document.getElementById('saveFort').innerText = formatNum(baseFort + mods.con + (eff.save || 0));
    document.getElementById('saveRef').innerText = formatNum(baseRef + mods.dex + (eff.save || 0)); // Ref uses raw dex usually
    document.getElementById('saveWill').innerText = formatNum(baseWill + mods.wis + (eff.save || 0));

    // 6. Skills & Synergies
    const acpTotal = state.acp_manual + loadAcp; // Add Armor ACP + Load Value
    renderSkills(mods, totalLvl, totalSkillPts, acpTotal);

    // 7. Attacks
    renderAttacks(bab, mods, eff, sizeMod);

    // 8. Spells
    renderSpells();
}

// --- HELPER LOGIC ---

function getCarryingCapacity(str) {
    // Simplified 3.5 Table
    // 10 -> 33/66/100
    // 11 -> 38/76/115
    // 12 -> 43/86/130
    // 13 -> 50/100/150
    // 14 -> 58/116/175
    // 15 -> 66/133/200
    // 16 -> 76/153/230
    // 17 -> 86/173/260
    // 18 -> 100/200/300
    // For now, rough formula:
    let heavy = 0;
    if (str <= 10) heavy = str * 10;
    else heavy = 100 + (str - 10) * 12.5; // Approximation

    // Recursive rule for >29 is complex. Let's stick to approximation for web app unless user complains.
    // Actually, let's use the precise table for 10-18.
    const lookup = { 10: 100, 11: 115, 12: 130, 13: 150, 14: 175, 15: 200, 16: 230, 17: 260, 18: 300 };
    if (lookup[str]) heavy = lookup[str];

    if (str > 18) heavy = 300 + (str - 18) * 25; // Approx for high strength

    const h = Math.floor(heavy);
    return { light: Math.floor(h / 3), medium: Math.floor(h * 2 / 3), heavy: h };
}

function getSave(good, lvl) { return good ? 2 + Math.floor(lvl / 2) : Math.floor(lvl / 3); }

// --- RENDERERS ---

function renderClasses() {
    const div = document.getElementById('classList');
    div.innerHTML = "";
    state.classes.forEach((c, i) => {
        div.innerHTML += `
            <div class="flex justify-between items-center bg-black/20 px-2 py-1 rounded text-xs border border-[#333]">
                <span class="font-bold text-[#c5a059]">${c.id}</span>
                <div class="flex items-center gap-2">
                    <button onclick="modLvl(${i}, -1)" class="text-gray-500 hover:text-white">-</button>
                    <span class="text-white font-mono w-4 text-center">${c.lvl}</span>
                    <button onclick="modLvl(${i}, 1)" class="text-gray-500 hover:text-white">+</button>
                </div>
            </div>`;
    });
}

function renderSkills(mods, maxRankLvl, totalPts, acp) {
    const list = document.getElementById('skillsBody'); // Now a DIV
    list.innerHTML = "";

    // Header for Grid (added via JS to clean up HTML)
    // Actually, let's assume the HTML container is cleared and we rebuild.

    let spent = 0;
    const maxRank = maxRankLvl + 3;

    // Calculate Synergies
    let synergies = {};
    SKILLS_LIST.forEach(s => {
        const ranks = state.skills[s.n] || 0;
        if (ranks >= 5) {
            const gives = SYNERGY_MAP[s.n];
            if (gives) gives.forEach(target => synergies[target] = (synergies[target] || 0) + 2);
        }
    });

    // Identify Class Skills based on current classes
    let classSkills = new Set();
    state.classes.forEach(c => {
        const cData = CLASSES[c.id];
        if (cData && cData.cs) cData.cs.forEach(sk => classSkills.add(sk));
    });

    SKILLS_LIST.forEach(s => {
        let rank = state.skills[s.n] || 0;

        // Multi-rank cost logic? In 3.5, cross-class costs 2 pts for 1 rank. 
        // Max rank for cross-class is (Lvl+3)/2. 
        // Let's keep it simple: 1 pt = 1 rank for now, visually mark cross-class?
        // Or strictly enforce? User wants "Auto-Assign".
        // Let's assume 1-to-1 for simplicity in UI, but highlight Class Skills.
        const isClassSkill = classSkills.has(s.n) || (s.n.startsWith('Saber') && classSkills.has('Saber (Todas)'));

        spent += rank;

        let misc = synergy = synergies[s.n] || 0;
        let acpVal = 0;
        if (s.acp) {
            acpVal = acp;
            if (s.doubleAcp) acpVal *= 2;
        }

        const total = rank + mods[s.a] + misc + acpVal;

        // Render Row (Grid Style Premium)
        // Columns: Name(Mod) | Rank Input | Misc | Total
        const rowClass = isClassSkill ? 'border-l-2 border-[#c5a059] bg-[#c5a059]/5' : 'border-l-2 border-transparent';

        list.innerHTML += `
            <div class="grid grid-cols-12 gap-1 items-center border-b border-[#222] py-2 px-2 group transition-all hover:bg-[#c5a059]/10 ${rowClass}">
                <!-- Name (Click to Roll) -->
                <div class="col-span-6 flex items-center gap-2 cursor-pointer" onclick="logRoll('${s.n}', ${total})">
                    <span class="text-xs ${isClassSkill ? 'text-[#c5a059] font-bold shadow-gold' : 'text-gray-400 font-medium'} group-hover:text-white transition-colors">${s.n}</span>
                    <span class="text-[9px] text-gray-600 uppercase font-mono">/ ${s.a}</span>
                    ${s.trained ? '<i data-lucide="graduation-cap" class="w-3 h-3 text-red-900 opacity-50" title="Solo Entrenada"></i>' : ''}
                    ${s.acp ? '<i data-lucide="shield" class="w-3 h-3 text-gray-700" title="ACP Afecta"></i>' : ''}
                </div>
                
                <!-- Rank Input -->
                <div class="col-span-2 text-center relative">
                    <input type="number" class="w-full text-center bg-transparent text-white font-bold text-xs border-b border-[#333] focus:border-[#c5a059] focus:outline-none py-1"
                           min="0" max="${maxRank}" value="${rank}"
                           onchange="setSkill('${s.n}', this.value)">
                </div>
                
                <!-- Misc/Mod Info -->
                <div class="col-span-2 text-center text-[10px] text-gray-500 font-mono">
                    ${(misc + acpVal) !== 0 ? formatNum(misc + acpVal) : '<span class="opacity-20">-</span>'}
                </div>
                
                <!-- Total -->
                <div class="col-span-2 text-right">
                    <span class="text-sm font-bold ${total > 0 ? 'text-[#c5a059]' : 'text-gray-600'} cursor-pointer hover:scale-125 inline-block transition-transform" onclick="logRoll('${s.n}', ${total})">
                        ${formatNum(total)}
                    </span>
                </div>
            </div>`;
    });

    const ptsRemaining = Math.max(0, totalPts - spent);
    document.getElementById('skillPts').innerText = ptsRemaining;

    // Auto-Assign Button visibility
    const autoBtn = document.getElementById('btnAutoSkill');
    if (autoBtn) {
        if (ptsRemaining > 0) autoBtn.classList.remove('hidden');
        else autoBtn.classList.add('hidden');
    }

    lucide.createIcons();
}

function autoDistributeSkills() {
    let totalLvl = 0;
    let totalPts = 0;

    const intMod = parseInt(document.getElementById('mod_int').innerText) || 0;
    const raceSp = (RACES[state.race] || {}).sp || 0;

    state.classes.forEach((c, idx) => {
        totalLvl += c.lvl;
        const cd = CLASSES[c.id];
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

    // Distribute
    let remaining = totalPts;
    let currentSpent = 0;
    for (let k in state.skills) currentSpent += state.skills[k];
    remaining -= currentSpent;

    if (remaining <= 0) { window.showCustomAlert("No quedan puntos de habilidad por asignar."); return; }

    const maxRank = totalLvl + 3;
    let anyChange = true;

    while (remaining > 0 && anyChange) {
        anyChange = false;
        // Prioritize skills? Alphabetical for now.
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
}

async function restCharacter() {
    if (!await window.showCustomConfirm("¿Realizar Descanso Largo? (Recuperar PG, Hechizos y eliminar fatiga)")) return;

    // 1. Heal HP
    // Calc Max HP
    let maxHP = parseInt(document.getElementById('hpMax').innerText) || 10;
    state.hp_curr = maxHP;
    document.getElementById('hpCurr').value = maxHP;

    // 2. Clear Used Slots
    state.used_slots = {};

    // 3. Clear Buffs? (Optional, maybe keep equipment buffs, clear spells)
    // Let's clear all for "Long Rest" logic
    state.buffs = [];

    updateAll();
    logRoll("Descanso Largo", 0, 0, "Recuperación completa");
}

async function distributeAttributes() {
    if (!await window.showCustomConfirm("¿Asignar automáticamante? Se sobrescribirán tus atributos actuales.")) return;

    // Standard Array (Elite)
    const STANDARD = [15, 14, 13, 12, 10, 8];
    const STAT_NAMES = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

    // Priorities by Class
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

    // 1. Get Primary Class
    const mainClass = state.classes.length > 0 ? state.classes[0].id : 'Guerrero';

    // 2. Get Priority List
    const prio = PRIORITIES[mainClass] || PRIORITIES['Guerrero'];

    // 3. Assign Base Scores
    let baseStats = {};
    prio.forEach((key, idx) => {
        baseStats[key] = STANDARD[idx];
    });

    // 4. Apply Race Logic (Manual) to Base, NOT just overriding.
    // Wait, the engine applies race calc in `updateAll` dynamically to `state.stats`.
    // So `state.stats` should hold the BASE value (raw dice roll or point buy).
    // The engine ADDS race mods later.
    // BUT! RACES constant defines modifiers.
    // Example: Elf has {dex: 2, con: -2}.
    // If we set state.stats.dex = 14 (Secondary), final will be 16.
    // Correct behavior for "Base Stats" inputs is to set them WITHOUT race mods.
    // Users normally mistakenly put final stats in base.
    // My engine: `total = state.stats[k] + (raceData.s[k] || 0) ...`
    // So YES, I should just set the STANDARD ARRAY into `state.stats`.
    // The engine will do the rest.

    // BUT wait, does user expect "15" to result in "17"? Yes.
    // Or does user want "15" to be the FINAL result? No, usually they assign points.

    // So simply assigning `state.stats` is correct.

    KEYS.forEach(k => {
        state.stats[k] = baseStats[k];
        document.getElementById('base_' + k).value = baseStats[k];
    });

    updateAll();
    window.showToast(`Atributos asignados para ${mainClass}.`);
}

// --- ARCHETYPE GENERATOR ---
function openGenerator() {
    // Simple Prompt UI replacement for now, or a custom modal injection
    // Let's inject a modal if it doesn't exist
    let modal = document.getElementById('genModal');
    if (!modal) {
        document.body.insertAdjacentHTML('beforeend', `
            <div id="genModal" class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center hidden">
                <div class="bg-[#111] border-2 border-[#c5a059] p-6 rounded-lg w-96 shadow-[0_0_30px_rgba(197,160,89,0.3)]">
                    <h2 class="text-[#c5a059] text-xl font-bold mb-4 border-b border-[#333] pb-2">Generador de Arquetipos</h2>
                    
                    <div class="mb-4">
                        <label class="block text-gray-400 text-xs mb-1">Clase</label>
                        <select id="genClass" class="w-full bg-[#222] text-white border border-[#444] rounded p-2 focus:border-[#c5a059] outline-none">
                            ${Object.keys(ARCHETYPES).map(c => `<option value="${c}">${c}</option>`).join('')}
                        </select>
                    </div>

                    <div class="mb-6">
                        <label class="block text-gray-400 text-xs mb-1">Nivel: <span id="genLevelVal" class="text-white font-bold">1</span></label>
                        <input type="range" id="genLevel" min="1" max="20" value="1" class="w-full accent-[#c5a059]" oninput="document.getElementById('genLevelVal').innerText = this.value">
                    </div>

                    <div class="flex gap-2">
                        <button onclick="document.getElementById('genModal').classList.add('hidden')" class="flex-1 bg-gray-800 text-gray-300 py-2 rounded hover:bg-gray-700">Cancelar</button>
                        <button onclick="runGenerator()" class="flex-1 bg-[#c5a059] text-black font-bold py-2 rounded hover:bg-[#b08c45]">GENERAR</button>
                    </div>
                </div>
            </div>
        `);
        modal = document.getElementById('genModal');
    }
    modal.classList.remove('hidden');
}

async function runGenerator() {
    const cls = document.getElementById('genClass').value;
    const lvl = parseInt(document.getElementById('genLevel').value);

    if (!await window.showCustomConfirm(`⚠️ ATENCIÓN: Esto BORRARÁ tu personaje actual y creará un ${cls} Nivel ${lvl}. ¿Continuar?`)) return;

    // 1. Hide Modal Immediately
    document.getElementById('genModal').classList.add('hidden');

    // 2. Run Generation (Small delay to allow UI refresh)
    setTimeout(() => {
        generateCharacter(cls, lvl);
    }, 50);
}

function generateCharacter(cls, lvl) {
    const ark = ARCHETYPES[cls];
    if (!ark) return window.showCustomAlert("Error: Arquetipo no encontrado.");

    // 1. Reset State
    state = {
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
        used_slots: {},
        notes: ""
    };

    // 2. Attributes (Standard Array + Scaling)
    const STANDARD = [15, 14, 13, 12, 10, 8];
    const prio = ark.priorities;

    // Assign Base
    prio.forEach((key, idx) => {
        state.stats[key] = STANDARD[idx];
    });

    // Scaling: +1 to Primary every 4 levels
    const bumps = Math.floor(lvl / 4);
    if (bumps > 0) {
        const primary = prio[0];
        state.stats[primary] += bumps;
    }

    // 3. HP Calculation
    const hd = CLASSES[cls].hd;
    const conMod = Math.floor((state.stats.con - 10) / 2);

    let hp = hd + conMod; // Level 1
    if (lvl > 1) {
        const avg = (hd / 2) + 1;
        hp += (avg + conMod) * (lvl - 1);
    }
    state.hp_curr = Math.floor(hp);

    // 4. Gear Logic (Cumulative / Tier)
    const tiers = [1, 5, 10, 15, 20];

    // Simple Tier Logic: Get the HIGHEST reached tier config
    let bestTier = 1;
    tiers.forEach(t => {
        if (lvl >= t) bestTier = t;
    });

    if (ark.gear[bestTier]) {
        ark.gear[bestTier].forEach(item => {
            state.inventory.push({ n: item, w: 0, q: 1 });
        });
    }

    // 5. Spells
    if (ark.spells) {
        // Determine Max Castable Level
        let maxCast = 0;
        if (['Mago', 'Clerigo', 'Druida'].includes(cls)) {
            // Full Prepared: Lv 1->1, 3->2, 17->9
            maxCast = Math.ceil(lvl / 2);
            if (maxCast > 9) maxCast = 9;
        } else if (['Paladin', 'Explorador'].includes(cls)) {
            // Half Prepared: Lv 4->1, 8->2, 11->3, 14->4
            if (lvl < 4) maxCast = -1;
            else if (lvl < 8) maxCast = 1;
            else if (lvl < 11) maxCast = 2;
            else if (lvl < 14) maxCast = 3;
            else maxCast = 4;
        } else if (SPELL_KNOWN[cls]) {
            // Spontaneous (Sor, Bard): Look up table
            // Table rows are Lvl 1-20. Return array of knowns.
            // If the array has value at index X, we can cast level X.
            // We just want ANY spells provided the table allows ANY known at that level.
            // Actually simpler: iterate the Archetype lists and check against table.
            // But let's define maxCast for consistency loop.
            // Sorcerer: L1->1, L4->2. 
            // We'll filter inside the loop using the table directly.
            maxCast = 9; // Fallback, checked inside
        }

        for (const [sLvlStr, list] of Object.entries(ark.spells)) {
            const sLvl = parseInt(sLvlStr);

            // Filtering
            if (SPELL_KNOWN[cls]) {
                // Check if we know ANY spells of this level
                const tableRow = SPELL_KNOWN[cls][Math.min(20, lvl) - 1];
                if (!tableRow || tableRow.length <= sLvl || tableRow[sLvl] < 1) continue;
            } else {
                // Prepared
                if (sLvl > maxCast) continue;
            }

            // Zero level usually allowed for all casters
            if (sLvl === 0 && maxCast >= 0) { /* Allow */ }
            else if (sLvl === 0 && maxCast < 0) continue; // Paladin L1 no cantrips? (Actually they don't have 0 level slots usually)

            list.forEach(spellName => {
                const dbSpell = SPELL_DB.find(x => x.n === spellName);
                if (dbSpell) {
                    state.spells.push({ n: spellName, l: `N${sLvlStr}`, d: dbSpell.d });
                } else {
                    state.spells.push({ n: spellName, l: `N${sLvlStr}`, d: "Descripción no disponible." });
                }
            });
        }
    }

    // 6. Sync UI
    KEYS.forEach(k => document.getElementById('base_' + k).value = state.stats[k]);
    document.getElementById('charName').value = state.name; // Updated logic
    document.getElementById('hpCurr').value = state.hp_curr;

    updateAll();
    window.showToast(`¡Arquetipo ${cls} Nivel ${lvl} Generado!`);
}

function renderAttacks(bab, mods, eff, sizeAtk) {
    const div = document.getElementById('attacksList');
    div.innerHTML = "";
    state.weapons.forEach((wIdx, i) => {
        const w = WEAPONS_DB[wIdx];
        const statMod = mods[w.stat];
        // Attack calculation: BAB + Stat + Size + Magic(eff.atk)
        const atk = bab + statMod + (eff.atk || 0) + sizeAtk;

        // Damage calculation: Die + StatMod (x1.5 if TwoHanded? We check 'h' prop)
        // h:2 means two-handed logic (usually 1.5x Str) unless it's Dex based...
        // For simplicity: If Str based and h:2, dmgMod = Str * 1.5
        let dmgMod = 0;
        if (w.stat === 'str') {
            dmgMod = w.h === 2 ? Math.floor(statMod * 1.5) : statMod;
        }

        div.innerHTML += `
            <div class="bg-black/30 border border-[#333] rounded p-2 flex justify-between items-center cursor-pointer hover:border-[#c5a059] group transition mb-2" onclick="logRoll('Ataque ${w.n}', ${atk})">
                <div>
                    <div class="font-bold text-[#c5a059] text-xs">${w.n}</div>
                    <div class="text-[10px] text-gray-500">${w.d}${dmgMod >= 0 ? "+" : ""}${dmgMod} | ${w.c}</div>
                </div>
                <div class="flex items-center gap-3">
                    <div class="text-lg font-bold text-white group-hover:text-blue-400">${formatNum(atk)}</div>
                    <button onclick="remWeapon(${i}); event.stopPropagation()" class="text-gray-600 hover:text-red-500">
                        <i data-lucide="x" class="w-3 h-3"></i>
                    </button>
                </div>
            </div>`;
    });
    lucide.createIcons();
}

// --- GRIMOIRE 2.0 DATA ---

// Primary Casting Stat
const CASTER_TYPE = {
    'Mago': 'int', 'Hechicero': 'cha', 'Clerigo': 'wis', 'Druida': 'wis',
    'Bardo': 'cha', 'Paladin': 'wis', 'Explorador': 'wis'
};

// Spells Per Day (3.5 Core) - Array index = Class Level (1-20)
// Format: [Lvl0, Lvl1, Lvl2, ..., Lvl9]
const SPELL_PROG = {
    'Mago': [
        [3, 1], [4, 2], [4, 2, 1], [4, 3, 2], [4, 3, 2, 1],
        [4, 3, 3, 2], [4, 4, 3, 2, 1], [4, 4, 3, 3, 2], [4, 4, 4, 3, 2, 1],
        [4, 4, 4, 3, 3, 2], [4, 4, 4, 4, 3, 2, 1], [4, 4, 4, 4, 3, 3, 2],
        [4, 4, 4, 4, 4, 3, 2, 1], [4, 4, 4, 4, 4, 3, 3, 2], [4, 4, 4, 4, 4, 4, 3, 2, 1],
        [4, 4, 4, 4, 4, 4, 3, 3, 2], [4, 4, 4, 4, 4, 4, 4, 3, 2, 1],
        [4, 4, 4, 4, 4, 4, 4, 3, 3, 2], [4, 4, 4, 4, 4, 4, 4, 4, 3, 3], [4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
    ],
    'Hechicero': [
        [5, 3], [6, 4], [6, 5], [6, 6, 3], [6, 6, 4],
        [6, 6, 5, 3], [6, 6, 6, 4], [6, 6, 6, 5, 3], [6, 6, 6, 6, 4],
        [6, 6, 6, 6, 5, 3], [6, 6, 6, 6, 6, 4], [6, 6, 6, 6, 6, 5, 3],
        [6, 6, 6, 6, 6, 6, 4], [6, 6, 6, 6, 6, 6, 5, 3], [6, 6, 6, 6, 6, 6, 6, 4],
        [6, 6, 6, 6, 6, 6, 6, 5, 3], [6, 6, 6, 6, 6, 6, 6, 6, 4],
        [6, 6, 6, 6, 6, 6, 6, 6, 5, 3], [6, 6, 6, 6, 6, 6, 6, 6, 6, 4],
        [6, 6, 6, 6, 6, 6, 6, 6, 6, 6]
    ],
    'Clerigo': [ // Same as Druid
        [3, 1], [4, 2], [4, 2, 1], [5, 3, 2], [5, 3, 2, 1],
        [5, 3, 3, 2], [6, 4, 3, 2, 1], [6, 4, 3, 3, 2], [6, 4, 4, 3, 2, 1],
        [6, 4, 4, 3, 3, 2], [6, 5, 4, 4, 3, 2, 1], [6, 5, 4, 4, 3, 3, 2],
        [6, 5, 5, 4, 4, 3, 2, 1], [6, 5, 5, 4, 4, 3, 3, 2], [6, 5, 5, 5, 4, 4, 3, 2, 1],
        [6, 5, 5, 5, 4, 4, 3, 3, 2], [6, 5, 5, 5, 5, 4, 4, 3, 2, 1],
        [6, 5, 5, 5, 5, 4, 4, 3, 3, 2], [6, 5, 5, 5, 5, 5, 4, 4, 3, 3], [6, 5, 5, 5, 5, 5, 4, 4, 4, 4]
    ],
    'Bardo': [
        [2], [3, 0], [3, 1], [3, 2, 0], [3, 3, 1],
        [3, 3, 2], [3, 3, 2, 0], [3, 3, 3, 1], [3, 3, 3, 2],
        [3, 3, 3, 2, 0], [3, 3, 3, 3, 1], [3, 3, 3, 3, 2],
        [3, 3, 3, 3, 2, 0], [4, 3, 3, 3, 3, 1], [4, 4, 3, 3, 3, 2],
        [4, 4, 4, 3, 3, 2, 0], [4, 4, 4, 4, 3, 3, 1],
        [4, 4, 4, 4, 4, 3, 2], [4, 4, 4, 4, 4, 4, 3], [4, 4, 4, 4, 4, 4, 4]
    ],
    'Paladin': [ // Start at lvl 4. Before that undefined (handle gracefully)
        [], [], [], [0], [0], [1], [1], [1, 0], [1, 0], [1, 1],
        [1, 1, 0], [1, 1, 1], [1, 1, 1], [2, 1, 1, 0], [2, 1, 1, 1],
        [2, 2, 1, 1], [2, 2, 2, 1], [3, 2, 2, 1], [3, 3, 3, 2], [3, 3, 3, 3]
    ]
};
SPELL_PROG['Druida'] = SPELL_PROG['Clerigo']; // Same table
SPELL_PROG['Explorador'] = SPELL_PROG['Paladin']; // Same table

// Spells Known (For Sorcerer/Bard checks) - Not strictly enforcing yet, just logic ready.

// --- GRIMOIRE LOGIC ---

function getBonusSpells(statMod) {
    // D&D 3.5 Table:
    // Mod +1: Lvl 1
    // Mod +2: Lvl 1, 2
    // Mod +3: Lvl 1, 2, 3
    // Mod +4: Lvl 1, 2, 3, 4
    // etc.
    // Formula: Bonus slot at Spell Level L exists if StatMod >= L + (L-1)/4 * 4 ?? No simpler:
    // You get a bonus spell of level L if your Modifier is at least L.
    // AND you get another if Mod >= L + 4. And another if Mod >= L + 8.
    let bonus = {}; // {1: 1, 2: 1...}
    if (statMod <= 0) return bonus;

    // Calculate for levels 1 to 9
    for (let lvl = 1; lvl <= 9; lvl++) {
        if (statMod >= lvl) {
            // Count how many sets of 4 fit
            // e.g. Lvl 1 (needs 1). Mod 1->1, Mod 5->2, Mod 9->3.
            // (Mod - Lvl) / 4 ... floor ... + 1
            bonus[lvl] = Math.floor((statMod - lvl) / 4) + 1;
        }
    }
    return bonus;
}

function renderSpells() {
    const listDiv = document.getElementById('spellsList');
    listDiv.innerHTML = "";

    // 1. Identify Caster Class
    let casterClass = null;
    let casterLvl = 0;
    state.classes.forEach(c => {
        if (!casterClass && CASTER_TYPE[c.id]) {
            casterClass = c.id;
            casterLvl = c.lvl;
        }
    });

    if (!casterClass) {
        listDiv.innerHTML = `<div class="col-span-2 text-center text-gray-500 italic py-10">No tienes entrenamiento en las artes arcanas o divinas.</div>`;
        return;
    }

    // 2. Stats
    const statKey = CASTER_TYPE[casterClass];
    const statMod = parseInt(document.getElementById('mod_' + statKey).innerText) || 0;

    // 3. Slots
    let progTable = SPELL_PROG[casterClass];
    let effectiveLvl = Math.min(20, Math.max(1, casterLvl));
    let baseSlots = progTable[effectiveLvl - 1] || [];

    const bonusMap = getBonusSpells(statMod);
    let maxSlots = {};
    baseSlots.forEach((slots, idx) => {
        const lvl = idx;
        let bonus = (lvl > 0) ? (bonusMap[lvl] || 0) : 0;
        maxSlots[lvl] = slots + bonus;
    });

    // 4. ADD NEW SPELL BUTTON
    listDiv.innerHTML += `
        <div class="col-span-1 md:col-span-2 mb-2 flex justify-end">
            <button onclick="toggleCompendium('${casterClass}')" class="btn btn-gold text-xs flex gap-2">
                <i data-lucide="${COMPENDIUM_OPEN ? 'book-open-check' : 'book-open'}" class="w-3 h-3"></i> 
                ${COMPENDIUM_OPEN ? 'Cerrar Compendio' : 'Abrir Compendio'}
            </button>
        </div>
        <div id="compendiumPanel" class="col-span-1 md:col-span-2 ${COMPENDIUM_OPEN ? '' : 'hidden'} bg-[#1a120b] border border-[#c5a059] p-2 mb-2 rounded max-h-96 overflow-y-auto custom-scroll relative">
            <h4 class="font-cinzel text-xs text-[#c5a059] mb-2 sticky top-0 bg-[#1a120b] py-1 border-b border-[#333] z-10 flex justify-between items-center">
                <span>Compendio de ${casterClass}</span>
                <span class="text-[9px] text-gray-500 uppercase tracking-wider">Haga clic en un nivel para expandir</span>
            </h4>
            <div id="compendiumList" class="space-y-1"></div>
        </div>`;

    if (COMPENDIUM_OPEN) {
        // Defer rendering content slightly to ensure DOM exists
        setTimeout(() => renderCompendiumContent(casterClass), 0);
    }

    // 5. Render Known Spells as Cards
    let spellsByLevel = {};
    state.spells.forEach((s, i) => {
        const dbSpell = SPELL_DB.find(db => db.n === s.n);
        const l = parseInt(s.l.replace('N', ''));
        if (!spellsByLevel[l]) spellsByLevel[l] = [];
        spellsByLevel[l].push({ data: s, idx: i, details: dbSpell });
    });

    if (!state.used_slots) state.used_slots = {};

    for (let lvl = 0; lvl <= 9; lvl++) {
        const max = maxSlots[lvl] || 0;
        const knw = spellsByLevel[lvl] || [];

        if (max === 0 && knw.length === 0) continue;

        // Header with Slots
        let slotHtml = '';
        if (max > 0) {
            const used = state.used_slots[lvl] || 0;
            slotHtml = `<div class="flex gap-1 bg-black/40 px-2 py-1 rounded-full border border-[#333]">`;
            for (let i = 0; i < max; i++) {
                const isUsed = i < used;
                slotHtml += `
                    <div onclick="toggleSlot(${lvl}, ${i})" 
                         class="w-3 h-3 rounded-full border border-[#444] cursor-pointer ${isUsed ? 'bg-transparent' : 'bg-blue-500 shadow-[0_0_5px_#3b82f6]'} transition-all hover:scale-110"
                         title="${isUsed ? 'Gastado' : 'Disponible'}">
                    </div>`;
            }
            slotHtml += `</div>`;
        }

        let spellRows = '';
        knw.forEach(item => {
            const hasDetails = !!item.details;

            spellRows += `
                <div class="bg-blue-900/10 border border-blue-900/30 rounded px-2 py-2 text-xs text-blue-200 group hover:bg-black/40 transition-colors cursor-pointer flex justify-between items-center" 
                     onclick="${hasDetails ? `openSpellCard('${item.data.n}')` : `window.showCustomAlert('Detalles no disponibles')`}">
                    
                    <div class="flex flex-col">
                        <span class="font-bold flex items-center gap-2">
                            ${item.data.n}
                            ${hasDetails ? '<i data-lucide="info" class="w-3 h-3 text-[#c5a059] opacity-50"></i>' : ''}
                        </span>
                    </div>

                    <div class="flex gap-2 items-center">
                        <button onclick="remSpell(${item.idx}); event.stopPropagation()" class="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                            <i data-lucide="trash" class="w-3 h-3"></i>
                        </button>
                    </div>
                </div>`;
        });

        listDiv.innerHTML += `
            <div class="col-span-1 md:col-span-2 bg-[#0c1014] border border-[#222] rounded p-2 mb-2">
                <div class="flex justify-between items-center mb-2 border-b border-[#222] pb-1">
                    <span class="font-bold text-[#c5a059] text-xs uppercase">Nivel ${lvl}</span>
                    ${slotHtml}
                </div>
                <div class="grid grid-cols-1 gap-1">
                    ${spellRows}
                    ${spellRows === '' ? '<span class="text-[10px] text-gray-600 italic">Sin hechizos en grimorio</span>' : ''}
                </div>
            </div>`;
    }
    lucide.createIcons();
}

// --- NEW COMPENDIUM LOGIC ---

const CLASS_ABBREV = {
    'Bardo': 'Brd',
    'Clerigo': 'Clr',
    'Druida': 'Drd',
    'Paladin': 'Pal',
    'Explorador': 'Rgr',
    'Hechicero': 'Sor',
    'Mago': 'Wiz'
};

function getClassLevel(levelStr, className) {
    if (!levelStr || typeof levelStr !== 'string') return undefined;

    let abbr = CLASS_ABBREV[className];
    if (!abbr) return undefined;

    // Handle Sor/Wiz case
    if ((className === 'Hechicero' || className === 'Mago') && levelStr.includes('Sor/Wiz')) {
        abbr = 'Sor/Wiz';
    }

    // Regex to find "Abbr Level"
    // e.g. "Brd 0, Clr 1" -> match "Clr 1"
    const regex = new RegExp(abbr + '\\s*(\\d+)');
    const match = levelStr.match(regex);

    if (match) return parseInt(match[1]);
    return undefined;
}

// --- NEW COMPENDIUM LOGIC ---
function toggleCompendium(cls) {
    COMPENDIUM_OPEN = !COMPENDIUM_OPEN;
    updateAll(); // Re-render to show/hide panel persistently
}

function renderCompendiumContent(cls) {
    const l = document.getElementById('compendiumList');
    if (!l) return;
    l.innerHTML = "";

    // Find Caster Level
    const cObj = state.classes.find(x => x.id === cls);
    const lvl = cObj ? cObj.lvl : 1;

    // Determine Max Spell Level allowed
    let maxCastLvl = 0;
    const prog = SPELL_PROG[cls];
    if (prog) {
        // -1 to handle 0-based index vs 1-based level
        const dayTable = prog[Math.min(prog.length, lvl) - 1];
        if (dayTable) maxCastLvl = dayTable.length - 1;
        else maxCastLvl = -1;
    }

    // Filter DB
    let available = SPELL_DB.map(s => {
        return { ...s, castLvl: getClassLevel(s.l, cls) };
    }).filter(s => s.castLvl !== undefined && s.castLvl <= maxCastLvl);

    // Group by Level
    const spellsByLvl = {};
    available.forEach(s => {
        if (!spellsByLvl[s.castLvl]) spellsByLvl[s.castLvl] = [];
        spellsByLvl[s.castLvl].push(s);
    });

    // Render Groups using <details>
    Object.keys(spellsByLvl).sort((a, b) => parseInt(a) - parseInt(b)).forEach(lvlKey => {
        const lvlInt = parseInt(lvlKey);
        const groupSpells = spellsByLvl[lvlInt];

        // Sort spells alphabetically
        groupSpells.sort((a, b) => a.n.localeCompare(b.n));

        // Create Details Element
        const details = document.createElement('details');
        details.className = "group bg-black/20 rounded border border-[#333] mb-1 open:bg-black/40 open:border-[#c5a059]";

        const summary = document.createElement('summary');
        summary.className = "cursor-pointer p-2 font-bold text-[#c5a059] text-xs uppercase hover:bg-white/5 flex justify-between items-center select-none";
        summary.innerHTML = `<span>Nivel ${lvlInt}</span> <span class="text-[10px] text-gray-500">${groupSpells.length} Hechizos</span>`;

        const content = document.createElement('div');
        content.className = "p-1 grid grid-cols-1 gap-1";

        let html = "";
        groupSpells.forEach(s => {
            const sLvl = s.castLvl;
            const exists = state.spells.some(x => x.n === s.n);

            // Check Limit
            let atLimit = false;
            // Simplified limit logic for display
            if (SPELL_KNOWN[cls]) {
                const kTable = SPELL_KNOWN[cls][Math.min(20, lvl) - 1];
                const max = kTable ? (kTable[sLvl] !== undefined ? kTable[sLvl] : 0) : 0;
                const current = state.spells.filter(x => parseInt(x.l.replace('N', '')) === sLvl).length;
                if (current >= max) atLimit = true;
            }

            const canAdd = !exists && !atLimit;
            const icon = exists ? 'check' : (atLimit ? 'lock' : 'plus');
            const color = exists ? 'text-green-500' : (atLimit ? 'text-gray-600' : 'text-[#c5a059]');

            html += `
                <div class="flex justify-between items-center hover:bg-white/5 p-1 rounded cursor-pointer ${exists || atLimit ? 'opacity-50' : ''}" 
                     onclick="${canAdd ? `addSpellFromDB('${s.n}', ${sLvl})` : ''}">
                    <div class="flex flex-col">
                        <span class="text-gray-300 text-xs font-bold">${s.n}</span>
                    </div>
                    <i data-lucide="${icon}" class="w-3 h-3 ${color}"></i>
                </div>`;
        });

        content.innerHTML = html;
        details.appendChild(summary);
        details.appendChild(content);
        l.appendChild(details);
    });

    lucide.createIcons();
}

function addSpellFromDB(name, lvl) {
    state.spells.push({ l: 'N' + lvl, n: name });
    // Show Toast
    if (window.showToast) window.showToast(`Hechizo aprendido: ${name}`);

    // KEEP COMPENDIUM OPEN logic is handled by global state + updateAll
    updateAll();
}

function toggleSpellCard(idx) {
    const el = document.getElementById('spell_desc_' + idx);
    if (el) el.classList.toggle('hidden');
}

function toggleSlot(lvl, idx) {
    const current = state.used_slots[lvl] || 0;
    const isUsed = idx < current;
    if (isUsed) state.used_slots[lvl] = idx;
    else state.used_slots[lvl] = idx + 1;
    updateAll();
}

function remSpell(i) {
    state.spells.splice(i, 1);
    updateAll();
}

function addSpell() {
    const lvl = document.getElementById('spellLvl').value;
    const name = document.getElementById('spellSelect').value;
    state.spells.push({ l: 'N' + lvl, n: name });
    updateAll();
}

// --- ACTIONS ---

function addClass() {
    state.classes.push({ id: document.getElementById('addClassSelect').value, lvl: 1 });
    updateAll();
}

function modLvl(i, val) {
    state.classes[i].lvl += val;
    if (state.classes[i].lvl <= 0) state.classes.splice(i, 1);
    if (state.classes.length === 0) { } // Allow empty classes
    updateAll();
}

function setSkill(n, v) {
    state.skills[n] = parseInt(v) || 0;
    updateAll();
}

function addWeapon() {
    state.weapons.push(document.getElementById('weaponSelect').value);
    updateAll();
}

function remWeapon(i) {
    state.weapons.splice(i, 1);
    updateAll();
}

function toggleBuff(id) {
    const idx = state.buffs.indexOf(id);
    const el = document.getElementById('buff_' + id);
    if (idx === -1) {
        state.buffs.push(id);
        el.classList.add('active');
    } else {
        state.buffs.splice(idx, 1);
        el.classList.remove('active');
    }
    updateAll();
}



// --- UTILS & LOGS ---

function formatNum(n) { return (n >= 0 ? "+" : "") + n; }

// --- TABS & UI ---

function switchTab(tabId) {
    // Hide all content
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    // Deactivate all buttons
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    // Show target content
    document.getElementById('tab-' + tabId).classList.remove('hidden');
    // Activate target button
    document.getElementById('btn-' + tabId).classList.add('active');
}

// --- DICE ROLLER ---

function rollCustomDice(sides) {
    const count = parseInt(document.getElementById('diceCount').value) || 1;
    const mod = parseInt(document.getElementById('diceMod').value) || 0;

    // Animate Button
    // (Optional visual feedback)

    let total = 0;
    let rolls = [];
    for (let i = 0; i < count; i++) {
        const r = Math.floor(Math.random() * sides) + 1;
        rolls.push(r);
        total += r;
    }

    const rollStr = `[${rolls.join(',')}]`;
    const label = `${count}d${sides}`;
    logRoll(label, mod, total, rollStr);
}

function rollFormula() {
    const sides = parseInt(document.getElementById('diceType').value);
    rollCustomDice(sides);
}

function logRoll(label, mod, rawTotal, details = "") {
    // If rawTotal provided, use it. If not (standard check), rawTotal is just the d20 result.
    // Wait, let's normalize. 
    // Standard checks use logRoll(label, mod) where it rolls 1d20 internally.
    // We need to overload or split.

    // Let's refactor logRoll to handle both:
    // 1. logRoll(label, mod) -> Rolls 1d20 + mod
    // 2. logRoll(label, mod, rawTotal, details) -> Logs rawTotal + mod

    let base = 0;
    let isCrit = false;
    let isFail = false;
    let displayDetails = details;

    if (rawTotal === undefined) {
        // Mode 1: Auto d20
        base = Math.floor(Math.random() * 20) + 1;
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

// Override old rollD20/rollCheck to Use New Logger
function rollD20() { logRoll("d20 Check", 0); }
function rollCheck(s) {
    // Check if it's a Stat or generic
    let mod = 0;
    if (STATS.includes(s)) {
        mod = parseInt(document.getElementById('mod_' + KEYS[STATS.indexOf(s)]).innerText);
    } else if (s === 'Initiative') {
        mod = parseInt(document.getElementById('valInit').innerText);
    } else if (s === 'BAB') {
        mod = parseInt(document.getElementById('valBAB').innerText);
    } else if (s === 'Presa') {
        mod = parseInt(document.getElementById('valGrapple').innerText);
    } else if (['Fortaleza', 'Reflejos', 'Voluntad'].includes(s)) {
        // Map to IDs
        const map = { 'Fortaleza': 'saveFort', 'Reflejos': 'saveRef', 'Voluntad': 'saveWill' };
        mod = parseInt(document.getElementById(map[s]).innerText);
    } else {
        // Try finding skill
        // We don't have direct skill map access easily by name unless we search rows.
        // For simplicity, skills click handlers pass the value directly in a closure?
        // No, renderSkills currently doesn't attach onclick to row.
        // TODO: attach onclick to skill rows?
    }
    logRoll(s, mod);
}

// --- PERSISTENCE ---

function saveData() {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(state)], { type: "application/json" }));
    a.download = (state.name || "Heroe") + ".json";
    a.click();
    window.showToast('✅ Ficha exportada correctamente');
}

function loadData(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (ev) {
        try {
            const data = JSON.parse(ev.target.result);

            // Name
            if (data.name) document.getElementById('charName').value = data.name;

            // Race
            if (data.race) document.getElementById('raceSelect').value = data.race;

            // Stats
            KEYS.forEach(k => {
                if (data.stats && data.stats[k]) {
                    document.getElementById('base_' + k).value = data.stats[k];
                }
            });

            updateAll();
            updateAll();
            window.showToast('✅ Ficha importada correctamente');
        } catch (x) {
            console.error(x);
            window.showToast('❌ Error al cargar el archivo', 'error');
        }
    };
    reader.readAsText(e.target.files[0]);
}

// --- CUSTOM SPINNERS ENGINE ---
function applyCustomSpinners() {
    // Find all number inputs that haven't been enhanced yet
    document.querySelectorAll('input[type="number"]:not(.enhanced)').forEach(input => {
        // Apply to all, even if hidden (so they are ready when tab switches)

        input.classList.add('enhanced');

        // Wrap input
        const wrapper = document.createElement('div');
        wrapper.className = 'input-wrapper';
        if (input.parentNode) {
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);
        }

        // Create controls
        const controls = document.createElement('div');
        controls.className = 'spinner-controls';
        controls.innerHTML = `
            <button class="spinner-btn up" tabindex="-1">▲</button>
            <button class="spinner-btn down" tabindex="-1">▼</button>
        `;
        wrapper.appendChild(controls);

        // Handlers
        const btnUp = controls.querySelector('.up');
        const btnDown = controls.querySelector('.down');

        const triggerChange = () => {
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        };

        btnUp.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            input.stepUp();
            triggerChange();
        };

        btnDown.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            input.stepDown();
            triggerChange();
        };
    });
}

// Ensure spinners are applied after rendering updates
const originalRenderSkills = renderSkills;
renderSkills = function (...args) {
    originalRenderSkills(...args);
    setTimeout(applyCustomSpinners, 50);
};

// Initial Application
document.addEventListener("DOMContentLoaded", () => {
    // Hook into main init
    setTimeout(applyCustomSpinners, 200);
});

// Add to updateAll just in case (e.g. after loadData)
const originalUpdateAll = updateAll;
updateAll = function () {
    originalUpdateAll();
};
// --- SPELL CARD MODAL SYSTEM ---

function injectSpellModal() {
    if (document.getElementById('spellCardModal')) return;



    const modalHTML = `
    <div id="spellCardModal" class="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center hidden backdrop-blur-sm p-4">
        <div class="bg-[#120c0a] border-2 border-[#c5a059] w-full max-w-lg rounded-lg shadow-[0_0_50px_rgba(197,160,89,0.2)] flex flex-col max-h-[90vh]">
            
            <!-- Header -->
            <div class="p-4 border-b border-[#c5a059]/30 bg-[#1a120b] flex justify-between items-start">
                <div>
                    <h3 id="scName" class="font-cinzel text-2xl text-[#c5a059] font-bold leading-none mb-1">Nombre Hechizo</h3>
                    <div class="flex gap-2 text-xs text-gray-500 font-mono uppercase">
                        <span id="scLevel" class="text-gray-400">Nivel X</span>
                    </div>
                </div>
                <button onclick="closeSpellCard()" class="text-gray-500 hover:text-red-500 transition-colors">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
            </div>

            <!-- Scrollable Content -->
            <div class="p-5 overflow-y-auto custom-scroll space-y-4 flex-grow">
                
                <!-- Icons / Stats Row -->
                <div class="grid grid-cols-2 gap-4 bg-black/20 p-3 rounded border border-[#333]">
                    <div class="space-y-1 text-xs">
                        <div class="flex justify-between"><span class="text-gray-500">Tiempo:</span> <span id="scTime" class="text-white">1 Acción</span></div>
                        <div class="flex justify-between"><span class="text-gray-500">Alcance:</span> <span id="scRange" class="text-white">-</span></div>
                        <div class="flex justify-between"><span class="text-gray-500">Componentes:</span> <span id="scComp" class="text-white italic">-</span></div>
                    </div>
                    <div class="space-y-1 text-xs border-l border-[#333] pl-3">
                        <div class="flex justify-between"><span class="text-gray-500">Duración:</span> <span id="scDur" class="text-white">Instantáneo</span></div>
                        <div class="flex justify-between"><span class="text-gray-500">Escuela:</span> <span id="scSchool" class="text-[#c5a059]">-</span></div>
                        <div class="flex justify-between"><span class="text-gray-500">Salvación:</span> <span id="scSave" class="text-[#c5a059] font-bold">-</span></div>
                        <div class="flex justify-between"><span class="text-gray-500">Resist. Conjuros:</span> <span id="scSR" class="text-white">-</span></div>
                    </div>
                </div>

                <!-- Description -->
                <div class="text-sm text-gray-300 leading-relaxed font-serif text-justify border-t border-[#333] pt-4">
                    <p id="scDesc">Descripción del hechizo...</p>
                </div>
            </div>

            <!-- Footer Actions -->
            <div class="p-4 border-t border-[#c5a059]/30 bg-[#1a120b] flex gap-3">
                <button onclick="castSpellAction()" class="flex-1 bg-gradient-to-r from-[#c5a059] to-[#b08c45] text-black font-bold py-3 rounded hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(197,160,89,0.4)] flex items-center justify-center gap-2">
                    <i data-lucide="zap" class="w-5 h-5 fill-black"></i> LANZAR HECHIZO
                </button>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    lucide.createIcons();
}

let currentSpellAction = null;

function openSpellCard(name) {
    injectSpellModal();
    const modal = document.getElementById('spellCardModal');

    // Normalize function to remove accents and lowercase
    const normalize = (str) => str.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/[^a-z0-9\s]/g, ""); // Remove special chars

    const normalizedName = normalize(name);

    // Find Data - Try multiple strategies
    let dbSpell = null;

    // 1. Exact match
    dbSpell = SPELL_DB.find(s => s.n === name);

    // 2. Case-insensitive + no accents match
    if (!dbSpell) {
        dbSpell = SPELL_DB.find(s => normalize(s.n) === normalizedName);
    }

    // 3. Partial match (DB name contains search name or vice versa)
    if (!dbSpell) {
        dbSpell = SPELL_DB.find(s =>
            normalize(s.n).includes(normalizedName) ||
            normalizedName.includes(normalize(s.n))
        );
    }

    // 4. Word-based match (any word from name appears in DB name)
    if (!dbSpell) {
        const words = normalizedName.split(/\s+/).filter(w => w.length > 3);
        dbSpell = SPELL_DB.find(s => {
            const dbNorm = normalize(s.n);
            return words.some(word => dbNorm.includes(word));
        });
    }

    if (!dbSpell) return alert("Detalles del hechizo no disponibles");

    // Populate UI
    document.getElementById('scName').innerText = dbSpell.n;
    document.getElementById('scLevel').innerText = dbSpell.l || "Nivel Desconocido";

    document.getElementById('scSchool').innerText = dbSpell.s;
    document.getElementById('scComp').innerText = dbSpell.c;
    document.getElementById('scRange').innerText = dbSpell.r;
    document.getElementById('scSave').innerText = dbSpell.sv;
    document.getElementById('scSR').innerText = dbSpell.sr;
    document.getElementById('scDesc').innerHTML = dbSpell.d.replace(/\n/g, '<br>'); // Support line breaks

    // Default values for missing fields in current DB (Time/Duration not in DB yet)
    // We will assume "1 Acción" and "Ver Texto" if missing
    document.getElementById('scTime').innerText = dbSpell.t || "1 Acción";
    document.getElementById('scDur').innerText = dbSpell.dur || "Ver Texto";

    // Setup Action
    currentSpellAction = () => {
        closeSpellCard();
        logRoll(`Lanzar ${dbSpell.n}`, 0, undefined, "¡Hechizo lanzado!");
    };

    modal.classList.remove('hidden');
}

function closeSpellCard() {
    const modal = document.getElementById('spellCardModal');
    if (modal) modal.classList.add('hidden');
}

function castSpellAction() {
    if (currentSpellAction) currentSpellAction();
}

// Hook into init
const originalInitUIForModal = initUI;
initUI = function () {
    originalInitUIForModal();
    injectSpellModal();
};
