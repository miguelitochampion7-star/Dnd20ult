# 🐛 Guía de Debugging - Problema de Login

## 🎯 Síntomas
- Login no muestra errores
- Al darle "Entrar" no pasa nada
- No redirige al dashboard

## 🔍 Pasos de Diagnóstico

### 1. Consola del Navegador (F12)
1. Presiona **F12**
2. Click en **"Console"**
3. Intenta hacer login
4. **¿Hay errores en rojo?** → Anótalos

### 2. Network Tab
1. En F12, click en **"Network"**
2. Intenta login
3. Busca petición **"login"**
4. Click en ella → Ve a **"Response"**
5. **Copia la respuesta**

### 3. Acceso Manual a Dashboard
Prueba esta URL directamente:
```
https://gamingthegame-the-ultimate-d20-ch-sheet.hf.space/dashboard
```

**Resultados posibles:**
- ✅ Ves dashboard → Login funciona, falla redirect
- ❌ Redirige a login → Sesión no se guarda

### 4. Logs del Servidor
Pestaña "Logs" del Space → Últimas 10 líneas

## 🔧 Posibles Causas

1. **JavaScript no ejecuta**: Error en frontend
2. **POST no llega**: Problema de CORS o form
3. **Login funciona pero no redirige**: Falta redirect en código
4. **Sesión no se guarda**: Problema con cookies/SECRET_KEY
