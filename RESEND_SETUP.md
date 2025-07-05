# 📧 Configuración de Resend para T1Referidos

Esta guía te ayudará a configurar Resend para el envío automático de correos electrónicos cuando se envían referencias.

## 🚀 Paso 1: Crear cuenta en Resend

1. Ve a [resend.com](https://resend.com)
2. Haz clic en "Sign Up"
3. Crea tu cuenta con email y contraseña
4. Verifica tu email

## 🔑 Paso 2: Obtener API Key

1. Inicia sesión en tu dashboard de Resend
2. Ve a la sección **"API Keys"** en el menú lateral
3. Haz clic en **"Create API Key"**
4. Dale un nombre descriptivo (ej: "T1Referidos Production")
5. Selecciona los permisos necesarios:
   - ✅ **Send emails**
   - ✅ **Full access** (recomendado para simplicidad)
6. Copia la API Key (empieza con `re_`)

⚠️ **IMPORTANTE**: Guarda esta clave de forma segura, no la podrás ver de nuevo.

## 🌐 Paso 3: Configurar dominio (Recomendado)

### Opción A: Usar dominio propio (Recomendado para producción)

1. En Resend, ve a **"Domains"**
2. Haz clic en **"Add Domain"**
3. Ingresa tu dominio (ej: `tuempresa.com`)
4. Configura los registros DNS que te proporcione Resend:
   - **SPF Record**
   - **DKIM Record** 
   - **DMARC Record** (opcional pero recomendado)
5. Espera a que se verifique el dominio (puede tomar hasta 24 horas)

### Opción B: Usar dominio de Resend (Para desarrollo)

Si no tienes dominio propio, puedes usar el dominio compartido de Resend temporalmente.

## ⚙️ Paso 4: Configurar variables de entorno

Edita tu archivo `.env.local` y agrega las siguientes variables:

```bash
# Configuración de Resend para envío de correos
RESEND_API_KEY=re_tu_api_key_aqui_1234567890abcdef
EMAIL_FROM=T1Referidos <noreply@tudominio.com>
EMAIL_ADMIN=admin@tudominio.com
```

### Explicación de las variables:

- **RESEND_API_KEY**: La clave API que obtuviste en el paso 2
- **EMAIL_FROM**: El remitente de los correos (debe usar tu dominio verificado)
- **EMAIL_ADMIN**: Email del administrador que recibirá notificaciones

### Ejemplos de configuración:

**Con dominio propio:**
```bash
RESEND_API_KEY=re_AbCdEf123456_tu_clave_real_aqui
EMAIL_FROM=T1Referidos <noreply@miempresa.com>
EMAIL_ADMIN=rh@miempresa.com
```

**Con dominio de Resend (desarrollo):**
```bash
RESEND_API_KEY=re_AbCdEf123456_tu_clave_real_aqui
EMAIL_FROM=T1Referidos <onboarding@resend.dev>
EMAIL_ADMIN=tu-email@gmail.com
```

## 🧪 Paso 5: Probar la configuración

1. Reinicia tu servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Envía una referencia de prueba desde el portal público

3. Verifica que se envíen los correos:
   - **Al referidor**: Confirmación de que se recibió la referencia
   - **Al admin**: Notificación de nueva referencia

## 📊 Paso 6: Monitorear envíos

En el dashboard de Resend puedes:
- Ver estadísticas de envío
- Revisar logs de correos enviados
- Monitorear bounces y quejas
- Ver métricas de entregabilidad

## 🔧 Configuración avanzada (Opcional)

### Plantillas de correo personalizadas

Puedes crear plantillas HTML más elaboradas en Resend:

1. Ve a **"Templates"** en Resend
2. Crea plantillas personalizadas
3. Modifica el código en `src/app/api/referencias/route.ts` para usar las plantillas

### Webhooks

Para recibir notificaciones de eventos de correo:

1. Configura webhooks en Resend
2. Crea un endpoint en tu app para recibir eventos
3. Maneja eventos como bounces, quejas, etc.

## ❌ Solución de problemas

### Error: "API key not found"
- Verifica que la variable `RESEND_API_KEY` esté correctamente configurada
- Asegúrate de que la API key sea válida y no haya expirado

### Error: "Domain not verified"
- Verifica que tu dominio esté correctamente configurado en Resend
- Revisa los registros DNS
- Usa el dominio de Resend temporalmente para pruebas

### Correos no llegan
- Revisa la carpeta de spam
- Verifica que el email de destino sea válido
- Revisa los logs en el dashboard de Resend

### Error: "Rate limit exceeded"
- Resend tiene límites de envío en el plan gratuito
- Considera upgradearte a un plan de pago si necesitas más volumen

## 💰 Planes y límites

**Plan Gratuito:**
- 3,000 correos/mes
- 100 correos/día
- Perfecto para desarrollo y pruebas

**Plan de Pago:**
- Desde $20/mes
- Más volumen de envío
- Soporte prioritario
- Funciones avanzadas

## 🔒 Seguridad

- ✅ Nunca commits tu API key al repositorio
- ✅ Usa variables de entorno para todas las credenciales
- ✅ Configura SPF, DKIM y DMARC para mejor entregabilidad
- ✅ Monitorea regularmente los logs de envío

## 📞 Soporte

Si tienes problemas:
1. Revisa la [documentación de Resend](https://resend.com/docs)
2. Contacta el soporte de Resend
3. Revisa los logs en tu aplicación y en Resend

---

Una vez configurado correctamente, el sistema enviará automáticamente:
- ✅ Confirmación al referidor cuando envíe una referencia
- ✅ Notificación al administrador sobre nuevas referencias
- ✅ Información completa del candidato y referidor
