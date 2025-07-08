/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import VacanteForm, { VacanteFormData } from '@/components/admin/VacanteForm';

// Función para crear la vacante usando API route
async function crearVacanteAction(data: VacanteFormData): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const response = await fetch('/api/vacantes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      return { success: false, error: result.error || 'Error al crear la vacante' };
    }

    return result;
  } catch (error) {
    console.error('Error calling API:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error de conexión' 
    };
  }
}


export default function NuevaVacantePage() {
  // El layout /admin/layout.tsx ya protege esta página.
  return (
    <div>
      <VacanteForm
        onSubmitAction={crearVacanteAction}
        isEditMode={false}
      />
    </div>
  );
}
