import React from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import ReferenciasPageClient from '@/components/admin/ReferenciasPageClient';

// Definición del tipo Referencia
interface Referencia {
  id: string;
  vacante_id: string;
  referidor_nombre: string;
  referidor_email: string;
  candidato_nombre: string;
  candidato_email: string;
  candidato_telefono?: string | null;
  candidato_linkedin?: string | null;
  relacion_con_candidato: string;
  justificacion_recomendacion: string;
  cv_url?: string | null;
  cv_filename?: string | null;
  fecha_referencia: string;
  estado_proceso?: string | null;
}

async function getReferencias(): Promise<Referencia[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('referencias')
    .select(`
      id,
      vacante_id,
      referidor_nombre,
      referidor_email,
      candidato_nombre,
      candidato_email,
      candidato_telefono,
      candidato_linkedin,
      relacion_con_candidato,
      justificacion_recomendacion,
      cv_url,
      cv_filename,
      created_at,
      estado_proceso
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching referencias:', error.message);
    return [];
  }

  // Mapear created_at a fecha_referencia para compatibilidad
  const mappedData = data?.map(item => ({
    ...item,
    fecha_referencia: item.created_at
  })) || [];

  return mappedData as Referencia[];
}

export default async function AdminReferenciasPage() {
  const referencias = await getReferencias();

  return (
    <ReferenciasPageClient referencias={referencias} />
  );
}
