---
title: The Ultimate D20 Character Sheet
emoji: 🎲
colorFrom: yellow
colorTo: red
sdk: docker
pinned: false
---

# 🎲 The Ultimate D20 Character Sheet

Aplicación web para gestionar fichas de personajes de D&D 3.5, desplegada en Hugging Face Spaces con autenticación mediante Supabase.

## 🚀 Características

- ✅ Autenticación con email/contraseña
- ✅ Login con Google OAuth
- ✅ Gestión completa de fichas de personajes
- ✅ Interfaz moderna y responsive
- ✅ Base de datos en Supabase
- ✅ Desplegado en Hugging Face Spaces

## 📁 Estructura del Proyecto

```
DnT_Sheet/
├── app/                    # Código de la aplicación Flask
│   ├── __init__.py        # Inicialización de la app
│   ├── api.py             # API REST para fichas
│   ├── auth.py            # Sistema de autenticación
│   ├── config.py          # Configuración
│   ├── routes.py          # Rutas principales
│   ├── static/            # CSS, JS, imágenes
│   └── templates/         # Templates HTML
├── docs/                   # 📚 Documentación
│   ├── CONFIGURAR_TODO.md # Guía completa de configuración
│   ├── SOLUCION_GOOGLE_OAUTH.md  # Configurar Google OAuth
│   ├── HF_SECRETS_GUIDE.md       # Configurar secrets en HF
│   ├── DEPLOYMENT.md             # Guía de deployment
│   ├── DEBUG_GUIDE.md            # Guía de debugging
│   └── supabase_setup.sql        # Script SQL inicial
├── .env.example           # Ejemplo de variables de entorno
├── Dockerfile             # Configuración Docker
├── requirements.txt       # Dependencias Python
└── run.py                 # Script para ejecutar la app

```

## 🔧 Configuración Rápida

### 1. Variables de Entorno

Copia `.env.example` a `.env` y configura:

```bash
SECRET_KEY=tu-secret-key
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_KEY=tu-service-key
```

### 2. Instalar Dependencias

```bash
pip install -r requirements.txt
```

### 3. Ejecutar Localmente

```bash
python run.py
```

La aplicación estará disponible en `http://localhost:7860`

## 📚 Documentación Completa

Toda la documentación está en la carpeta **`docs/`**:

- **[CONFIGURAR_TODO.md](docs/CONFIGURAR_TODO.md)** - Configuración completa paso a paso
- **[SOLUCION_GOOGLE_OAUTH.md](docs/SOLUCION_GOOGLE_OAUTH.md)** - Configurar autenticación con Google
- **[HF_SECRETS_GUIDE.md](docs/HF_SECRETS_GUIDE.md)** - Configurar secrets en Hugging Face
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Desplegar en Hugging Face Spaces
- **[DEBUG_GUIDE.md](docs/DEBUG_GUIDE.md)** - Solución de problemas

## 🌐 Despliegue (Acceso a la App)

✅ **USA ESTE LINK PARA ENTRAR:**
👉 [**https://gamingthegame-the-ultimate-d20-ch-sheet.hf.space**](https://gamingthegame-the-ultimate-d20-ch-sheet.hf.space)

> **Nota:** Usa siempre el enlace de arriba. El enlace de "Space" de Hugging Face tiene limitaciones con Google Login porque funciona dentro de una "caja" (iframe).

- **Página del Proyecto (Código):** https://huggingface.co/spaces/gamingthegame/THE-ULTIMATE-D20-CH-SHEET

## 🛠️ Stack Tecnológico

- **Backend:** Flask (Python)
- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Base de Datos:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth + Google OAuth
- **Hosting:** Hugging Face Spaces
- **Container:** Docker

## 📝 Licencia

Este proyecto está liberado bajo la **Licencia GNU GPLv3**.

### ¿Qué significa esto?
*   ✅ **Eres libre de usarlo, copiarlo y modificarlo.**
*   ✅ **Debes mantener la misma licencia libre** si distribuyes versiones modificadas.
*   ❌ **No puedes cerrar el código** para venderlo como producto propietario.

El contenido relacionado con Dungeons & Dragons 3.5 (hechizos, clases, reglas) pertenece a Wizards of the Coast bajo la **Open Game License (OGL)**.

Copyright © 2026 The Ultimate D20 Ch'Sheet. Desarrollado con ❤️ (y demasiado café) para la mejor mesa de rol del mundo.

---

**¿Necesitas ayuda?** Consulta la [documentación completa](docs/) o revisa los logs de la aplicación.
