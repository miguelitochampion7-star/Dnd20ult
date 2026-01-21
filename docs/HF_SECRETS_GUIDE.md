# 🔧 GUÍA RÁPIDA: Configurar Secrets en Hugging Face

## ⚠️ El código YA está subido, solo falta configurar las variables de entorno

### **PASO 1: Ir a Settings**

1. Abre: https://huggingface.co/spaces/gamingthegame/THE-ULTIMATE-D20-CH-SHEET/settings

### **PASO 2: Buscar la sección "Variables and secrets"**

Scroll hacia abajo hasta encontrar "Variables and secrets" o "Repository secrets"

### **PASO 3: Añadir cada Secret**

Haz click en **"+ New secret"** (o "Add a secret") 6 veces, una para cada variable:

---

#### **Secret 1: SECRET_KEY**
```
Value: your-very-secret-key-here
```

#### **Secret 2: SUPABASE_URL**
```
Name: SUPABASE_URL
Value: https://foacuiatzqtrfrlhrtmx.supabase.co
```

#### **Secret 3: SUPABASE_ANON_KEY**
```
Value: your-supabase-anon-key-here
```

#### **Secret 4: SUPABASE_SERVICE_KEY**
```
Value: your-supabase-service-key-here
```

#### **Secret 5: GOOGLE_CLIENT_ID** ⭐ NUEVO
```
Value: your-google-client-id.apps.googleusercontent.com
```

#### **Secret 6: GOOGLE_CLIENT_SECRET** ⭐ NUEVO
```
Value: your-google-client-secret
```

---

### **PASO 4: Guardar y Esperar**

- Después de añadir cada secret, el Space se **reiniciará automáticamente**
- Espera 2-3 minutos a que termine de construirse
- Ve a: https://huggingface.co/spaces/gamingthegame/THE-ULTIMATE-D20-CH-SHEET
- Debería cambiar de "Building..." a "Running" (círculo verde)

### **PASO 5: Probar**

Visita: https://gamingthegame-the-ultimate-d20-ch-sheet.hf.space

¡Deberías ver la página de login! 🎉

---

## 🐛 Si hay errores:

1. En tu Space, click en "Logs" (arriba)
2. Busca errores en rojo
3. Pásame el error y te ayudo

## ✅ Si ves "⚠️ WARNING: Faltan variables de entorno":

Significa que los secrets NO están configurados correctamente. Revisa que:
- Los **nombres** sean EXACTOS (MAYÚSCULAS incluidas)
- Los **valores** no tengan espacios extra al inicio/final
