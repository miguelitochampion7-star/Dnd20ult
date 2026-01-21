# Sistema de Arquetipos Modular (v2.0)

Este documento explica la nueva arquitectura del Generador de Arquetipos, refactorizada para ser modular, mantenible y escalable.

## 📂 Estructura de Archivos

El sistema ya no depende de scripts gigantes cargados globalmente en el HTML. Ahora utiliza **Módulos ES6** nativos de JavaScript.

### 1. Lógica del Generador (`generator.js`)
*   **Ubicación:** `app/static/js/modules/features/archetypes/generator.js`
*   **Función:** Es el "cerebro".
    *   Importa los datos de arquetipos y hechizos.
    *   Gestiona el Modal de selección (UI).
    *   Ejecuta la lógica de creación de personaje (reseteo de estado, asignación de stats, equipo, hechizos).
    *   Actualiza la UI global (`updateAll`).

### 2. Datos de Arquetipos (`data.js`)
*   **Ubicación:** `app/static/js/modules/features/archetypes/data.js`
*   **Función:** Contiene **solo** las definiciones de las clases.
*   **Formato JSON:**
    ```javascript
    export const ARCHETYPES = {
        'NombreClase': {
            role: 'combat/magic/support',
            priorities: ['stat1', 'stat2', ...], // Orden de asignación de atributos
            gear: { 1: [...], 5: [...] },         // Equipo por nivel
            spells: { 1: ['Hechizo A'], ... }     // Hechizos conocidos (si aplica)
        },
        ...
    };
    ```

### 3. Base de Datos de Hechizos (`spells.js`)
*   **Ubicación:** `app/static/js/modules/data/spells.js`
*   **Función:** Catálogo completo de todos los hechizos disponibles en el sistema.
*   **Nota:** Se movió desde la raíz (`spells_db.js`) a una carpeta de datos compartidos porque ahora es utilizado tanto por el *Generador* como por el *Compendio*.

## 🔄 Flujo de Datos

1.  **Inicio:** `main.js` importa `openGenerator` de `generator.js` y lo expone globalmente para que el botón del HTML pueda llamarlo.
2.  **Selección:** El usuario elige Clase y Nivel.
3.  **Generación (`runGenerator`):**
    *   Borra el estado actual (`state`).
    *   Busca la plantilla en `data.js`.
    *   Asigna atributos usando el "Standard Array" ordenado según `priorities`.
    *   Calcula HP y asigna equipo según el nivel.
    *   Si la clase tiene hechizos, busca sus detalles completos en `spells.js` y los añade al grimorio.
    *   Llama a `updateAll()` para refrescar toda la pantalla.

## 🛠 Cómo Extender el Sistema

### Añadir una Nueva Clase
1.  Abre `app/static/js/modules/features/archetypes/data.js`.
2.  Añade una nueva entrada al objeto `ARCHETYPES`.
3.  Define sus prioridades de atributos y equipo.

### Añadir Nuevo Hechizo
1.  Abre `app/static/js/modules/data/spells.js`.
2.  Añade el objeto del hechizo con sus stats (Escuela, Nivel, Descripción, etc.).

---
*Arquitectura actualizada el 21/01/2026 para mejorar compatibilidad con Vercel y eliminar dependencias circulares.*
