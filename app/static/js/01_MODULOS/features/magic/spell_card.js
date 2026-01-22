/**
 * Spell Info Card System v2.0
 * Beautiful, dedicated modal for displaying spell details
 */

import { SPELL_DB } from '../../../02_DATOS/data/spells.js';
import { showToast } from '../../modals.js';
import { formatSpellDescription, DESCRIPTION_STYLES } from './description_parser.js';

// School Color Mapping
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
    // School string can be "Evocation [Fire]" - extract base school
    const baseSchool = schoolStr.split('[')[0].trim();
    return SCHOOL_COLORS[baseSchool] || DEFAULT_SCHOOL;
}

function formatField(value, fallback = '—') {
    if (!value || value.trim() === '') return `<span class="text-gray-600 italic">${fallback}</span>`;
    return value;
}

/**
 * Renders and displays a beautiful spell info card.
 */
export function showSpellInfoCard(spellName) {
    const spell = SPELL_DB.find(s => s.n === spellName);
    if (!spell) {
        showToast(`Hechizo no encontrado: ${spellName}`, 'error');
        return;
    }

    // Remove existing modal
    closeSpellInfoCard();

    const style = getSchoolStyle(spell.s);
    const subSchool = spell.s && spell.s.includes('[') ? spell.s.match(/\[(.+?)\]/)?.[1] : null;

    const html = `
    <div id="spellInfoModal" class="fixed inset-0 bg-black/85 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn" onclick="window.closeSpellInfoCard()">
        <!-- Added flex-col to keep header/footer fixed -->
        <div class="w-full max-w-lg max-h-[85vh] flex flex-col ${style.bg} border-2 ${style.border} rounded-xl shadow-2xl overflow-hidden transform scale-100 transition-transform" onclick="event.stopPropagation()">
            
            <!-- Header (Fixed) -->
            <div class="p-4 border-b ${style.border} flex items-start justify-between flex-shrink-0 bg-black/40">
                <div>
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-2xl">${style.icon}</span>
                        <h2 class="text-xl font-bold ${style.text} font-['Cinzel']">${spell.n}</h2>
                    </div>
                    <p class="text-xs text-gray-400 uppercase tracking-widest">
                        ${spell.s || 'Escuela Desconocida'}
                        ${subSchool ? `<span class="text-gray-600">• ${subSchool}</span>` : ''}
                    </p>
                </div>
                <!-- Large Touch Target Close Button -->
                <button onclick="window.closeSpellInfoCard()" class="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>

            <!-- Scrollable Content Area -->
            <div class="overflow-y-auto custom-scroll flex-grow relative">
                
                <!-- Stats Grid -->
                <div class="grid grid-cols-2 gap-px bg-black/30 sticky top-0 z-10">
                    <div class="p-3 bg-black/80 flex items-center gap-2 backdrop-blur-md">
                        <span class="text-yellow-400">⭐</span>
                        <div>
                            <p class="text-[10px] text-gray-500 uppercase">Nivel</p>
                            <p class="text-sm text-gray-200">${formatField(spell.l)}</p>
                        </div>
                    </div>
                    <div class="p-3 bg-black/80 flex items-center gap-2 backdrop-blur-md">
                        <span class="text-green-400">⏱️</span>
                        <div>
                            <p class="text-[10px] text-gray-500 uppercase">Lanzamiento</p>
                            <p class="text-sm text-gray-200">${formatField(spell.t)}</p>
                        </div>
                    </div>
                    <div class="p-3 bg-black/80 flex items-center gap-2 backdrop-blur-md">
                        <span class="text-blue-400">🎯</span>
                        <div>
                            <p class="text-[10px] text-gray-500 uppercase">Alcance</p>
                            <p class="text-sm text-gray-200">${formatField(spell.r)}</p>
                        </div>
                    </div>
                    <div class="p-3 bg-black/80 flex items-center gap-2 backdrop-blur-md">
                        <span class="text-cyan-400">⌛</span>
                        <div>
                            <p class="text-[10px] text-gray-500 uppercase">Duración</p>
                            <p class="text-sm text-gray-200">${formatField(spell.dur)}</p>
                        </div>
                    </div>
                </div>

                <!-- Components -->
                <div class="p-3 border-t border-b border-black/30 bg-black/10 flex items-center gap-2">
                    <span class="text-orange-400">📜</span>
                    <p class="text-xs text-gray-300"><span class="text-gray-500">Componentes:</span> ${formatField(spell.c)}</p>
                </div>

                <!-- Description -->
                <div class="p-4 bg-black/20 pb-8">
                    <div class="spell-desc-container text-sm leading-relaxed text-gray-300">
                        ${formatSpellDescription(spell.d)}
                    </div>
                </div>
            </div>

            <!-- Combat Footer (Fixed) -->
            <div class="p-3 border-t border-black/30 bg-black/40 flex gap-4 text-xs flex-shrink-0 backdrop-blur-sm">
                <div class="flex items-center gap-1">
                    <span class="text-red-400">💪</span>
                    <span class="text-gray-400">Salvación:</span>
                    <span class="text-gray-200">${formatField(spell.sv, 'Ninguna')}</span>
                </div>
                <div class="flex items-center gap-1">
                    <span class="text-gray-400">🛡️</span>
                    <span class="text-gray-400">R. Conjuros:</span>
                    <span class="text-gray-200">${formatField(spell.sr, 'No')}</span>
                </div>
            </div>
        </div>
    </div>
    <style>
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        ${DESCRIPTION_STYLES}
    </style>`;

    document.body.insertAdjacentHTML('beforeend', html);

    // Add Escape key listener
    const escHandler = (e) => {
        if (e.key === 'Escape') closeSpellInfoCard();
    };
    document.addEventListener('keydown', escHandler);

    // Store handler to remove it later
    window._currentEscHandler = escHandler;
}

export function closeSpellInfoCard() {
    const modal = document.getElementById('spellInfoModal');
    if (modal) {
        modal.classList.add('opacity-0'); // Fade out effect
        setTimeout(() => modal.remove(), 200);
    }

    // Remove Escape listener
    if (window._currentEscHandler) {
        document.removeEventListener('keydown', window._currentEscHandler);
        window._currentEscHandler = null;
    }
}
