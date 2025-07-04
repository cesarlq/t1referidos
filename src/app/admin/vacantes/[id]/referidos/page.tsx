// src/app/admin/vacantes/[id]/referidos/page.tsx
import React from 'react';
import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Vacante } from '@/components/VacanteCard'; // Reutilizamos interfaz

// Definimos la interfaz para los datos de una Referencia
interface Referencia {
  id: string;
  created_at: string; // Supabase suele añadir este campo
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
  // Podríamos añadir un campo 'estado' si existe en la tabla 'referencias'
  // estado?: 'pendiente' | 'en revisión' | 'contactado' | 'descartado' | 'contratado';
}

interface VerReferidosPageProps {
  params: { id: string };
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
      años_conociendo,
      justificacion_recomendacion,
      fortalezas_principales,
      cv_url,
      cv_filename
    `)
    .eq('vacante_id', vacanteId)
    .order('created_at', { ascending: false }); // Mostrar los más recientes primero

  if (error) {
    console.error('Error fetching referrals by vacanteId:', error);
    return []; // Devolver un array vacío en caso de error
  }
  return data as Referencia[];
}

async function getVacanteById(id: string): Promise<Partial<Vacante> | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('vacantes')
    .select('id, titulo_puesto') // Solo seleccionamos lo necesario
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching vacante by id for referrals page:', error);
    return null;
  }
  return data as Partial<Vacante>;
}

export default async function VerReferidosPage({ params }: VerReferidosPageProps) {
  const vacanteId = params.id;
  const vacante = await getVacanteById(vacanteId);
  const referidos = await getReferidosPorVacante(vacanteId);

  if (!vacante) {
    return (
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-xl font-semibold text-red-600">Vacante no encontrada</h1>
        <p className="text-gray-600 mt-2">No se pudo cargar la información de la vacante.</p>
        <Link href="/admin/vacantes" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
          Volver al listado de vacantes
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Referidos para: {vacante.titulo_puesto || 'Vacante'}</h1>
        <Link href={`/admin/vacantes/${vacanteId}/editar`} className="text-indigo-600 hover:text-indigo-800">
          Volver a editar vacante
        </Link>
      </div>
      <p className="text-gray-600 mb-6">
        A continuación se listan los candidatos referidos para esta vacante.
      </p>
      {referidos.length === 0 ? (
        <p className="text-gray-500">No hay referidos para esta vacante aún.</p>
      ) : (
        <div className="space-y-6">
          {referidos.map((referido) => (
            <div key={referido.id} className="bg-gray-50 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-indigo-700">{referido.candidato_nombre}</h3>
              <p className="text-sm text-gray-600">Email: {referido.candidato_email}</p>
              {referido.candidato_telefono && <p className="text-sm text-gray-600">Teléfono: {referido.candidato_telefono}</p>}
              {referido.candidato_linkedin && (
                <p className="text-sm text-gray-600">
                  LinkedIn: <a href={referido.candidato_linkedin} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">{referido.candidato_linkedin}</a>
                </p>
              )}
              <hr className="my-3" />
              <p className="text-sm text-gray-800"><strong>Referido por:</strong> {referido.referidor_nombre} ({referido.referidor_email})</p>
              {referido.referidor_empresa && <p className="text-sm text-gray-600">Empresa (Referidor): {referido.referidor_empresa}</p>}
              <p className="text-sm text-gray-600"><strong>Relación con candidato:</strong> {referido.relacion_con_candidato}</p>
              {referido.años_conociendo !== null && <p className="text-sm text-gray-600">Años conociéndolo/a: {referido.años_conociendo}</p>}
              <p className="text-sm text-gray-600 mt-2"><strong>Justificación:</strong></p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{referido.justificacion_recomendacion}</p>
              {referido.fortalezas_principales && referido.fortalezas_principales.length > 0 && (
                <>
                  <p className="text-sm text-gray-600 mt-2"><strong>Fortalezas principales:</strong></p>
                  <ul className="list-disc list-inside pl-4 text-sm text-gray-700">
                    {referido.fortalezas_principales.map((f, index) => <li key={index}>{f}</li>)}
                  </ul>
                </>
              )}
              {referido.cv_url && (
                <p className="mt-3">
                  <a
                    href={referido.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-indigo-500 text-white px-3 py-1 rounded text-sm hover:bg-indigo-600"
                  >
                    Ver CV {referido.cv_filename ? `(${referido.cv_filename})` : ''}
                  </a>
                </p>
              )}
              <p className="text-xs text-gray-500 mt-3">
                Enviado: {new Date(referido.created_at).toLocaleDateString()} {new Date(referido.created_at).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
