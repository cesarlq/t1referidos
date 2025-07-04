/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import VacanteForm, { VacanteFormData } from '@/components/admin/VacanteForm';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Vacante } from '@/components/VacanteCard'; // Reutilizamos interfaz
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

interface EditarVacantePageProps {
  params: { id: string };
}

// Server Action para actualizar la vacante
async function actualizarVacanteAction(id: string, data: VacanteFormData): Promise<{ success: boolean; error?: string; data?: any }> {
  "use server";

  const supabase = createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: 'No autenticado.' };
  }
   const { data: userProfile } = await supabase
    .from('usuarios')
    .select('rol')
    .eq('id', user.id)
    .single();
    
  if (userProfile?.rol !== 'administrador') {
    return { success: false, error: 'No autorizado.'};
  }


  const vacanteToUpdate = {
    ...data,
    tecnologias_requeridas: data.tecnologias_requeridas.filter(t => t.trim() !== ''),
    // El campo updated_at se actualiza automáticamente por el trigger en la DB
  };

  console.log('ID recibido en actualizarVacanteAction:', id);
  console.log('Datos a actualizar:', JSON.stringify(vacanteToUpdate, null, 2)); // Usar null, 2 para pretty print

  const { data: updatedData, error } = await supabase
    .from('vacantes')
    .update(vacanteToUpdate)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating vacante:", error);
    if (error.code === 'PGRST116' && error.details?.includes('0 rows')) {
      return { success: false, error: "Error al actualizar: La vacante no fue encontrada o ya ha sido eliminada. Por favor, verifique el listado de vacantes." };
    }
    return { success: false, error: `Error del servidor: ${error.message}` };
  }

  revalidatePath('/admin/vacantes'); // Actualizar la lista
  revalidatePath(`/admin/vacantes/${id}/editar`); // Actualizar esta misma página si es necesario
  return { success: true, data: updatedData };
}

async function getVacanteById(id: string): Promise<Partial<Vacante> | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('vacantes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching vacante by id for edit:', error);
    return null;
  }
  return data as Partial<Vacante>;
}


export default async function EditarVacantePage({ params }: EditarVacantePageProps) {
  const vacanteId = params.id;
  const vacante = await getVacanteById(vacanteId);

  if (!vacante) {
    // Podríamos mostrar un mensaje de "No encontrado" o redirigir
    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-xl font-semibold text-red-600">Vacante no encontrada</h1>
            <p className="text-gray-600 mt-2">No se pudo cargar la información de la vacante para editar.</p>
            <Link href="/admin/vacantes" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
              Volver al listado de vacantes
            </Link>
        </div>
    );
  }

  // "Bindeamos" el vacanteId a la Server Action.
  // Esto crea una nueva Server Action que solo espera VacanteFormData.
  const boundActualizarVacanteAction = actualizarVacanteAction.bind(null, vacanteId);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Editar Vacante</h1>
        <Link href={`/admin/vacantes/${vacanteId}/referidos`} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Ver Referidos
        </Link>
      </div>
      <VacanteForm
        initialData={vacante}
        onSubmitAction={boundActualizarVacanteAction} // Pasamos la acción bindeada
        isEditMode={true}
      />
    </div>
  );
}
