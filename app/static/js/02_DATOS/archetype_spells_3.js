// Spell entries for archetypes - Part 3: Level 5-9
const ARCHETYPE_SPELLS_3 = [
    // === LEVEL 5 SPELLS ===
    { n: "Muro de Espinas", l: "Clr 5, Drd 5", s: "Conjuración (Creación)", c: "V, S", t: "1 acción estándar", r: "Medio", dur: "10 min/nivel (D)", sv: "Ninguna", sr: "No", d: "Creas un muro de arbustos espinosos que inflige daño a quien lo atraviese." },
    { n: "Comulgar con la Naturaleza", l: "Drd 5, Rgr 4", s: "Adivinación", c: "V, S", t: "10 minutos", r: "Personal", dur: "Instantánea", sv: "Ninguna", sr: "No", d: "Aprendes sobre el terreno en un radio de 1 milla/nivel." },
    { n: "Cono de Frío", l: "Sor/Wiz 5", s: "Evocación [Frío]", c: "V, S, M", t: "1 acción estándar", r: "18 m", dur: "Instantánea", sv: "Reflejos mitad", sr: "Sí", d: "Un cono de frío extremo inflige 1d6/nivel (máximo 15d6) de daño por frío." },
    { n: "Teleportar", l: "Sor/Wiz 5", s: "Conjuración (Teletransporte)", c: "V", t: "1 acción estándar", r: "Personal y toque", dur: "Instantánea", sv: "Ninguna y Voluntad niega (objeto)", sr: "No y Sí (objeto)", d: "Te teletransportas instantáneamente hasta 160 km/nivel." },
    { n: "Muro de Fuerza", l: "Sor/Wiz 5", s: "Evocación [Fuerza]", c: "V, S, M", t: "1 acción estándar", r: "Cercano", dur: "1 ronda/nivel (D)", sv: "Ninguna", sr: "No", d: "Creas un muro invisible e indestructible." },
    { n: "Descarga Flamígera", l: "Clr 5", s: "Evocación", c: "V, S", t: "1 acción estándar", r: "Medio", dur: "Instantánea", sv: "Reflejos mitad", sr: "Sí", d: "Rayos de fuego infligen 1d6/nivel, hasta 15d6." },
    { n: "Resistencia a Conjuros", l: "Clr 5", s: "Abjuración", c: "V, S, DF", t: "1 acción estándar", r: "Toque", dur: "1 min/nivel", sv: "Voluntad niega (inofensivo)", sr: "Sí (inofensivo)", d: "El sujeto gana RC 12 + nivel de lanzador." },
    { n: "Revivir a los Muertos", l: "Clr 5", s: "Conjuración (Curación)", c: "V, S, M, DF", t: "1 minuto", r: "Toque", dur: "Instantánea", sv: "Ninguna", sr: "Sí (inofensivo)", d: "Devuelves la vida a un sujeto muerto hace menos de 1 día/nivel." },
    { n: "Nube Aniquiladora", l: "Sor/Wiz 5", s: "Conjuración (Creación)", c: "V, S", t: "1 acción estándar", r: "Medio", dur: "1 ronda/nivel", sv: "Ver texto", sr: "No", d: "Una nube de niebla venenosa que se mueve 3 m/ronda y mata a criaturas vivas." },
    { n: "Curar Heridas Leves de Masas", l: "Brd 5, Clr 5", s: "Conjuración (Curación)", c: "V, S", t: "1 acción estándar", r: "Cercano", dur: "Instantánea", sv: "Voluntad mitad (inofensivo)", sr: "Sí (inofensivo)", d: "Cura 1d8 +1/nivel a varias criaturas." },
    { n: "Espejismo Arcano", l: "Brd 5, Sor/Wiz 5", s: "Ilusión (Sombra)", c: "V, S", t: "1 acción estándar", r: "Largo", dur: "Concentración + 1 hora/nivel (D)", sv: "Voluntad descreer", sr: "No", d: "Creas una ilusión de un área de terreno." },

    // === LEVEL 6 SPELLS ===
    { n: "Semillas de Fuego", l: "Drd 6", s: "Conjuración (Creación) [Fuego]", c: "V, S, DF", t: "1 acción estándar", r: "Toque", dur: "10 min/nivel o hasta uso", sv: "Ninguna o Reflejos mitad", sr: "No", d: "Bellotas y bayas se convierten en granadas y bombas." },
    { n: "Disipar Magia Mayor", l: "Brd 5, Clr 6, Drd 6, Sor/Wiz 6", s: "Abjuración", c: "V, S", t: "1 acción estándar", r: "Medio", dur: "Instantánea", sv: "Ninguna", sr: "No", d: "Como disipar magia, pero +20 en la prueba en lugar de +10." },
    { n: "Desintegrar", l: "Sor/Wiz 6", s: "Transmutación", c: "V, S, M/DF", t: "1 acción estándar", r: "Medio", dur: "Instantánea", sv: "Fortaleza parcial", sr: "Sí", d: "Un rayo verde inflige 2d6/nivel (máximo 40d6), reduce a polvo si mata." },
    { n: "Relámpago en Cadena", l: "Sor/Wiz 6", s: "Evocación [Electricidad]", c: "V, S, F", t: "1 acción estándar", r: "Largo", dur: "Instantánea", sv: "Reflejos mitad", sr: "Sí", d: "Rayo de 1d6/nivel que salta a objetivos secundarios." },
    { n: "Curar Heridas Moderadas de Masas", l: "Brd 6, Clr 6", s: "Conjuración (Curación)", c: "V, S", t: "1 acción estándar", r: "Cercano", dur: "Instantánea", sv: "Voluntad mitad (inofensivo)", sr: "Sí (inofensivo)", d: "Cura 2d8 +1/nivel a varias criaturas." },
    { n: "Baile Irresistible de Otto", l: "Brd 6, Sor/Wiz 8", s: "Encantamiento (Compulsión) [Mente]", c: "V", t: "1 acción estándar", r: "Toque", dur: "1d4+1 rondas", sv: "Ninguna", sr: "Sí", d: "Obliga a una criatura a bailar, penalizando su CA y salvaciones." },
    { n: "Proyectar Imagen", l: "Brd 6, Sor/Wiz 7", s: "Ilusión (Sombra)", c: "V, S, M", t: "1 acción estándar", r: "Medio", dur: "1 ronda/nivel (D)", sv: "Voluntad descreer", sr: "No", d: "Creas una copia ilusoria de ti mismo que puedes controlar." },
    { n: "Globo de Invulnerabilidad", l: "Sor/Wiz 6", s: "Abjuración", c: "V, S, M", t: "1 acción estándar", r: "Personal", dur: "1 ronda/nivel (D)", sv: "Ninguna", sr: "No", d: "Una esfera te protege de hechizos de nivel 4 o inferior." },

    // === LEVEL 7 SPELLS ===
    { n: "Sanar", l: "Clr 6, Drd 7", s: "Conjuración (Curación)", c: "V, S", t: "1 acción estándar", r: "Toque", dur: "Instantánea", sv: "Voluntad niega (inofensivo)", sr: "Sí (inofensivo)", d: "Cura 10 puntos/nivel, todas las enfermedades y aflicciones mentales." },
    { n: "Tormenta de Fuego", l: "Clr 8, Drd 7", s: "Evocación [Fuego]", c: "V, S", t: "1 ronda", r: "Medio", dur: "Instantánea", sv: "Reflejos mitad", sr: "Sí", d: "Lluvia de fuego que inflige 1d6/nivel en un área de cubos de 3m." },
    { n: "Destrucción", l: "Clr 7", s: "Necromancia [Muerte]", c: "V, S, F", t: "1 acción estándar", r: "Cercano", dur: "Instantánea", sv: "Fortaleza parcial", sr: "Sí", d: "Mata al sujeto o inflige 10d6 si salva." },
    { n: "Resurrección", l: "Clr 7", s: "Conjuración (Curación)", c: "V, S, M, DF", t: "1 minuto", r: "Toque", dur: "Instantánea", sv: "Ninguna", sr: "Sí (inofensivo)", d: "Como revivir, pero funciona sin importar cuánto tiempo haya pasado." },
    { n: "Retrasar Bola de Fuego", l: "Sor/Wiz 7", s: "Evocación [Fuego]", c: "V, S, M", t: "1 acción estándar", r: "Largo", dur: "5 rondas o menos", sv: "Reflejos mitad", sr: "Sí", d: "Como bola de fuego, pero puedes retrasar la explosión hasta 5 rondas." },
    { n: "Dedo de la Muerte", l: "Drd 8, Sor/Wiz 7", s: "Necromancia [Muerte]", c: "V, S", t: "1 acción estándar", r: "Cercano", dur: "Instantánea", sv: "Fortaleza parcial", sr: "Sí", d: "Mata a un sujeto o inflige 3d6+1/nivel si salva." },
    { n: "Jaula de Fuerza", l: "Sor/Wiz 7", s: "Evocación [Fuerza]", c: "V, S, M", t: "1 acción estándar", r: "Cercano", dur: "1 ronda/nivel (D)", sv: "Reflejos niega", sr: "No", d: "Creas una jaula o caja invisible de fuerza que atrapa criaturas." },
    { n: "Invertir Gravedad", l: "Sor/Wiz 7", s: "Transmutación", c: "V, S, M", t: "1 acción estándar", r: "Medio", dur: "1 ronda/nivel (D)", sv: "Ninguna", sr: "No", d: "Los objetos y criaturas caen hacia arriba." },

    // === LEVEL 8 SPELLS ===
    { n: "Explosión Solar", l: "Drd 8, Sor/Wiz 8", s: "Evocación [Luz]", c: "V, S, M/DF", t: "1 acción estándar", r: "Largo", dur: "Instantánea", sv: "Reflejos parcial", sr: "Sí", d: "Ciega en 24 m, inflige 6d6 a no-muertos." },
    { n: "Campo Antimagia", l: "Clr 8, Sor/Wiz 6", s: "Abjuración", c: "V, S, M/DF", t: "1 acción estándar", r: "Personal", dur: "10 min/nivel (D)", sv: "Ninguna", sr: "Ver texto", d: "Un campo de 3 m de radio niega toda magia." },
    { n: "Curar Heridas Críticas de Masas", l: "Clr 8", s: "Conjuración (Curación)", c: "V, S", t: "1 acción estándar", r: "Cercano", dur: "Instantánea", sv: "Voluntad mitad (inofensivo)", sr: "Sí (inofensivo)", d: "Cura 4d8 +1/nivel a varias criaturas." },
    { n: "Horrible Marchitamiento", l: "Sor/Wiz 8", s: "Necromancia", c: "V, S", t: "1 acción estándar", r: "Medio", dur: "Instantánea", sv: "Fortaleza mitad", sr: "Sí", d: "Inflige 1d6/nivel a criaturas vivas en un área de 9m de radio." },
    { n: "Laberinto", l: "Sor/Wiz 8", s: "Conjuración (Teletransporte)", c: "V, S", t: "1 acción estándar", r: "Cercano", dur: "Ver texto", sv: "Ninguna", sr: "Sí", d: "Envías a una criatura a un laberinto extradimensional." },
    { n: "Mente en Blanco", l: "Sor/Wiz 8", s: "Abjuración", c: "V", t: "1 acción estándar", r: "Cercano", dur: "24 horas", sv: "Voluntad niega (inofensivo)", sr: "Sí (inofensivo)", d: "El sujeto es inmune a adivinación y detección mental." },

    // === LEVEL 9 SPELLS ===
    { n: "Cambio de Forma", l: "Drd 9, Sor/Wiz 9", s: "Transmutación", c: "V, S, F", t: "1 acción estándar", r: "Personal", dur: "10 min/nivel (D)", sv: "Ninguna", sr: "No", d: "Puedes asumir cualquier forma y cambiarla una vez por ronda." },
    { n: "Tormenta de Venganza", l: "Clr 9, Drd 9", s: "Conjuración (Convocación)", c: "V, S", t: "1 ronda", r: "Largo", dur: "Concentración (máximo 10 rondas) (D)", sv: "Ver texto", sr: "Sí", d: "Creas una tormenta de rayos, lluvia ácida y granizo." },
    { n: "Sanar de Masas", l: "Clr 9", s: "Conjuración (Curación)", c: "V, S", t: "1 acción estándar", r: "Cercano", dur: "Instantánea", sv: "Voluntad niega (inofensivo)", sr: "Sí (inofensivo)", d: "Como sanar, pero a varias criaturas." },
    { n: "Implosión", l: "Clr 9", s: "Evocación", c: "V, S", t: "1 acción estándar", r: "Cercano", dur: "Concentración (hasta 4 rondas)", sv: "Fortaleza niega", sr: "Sí", d: "Mata a una criatura/ronda." },
    { n: "Milagro", l: "Clr 9", s: "Evocación", c: "V, S", t: "1 acción estándar", r: "Ver texto", dur: "Ver texto", sv: "Ver texto", sr: "Sí", d: "Pides intervención divina para lograr casi cualquier efecto." },
    { n: "Lluvia de Meteoritos", l: "Sor/Wiz 9", s: "Evocación [Fuego]", c: "V, S", t: "1 acción estándar", r: "Largo", dur: "Instantánea", sv: "Ninguna o Reflejos mitad", sr: "Sí", d: "Cuatro esferas (2d6 impacto + 6d6 fuego cada una) explotan en 12m de radio." },
    { n: "Deseo", l: "Sor/Wiz 9", s: "Universal", c: "V", t: "1 acción estándar", r: "Ver texto", dur: "Ver texto", sv: "Ver texto", sr: "Sí", d: "El hechizo más poderoso, puede duplicar casi cualquier otro hechizo o lograr efectos únicos." },
    { n: "Parar el Tiempo", l: "Sor/Wiz 9", s: "Transmutación", c: "V", t: "1 acción estándar", r: "Personal", dur: "1d4+1 rondas (aparente)", sv: "Ninguna", sr: "No", d: "El tiempo se detiene para todos excepto para ti." },
    { n: "Portal", l: "Sor/Wiz 9", s: "Conjuración (Creación o Llamada)", c: "V, S, M", t: "1 acción estándar", r: "Medio", dur: "Instantánea o concentración (hasta 1 ronda/nivel)", sv: "Ninguna", sr: "No", d: "Conectas dos planos con una puerta bidireccional o llamas a una criatura." }
];
