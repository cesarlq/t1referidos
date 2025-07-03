"use client"; // Directiva para Client Component

import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

interface DeleteVacanteFormProps {
  vacanteId: string;
  // Tipamos la Server Action de forma genérica. FormData es lo que recibe.
  // La acción puede ser async, por lo que el retorno es Promise<void> o Promise<un_tipo_de_retorno_si_lo_hay>
  eliminarAction: (formData: FormData) => Promise<void | any>;
}

export default function DeleteVacanteForm({ vacanteId, eliminarAction }: DeleteVacanteFormProps) {

  // No necesitamos un handleSubmit explícito aquí si la confirmación se hace
  // en el onSubmit del formulario que llama directamente a la acción después de la confirmación.
  // Sin embargo, para prevenir la acción si se cancela, sí es necesario.

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta vacante? Esta acción no se puede deshacer.')) {
      event.preventDefault(); // Detiene el envío del formulario y la ejecución de la Server Action
      return;
    }
    // Si el usuario confirma, no hacemos preventDefault(), y el formulario
    // procederá a ejecutar la Server Action definida en la prop `action`.
    // Si la Server Action se pasa directamente a `action` del form, no necesitamos llamarla aquí.
  };

  return (
    // Cuando se usa una Server Action, el `action` prop del form es suficiente.
    // El `onSubmit` se usa aquí solo para el `confirm()`.
    <form
      action={eliminarAction}
      method="POST" // method="POST" es implícito para Server Actions pero bueno tenerlo
      className="inline"
      onSubmit={handleFormSubmit} // Este onSubmit es para la confirmación del cliente
    >
      <input type="hidden" name="id" value={vacanteId} />
      <button
        type="submit"
        className="text-red-600 hover:text-red-800 transition-colors"
        title="Eliminar"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </form>
  );
}
