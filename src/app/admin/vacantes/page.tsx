import React from 'react';
import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Vacante } from '@/components/VacanteCard';
import { EyeIcon, PencilIcon, TrashIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { revalidatePath } from 'next/cache';
import DeleteVacanteForm from '@/components/admin/DeleteVacanteForm'; // Importar el nuevo componente

interface AdminVacante extends Vacante {
  vistas_count?: number;
  aplicaciones_count?: number;
  created_at?: string;
  updated_at?: string;
}

async function getTodasLasVacantes(): Promise<AdminVacante[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('vacantes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all vacantes for admin:', error);
    return [];
  }
  return data.map(item => ({
    ...item,
    modalidad: item.modalidad as 'remoto' | 'presencial' | 'hibrido',
    tecnologias_requeridas: item.tecnologias_requeridas || [],
  })) as AdminVacante[];
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
    <div className="bg-white shadow-lg rounded-xl p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">Gestionar Vacantes</h1>
        <Link
          href="/admin/vacantes/nueva"
          className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150 w-full sm:w-auto"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Agregar Nueva Vacante
        </Link>
      </div>

      {vacantes.length === 0 ? (
        <div className="text-center py-10">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h2 className="mt-2 text-xl font-semibold text-gray-700">No hay vacantes creadas.</h2>
          <p className="mt-1 text-sm text-gray-500">Comienza agregando una nueva vacante.</p>
      </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Título</th>
                <th scope="col" className="hidden md:table-cell px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Departamento</th>
                <th scope="col" className="hidden lg:table-cell px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Modalidad</th>
                <th scope="col" className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Estado</th>
                <th scope="col" className="hidden md:table-cell px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Publicada</th>
                <th scope="col" className="px-4 py-3 sm:px-6 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vacantes.map((vacante) => (
                <tr key={vacante.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{vacante.titulo_puesto}</div>
                    <div className="text-xs text-gray-500 lg:hidden">{vacante.departamento} - {vacante.modalidad}</div>
                  </td>
                  <td className="hidden md:table-cell px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-600">{vacante.departamento}</td>
                  <td className="hidden lg:table-cell px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-600">{vacante.modalidad}</td>
                  <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      vacante.esta_activa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {vacante.esta_activa ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-600">
                    {vacante.fecha_publicacion ? new Date(vacante.fecha_publicacion + 'T00:00:00').toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm font-medium text-center">
                    <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                      <Link
                        href={`/admin/vacantes/${vacante.id}/editar`}
                        className="text-indigo-600 hover:text-indigo-800 transition-colors"
                        title="Editar"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                      <form action={eliminarVacanteAction} method="POST" className="inline" onSubmit={(e) => {
                          if (!confirm('¿Estás seguro de que quieres eliminar esta vacante? Esta acción no se puede deshacer.')) {
                              e.preventDefault();
                          }
                      }}>
                          <input type="hidden" name="id" value={vacante.id} />
                          <button type="submit" className="text-red-600 hover:text-red-800 transition-colors" title="Eliminar">
                             <TrashIcon className="h-5 w-5" />
                          </button>
                      </form>
                      <Link
                        href={`/admin/vacantes/${vacante.id}/referidos`}
                        className="text-sky-600 hover:text-sky-800 transition-colors"
                        title="Ver Referidos"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
