/**
 * Spell Info Card System v3.0 (Mobile Scroll Fix)
 * Uses Body Scroll Lock pattern + Clean DOM Structure
 */

import { SPELL_DB } from '../../../02_DATOS/data/spells.js';
import { showToast } from '../../modals.js';
import { formatSpellDescription, DESCRIPTION_STYLES } from './description_parser.js';

// --- STYLES CONFIG ---
const SCHOOL_COLORS = {
    'Abjuration': { bg: 'bg-blue-900/30', border: 'border-blue-500', text: 'text-blue-400', icon: '🛡️' },
    'Abjuración': { bg: 'bg-blue-900/30', border: 'border-blue-500', text: 'text-blue-400', icon: '🛡️' },
    'Conjuration': { bg: 'bg-green-900/30', border: 'border-green-500', text: 'text-green-400', icon: '✨' },
    'Conjuración': { bg: 'bg-green-900/30', border: 'border-green-500', text: 'text-green-400', icon: '✨' },
    'Divination': { bg: 'bg-gray-800/50', border: 'border-gray-400', text: 'text-gray-300', icon: '👁️' },
    'Adivinación': { bg: 'bg-gray-800/50', border: 'border-gray-400', text: 'text-gray-300', icon: '👁️' },
    'Enchantment': { bg: 'bg-pink-900/30', border: 'border-pink-500', text: 'text-pink-400', icon: '💖' },
    'Encantamiento': { bg: 'bg-pink-900/30', border: 'border-pink-500', text: 'text-pink-400', icon: '💖' },
    'Evocation': { bg: 'bg-orange-900/30', border: 'border-orange-500', text: 'text-orange-400', icon: '🔥' },
    'Evocación': { bg: 'bg-orange-900/30', border: 'border-orange-500', text: 'text-orange-400', icon: '🔥' },
    'Illusion': { bg: 'bg-purple-900/30', border: 'border-purple-500', text: 'text-purple-400', icon: '🎭' },
    'Ilusión': { bg: 'bg-purple-900/30', border: 'border-purple-500', text: 'text-purple-400', icon: '🎭' },
    'Necromancy': { bg: 'bg-gray-900/50', border: 'border-gray-600', text: 'text-gray-400', icon: '💀' },
    'Nigromancia': { bg: 'bg-gray-900/50', border: 'border-gray-600', text: 'text-gray-400', icon: '💀' },
    'Transmutation': { bg: 'bg-yellow-900/30', border: 'border-yellow-500', text: 'text-yellow-400', icon: '⚗️' },
    'Transmutación': { bg: 'bg-yellow-900/30', border: 'border-yellow-500', text: 'text-yellow-400', icon: '⚗️' },
    'Universal': { bg: 'bg-[#c5a059]/20', border: 'border-[#c5a059]', text: 'text-[#c5a059]', icon: '✦' }
};

const DEFAULT_SCHOOL = { bg: 'bg-[#c5a059]/20', border: 'border-[#c5a059]', text: 'text-[#c5a059]', icon: '📜' };

function getSchoolStyle(schoolStr) {
    if (!schoolStr) return DEFAULT_SCHOOL;
    const baseSchool = schoolStr.split('[')[0].trim();
    return SCHOOL_COLORS[baseSchool] || DEFAULT_SCHOOL;
}

function formatField(value, fallback = '—') {
    if (!value || value.trim() === '') return `<span class="text-gray-600 italic">${fallback}</span>`;
    return value;
}

// --- DOM CREATION ---

