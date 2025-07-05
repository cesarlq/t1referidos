"use client";

import { useState } from 'react';
import { useSnackbar } from '@/contexts/SnackbarContext';

interface UseApiWithSnackbarOptions {
  successMessage?: string;
  errorMessage?: string;
  loadingMessage?: string;
  showLoading?: boolean;
}

export const useApiWithSnackbar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError, showInfo } = useSnackbar();

  const executeRequest = async <T>(
    requestFn: () => Promise<T>,
    options: UseApiWithSnackbarOptions = {}
  ): Promise<T | null> => {
    const {
      successMessage = 'Operación completada exitosamente',
      errorMessage = 'Ocurrió un error',
      loadingMessage = 'Procesando...',
      showLoading = true
    } = options;

    try {
      setIsLoading(true);
      
      if (showLoading) {
        showInfo(loadingMessage);
      }

      const result = await requestFn();
      
      showSuccess(successMessage);
      return result;
    } catch (error) {
      console.error('API Error:', error);
      const message = error instanceof Error ? error.message : errorMessage;
      showError(`${errorMessage}: ${message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Métodos específicos para operaciones comunes
  const create = async <T>(
    requestFn: () => Promise<T>,
    resourceName: string = 'elemento'
  ) => {
    return executeRequest(requestFn, {
      successMessage: `${resourceName} creado exitosamente`,
      errorMessage: `Error al crear ${resourceName}`,
      loadingMessage: `Creando ${resourceName}...`
    });
  };

  const update = async <T>(
    requestFn: () => Promise<T>,
    resourceName: string = 'elemento'
  ) => {
    return executeRequest(requestFn, {
      successMessage: `${resourceName} actualizado exitosamente`,
      errorMessage: `Error al actualizar ${resourceName}`,
      loadingMessage: `Actualizando ${resourceName}...`
    });
  };

  const remove = async <T>(
    requestFn: () => Promise<T>,
    resourceName: string = 'elemento'
  ) => {
    return executeRequest(requestFn, {
      successMessage: `${resourceName} eliminado exitosamente`,
      errorMessage: `Error al eliminar ${resourceName}`,
      loadingMessage: `Eliminando ${resourceName}...`
    });
  };

  const fetch = async <T>(
    requestFn: () => Promise<T>,
    resourceName: string = 'datos',
    showLoadingMessage: boolean = false
  ) => {
    return executeRequest(requestFn, {
      successMessage: `${resourceName} cargados exitosamente`,
      errorMessage: `Error al cargar ${resourceName}`,
      loadingMessage: `Cargando ${resourceName}...`,
      showLoading: showLoadingMessage
    });
  };

  return {
    isLoading,
    executeRequest,
    create,
    update,
    remove,
    fetch
  };
};

// Hook específico para operaciones de autenticación
export const useAuthWithSnackbar = () => {
  const api = useApiWithSnackbar();

  const login = async <T>(requestFn: () => Promise<T>) => {
    return api.executeRequest(requestFn, {
      successMessage: '¡Inicio de sesión exitoso!',
      errorMessage: 'Error de autenticación',
      loadingMessage: 'Iniciando sesión...'
    });
  };

  const logout = async <T>(requestFn: () => Promise<T>) => {
    return api.executeRequest(requestFn, {
      successMessage: 'Sesión cerrada exitosamente',
      errorMessage: 'Error al cerrar sesión',
      loadingMessage: 'Cerrando sesión...'
    });
  };

  return {
    ...api,
    login,
    logout
  };
};

// Hook específico para operaciones de formularios
export const useFormWithSnackbar = () => {
  const api = useApiWithSnackbar();

  const submitForm = async <T>(
    requestFn: () => Promise<T>,
    formName: string = 'formulario'
  ) => {
    return api.executeRequest(requestFn, {
      successMessage: `${formName} enviado exitosamente`,
      errorMessage: `Error al enviar ${formName}`,
      loadingMessage: `Enviando ${formName}...`
    });
  };

  return {
    ...api,
    submitForm
  };
};
