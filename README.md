# T1Referidos – Plataforma de Referencias Internas para Reclutamiento

Plataforma web de referidos internos basada en Next.js que permite a los colaboradores recomendar candidatos a vacantes internas. Centraliza la gestión de postulaciones, ofrece un formulario completo de referencia, y permite a un administrador tener control sobre vacantes y postulaciones.

## Características Principales Implementadas

*   **Frontend (Next.js / React):**
    *   Página pública con listado de vacantes activas obtenidas desde Supabase.
    *   Diseño responsivo con Tailwind CSS.
    *   Tarjetas de vacantes con información detallada.
    *   Formulario modal para referir candidatos con validación (Formik/Yup) y subida de CV.
*   **Backend y Base de Datos (Supabase):**
    *   Base de datos PostgreSQL gestionada por Supabase.
    *   Almacenamiento de referencias, detalles de vacantes y CVs (Supabase Storage).
    *   Endpoint API (`/api/referencias`) para procesar nuevas referencias y subir CVs.
*   **Roles y Autenticación (Supabase Auth):**
    *   **Administrador:**
        *   Login seguro (`/admin/login`).
        *   Panel de administración protegido por rol.
        *   CRUD completo para Vacantes (crear, leer, actualizar, eliminar).
        *   Dashboard básico con métricas (total de referidos).
    *   **Referidores (Público):**
        *   Visualización de vacantes y envío de formularios de referencia sin necesidad de login.
*   **Notificaciones (Resend):**
    *   Envío automático de correos tras una nueva referencia:
        *   Confirmación al referidor.
        *   Aviso al administrador.

## Estructura del Proyecto

```
t1referidos/
├── public/               # Archivos estáticos
├── src/
│   ├── app/              # Rutas de la aplicación (App Router)
│   │   ├── (public)/     # Rutas públicas (ej: page.tsx para home)
│   │   ├── admin/        # Rutas del panel de administración
│   │   │   ├── dashboard/
│   │   │   ├── login/
│   │   │   └── vacantes/
│   │   └── api/          # API Route Handlers (ej: referencias)
│   ├── components/       # Componentes React reutilizables
│   │   ├── admin/        # Componentes específicos del panel de admin
│   │   └── (public)/     # Componentes para partes públicas (ej: VacanteCard, FormularioReferencia)
│   ├── lib/              # Librerías, helpers, utilidades
│   │   └── supabase/     # Clientes y helpers de Supabase (client, server, middleware)
│   ├── styles/           # Estilos globales (globals.css)
│   └── middleware.ts     # Middleware de Next.js (para Supabase Auth SSR)
├── .env.local.example    # Ejemplo de variables de entorno (RECOMENDADO CREAR ESTE ARCHIVO)
├── next.config.mjs       # Configuración de Next.js
├── package.json
├── README.md             # Esta documentación
└── tsconfig.json
```

## Tecnologías Utilizadas

*   **Framework Frontend:** Next.js (App Router)
*   **Lenguaje:** TypeScript
*   **UI:** React
*   **Estilos:** Tailwind CSS
*   **Backend como Servicio (BaaS):** Supabase
    *   Base de Datos: PostgreSQL
    *   Autenticación: Supabase Auth
    *   Almacenamiento: Supabase Storage
*   **Envío de Correos:** Resend
*   **Manejo de Formularios:** Formik
*   **Validación de Formularios:** Yup
*   **Iconos:** Heroicons

## Configuración del Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables (reemplaza los valores de ejemplo con tus credenciales reales):

```env
# Supabase - Reemplaza con tus credenciales de Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxx.xxxxxxxxx

# Resend (para envío de correos) - Reemplaza con tu API Key y correos
RESEND_API_KEY=re_xxxxxxxxxxxxxxx
EMAIL_FROM="Portal T1Referidos <noreply@tudominioverificado.com>"
EMAIL_ADMIN=admin@example.com

# (Opcional) Clave de servicio de Supabase si se usa para operaciones privilegiadas en backend
# Esta clave NO debe ser pública y solo se usaría en el backend de forma segura.
# SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key
```
**Nota:** Es buena práctica crear un archivo `.env.local.example` con la estructura de las variables (sin los valores secretos) para que otros desarrolladores sepan qué configurar.

