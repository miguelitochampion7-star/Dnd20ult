const ARCHETYPES = {
    'Barbaro': {
        role: 'combat',
        priorities: ['str', 'con', 'dex', 'wis', 'int', 'cha'],
        gear: {
            1: ['Gran Hacha', 'Cota de Mallas', 'Poción de Curación'],
            5: ['Gran Hacha +1', 'Coraza +1', 'Capa de Resistencia +1'],
            10: ['Gran Hacha +2', 'Coraza +2', 'Cinturón de Fuerza +2'],
            15: ['Gran Hacha +3 (Fuego)', 'Coraza +4', 'Cinturón de Fuerza +4', 'Botas de Velocidad'],
            20: ['Gran Hacha +5 Vorpal', 'Coraza +5', 'Cinturón de Fuerza +6', 'Manual de Constitución +2']
        },
        feats: ['Ataque Poderoso', 'Hendaura', 'Furia Extra', 'Crítico Mejorado']
    },
    'Bardo': {
        role: 'support',
        priorities: ['cha', 'dex', 'int', 'con', 'wis', 'str'],
        gear: {
            1: ['Espada Larga', 'Armadura de Cuero', 'Laúd', 'Poción de Curación'],
            5: ['Espada Larga +1', 'Cota de Mallas Mitral', 'Capa de Carisma +2'],
            10: ['Espada Larga +2', 'Cota de Mallas Mitral +2', 'Capa de Carisma +4'],
            15: ['Estoque +3', 'Cota de Mallas Mitral +4', 'Capa de Carisma +6'],
            20: ['Estoque +5', 'Armadura Celestial', 'Tomo de Liderazgo +2']
        },
        spells: {
            0: ['Detectar Magia', 'Luz', 'Prestidigitación'],
            1: ['Curar Heridas Leves', 'Grasa', 'Identificar'],
            2: ['Invisibilidad', 'Polvo de Purpurina', 'Imagen Menor'],
            3: ['Disipar Magia', 'Prisa', 'Lentiitud'],
            4: ['Puerta Dimensional', 'Dominar Persona', 'Invisibilidad Mayor'],
            5: ['Curar Heridas Leves de Masas', 'Espejismo Arcano'],
            6: ['Baile Irresistible de Otto', 'Proyectar Imagen']
        }
    },
    'Clerigo': {
        role: 'divine',
        priorities: ['wis', 'con', 'str', 'cha', 'int', 'dex'],
        gear: {
            1: ['Maza Pesada', 'Escudo Grande de Acero', 'Armadura de Bandas'],
            5: ['Maza +1', 'Escudo +1', 'Armadura Completa'],
            10: ['Maza +2', 'Escudo +2', 'Armadura Completa +2', 'Periplo de Sabiduría +2'],
            15: ['Maza +3', 'Escudo +4', 'Armadura Completa +4', 'Periplo de Sabiduría +4'],
            20: ['Maza +5 Sagrada', 'Escudo Animado +5', 'Armadura Completa +5', 'Periplo de Sabiduría +6']
        },
        spells: {
            0: ['Detectar Magia', 'Luz', 'Leer Magia'],
            1: ['Bendición', 'Escudo de la Fe', 'Curar Heridas Leves'],
            2: ['Arma Espiritual', 'Restauración Menor', 'Fuerza de Toro'],
            3: ['Disipar Magia', 'Plegaria', 'Luz Abrasadora'],
            4: ['Poder Divino', 'Libertad de Movimiento', 'Curar Heridas Críticas'],
            5: ['Descarga Flamígera', 'Resistencia a Conjuros', 'Revivir a los Muertos'],
            6: ['Curar Heridas Moderadas de Masas', 'Disipar Magia Mayor'],
            7: ['Destrucción', 'Resurrección'],
            8: ['Campo Antimagia', 'Curar Heridas Críticas de Masas'],
            9: ['Sanar de Masas', 'Implosión', 'Milagro']
        }
    },
    'Druida': {
        role: 'divine',
        priorities: ['wis', 'con', 'dex', 'int', 'str', 'cha'],
        gear: {
            1: ['Cimitarra', 'Escudo de Madera', 'Armadura de Pieles'],
            5: ['Cimitarra +1', 'Escudo de Madera +1', 'Armadura de Pieles +1'],
            10: ['Cimitarra +2', 'Escudo Oscuro +2', 'Armadura de Pieles +3', 'Periplo de Sabiduría +2'],
            15: ['Cimitarra +3', 'Escudo Oscuro +4', 'Armadura de Dragón', 'Periplo de Sabiduría +6'],
            20: ['Cimitarra +5', 'Escudo +5', 'Armadura Salvaje', 'Bastón de los Bosques']
        },
        spells: {
            0: ['Detectar Magia', 'Luz', 'Purificar Comida'],
            1: ['Enredar', 'Fuego Feérico', 'Curar Heridas Leves'],
            2: ['Piel de Roble', 'Flamígera', 'Resistir Energía'],
            3: ['Llamar al Relámpago', 'Crecimiento Vegetal', 'Protección contra Energía'],
            4: ['Golpe Flamígero', 'Piel de Piedra', 'Libertad de Movimiento'],
            5: ['Muro de Espinas', 'Comulgar con la Naturaleza'],
            6: ['Semillas de Fuego', 'Disipar Magia Mayor'],
            7: ['Sanar', 'Tormenta de Fuego'],
            8: ['Dedo de la Muerte', 'Explosión Solar'],
            9: ['Cambio de Forma', 'Tormenta de Venganza']
        }
    },
    'Guerrero': {
        role: 'combat',
        priorities: ['str', 'con', 'dex', 'wis', 'int', 'cha'],
        gear: {
            1: ['Espada Larga', 'Escudo', 'Cota de Mallas'],
            5: ['Espada Larga +1', 'Escudo +1', 'Armadura Completa'],
            10: ['Espada Larga +2', 'Escudo +2', 'Armadura Completa +2', 'Guanteletes de Ogro +2'],
            15: ['Espada Bastarda +3', 'Escudo +4', 'Armadura Completa +4', 'Cinturón de Fuerza +6'],
            20: ['Espada Vorpal +5', 'Escudo +5', 'Armadura Completa de Adamantita +5']
        },
        feats: ['Soltura con un Arma', 'Especialización en Arma', 'Ataque Poderoso', 'Crítico Mejorado']
    },
    'Monje': {
        role: 'combat',
        priorities: ['wis', 'dex', 'str', 'con', 'int', 'cha'],
        gear: {
            1: ['Kama', 'Baston', 'Poción de Curación'],
            5: ['Kama +1', 'Bracales de Armadura +1', 'Capa de Resistencia +1'],
            10: ['Kama +2', 'Bracales de Armadura +3', 'Amuleto de Puños Poderosos +1', 'Cinturon de Monje'],
            15: ['Kama +3', 'Bracales de Armadura +5', 'Amuleto de Sabiduría +4'],
            20: ['Kama +5', 'Bracales de Armadura +8', 'Manual de Sabiduría +2', 'Túnica de los Archimagos (Si, Monjes magicos)']
        }
    },
    'Paladin': {
        role: 'combat',
        priorities: ['str', 'cha', 'wis', 'con', 'int', 'dex'],
        gear: {
            1: ['Espada Larga', 'Escudo Pesado', 'Armadura de Bandas'],
            5: ['Espada Larga +1', 'Escudo +1', 'Armadura Completa'],
            10: ['Espada Larga +2', 'Escudo +2', 'Armadura Completa +2', 'Capa de Carisma +2'],
            15: ['Vengadora Sagrada +4', 'Escudo +3', 'Armadura Completa +4'],
            20: ['Vengadora Sagrada +5', 'Escudo +5', 'Armadura Completa +5', 'Cinturón de Fuerza +6']
        },
        spells: {
            1: ['Bendecir Arma', 'Curar Heridas Leves'],
            2: ['Fuerza de Toro', 'Escudo de Otro'],
            3: ['Curar Heridas Moderadas', 'Disipar Magia'],
            4: ['Romper Encantamiento', 'Espada Sagrada']
        }
    },
    'Explorador': {
        role: 'combat',
        priorities: ['dex', 'str', 'wis', 'con', 'int', 'cha'],
        gear: {
            1: ['Arco Largo Compuesto', 'Espada Corta', 'Armadura de Cuero Tachonado'],
            5: ['Arco Largo +1', 'Armadura de Cuero Tachonado +1', 'Capa de Elvenkind'],
            10: ['Arco Largo +2', 'Armadura de Cuero +3', 'Guantes de Destreza +2'],
            15: ['Arco del Juramento +3', 'Armadura de Cuero +4', 'Guantes de Destreza +4'],
            20: ['Arco Largo +5 Velocidad', 'Armadura de Piel de Dragón', 'Guantes de Destreza +6']
        },
        spells: {
            1: ['Pasar sin Rastro', 'Hablar con los Animales'],
            2: ['Piel de Roble', 'Protección contra Energía'],
            3: ['Curar Heridas Moderadas', 'Neutralizar Veneno'],
            4: ['Libertad de Movimiento', 'Comulgar con la Naturaleza']
        }
    },
    'Picaro': {
        role: 'skill',
        priorities: ['dex', 'int', 'cha', 'con', 'wis', 'str'],
        gear: {
            1: ['Espada Corta', 'Arco Corto', 'Armadura de Cuero', 'Kit de Ladrón'],
            5: ['Espada Corta +1', 'Armadura de Cuero +1', 'Botas de Elvenkind'],
            10: ['Espada Corta +2', 'Armadura de Cuero +3', 'Guantes de Destreza +2', 'Anillo de Invisibilidad'],
            15: ['Estoque +3', 'Armadura de Cuero +4', 'Guantes de Destreza +4', 'Ojos de Águila'],
            20: ['Estoque +5', 'Armadura de Sombras +5', 'Guantes de Destreza +6', 'Manual de Destreza +2']
        }
    },
    'Hechicero': {
        role: 'magic',
        priorities: ['cha', 'dex', 'con', 'int', 'wis', 'str'],
        gear: {
            1: ['Ballesta Ligera', 'Daga', 'Componentes de Conjuros'],
            5: ['Capa de Carisma +2', 'Anillo de Protección +1'],
            10: ['Capa de Carisma +4', 'Bastón de Fuego', 'Brazales de Armadura +2'],
            15: ['Capa de Carisma +6', 'Vara de Metamagia (Potenciar)', 'Brazales de Armadura +4'],
            20: ['Capa de Carisma +6', 'Túnica de Archimago', 'Bastón del Poder']
        },
        spells: {
            0: ['Detectar Magia', 'Luz', 'Rayo de Escarcha', 'Sonido Fantasma'],
            1: ['Misil Mágico', 'Armadura de Mago', 'Escudo', 'Manos Ardientes'],
            2: ['Flecha Ácida de Melf', 'Imagen del Espejo', 'Invisibilidad'],
            3: ['Bola de Fuego', 'Volar', 'Rayo Relampagueante'],
            4: ['Muro de Fuego', 'Piel de Piedra', 'Tormenta de Hielo'],
            5: ['Cono de Frío', 'Teleportar', 'Muro de Fuerza'],
            6: ['Desintegrar', 'Relámpago en Cadena'],
            7: ['Retrasar Bola de Fuego', 'Dedo de la Muerte'],
            8: ['Horrible Marchitamiento', 'Laberinto'],
            9: ['Lluvia de Meteoritos', 'Deseo', 'Parar el Tiempo']
        }
    },
    'Mago': {
        role: 'magic',
        priorities: ['int', 'dex', 'con', 'wis', 'cha', 'str'],
        gear: {
            1: ['Bastón', 'Libro de Conjuros', 'Componentes'],
            5: ['Diadema de Intelecto +2', 'Anillo de Protección +1'],
            10: ['Diadema de Intelecto +4', 'Varita de Bola de Fuego', 'Brazales de Armadura +3'],
            15: ['Diadema de Intelecto +6', 'Vara de Metamagia (Maximizar)', 'Brazales de Armadura +5'],
            20: ['Diadema de Intelecto +6', 'Túnica de Archimago', 'Bastón del Magi']
        },
        spells: {
            0: ['Detectar Magia', 'Luz', 'Leer Magia', 'Mano de Mago'],
            1: ['Misil Mágico', 'Armadura de Mago', 'Identificar', 'Dormir'],
            2: ['Telaraña', 'Invisibilidad', 'Resistencia de Oso'],
            3: ['Bola de Fuego', 'Disipar Magia', 'Volar'],
            4: ['Puerta Dimensional', 'Ojo Arcano', 'Invisibilidad Mayor'],
            5: ['Nube Aniquiladora', 'Dominar Persona', 'Teleportar'],
            6: ['Desintegrar', 'Globo de Invulnerabilidad'],
            7: ['Jaula de Fuerza', 'Invertir Gravedad'],
            8: ['Mente en Blanco', 'Laberinto'],
            9: ['Parar el Tiempo', 'Deseo', 'Portal']
        }
    }
};
