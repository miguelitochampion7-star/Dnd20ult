/**
 * Spell Description Parser
 * Formats raw spell descriptions with visual enhancements:
 * - Headers for keywords (Efecto:, Blanco:, etc.)
 * - Highlighted dice rolls (1d6, 2d4+2)
 * - Bonus/penalty styling (+4, -2)
 * - Paragraph separation
 */

// Keywords to detect and convert to styled headers
const KEYWORDS = [
    { pattern: /^Efecto:/gm, icon: '⚡', label: 'Efecto' },
    { pattern: /^Blanco:/gm, icon: '🎯', label: 'Blanco' },
    { pattern: /^Área:/gm, icon: '📍', label: 'Área' },
    { pattern: /^Objetivos?:/gm, icon: '🎯', label: 'Objetivo' },
    { pattern: /^Componente de material( arcano)?:/gmi, icon: '🧪', label: 'Material' },
    { pattern: /^Centro de atención:/gmi, icon: '🔮', label: 'Foco' },
    { pattern: /^Enfoque Arcano:/gmi, icon: '🔮', label: 'Foco' },
    { pattern: /^Fundición Hora:/gmi, icon: '⏱️', label: 'Tiempo' },
    { pattern: /^Ahorro Tirar:/gmi, icon: '🛡️', label: 'Salvación' },
    { pattern: /^Ortografía Resistencia:/gmi, icon: '✨', label: 'SR' },
];

/**
 * Escapes HTML special characters to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Main formatting function
 * @param {string} rawText - The raw spell description
 * @returns {string} HTML formatted description
 */
export function formatSpellDescription(rawText) {
    if (!rawText || rawText.trim() === '') {
        return '<span class="text-gray-600 italic">Sin descripción disponible.</span>';
    }

    // 1. Escape HTML first
    let text = escapeHtml(rawText);

    // 2. Convert keywords to styled headers
    KEYWORDS.forEach(kw => {
        text = text.replace(kw.pattern, `</p><p class="spell-section"><span class="spell-header">${kw.icon} ${kw.label}:</span> `);
    });

    // 3. Highlight dice rolls (1d6, 2d8+4, 1d4-1, etc.)
    text = text.replace(
        /(\d+d\d+)(\s*[+\-]\s*\d+)?/g,
        '<span class="spell-dice">$1$2</span>'
    );

    // 4. Highlight bonuses and penalties  
    // Positive: +1, +2 a, +4 en
    text = text.replace(
        /(\+\d+)(\s+(?:a|en|de|al?)\s)/gi,
        '<span class="spell-bonus">$1</span>$2'
    );

    // Negative: -2 a, –4 en (both regular hyphen and en-dash)
    text = text.replace(
        /([–\-]\d+)(\s+(?:a|en|de|al?)\s)/gi,
        '<span class="spell-penalty">$1</span>$2'
    );

    // 5. Split by newlines and wrap in paragraphs
    const paragraphs = text.split(/\n+/).filter(p => p.trim());
    text = paragraphs.map(p => {
        // Don't double-wrap if already starts with <p
        if (p.trim().startsWith('</p><p') || p.trim().startsWith('<p')) {
            return p;
        }
        return `<p>${p}</p>`;
    }).join('');

    // Clean up empty paragraphs and fix double wrapping
    text = text.replace(/<p>\s*<\/p>/g, '');
    text = text.replace(/<\/p><p class="spell-section">/g, '<p class="spell-section">');

    return text;
}

/**
 * CSS styles for the formatted descriptions
 * Inject these into the spell card modal
 */
export const DESCRIPTION_STYLES = `
    .spell-desc-container {
        font-size: 0.875rem;
        line-height: 1.7;
        color: #d1d5db;
    }
    .spell-desc-container p {
        margin-bottom: 0.75rem;
    }
    .spell-desc-container p:last-child {
        margin-bottom: 0;
    }
    .spell-section {
        border-left: 2px solid #c5a059;
        padding-left: 0.75rem;
        margin-top: 0.5rem;
        background: rgba(0,0,0,0.2);
        padding: 0.5rem 0.75rem;
        border-radius: 0 4px 4px 0;
    }
    .spell-header {
        color: #c5a059;
        font-weight: 600;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    .spell-dice {
        background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
        color: white;
        padding: 0.1rem 0.35rem;
        border-radius: 4px;
        font-weight: 600;
        font-family: 'Fira Code', 'Consolas', monospace;
        font-size: 0.8em;
        box-shadow: 0 1px 2px rgba(0,0,0,0.3);
    }
    .spell-bonus {
        color: #22c55e;
        font-weight: 700;
    }
    .spell-penalty {
        color: #ef4444;
        font-weight: 700;
    }
`;
