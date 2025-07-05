import React from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Vacante } from '@/components/VacanteCard';
import ReferidosPageClient from '../../../../../components/admin/ReferidosPageClient';

// Definimos la interfaz para los datos de una Referencia
export interface Referencia {
  id: string;
  created_at: string;
  vacante_id: string;
  referidor_nombre: string;
  referidor_email: string;
  referidor_empresa?: string | null;
  candidato_nombre: string;
  candidato_email: string;
  candidato_telefono?: string | null;
  candidato_linkedin?: string | null;
  relacion_con_candidato: string;
  años_conociendo?: number | null;
  justificacion_recomendacion: string;
  fortalezas_principales?: string[] | null;
  cv_url?: string | null;
  cv_filename?: string | null;
}

interface VerReferidosPageProps {
  params: Promise<{ id: string }>;
}

// Función para obtener los referidos de una vacante específica
async function getReferidosPorVacante(vacanteId: string): Promise<Referencia[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('referencias')
    .select(`
      id,
      created_at,
      vacante_id,
      referidor_nombre,
      referidor_email,
      referidor_empresa,
      candidato_nombre,
      candidato_email,
      candidato_telefono,
      candidato_linkedin,
      relacion_con_candidato,
      justificacion_recomendacion,
      fortalezas_principales,
      cv_url,
      cv_filename
    `)
    .eq('vacante_id', vacanteId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching referrals by vacanteId:', error);
    return [];
  }
  
  // Mapear los datos para incluir años_conociendo si existe
  const mappedData = data?.map(item => ({
    ...item,
    años_conociendo: (item as Record<string, unknown>).años_conociendo as number | null || null
  })) || [];
  
  return mappedData as Referencia[];
}

async function getVacanteById(id: string): Promise<Partial<Vacante> | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('vacantes')
    .select('id, titulo_puesto, departamento, modalidad')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching vacante by id for referrals page:', error);
    return null;
  }
  return data as Partial<Vacante>;
}

export default async function VerReferidosPage({ params }: VerReferidosPageProps) {
  const { id: vacanteId } = await params;
  const vacante = await getVacanteById(vacanteId);
  const referidos = await getReferidosPorVacante(vacanteId);

  return (
    <ReferidosPageClient 
      vacante={vacante}
      referidos={referidos}
      vacanteId={vacanteId}
    />
  );
}
