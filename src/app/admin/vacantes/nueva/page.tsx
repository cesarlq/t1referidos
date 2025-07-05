/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import VacanteForm, { VacanteFormData } from '@/components/admin/VacanteForm';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Server Action para crear la vacante
async function crearVacanteAction(data: VacanteFormData): Promise<{ success: boolean; error?: string; data?: any }> {
  "use server";

  const supabase = createSupabaseServerClient();

  // Validación de sesión y rol (aunque el layout ya protege, es bueno tener doble check en actions)
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { success: false, error: 'No autenticado.' };
  const { data: userProfile } = await supabase.from('usuarios').select('rol').eq('id', session.user.id).single();
  if (userProfile?.rol !== 'administrador') return { success: false, error: 'No autorizado.'};

  // Preparar datos para insertar, asegurándose de que los campos opcionales sean null si están vacíos
  const vacanteToInsert = {
    ...data,
    // Los campos numéricos y de fecha ya se manejan en el componente VacanteForm para ser null o valor
    // Asegurarse que tecnologias_requeridas sea un array, incluso si está vacío.
    tecnologias_requeridas: data.tecnologias_requeridas.filter(t => t.trim() !== ''),
    creada_por_admin_id: session.user.id, // Asociar con el admin que la crea
  };

  const { data: newData, error } = await supabase
    .from('vacantes')
    .insert(vacanteToInsert)
    .select() // Para obtener los datos insertados, opcional
    .single(); // Asumimos que insertamos una y queremos que devuelva esa una

  if (error) {
    console.error("Error creating vacante:", error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/vacantes'); // Actualizar la lista de vacantes
  return { success: true, data: newData };
  // La redirección se maneja en el cliente a través del router.push en VacanteForm
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
