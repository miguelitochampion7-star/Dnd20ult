/**
 * Parses spell level strings from the legacy database.
 * Example Input: "Sor/Wiz 2, Clr 3"
 * Example Output: { "Sor/Wiz": 2, "Clr": 3 }
 */
export function parseSpellLevels(levelString) {
    if (!levelString || typeof levelString !== 'string') return {};

    const levels = {};
    const parts = levelString.split(', ');

    parts.forEach(part => {
        // Match "Class Name Level" (e.g., "Sor/Wiz 2" or "Brd 1")
        // Regex looks for: (Anything but numbers) (Number at end)
        const match = part.trim().match(/^(.+)\s+(\d+)$/);
        if (match) {
            const className = match[1].trim();
            const level = parseInt(match[2]);
            levels[className] = level;
        }
    });

    return levels;
}

/**
 * Returns the effective class key for a given User Class.
 * Maps "Mago" -> "Sor/Wiz", "Hechicero" -> "Sor/Wiz", "Clerigo" -> "Clr", etc.
 */
export function getDbClassKey(userClass) {
    const map = {
        'Mago': 'Sor/Wiz',
        'Hechicero': 'Sor/Wiz',
        'Bardo': 'Brd',
        'Clérigo': 'Clr', // Handle accents if present in config, though internal ID usually Clérigo
        'Clerigo': 'Clr',
        'Druida': 'Drd',
        'Paladin': 'Pal',
        'Paladín': 'Pal',
        'Explorador': 'Rgr'
    };
    return map[userClass] || null;
}

/**
 * Determines the accent color capability for a class.
 */
export function getClassColor(userClass) {
    // Aesthetics
    const colors = {
        'Druida': 'text-green-400',
        'Explorador': 'text-green-500',
        'Clerigo': 'text-yellow-200',
        'Paladin': 'text-yellow-400',
        'Mago': 'text-blue-400',
        'Hechicero': 'text-purple-400',
        'Bardo': 'text-pink-400'
    };
    return colors[userClass] || 'text-[#c5a059]'; // Default Gold
}

export function getClassBg(userClass) {
    const bgs = {
        'Druida': 'bg-green-900/20',
        'Explorador': 'bg-green-900/20',
        'Clerigo': 'bg-yellow-900/20',
        'Paladin': 'bg-yellow-600/20',
        'Mago': 'bg-blue-900/20',
        'Hechicero': 'bg-purple-900/20',
        'Bardo': 'bg-pink-900/20'
    };
    return bgs[userClass] || 'bg-[#c5a059]/10';
}
