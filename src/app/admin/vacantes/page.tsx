import React from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Vacante } from '@/components/VacanteCard';
import { revalidatePath } from 'next/cache';
import VacantesPageClient from '../../../components/admin/VacantesPageClient';

interface AdminVacante extends Vacante {
  vistas_count?: number;
  aplicaciones_count?: number;
  referencias_count?: number;
  created_at?: string;
  updated_at?: string;
}

async function getTodasLasVacantes(): Promise<AdminVacante[]> {
  const supabase = createSupabaseServerClient();
  
  // Obtener todas las vacantes
  const { data: vacantesData, error: vacantesError } = await supabase
    .from('vacantes')
    .select('*')
    .order('created_at', { ascending: false });

  if (vacantesError) {
    console.error('Error fetching vacantes for admin:', vacantesError);
    return [];
  }

  // Obtener conteos de referencias para cada vacante
  const vacantesWithCounts = await Promise.all(
    vacantesData.map(async (vacante) => {
      const { count, error: countError } = await supabase
        .from('referencias')
        .select('*', { count: 'exact', head: true })
        .eq('vacante_id', vacante.id);

      if (countError) {
        console.error(`Error counting referencias for vacante ${vacante.id}:`, countError);
      }

      return {
        ...vacante,
        modalidad: vacante.modalidad as 'remoto' | 'presencial' | 'hibrido',
        tecnologias_requeridas: vacante.tecnologias_requeridas || [],
        referencias_count: count || 0,
      };
    })
  );

  return vacantesWithCounts as AdminVacante[];
}

async function eliminarVacanteAction(formData: FormData) {
  "use server";
  const id = formData.get('id') as string;
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No autenticado.');
  const { data: userProfile } = await supabase.from('usuarios').select('rol').eq('id', session.user.id).single();
  if (userProfile?.rol !== 'administrador') throw new Error('No autorizado.');

  if (!id) {
    console.error('ID de vacante no proporcionado para eliminar.');
    return;
  }

  const { error } = await supabase.from('vacantes').delete().match({ id });

  if (error) {
    console.error('Error deleting vacante:', error);
    return;
  }
  revalidatePath('/admin/vacantes');
}

export default async function AdminVacantesPage() {
  const vacantes = await getTodasLasVacantes();

  return (
    <VacantesPageClient 
      vacantes={vacantes} 
      eliminarVacanteAction={eliminarVacanteAction}
    />
  );
}
