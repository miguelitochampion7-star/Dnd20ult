// D&D 3.5 Core Configuration & Constants

export const STATS = ['Fuerza', 'Destreza', 'Constitución', 'Inteligencia', 'Sabiduría', 'Carisma'];
export const KEYS = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

export const RACES = {
    'Humano': { s: {}, sp: 1 },
    'Enano': { s: { con: 2, cha: -2 }, sp: 0 },
    'Elfo': { s: { dex: 2, con: -2 }, sp: 0 },
    'Gnomo': { s: { con: 2, str: -2 }, sp: 0, sz: 1 },
    'Mediano': { s: { dex: 2, str: -2 }, sp: 0, sz: 1 },
    'Semiorco': { s: { str: 2, int: -2, cha: -2 }, sp: 0 },
    'Semielfo': { s: {}, sp: 0 }
};

export const CLASSES = {
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

export const SPELL_KNOWN = {
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

export const SKILLS_LIST = [
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

export const SYNERGY_MAP = {
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

export const BUFFS = [
    { id: 'furia', n: 'Furia (Barbaro)', d: '+4 Str/Con, +2 Will, -2 AC', e: { str: 4, con: 4, will: 2, ac: -2 } },
    { id: 'toro', n: 'Fuerza de Toro', d: '+4 Str', e: { str: 4 } },
    { id: 'gato', n: 'Gracia Felina', d: '+4 Dex', e: { dex: 4 } },
    { id: 'escudo', n: 'Escudo', d: '+4 AC Escudo', e: { ac: 4 } },
    { id: 'armadura_mago', n: 'Armadura de Mago', d: '+4 AC Armadura', e: { ac: 4 } },
    { id: 'bendicion', n: 'Bendición', d: '+1 Atk/Save', e: { atk: 1, save: 1 } },
    { id: 'agrandar', n: 'Agrandar Persona', d: '+2 Str, -2 Dex, Size Large', e: { str: 2, dex: -2, size: -1 } }
];

export const WEAPONS_DB = [
    { n: "Espada Larga", d: "1d8", c: "19-20/x2", t: "Cortante", stat: "str" },
    { n: "Espada Corta", d: "1d6", c: "19-20/x2", t: "Perforante", stat: "str" },
    { n: "Gran Hacha", d: "1d12", c: "x3", t: "Cortante", stat: "str", h: 2 },
    { n: "Daga", d: "1d4", c: "19-20/x2", t: "Perf/Cort", stat: "dex" },
    { n: "Arco Largo", d: "1d8", c: "x3", t: "Perforante", stat: "dex", r: true },
    { n: "Arco Corto", d: "1d6", c: "x3", t: "Perforante", stat: "dex", r: true },
    { n: "Maza", d: "1d8", c: "x2", t: "Contundente", stat: "str" },
    { n: "Cimitarra", d: "1d6", c: "18-20/x2", t: "Cortante", stat: "str" }
];

// D&D 3.5 Spells Per Day Tables (SRD)
// Each table row index = class level - 1
// Each row = [level 0, level 1, level 2, ...]
export const SPELLS_PER_DAY = {
    'Mago': {
        attr: 'int',
        type: 'prepared',
        table: [
            [3, 1], [4, 2], [4, 2, 1], [4, 3, 2], [4, 3, 2, 1],
            [4, 3, 3, 2], [4, 4, 3, 2, 1], [4, 4, 3, 3, 2], [4, 4, 4, 3, 2, 1], [4, 4, 4, 3, 3, 2],
            [4, 4, 4, 4, 3, 2, 1], [4, 4, 4, 4, 3, 3, 2], [4, 4, 4, 4, 4, 3, 2, 1], [4, 4, 4, 4, 4, 3, 3, 2],
            [4, 4, 4, 4, 4, 4, 3, 2, 1], [4, 4, 4, 4, 4, 4, 3, 3, 2], [4, 4, 4, 4, 4, 4, 4, 3, 2, 1],
            [4, 4, 4, 4, 4, 4, 4, 3, 3, 2], [4, 4, 4, 4, 4, 4, 4, 4, 3, 3], [4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
        ]
    },
    'Hechicero': {
        attr: 'cha',
        type: 'spontaneous',
        table: [
            [5, 3], [6, 4], [6, 5], [6, 6, 3], [6, 6, 4],
            [6, 6, 5, 3], [6, 6, 6, 4], [6, 6, 6, 5, 3], [6, 6, 6, 6, 4], [6, 6, 6, 6, 5, 3],
            [6, 6, 6, 6, 6, 4], [6, 6, 6, 6, 6, 5, 3], [6, 6, 6, 6, 6, 6, 4], [6, 6, 6, 6, 6, 6, 5, 3],
            [6, 6, 6, 6, 6, 6, 6, 4], [6, 6, 6, 6, 6, 6, 6, 5, 3], [6, 6, 6, 6, 6, 6, 6, 6, 4],
            [6, 6, 6, 6, 6, 6, 6, 6, 5, 3], [6, 6, 6, 6, 6, 6, 6, 6, 6, 4], [6, 6, 6, 6, 6, 6, 6, 6, 6, 6]
        ]
    },
    'Clerigo': {
        attr: 'wis',
        type: 'prepared',
        table: [
            [3, 1], [4, 2], [4, 2, 1], [5, 3, 2], [5, 3, 2, 1],
            [5, 3, 3, 2], [6, 4, 3, 2, 1], [6, 4, 3, 3, 2], [6, 4, 4, 3, 2, 1], [6, 4, 4, 3, 3, 2],
            [6, 5, 4, 4, 3, 2, 1], [6, 5, 4, 4, 3, 3, 2], [6, 5, 5, 4, 4, 3, 2, 1], [6, 5, 5, 4, 4, 3, 3, 2],
            [6, 5, 5, 5, 4, 4, 3, 2, 1], [6, 5, 5, 5, 4, 4, 3, 3, 2], [6, 5, 5, 5, 5, 4, 4, 3, 2, 1],
            [6, 5, 5, 5, 5, 4, 4, 3, 3, 2], [6, 5, 5, 5, 5, 5, 4, 4, 3, 3], [6, 5, 5, 5, 5, 5, 4, 4, 4, 4]
        ]
    },
    'Druida': {
        attr: 'wis',
        type: 'prepared',
        table: [
            [3, 1], [4, 2], [4, 2, 1], [5, 3, 2], [5, 3, 2, 1],
            [5, 3, 3, 2], [6, 4, 3, 2, 1], [6, 4, 3, 3, 2], [6, 4, 4, 3, 2, 1], [6, 4, 4, 3, 3, 2],
            [6, 5, 4, 4, 3, 2, 1], [6, 5, 4, 4, 3, 3, 2], [6, 5, 5, 4, 4, 3, 2, 1], [6, 5, 5, 4, 4, 3, 3, 2],
            [6, 5, 5, 5, 4, 4, 3, 2, 1], [6, 5, 5, 5, 4, 4, 3, 3, 2], [6, 5, 5, 5, 5, 4, 4, 3, 2, 1],
            [6, 5, 5, 5, 5, 4, 4, 3, 3, 2], [6, 5, 5, 5, 5, 5, 4, 4, 3, 3], [6, 5, 5, 5, 5, 5, 4, 4, 4, 4]
        ]
    },
    'Bardo': {
        attr: 'cha',
        type: 'spontaneous',
        maxLevel: 6,
        table: [
            [2], [3, 0], [3, 1], [3, 2, 0], [3, 3, 1],
            [3, 3, 2], [3, 3, 2, 0], [3, 3, 3, 1], [3, 3, 3, 2], [3, 3, 3, 2, 0],
            [3, 3, 3, 3, 1], [3, 3, 3, 3, 2], [3, 3, 3, 3, 2, 0], [4, 3, 3, 3, 3, 1],
            [4, 4, 3, 3, 3, 2], [4, 4, 4, 3, 3, 2, 0], [4, 4, 4, 4, 3, 3, 1], [4, 4, 4, 4, 4, 3, 2],
            [4, 4, 4, 4, 4, 4, 3], [4, 4, 4, 4, 4, 4, 4]
        ]
    },
    'Paladin': {
        attr: 'wis',
        type: 'prepared',
        startLevel: 4, // Empieza a lanzar en nivel 4
        maxLevel: 4,   // Hasta hechizos nivel 4
        table: [
            // Nivel de clase 4-20, índice 0 = nivel 4
            [0], [1], [1], [1, 0], [1, 1],
            [1, 1, 0], [1, 1, 1], [1, 1, 1, 0], [2, 1, 1, 1], [2, 2, 1, 1],
            [2, 2, 2, 1], [3, 2, 2, 1], [3, 3, 2, 2], [3, 3, 3, 2], [3, 3, 3, 3]
        ]
    },
    'Explorador': {
        attr: 'wis',
        type: 'prepared',
        startLevel: 4,
        maxLevel: 4,
        table: [
            [0], [1], [1], [1, 0], [1, 1],
            [1, 1, 0], [1, 1, 1], [1, 1, 1, 0], [2, 1, 1, 1], [2, 2, 1, 1],
            [2, 2, 2, 1], [3, 2, 2, 1], [3, 3, 2, 2], [3, 3, 3, 2], [3, 3, 3, 3]
        ]
    }
};

