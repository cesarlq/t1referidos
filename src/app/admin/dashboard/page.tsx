import React from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ChartBarIcon, UsersIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// Componente para el botón de Logout
const LogoutButton = () => {
  const handleLogout = async () => {
    "use server";
    const supabase = createSupabaseServerClient();
    await supabase.auth.signOut();
    redirect('/admin/login');
  };

  return (
    <form action={handleLogout}>
      <button
        type="submit"
        className="px-4 py-2 bg-red-600 text-white font-semibold text-sm rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition ease-in-out duration-150"
      >
        Cerrar Sesión
      </button>
    </form>
  );
};

// Funciones para obtener métricas
async function getTotalReferencias(): Promise<number> {
  const supabase = createSupabaseServerClient();
  const { count, error } = await supabase
    .from('referencias')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error fetching total referencias:', error.message);
    return 0;
  }
  return count || 0;
}

async function getTotalVacantesActivas(): Promise<number> {
  const supabase = createSupabaseServerClient();
  const { count, error } = await supabase
    .from('vacantes')
    .select('*', { count: 'exact', head: true })
    .eq('esta_activa', true);

  if (error) {
    console.error('Error fetching active vacantes count:', error.message);
    return 0;
  }
  return count || 0;
}

interface VacanteConteoReferencias {
  id: string;
  titulo_puesto: string;
  conteo_referencias: number;
}

// La función getVacantesConMasReferencias sigue comentada porque requiere una vista o RPC para ser eficiente,
// lo cual está fuera del alcance de esta modificación directa de archivo.
// async function getVacantesConMasReferencias(limit: number = 5): Promise<VacanteConteoReferencias[]> {
//   // ... (implementación original o mejorada con RPC/vista)
//   console.warn("getVacantesConMasReferencias no está implementado de forma óptima sin una vista o RPC en la DB. Devolviendo array vacío.");
//   return [];
// }


export default async function AdminDashboardPage() {
  // Las llamadas a la base de datos se hacen aquí directamente.
  const totalReferencias = await getTotalReferencias();
  const totalVacantesActivas = await getTotalVacantesActivas();

  // La lógica para topVacantes sigue como placeholder ya que su implementación eficiente es más compleja.
  const topVacantes: VacanteConteoReferencias[] = []; // await getVacantesConMasReferencias(5);

  // El nombre del admin también se puede obtener si es necesario, pero se mantiene el placeholder por simplicidad
  // ya que el foco está en las métricas principales.
  // const adminName = "Administrador";

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
          <p className="text-gray-600 mt-1">Bienvenido.</p>
        </div>
        <LogoutButton />
      </div>

      {/* Sección de Métricas */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <ChartBarIcon className="h-6 w-6 mr-2 text-indigo-600" />
          Métricas Clave
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total de Referidos */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <UsersIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total de Referencias</p>
                <p className="text-3xl font-bold text-gray-800">{totalReferencias}</p>
              </div>
            </div>
          </div>

          {/* Vacantes Activas */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
             <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <BriefcaseIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Vacantes Activas</p>
                <p className="text-3xl font-bold text-gray-800">{totalVacantesActivas}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Vacantes con más Referencias (si hay datos) */}
      {topVacantes.length > 0 && ( // Esta sección probablemente no se mostrará hasta que topVacantes se implemente
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Vacantes Más Populares (por Referencias)</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ul className="divide-y divide-gray-200">
              {topVacantes.map((vacante) => (
                <li key={vacante.id} className="py-3 flex justify-between items-center">
                  <span className="text-gray-800 font-medium">{vacante.titulo_puesto}</span>
                  <span className="text-indigo-600 font-semibold bg-indigo-100 px-2 py-1 rounded-full text-sm">
                    {vacante.conteo_referencias} Referencias
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Accesos Directos */}
      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Accesos Directos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/admin/vacantes" className="block p-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-colors">
                <h3 className="font-semibold text-lg">Gestionar Vacantes</h3>
                <p className="text-sm opacity-90">Crear, editar y eliminar listados de vacantes.</p>
            </Link>
            {/* <Link href="/admin/referencias" className="block p-6 bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow-md transition-colors">
                <h3 className="font-semibold text-lg">Ver Referencias</h3>
                <p className="text-sm opacity-90">Revisar y gestionar todas las referencias enviadas.</p>
            </Link> */}
        </div>
      </section>

    </div>
  );
}
