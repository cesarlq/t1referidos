# Debugging en Producción - T1Referidos

## Problema Identificado
El formulario de creación de vacantes no funciona en producción (Vercel) pero sí en desarrollo local.

## Cambios Implementados para Debugging

### 1. Logging Mejorado
- ✅ Agregado logging detallado en `crearVacanteAction` (Server Action)
- ✅ Agregado logging en `useApiWithSnackbar` hook
- ✅ Agregado logging en `VacanteForm` component

### 2. Manejo de Errores Mejorado
- ✅ Try-catch completo en Server Action
- ✅ Validación de variables de entorno
- ✅ Manejo de errores más específico

### 3. Componente de Debug
- ✅ Creado `DebugInfo` component para mostrar información del sistema
- ✅ Solo visible en desarrollo o con `?debug=true` en la URL

### 4. Configuración de Producción
- ✅ Actualizado `next.config.ts` con logging habilitado
- ✅ Agregado `vercel.json` con configuración específica
- ✅ Configuración de Supabase mejorada

## Cómo Debuggear en Producción

### Paso 1: Habilitar Debug Mode
Agrega `?debug=true` al final de la URL en producción:
```
https://tu-app.vercel.app/admin/vacantes/nueva?debug=true
```

### Paso 2: Ver Logs en Vercel
1. Ve a tu dashboard de Vercel
2. Selecciona tu proyecto
3. Ve a la pestaña "Functions"
4. Busca los logs de las funciones que se ejecutan

### Paso 3: Revisar Console Logs
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Console"
3. Intenta crear una vacante
4. Revisa los logs que aparecen con emojis (🚀, 📝, ✅, ❌, etc.)

### Paso 4: Revisar Network Tab
1. En las herramientas de desarrollador, ve a "Network"
2. Intenta crear una vacante
3. Busca requests que fallen o tengan errores

## Posibles Causas del Problema

### 1. Variables de Entorno
- Verificar que `NEXT_PUBLIC_SUPABASE_URL` esté configurada en Vercel
- Verificar que `NEXT_PUBLIC_SUPABASE_ANON_KEY` esté configurada en Vercel

### 2. Server Actions en Producción
- Las Server Actions pueden comportarse diferente en producción
- Problemas de serialización de datos
- Timeouts en funciones serverless

### 3. Middleware Interference
- El middleware complejo puede estar interfiriendo
- Problemas con cookies en producción

### 4. Supabase Connection
- Problemas de conectividad con Supabase
- Configuración de RLS (Row Level Security)
- Permisos de base de datos

## Logs a Buscar

### En Console del Browser:
```
🚀 Server Action iniciada - crearVacanteAction
📝 Datos recibidos: {...}
✅ Variables de entorno OK
🔐 Verificando sesión...
✅ Sesión válida para usuario: email@example.com
👤 Verificando rol de usuario...
✅ Usuario es administrador
📋 Preparando datos para insertar...
📝 Datos preparados: {...}
💾 Insertando en base de datos...
✅ Vacante creada exitosamente: {...}
```

### En Vercel Function Logs:
- Buscar errores de Supabase
- Buscar timeouts
- Buscar errores de serialización

## Soluciones Potenciales

### Si hay error de variables de entorno:
1. Ve a Vercel Dashboard → Settings → Environment Variables
2. Verifica que estén configuradas correctamente
3. Redeploy la aplicación

### Si hay error de Supabase:
1. Verifica la conexión a Supabase
2. Revisa los permisos de la tabla `vacantes`
3. Verifica que el usuario tenga rol de `administrador`

### Si hay timeout:
1. Optimizar la Server Action
2. Aumentar el timeout en `vercel.json`

## Comandos Útiles

### Para ver logs localmente:
```bash
npm run dev
# Luego ve a http://localhost:3000/admin/vacantes/nueva?debug=true
```

### Para deployar cambios:
```bash
git add .
git commit -m "Debug: Mejorar logging para producción"
git push origin main
```

## Contacto
Si necesitas ayuda adicional, revisa los logs y comparte la información específica del error.
