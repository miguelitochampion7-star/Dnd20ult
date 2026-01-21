# 🚀 Deployment Guide - D&D Character Sheet

## 📋 Pre-requisitos Completados
- ✅ Código desarrollado
- ✅ Supabase configurado
- ✅ Credenciales obtenidas

---

## 🗄️ PASO 1: Configurar Base de Datos en Supabase

1. Ve a tu proyecto Supabase: https://app.supabase.com/project/foacuiatzqtrfrlhrtmx
2. Click en **"SQL Editor"** en el menú lateral
3. Click en **"New query"**
4. Abre el archivo `supabase_setup.sql` de este proyecto
5. Copia TODO el contenido
6. Pégalo en el editor SQL de Supabase
7. Click en **"Run"** (botón ▶️)
8. Deberías ver: "Success. No rows returned"

✅ **¡Base de datos configurada!**

---

## 🔐 PASO 2: Configurar Variables de Entorno en Hugging Face

1. Ve a tu Space: https://huggingface.co/spaces/gamingthegame/THE-ULTIMATE-D20-CH-SHEET

2. Click en **"Settings"** (arriba a la derecha)

3. Scroll hasta **"Repository secrets"**

4. Añade estas 4 variables **(IMPORTANTE: Los nombres deben ser EXACTOS)**:

### Variable 1: SECRET_KEY
```
Nombre: SECRET_KEY
Valor: [Genera uno nuevo corriendo este comando en tu PC:]
```
Ejecuta en PowerShell:
```powershell
python -c "import secrets; print(secrets.token_hex(32))"
```
Copia el resultado y pégalo como valor.

### Variable 2: SUPABASE_URL
```
Nombre: SUPABASE_URL  
Valor: your-supabase-url-here
```

### Variable 3: SUPABASE_ANON_KEY
```
Nombre: SUPABASE_ANON_KEY
Valor: your-supabase-anon-key-here
```

### Variable 4: SUPABASE_SERVICE_KEY
```
Nombre: SUPABASE_SERVICE_KEY
Valor: your-supabase-service-key-here
```

✅ **Variables configuradas**

---

## 📤 PASO 3: Deploying Code to Hugging Face

Ahora tienes que subir el código actualizado a Hugging Face.

### Opción A: Usando deploy.py (RECOMENDADO)

1. Desde tu carpeta del proyecto, ejecuta:
```powershell
python deploy.py
```

2. Espera que termine de subir todos los archivos

### Opción B: Git Manual

```bash
git add .
git commit -m "Add multi-user authentication with Supabase"
git push
```

✅ **Código subido**

---

## ⏳ PASO 4: Esperar el Build

1. Ve a tu Space: https://huggingface.co/spaces/gamingthegame/THE-ULTIMATE-D20-CH-SHEET

2. Verás que está "Building..." (puede tardar 2-3 minutos)

3. Espera a que diga "Running" con el círculo verde

---

## 🎉 PASO 5: ¡Probar!

1. **Visita tu Space**: https://gamingthegame-the-ultimate-d20-ch-sheet.hf.space

2. Deberías ver la **página de login**

3. **Prueba registrarte**:
   - Click en "Registrarse"
   - Ingresa tu email
   - Crea una contraseña (mín. 6 caracteres)
   - Click "Crear Cuenta"
   - Revisa tu email para confirmar (Supabase envía un email)

4. **Opcional: Prueba Google OAuth** (si configuraste Google)

5. Una vez dentro, deberías ver el **Dashboard vacío**

6. Click en **"Nueva Ficha"**

7. Crea tu personaje

8. **Verifica el auto-guardado**: Edita algo y espera 10 segundos. Deberías ver "✅ Guardado"

9. **Cierra la página** y vuelve a abrirla → tus cambios deben estar guardados

---

## ✅ Checklist de Verificación

- [ ] Base de datos creada en Supabase (ejecutaste el SQL)
- [ ] Variables de entorno configuradas en HF
- [ ] Código subido a Hugging Face
- [ ] Space está "Running"
- [ ] Puedes registrarte con email
- [ ] Puedes crear una ficha
- [ ] La ficha se auto-guarda
- [ ] Los datos persisten al recargar

---

## 🐛 Troubleshooting

### Error: "Faltan variables de entorno"
- Verifica que los nombres en HF Secrets sean EXACTOS (MAYÚSCULAS)
- Verifica que no haya espacios extra en los valores

### Error: "Connection refused" o error de Supabase
- Verifica que la URL de Supabase sea correcta
- Verifica que las claves sean las correctas (anon y service_role)

### La ficha no se guarda
- Abre la consola del navegador (F12)
- Busca errores en rojo
- Verifica que ejecutaste el SQL en Supabase

### No recibo email de confirmación
- Revisa spam
- En Supabase → Authentication → Email Templates puedes deshabilitar la confirmación

---

## 🔄 Configurar Google OAuth (OPCIONAL)

Si quieres habilitar el login con Google:

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un proyecto nuevo
3. Habilita "Google+ API"
4. Credentials → Create OAuth 2.0 Client ID
5. Authorized redirect URIs: `your-supabase-url/auth/v1/callback`
6. Copia Client ID y Secret
7. En Supabase → Authentication → Providers → Google
8. Pega Client ID y Secret
9. Guarda

---

## 📞 Soporte

Si tienes problemas, revisa:
- Logs de Hugging Face Space (Settings → Logs)
- Consola del navegador (F12)
- Logs de Supabase (Dashboard → Logs)
