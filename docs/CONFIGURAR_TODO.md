# 🎯 CONFIGURACIÓN COMPLETA - TODO EN UNO

## 📌 RESUMEN
Necesitas hacer 2 cosas:
1. ✅ Configurar 6 secrets en Hugging Face
2. ✅ Verificar URIs en Google Cloud Console

---

## PARTE 1: CONFIGURAR SECRETS EN HUGGING FACE

### � PASO 0: Verificar Acceso (IMPORTANTE)

**Antes de continuar, verifica lo siguiente:**

1. **Inicia sesión en Hugging Face:**
   - Ve a: https://huggingface.co/login
   - Inicia sesión con tu cuenta **gamingthegame**

2. **Verifica que eres el propietario del Space:**
   - Ve a: https://huggingface.co/spaces/gamingthegame/THE-ULTIMATE-D20-CH-SHEET
   - Deberías ver un botón "Settings" en la parte superior
   - Si no ves el botón "Settings", significa que no tienes acceso

3. **Si no tienes acceso:**
   - Verifica que estás usando la cuenta correcta
   - Verifica que el Space existe y es tuyo
   - Si necesitas crear un nuevo Space, avísame

---

### �🔗 PASO 1: Ir a Settings

**IMPORTANTE:** Solo podrás acceder si has completado el PASO 0.

Abre este link:
```
https://huggingface.co/spaces/gamingthegame/THE-ULTIMATE-D20-CH-SHEET/settings
```

**Si obtienes un error 403:**
- Verifica que has iniciado sesión
- Verifica que estás usando la cuenta **gamingthegame**
- Verifica que el Space existe

### 📝 PASO 2: Buscar "Variables and secrets"

Scroll hacia abajo hasta encontrar la sección **"Variables and secrets"** o **"Repository secrets"**

### ➕ PASO 3: Añadir los 6 Secrets

Haz click en **"+ New secret"** 6 veces (una para cada variable).

Para cada secret, copia EXACTAMENTE el **Name** y el **Value**:

---

#### ✅ Secret 1 de 6

**Name:**
```
SECRET_KEY
```

**Value:**
```
your-very-secret-key-here
```

---

#### ✅ Secret 2 de 6

**Name:**
```
SUPABASE_URL
```

**Value:**
```
https://foacuiatzqtrfrlhrtmx.supabase.co
```

---

#### ✅ Secret 3 de 6

**Name:**
```
SUPABASE_ANON_KEY
```

**Value:**
```
your-supabase-anon-key-here
```

---

#### ✅ Secret 4 de 6

**Name:**
```
SUPABASE_SERVICE_KEY
```

**Value:**
```
your-supabase-service-key-here
```

---

#### ✅ Secret 5 de 6 🔴 NUEVO

**Name:**
```
GOOGLE_CLIENT_ID
```

**Value:**
```
your-google-client-id.apps.googleusercontent.com
```

---

#### ✅ Secret 6 de 6 🔴 NUEVO

**Name:**
```
GOOGLE_CLIENT_SECRET
```

**Value:**
```
your-google-client-secret
```

---

### ⏳ PASO 4: Esperar

- Después de añadir cada secret, el Space se reiniciará automáticamente
- **Espera 2-3 minutos** a que termine de construirse
- El estado cambiará de "Building..." a "Running" (círculo verde)

---

## PARTE 2: VERIFICAR GOOGLE CLOUD CONSOLE

### 🔗 PASO 1: Ir a Google Cloud Console

Abre este link:
```
https://console.cloud.google.com/apis/credentials/oauthclient/811903659064-gfmjgll3fpfsk74p17lusq186tbknhkb.apps.googleusercontent.com
```

### 📋 PASO 2: Verificar "Orígenes autorizados de JavaScript"

Asegúrate de que estas 2 URIs estén en la lista:

```
https://gamingthegame-the-ultimate-d20-ch-sheet.hf.space
https://foacuiatzqtrfrlhrtmx.supabase.co
```

### 📋 PASO 3: Verificar "URIs de redireccionamiento autorizados"

Asegúrate de que esta URI esté en la lista:

```
https://foacuiatzqtrfrlhrtmx.supabase.co/auth/v1/callback
```

### 💾 PASO 4: Guardar

Si añadiste o modificaste algo, haz click en **"GUARDAR"** al final de la página.

---

## ✅ VERIFICACIÓN FINAL

### 🌐 Probar la Aplicación

Abre este link:
```
https://gamingthegame-the-ultimate-d20-ch-sheet.hf.space
```

**Deberías ver:**
- ✅ La página de login
- ✅ Un botón "Sign in with Google"
- ✅ Poder iniciar sesión con tu cuenta de Google

---

## 🐛 SI HAY PROBLEMAS

### Ver los logs del Space:
```
https://huggingface.co/spaces/gamingthegame/THE-ULTIMATE-D20-CH-SHEET/logs
```

### Problemas comunes:

**1. El Space no arranca:**
- Verifica que los 6 secrets estén configurados
- Verifica que los nombres sean EXACTOS (mayúsculas incluidas)
- Verifica que los valores no tengan espacios extra

**2. Error al hacer login con Google:**
- Verifica las URIs en Google Cloud Console
- Verifica que `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` sean correctos

**3. Ves "⚠️ WARNING: Faltan variables de entorno":**
- Falta algún secret por configurar
- Revisa los nombres y valores

---

## 📊 CHECKLIST FINAL

- [ ] ✅ Añadido SECRET_KEY en Hugging Face
- [ ] ✅ Añadido SUPABASE_URL en Hugging Face
- [ ] ✅ Añadido SUPABASE_ANON_KEY en Hugging Face
- [ ] ✅ Añadido SUPABASE_SERVICE_KEY en Hugging Face
- [ ] ✅ Añadido GOOGLE_CLIENT_ID en Hugging Face
- [ ] ✅ Añadido GOOGLE_CLIENT_SECRET en Hugging Face
- [ ] ✅ Verificado URIs en Google Cloud Console
- [ ] ✅ Space en estado "Running" (verde)
- [ ] ✅ Login con Google funciona

---

## 🎉 ¡LISTO!

Si todos los pasos están completados y el checklist está marcado, tu aplicación debería funcionar perfectamente.
