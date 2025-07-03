import React from 'react';
import VacanteForm, { VacanteFormData } from '@/components/admin/VacanteForm';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Vacante } from '@/components/VacanteCard'; // Reutilizamos interfaz
import { revalidatePath } from 'next/cache';

interface EditarVacantePageProps {
  params: { id: string };
}

// Server Action para actualizar la vacante
async function actualizarVacanteAction(id: string, data: VacanteFormData): Promise<{ success: boolean; error?: string; data?: any }> {
  "use server";

  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { success: false, error: 'No autenticado.' };
  const { data: userProfile } = await supabase.from('usuarios').select('rol').eq('id', session.user.id).single();
  if (userProfile?.rol !== 'administrador') return { success: false, error: 'No autorizado.'};

  const vacanteToUpdate = {
    ...data,
    tecnologias_requeridas: data.tecnologias_requeridas.filter(t => t.trim() !== ''),
    // El campo updated_at se actualiza automáticamente por el trigger en la DB
  };

  const { data: updatedData, error } = await supabase
    .from('vacantes')
    .update(vacanteToUpdate)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating vacante:", error);
    return { success: false, error: error.message };
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

  // Creamos una función wrapper para pasar el id a la server action,
  // ya que el componente VacanteForm no conoce el ID directamente.
  const submitActionWithId = async (formData: VacanteFormData) => {
    return actualizarVacanteAction(vacanteId, formData);
  };

  return (
    <div>
      <VacanteForm
        initialData={vacante}
        onSubmitAction={submitActionWithId}
        isEditMode={true}
      />
    </div>
  );
}
