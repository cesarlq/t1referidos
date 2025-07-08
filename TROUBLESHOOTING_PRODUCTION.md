# Guía de Solución de Problemas - Publicación de Vacantes en Producción

## Problema
Las vacantes se pueden publicar en local pero no en producción (Vercel) sin mostrar errores.

## Soluciones Implementadas

### 1. API Route en lugar de Server Actions
Se creó una API route tradicional (`/api/vacantes`) para reemplazar la Server Action, ya que las Server Actions pueden tener problemas en Vercel.

### 2. Sistema de Debug Mejorado
Se agregó un sistema de logging que te ayudará a identificar exactamente dónde falla el proceso.

## Pasos para Diagnosticar el Problema

### Paso 1: Verificar Variables de Entorno en Vercel
1. Ve a tu dashboard de Vercel
2. Selecciona tu proyecto
3. Ve a Settings → Environment Variables
4. Asegúrate de tener:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Verifica que los valores sean exactamente los mismos que en tu `.env.local`

### Paso 2: Habilitar Debug en Producción
1. En Vercel, agrega una nueva variable de entorno:
   - Name: `NEXT_PUBLIC_DEBUG`
   - Value: `true`
2. Redeploy tu aplicación
3. Ahora verás logs detallados en la consola del navegador y en los logs de Vercel

### Paso 3: Verificar Logs de Vercel
1. Ve a tu dashboard de Vercel
2. Selecciona tu proyecto
3. Ve a la pestaña "Functions"
4. Busca logs de la función `/api/vacantes`
5. Revisa si hay errores específicos

### Paso 4: Verificar Permisos en Supabase
1. Ve a tu dashboard de Supabase
2. Ve a Authentication → Policies
3. Revisa las políticas de la tabla `vacantes`
4. Asegúrate de que permitan INSERT para usuarios administradores

### Paso 5: Verificar Estructura de la Base de Datos
Asegúrate de que la tabla `vacantes` tenga todos los campos necesarios:
- `titulo_puesto` (text)
- `departamento` (text)
- `modalidad` (text)
- `descripcion_puesto` (text)
- `tecnologias_requeridas` (text[])
- `ubicacion` (text, nullable)
- `salario_rango_min` (numeric, nullable)
- `salario_rango_max` (numeric, nullable)
- `moneda` (text, nullable)
- `responsabilidades` (text, nullable)
- `requisitos` (text, nullable)
- `beneficios` (text, nullable)
- `fecha_cierre` (date, nullable)
- `esta_activa` (boolean)
- `creada_por_admin_id` (uuid)

## Errores Comunes y Soluciones

### Error: "No autenticado"
- **Causa**: Las cookies de sesión no se están enviando correctamente
- **Solución**: Verificar configuración de cookies en Supabase

### Error: "No autorizado"
- **Causa**: El usuario no tiene rol de administrador
- **Solución**: Verificar que el usuario tenga `rol = 'administrador'` en la tabla `usuarios`

### Error: "Configuración del servidor incorrecta"
- **Causa**: Variables de entorno faltantes
- **Solución**: Verificar que todas las variables estén configuradas en Vercel

### Error de Supabase Insert
- **Causa**: Problemas con la estructura de datos o permisos RLS
- **Solución**: Revisar políticas RLS y estructura de la tabla

## Comandos Útiles para Debug

### Ver logs en tiempo real (local)
```bash
npm run dev
```

### Ver logs de Vercel
```bash
vercel logs [deployment-url]
```

### Verificar build
```bash
npm run build
```

## Próximos Pasos si el Problema Persiste

1. **Revisar Network Tab**: En las herramientas de desarrollador, ve a Network y observa la respuesta de `/api/vacantes`
2. **Verificar CORS**: Asegúrate de que no haya problemas de CORS
3. **Revisar Timeout**: Vercel tiene límites de tiempo para funciones
4. **Contactar Soporte**: Si todo lo anterior falla, contacta el soporte de Vercel o Supabase

## Archivos Modificados
- `src/app/api/vacantes/route.ts` - Nueva API route
- `src/app/admin/vacantes/nueva/page.tsx` - Actualizado para usar API route
- `src/lib/debug.ts` - Sistema de debugging
- `TROUBLESHOOTING_PRODUCTION.md` - Esta guía