export function showSpellInfoCard(spellName) {
    const spell = SPELL_DB.find(s => s.n === spellName);
    if (!spell) {
        showToast(`Hechizo no encontrado: ${spellName}`, 'error');
        return;
    }

    closeModal(); // Ensure any previous modal is closed

    const style = getSchoolStyle(spell.s);
    const subSchool = spell.s && spell.s.includes('[') ? spell.s.match(/\[(.+?)\]/)?.[1] : null;

    // 1. Lock Body Scroll
    document.body.style.overflow = 'hidden';

    // 2. Create Modal Overlay
    const overlay = document.createElement('div');
    overlay.id = 'spell-modal-overlay';
    // Use fixed inset-0 with high z-index
    overlay.className = 'fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex justify-center items-center p-4 animate-fadeIn';

    // 3. Create Card Container
    const card = document.createElement('div');
    // Important: flex flex-col max-h-[90vh] ensures card takes up to 90% height but manages its own scroll
    card.className = `w-full max-w-lg max-h-[90vh] flex flex-col ${style.bg} border-2 ${style.border} rounded-xl shadow-2xl overflow-hidden relative`;

    // Stop propagation so clicking card doesn't close it
    card.onclick = (e) => e.stopPropagation();

    // 4. Build Content
    card.innerHTML = `
        <!-- HEADER (Fixed) -->
        <div class="p-4 border-b ${style.border} bg-black/60 backdrop-blur flex justify-between items-start shrink-0">
            <div>
                <div class="flex items-center gap-2">
                    <span class="text-2xl">${style.icon}</span>
                    <h2 class="text-xl font-bold ${style.text} font-['Cinzel'] leading-none">${spell.n}</h2>
                </div>
                <div class="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                    ${spell.s || 'Escuela Desconocida'}
                    ${subSchool ? `<span class="text-gray-500">• ${subSchool}</span>` : ''}
                </div>
            </div>
            
            <!-- Close Button -->
            <button id="spell-modal-close" class="bg-gray-800/50 hover:bg-red-900/50 text-gray-400 hover:text-white rounded-full p-2 transition-colors ml-2">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>

        <!-- SCROLLABLE CONTENT (Flex Grow) -->
        <div id="spell-modal-scroll" class="overflow-y-auto custom-scroll flex-grow relative bg-black/20">
            
            <!-- Quick Stats Sticky Header -->
            <div class="sticky top-0 z-10 grid grid-cols-4 gap-px bg-black/40 border-b border-white/5 backdrop-blur-md">
                <div class="p-2 text-center bg-black/40">
                    <div class="text-[8px] uppercase text-gray-500">Nivel</div>
                    <div class="text-xs text-white font-bold">${formatField(spell.l)}</div>
                </div>
                <div class="p-2 text-center bg-black/40">
                    <div class="text-[8px] uppercase text-gray-500">Tiempo</div>
                    <div class="text-xs text-white font-bold">${formatField(spell.t)}</div>
                </div>
                <div class="p-2 text-center bg-black/40">
                    <div class="text-[8px] uppercase text-gray-500">Alcance</div>
                    <div class="text-xs text-white font-bold">${formatField(spell.r)}</div>
                </div>
                <div class="p-2 text-center bg-black/40">
                    <div class="text-[8px] uppercase text-gray-500">Duración</div>
                    <div class="text-xs text-white font-bold">${formatField(spell.dur)}</div>
                </div>
            </div>

            <!-- Detailed Content -->
            <div class="p-4 space-y-4">
                
                <!-- Description -->
                <div class="spell-desc-container text-sm leading-6 text-gray-300 font-serif">
                    ${formatSpellDescription(spell.d)}
                </div>

                <!-- Footer Stats -->
                <div class="grid grid-cols-2 gap-2 text-xs pt-4 border-t border-white/10 mt-4">
                     <div class="bg-black/30 p-2 rounded border border-white/5">
                        <span class="text-gray-500 uppercase text-[9px] block">Componentes</span>
                        <span class="text-orange-300 font-mono">${formatField(spell.c)}</span>
                     </div>
                     <div class="bg-black/30 p-2 rounded border border-white/5">
                        <span class="text-gray-500 uppercase text-[9px] block">Resistencia</span>
                         <div class="flex justify-between items-center">
                            <span class="text-gray-300">Salv: <span class="text-white">${formatField(spell.sv, '—')}</span></span>
                            <span class="text-gray-300">RC: <span class="text-white">${formatField(spell.sr, 'No')}</span></span>
                         </div>
                     </div>
                </div>
            </div>
            
            <!-- Spacer for bottom scroll -->
            <div class="h-8"></div>
        </div>
    `;

    // 5. Append and Listeners
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    // Initial Lucide Icons
    if (window.lucide) window.lucide.createIcons();

    // Event Listeners
    const closeBtn = card.querySelector('#spell-modal-close');
    closeBtn.onclick = closeModal;

    overlay.onclick = closeModal;

    // Mobile Touch Handling for Scroll Lock
    // We allow touchmove ONLY on the scrollable area
    const scrollArea = card.querySelector('#spell-modal-scroll');

    // Prevent background scroll events
    overlay.addEventListener('touchmove', (e) => {
        if (!scrollArea.contains(e.target)) {
            e.preventDefault();
        }
    }, { passive: false });

    // ESC Key
    const escHandler = (e) => {
        if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', escHandler);
    window._spellModalEsc = escHandler;
}

// Global exposure for onClick
window.closeSpellInfoCard = closeModal;

function closeModal() {
    const overlay = document.getElementById('spell-modal-overlay');
    if (!overlay) return;

    // Unlock Body Scroll
    document.body.style.overflow = '';

    // Cleanup Listeners
    if (window._spellModalEsc) {
        document.removeEventListener('keydown', window._spellModalEsc);
        window._spellModalEsc = null;
    }

    // Fade Out
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.2s ease-out';

    setTimeout(() => {
        overlay.remove();
    }, 200);
}

// Add CSS for fade in
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
    .animate-fadeIn {
        animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    ${DESCRIPTION_STYLES}
`;
document.head.appendChild(style);
