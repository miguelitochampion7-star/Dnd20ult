/* --- CUSTOM MODAL SYSTEM --- */
// Replacement for native alert/confirm

function createModalHTML() {
    if (document.getElementById('custom-modal-overlay')) return;

    const html = `
    <div id="custom-modal-overlay" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] hidden flex items-center justify-center opacity-0 transition-opacity duration-300">
        <div id="custom-modal-box" class="card p-6 rounded-lg max-w-sm w-full mx-4 transform scale-95 transition-transform duration-300 border border-[#c5a059] shadow-[0_0_30px_rgba(197,160,89,0.2)]">
            <h3 id="custom-modal-title" class="title-font text-xl text-[#c5a059] mb-4 border-b border-[#333] pb-2">Atención</h3>
            <p id="custom-modal-message" class="text-gray-300 mb-6 font-primary text-sm leading-relaxed"></p>
            
            <div id="custom-modal-buttons" class="flex justify-end gap-3">
                <!-- Buttons injected dynamically -->
            </div>
        </div>
    </div>
    <div id="toast-container" class="fixed top-4 right-4 z-[9999] flex flex-col pointer-events-none"></div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
}

// Ensure HTML exists on load
// Ensure HTML exists on load
document.addEventListener('DOMContentLoaded', createModalHTML);

export function showCustomConfirm(message, title = "Confirmación") {
    return new Promise((resolve) => {
        createModalHTML();
        const overlay = document.getElementById('custom-modal-overlay');
        const box = document.getElementById('custom-modal-box');
        const titleEl = document.getElementById('custom-modal-title');
        const msgEl = document.getElementById('custom-modal-message');
        const btnContainer = document.getElementById('custom-modal-buttons');

        titleEl.textContent = title;
        msgEl.textContent = message;

        // Reset buttons
        btnContainer.innerHTML = '';

        // Cancel Button
        const btnCancel = document.createElement('button');
        btnCancel.className = 'px-4 py-2 rounded border border-gray-600 text-gray-400 hover:text-white hover:border-white transition-colors text-xs font-bold uppercase tracking-wider';
        btnCancel.textContent = 'Cancelar';
        btnCancel.onclick = () => closeModal(false);

        // Confirm Button
        const btnConfirm = document.createElement('button');
        btnConfirm.className = 'btn-gold px-6 py-2 rounded text-black font-bold hover:shadow-[0_0_15px_rgba(197,160,89,0.5)] transition-shadow text-xs uppercase tracking-wider';
        btnConfirm.textContent = 'Aceptar';
        btnConfirm.onclick = () => closeModal(true);

        btnContainer.appendChild(btnCancel);
        btnContainer.appendChild(btnConfirm);

        // Show
        overlay.classList.remove('hidden');
        // Small delay for transition
        requestAnimationFrame(() => {
            overlay.classList.remove('opacity-0');
            box.classList.remove('scale-95');
            box.classList.add('scale-100');
        });

        function closeModal(result) {
            overlay.classList.add('opacity-0');
            box.classList.add('scale-95');
            box.classList.remove('scale-100');

            setTimeout(() => {
                overlay.classList.add('hidden');
                resolve(result);
            }, 300);
        }
    });
}

export function showCustomAlert(message, title = "Información") {
    return new Promise((resolve) => {
        createModalHTML();
        const overlay = document.getElementById('custom-modal-overlay');
        const box = document.getElementById('custom-modal-box');
        const titleEl = document.getElementById('custom-modal-title');
        const msgEl = document.getElementById('custom-modal-message');
        const btnContainer = document.getElementById('custom-modal-buttons');

        titleEl.textContent = title;
        msgEl.textContent = message;

        // Reset buttons
        btnContainer.innerHTML = '';

        // OK Button
        const btnOk = document.createElement('button');
        btnOk.className = 'btn-gold px-6 py-2 rounded text-black font-bold hover:shadow-[0_0_15px_rgba(197,160,89,0.5)] transition-shadow text-xs uppercase tracking-wider';
        btnOk.textContent = 'Entendido';
        btnOk.onclick = () => closeModal();

        btnContainer.appendChild(btnOk);

        // Show
        overlay.classList.remove('hidden');
        requestAnimationFrame(() => {
            overlay.classList.remove('opacity-0');
            box.classList.remove('scale-95');
            box.classList.add('scale-100');
        });

        function closeModal() {
            overlay.classList.add('opacity-0');
            box.classList.add('scale-95');
            box.classList.remove('scale-100');

            setTimeout(() => {
                overlay.classList.add('hidden');
                resolve();
            }, 300);
        }
    });
}

export function showToast(message, type = 'success') {
    createModalHTML();
    const container = document.getElementById('toast-container');

    if (!container) return; // Safety check

    // Create Toast Element
    const toast = document.createElement('div');
    const borderColor = type === 'error' ? 'border-red-600' : 'border-[#c5a059]';
    const textColor = type === 'error' ? 'text-red-400' : 'text-[#c5a059]';
    const icon = type === 'error' ? '❌' : '✅';

    toast.className = `transform transition-all duration-300 translate-x-full bg-[#120c0a] border-l-4 ${borderColor} p-4 rounded shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex items-center gap-3 w-72 pointer-events-auto border-t border-b border-r border-[#333] mb-2`;
    toast.innerHTML = `
        <span class="text-xl">${icon}</span>
        <div class="flex-1">
            <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-0.5">${type === 'error' ? 'Error' : 'Éxito'}</p>
            <p class="${textColor} text-sm font-secondary font-bold">${message}</p>
        </div>
    `;

    container.appendChild(toast);

    // Animate In
    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full');
    });

    // Auto Dismiss
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-x-full');
        setTimeout(() => {
            if (toast.parentElement) toast.parentElement.removeChild(toast);
        }, 300);
    }, 4000);
}

// --- Global Exposure for Legacy Scripts (Dashboard, Index Inline) ---
window.showCustomConfirm = showCustomConfirm;
window.showCustomAlert = showCustomAlert;
window.showToast = showToast;

