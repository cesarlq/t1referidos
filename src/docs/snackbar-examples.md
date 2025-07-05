# Sistema de Snackbar Global - Ejemplos de Uso

Este documento muestra cómo usar el sistema de Snackbar global implementado en el proyecto T1Referidos.

## Contexto y Hooks Disponibles

### 1. SnackbarContext
Contexto principal que proporciona las funciones básicas:
- `showSnackbar(message, severity, duration)`
- `showSuccess(message, duration)`
- `showError(message, duration)`
- `showWarning(message, duration)`
- `showInfo(message, duration)`

### 2. useApiWithSnackbar
Hook para operaciones CRUD generales:
- `create(requestFn, resourceName)`
- `update(requestFn, resourceName)`
- `remove(requestFn, resourceName)`
- `fetch(requestFn, resourceName, showLoadingMessage)`

### 3. useAuthWithSnackbar
Hook específico para autenticación:
- `login(requestFn)`
- `logout(requestFn)`

### 4. useFormWithSnackbar
Hook específico para formularios:
- `submitForm(requestFn, formName)`

## Ejemplos de Uso

### Ejemplo 1: Operaciones CRUD básicas

```tsx
import { useApiWithSnackbar } from '@/hooks/useApiWithSnackbar';

const VacantesManager = () => {
  const { create, update, remove, fetch, isLoading } = useApiWithSnackbar();

  // Crear vacante
  const handleCreateVacante = async (vacanteData) => {
    const result = await create(async () => {
      const response = await fetch('/api/vacantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vacanteData)
      });
      if (!response.ok) throw new Error('Error al crear vacante');
      return response.json();
    }, 'vacante');

    if (result) {
      // Vacante creada exitosamente
      refreshVacantes();
    }
  };

  // Actualizar vacante
  const handleUpdateVacante = async (id, vacanteData) => {
    const result = await update(async () => {
      const response = await fetch(`/api/vacantes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vacanteData)
      });
      if (!response.ok) throw new Error('Error al actualizar vacante');
      return response.json();
    }, 'vacante');

    if (result) {
      refreshVacantes();
    }
  };

  // Eliminar vacante
  const handleDeleteVacante = async (id) => {
    const result = await remove(async () => {
      const response = await fetch(`/api/vacantes/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Error al eliminar vacante');
      return response.json();
    }, 'vacante');

    if (result) {
      refreshVacantes();
    }
  };

  return (
    // Tu componente JSX aquí
  );
};
```

### Ejemplo 2: Uso directo del contexto

```tsx
import { useSnackbar } from '@/contexts/SnackbarContext';

const MyComponent = () => {
  const { showSuccess, showError, showWarning, showInfo } = useSnackbar();

  const handleAction = () => {
    // Mostrar diferentes tipos de notificaciones
    showSuccess('¡Operación completada!');
    showError('Algo salió mal');
    showWarning('Ten cuidado con esta acción');
    showInfo('Información importante');
  };

  return (
    <button onClick={handleAction}>
      Mostrar Notificaciones
    </button>
  );
};
```

### Ejemplo 3: Logout con Snackbar

```tsx
import { useAuthWithSnackbar } from '@/hooks/useApiWithSnackbar';

const LogoutButton = () => {
  const { logout, isLoading } = useAuthWithSnackbar();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const handleLogout = async () => {
    const result = await logout(async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
      return { success: true };
    });

    if (result) {
      router.push('/admin/login');
    }
  };

  return (
    <Button 
      onClick={handleLogout} 
      disabled={isLoading}
      variant="outlined"
      color="error"
    >
      {isLoading ? 'Cerrando...' : 'Cerrar Sesión'}
    </Button>
  );
};
```

### Ejemplo 4: Formulario con validación

```tsx
import { useFormWithSnackbar } from '@/hooks/useApiWithSnackbar';

const ContactForm = () => {
  const { submitForm, isLoading } = useFormWithSnackbar();
  const [formData, setFormData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await submitForm(async () => {
      // Validaciones locales
      if (!formData.email) {
        throw new Error('El email es requerido');
      }
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al enviar formulario');
      }
      
      return response.json();
    }, 'formulario de contacto');

    if (result) {
      // Limpiar formulario
      setFormData({});
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos del formulario */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
};
```

## Configuración de Mensajes Personalizados

### Duración personalizada
```tsx
const { showSuccess } = useSnackbar();

// Mensaje que se muestra por 2 segundos
showSuccess('¡Guardado!', 2000);

// Mensaje que se muestra por 8 segundos
showError('Error crítico', 8000);
```

### Mensajes con contexto específico
```tsx
const { executeRequest } = useApiWithSnackbar();

const result = await executeRequest(
  async () => {
    // Tu operación aquí
  },
  {
    successMessage: 'Datos sincronizados correctamente',
    errorMessage: 'Error de sincronización',
    loadingMessage: 'Sincronizando con el servidor...',
    showLoading: true
  }
);
```

## Mejores Prácticas

1. **Usa hooks específicos**: Prefiere `useFormWithSnackbar` para formularios y `useAuthWithSnackbar` para autenticación.

2. **Maneja errores apropiadamente**: Siempre lanza errores con mensajes descriptivos en tus funciones async.

3. **Personaliza mensajes**: Usa nombres de recursos específicos para mensajes más claros.

4. **Controla la duración**: Ajusta la duración según la importancia del mensaje.

5. **No abuses de las notificaciones**: Usa Snackbars para acciones importantes, no para cada interacción menor.

## Integración Completa

El sistema está completamente integrado en:
- ✅ Layout principal (`src/app/layout.tsx`)
- ✅ Formulario de referencias (`src/components/FormularioReferencia.tsx`)
- ✅ Login de admin (`src/components/admin/LoginForm.tsx`)
- ✅ Hooks personalizados (`src/hooks/useApiWithSnackbar.ts`)

Para usar en nuevos componentes, simplemente importa el hook apropiado y sigue los ejemplos anteriores.