## Cómo Ejecutar Localmente

1.  **Clonar el repositorio:**
    ```bash
    git clone <url-del-repositorio>
    cd t1referidos
    ```
2.  **Instalar dependencias:**
    ```bash
    npm install
    ```
3.  **Configurar variables de entorno:**
    Crea el archivo `.env.local` como se describe arriba y llénalo con tus variables.
4.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:3000`.

5.  **Configurar la Base de Datos Supabase:**
    *   Asegúrate de haber ejecutado los scripts SQL para crear las tablas (`usuarios`, `vacantes`, `referencias`) y cualquier tipo/función/vista necesaria (ej: `user_role`, `proceso_estado`, la función `get_top_vacantes_por_referencias` o la vista `vacantes_con_conteo_referencias` mencionada en el dashboard). El esquema base de las tablas se puede encontrar en la conversación de desarrollo.
    *   Crea un bucket llamado `cvs` en Supabase Storage. Configura sus políticas para permitir la subida de archivos desde la aplicación (considera la seguridad; para el endpoint `/api/referencias` actual, las políticas deben permitir inserciones anónimas o para usuarios con la `anon_key`, a menos que modifiques el endpoint para usar `service_role_key` para la subida).
    *   Crea al menos un usuario administrador en la sección "Authentication" de Supabase. Luego, en la tabla `public.usuarios`, añade una fila para este usuario, vinculando su `id` (de `auth.users`) y estableciendo el campo `rol` a `'administrador'`.

## Despliegue

La aplicación está preparada para ser desplegada en **Vercel**:
1.  Asegúrate de que tu código esté en un repositorio Git (GitHub, GitLab, Bitbucket).
2.  Conecta tu repositorio Git a Vercel.
3.  Configura las mismas variables de entorno (`.env.local`) en la sección "Environment Variables" de la configuración de tu proyecto en Vercel.
4.  Vercel debería detectar automáticamente la configuración de Next.js y desplegar la aplicación. Revisa los logs de Vercel si encuentras problemas.

## Decisiones de Diseño y Puntos Clave

*   **Supabase como BaaS:** Simplifica el backend (DB, Auth, Storage).
*   **Next.js App Router:** Uso de Server Components, Server Actions, Route Handlers.
*   **Autenticación SSR con Supabase:** Paquete `@supabase/ssr` y middleware para sesiones seguras.
*   **Tailwind CSS:** Estilización utilitaria y consistente.
*   **Server Actions y API Routes:** Server Actions para mutaciones en el panel de admin; API Route para el formulario público de referencias.
*   **Resend para Emails:** Notificaciones transaccionales.
*   **Seguridad de Roles:** Protección de rutas admin basada en sesión y campo `rol` en tabla `usuarios`.
*   **Manejo de Archivos:** CVs en Supabase Storage, URL en DB.

## Próximos Pasos y Mejoras Futuras (Sugerencias)

*   **Gestión Completa de Referencias en Panel Admin:** Listado, detalles, cambio de estado.
*   **Métricas Avanzadas y Funcionales:** Implementar correctamente "Vacantes con más postulaciones" (con vistas/RPCs), añadir más métricas.
*   **Funcionalidades IA (Fase 2):** Clasificación de CVs, etc.
*   **Gamificación:** Sistema de puntos.
*   **Integración con ATS.**
*   **Plantillas de Correo Avanzadas (React Email).**
*   **Pruebas Automatizadas (Jest/Vitest, Cypress/Playwright).**
*   **UI/UX Avanzada:** Paginación, filtros, búsquedas. Adaptar al "diseño de Caude" si se proveen detalles.
*   **Seguridad Reforzada:** Revisión de RLS, políticas de bucket. Considerar `service_role_key` para todas las operaciones de backend que modifican datos o acceden a storage sensible.
*   **Optimización de Rendimiento:** Análisis de bundles, optimización de imágenes, etc.
```
