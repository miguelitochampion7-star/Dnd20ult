// API Client para comunicación con el backend
export class APIClient {
    constructor() {
        this.baseURL = '/api';
    }

    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, error: error.message };
        }
    }

    // Obtener lista de fichas
    async getFichas() {
        return this.request('/fichas');
    }

    // Obtener una ficha específica
    async getFicha(id) {
        return this.request(`/fichas/${id}`);
    }

    // Crear nueva ficha
    async createFicha(data) {
        return this.request('/fichas', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Actualizar ficha
    async updateFicha(id, data) {
        return this.request(`/fichas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // Eliminar ficha
    async deleteFicha(id) {
        return this.request(`/fichas/${id}`, {
            method: 'DELETE'
        });
    }

    // Obtener usuario actual
    async getCurrentUser() {
        return this.request('/user');
    }
}

// Auto-guardado inteligente
export class AutoSaver {
    constructor(saveFunction, interval = 10000) {
        this.saveFunction = saveFunction;
        this.interval = interval;
        this.timeoutId = null;
        this.isSaving = false;
        this.hasChanges = false;
    }

    // Marcar que hay cambios pendientes
    markDirty() {
        this.hasChanges = true;
        this.scheduleSave();
    }

    // Programar guardado
    scheduleSave() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }

        this.timeoutId = setTimeout(() => {
            this.save();
        }, this.interval);
    }

    // Guardar ahora
    async save() {
        if (!this.hasChanges || this.isSaving) return;

        this.isSaving = true;
        this.showStatus('saving');

        try {
            await this.saveFunction();
            this.hasChanges = false;
            this.showStatus('saved');
        } catch (error) {
            console.error('Error al guardar:', error);
            this.showStatus('error');
            // Reintentar en 5 segundos
            setTimeout(() => this.save(), 5000);
        } finally {
            this.isSaving = false;
        }
    }

    // Mostrar estado de guardado
    showStatus(status) {
        const indicator = document.getElementById('save-indicator');
        if (!indicator) return;

        const messages = {
            saving: { text: '💾 Guardando...', class: 'text-yellow-400' },
            saved: { text: '✅ Guardado', class: 'text-green-400' },
            error: { text: '⚠️ Error al guardar', class: 'text-red-400' }
        };

        const msg = messages[status];
        indicator.textContent = msg.text;
        indicator.className = `text-sm ${msg.class}`;

        // Ocultar mensaje de "guardado" después de 3 segundos
        if (status === 'saved') {
            setTimeout(() => {
                indicator.textContent = '';
            }, 3000);
        }
    }

    // Forzar guardado inmediato
    forceSave() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        return this.save();
    }
}
