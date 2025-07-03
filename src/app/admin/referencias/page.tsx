import React from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeftIcon, DocumentTextIcon, EnvelopeIcon, PhoneIcon, UserCircleIcon, BriefcaseIcon, CalendarDaysIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Definición del tipo Referencia (ajustar según sea necesario)
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
  fecha_referencia: string; // ISO string date
  estado_proceso?: string | null;
  // Podríamos añadir el título de la vacante aquí si decidimos hacer un join o mapeo
  // vacante_titulo?: string;
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
      fecha_referencia,
      estado_proceso
    `)
    .order('fecha_referencia', { ascending: false });

  if (error) {
    console.error('Error fetching referencias:', error.message);
    return [];
  }
  // Aquí podríamos potencialmente hacer otra llamada para obtener los títulos de las vacantes
  // y mapearlos a las referencias si fuera necesario.
  return data as Referencia[];
}

export default async function AdminReferenciasPage() {
  const referencias = await getReferencias();

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Referencias Enviadas</h1>
        <Link href="/admin/dashboard" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Volver al Dashboard
        </Link>
      </div>

      {referencias.length === 0 ? (
        <div className="text-center py-12">
          <InformationCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600">No hay referencias enviadas por el momento.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {referencias.map((ref) => (
            <div key={ref.id} className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-5 sm:p-6">
                <div className="sm:flex sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-indigo-700 hover:text-indigo-800">
                      {ref.candidato_nombre}
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Referido por: {ref.referidor_nombre}
                    </p>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-4">
                    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${
                      ref.estado_proceso === 'recibido' ? 'bg-blue-100 text-blue-800' :
                      ref.estado_proceso === 'en revisión' ? 'bg-yellow-100 text-yellow-800' :
                      ref.estado_proceso === 'contactado' ? 'bg-green-100 text-green-800' :
                      ref.estado_proceso === 'rechazado' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ref.estado_proceso ? ref.estado_proceso.charAt(0).toUpperCase() + ref.estado_proceso.slice(1) : 'Desconocido'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700 flex items-center"><UserCircleIcon className="h-5 w-5 mr-2 text-gray-400" />Candidato:</p>
                    <p className="text-gray-600 ml-7">{ref.candidato_nombre}</p>
                    <p className="text-gray-600 ml-7 flex items-center"><EnvelopeIcon className="h-4 w-4 mr-1.5 text-gray-400" />{ref.candidato_email}</p>
                    {ref.candidato_telefono && <p className="text-gray-600 ml-7 flex items-center"><PhoneIcon className="h-4 w-4 mr-1.5 text-gray-400" />{ref.candidato_telefono}</p>}
                     {ref.candidato_linkedin && (
                      <p className="text-gray-600 ml-7">
                        <a href={ref.candidato_linkedin.startsWith('http') ? ref.candidato_linkedin : `https://${ref.candidato_linkedin}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 hover:underline">
                          Perfil de LinkedIn
                        </a>
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 flex items-center"><UserCircleIcon className="h-5 w-5 mr-2 text-gray-400" />Referidor:</p>
                    <p className="text-gray-600 ml-7">{ref.referidor_nombre}</p>
                    <p className="text-gray-600 ml-7 flex items-center"><EnvelopeIcon className="h-4 w-4 mr-1.5 text-gray-400" />{ref.referidor_email}</p>
                  </div>
                   <div>
                    <p className="font-medium text-gray-700 flex items-center"><BriefcaseIcon className="h-5 w-5 mr-2 text-gray-400" />Vacante ID:</p>
                    <p className="text-gray-600 ml-7">{ref.vacante_id}</p>
                    {/* Futuro: Mostrar título de vacante aquí */}
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 flex items-center"><CalendarDaysIcon className="h-5 w-5 mr-2 text-gray-400" />Fecha de Referencia:</p>
                    <p className="text-gray-600 ml-7">
                      {format(new Date(ref.fecha_referencia), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="font-medium text-gray-700">Relación con el candidato:</p>
                  <p className="text-gray-600 text-sm">{ref.relacion_con_candidato}</p>
                </div>

                <div className="mt-3">
                  <p className="font-medium text-gray-700">Justificación de la recomendación:</p>
                  <p className="text-gray-600 text-sm whitespace-pre-wrap">{ref.justificacion_recomendacion}</p>
                </div>

                {ref.cv_url && ref.cv_filename && (
                  <div className="mt-5 pt-4 border-t border-gray-200">
                    <a
                      href={ref.cv_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <DocumentTextIcon className="h-5 w-5 mr-2" />
                      Ver CV ({ref.cv_filename})
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
