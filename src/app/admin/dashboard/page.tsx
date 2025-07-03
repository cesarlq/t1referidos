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

// --- SECCIÓN DE DIAGNÓSTICO: DEFINICIONES DE FUNCIONES COMENTADAS ---
// // Funciones para obtener métricas
// async function getTotalReferencias(): Promise<number> {
//   const supabase = createSupabaseServerClient();
//   const { count, error } = await supabase
//     .from('referencias')
//     .select('*', { count: 'exact', head: true });

//   if (error) {
//     console.error('Error fetching total referencias:', error);
//     return 0;
//   }
//   return count || 0;
// }

interface VacanteConteoReferencias { // Esta interfaz puede quedar por si se usa en el render
  id: string;
  titulo_puesto: string;
  conteo_referencias: number;
}

// async function getVacantesConMasReferencias(limit: number = 5): Promise<VacanteConteoReferencias[]> {
//   const supabase = createSupabaseServerClient();
//   // Supabase no soporta joins complejos o group by directos en el select de esta forma para conteos agrupados fácilmente
//   // sin usar RPC (Remote Procedure Calls) o vistas.
//   // Una forma es obtener todas las referencias y agrupar en JS, o crear una vista/función en Supabase.
//   // Para simplificar por ahora, podríamos hacer un RPC o una query más compleja si fuera necesario.
//   // Alternativa: contar referencias por vacante_id.

//   // Usaremos una función RPC si la tenemos, o una aproximación.
//   // Por ahora, vamos a hacer una llamada que traiga los conteos de referencias por vacante.
//   // Esto idealmente se haría con una vista o una función en la base de datos para optimizar.
//   // Ejemplo de RPC (necesitarías crear esta función en tu SQL de Supabase):
//   /*
//     create or replace function get_top_vacantes_por_referencias(limit_count integer)
//     returns table (
//         id uuid,
//         titulo_puesto text,
//         conteo_referencias bigint
//     )
//     language sql
//     as $$
//         select v.id, v.titulo_puesto, count(r.id) as conteo_referencias
//         from vacantes v
//         join referencias r on v.id = r.vacante_id
//         group by v.id, v.titulo_puesto
//         order by conteo_referencias desc
//         limit limit_count;
//     $$;
//   */
//   // Si la función RPC 'get_top_vacantes_por_referencias' existe:
//   // const { data, error } = await supabase.rpc('get_top_vacantes_por_referencias', { limit_count: limit });

//   // Solución sin RPC por ahora (menos eficiente si hay muchas referencias/vacantes):
//   // 1. Obtener todas las referencias
//   // 2. Agruparlas por vacante_id en código
//   // 3. Obtener los detalles de esas vacantes
//   // Esto puede ser muy ineficiente.

//   // Una mejor aproximación sin RPC directo, pero aún no ideal para Supabase JS SDK directamente:
//   // Obtener todas las vacantes y luego para cada una, contar sus referencias. Aún ineficiente.

//   // La forma más directa con Supabase es usar una vista que ya tenga el conteo.
//   // Supongamos que tienes una vista `vacantes_con_conteo_referencias` que incluye `id, titulo_puesto, conteo_referencias`.
//   // CREATE VIEW vacantes_con_conteo_referencias AS
//   // SELECT v.id, v.titulo_puesto, COUNT(r.id) AS conteo_referencias
//   // FROM vacantes v
//   // LEFT JOIN referencias r ON v.id = r.vacante_id
//   // GROUP BY v.id, v.titulo_puesto;

//   // Usando la vista (si la creas):
//   // const { data, error } = await supabase
//   //   .from('vacantes_con_conteo_referencias')
//   //   .select('id, titulo_puesto, conteo_referencias')
//   //   .order('conteo_referencias', { ascending: false })
//   //   .limit(limit);

//   // Por ahora, y para mantenerlo simple sin modificar la DB desde aquí,
//   // devolveré un array vacío. Esta es una limitación de no poder ejecutar SQL complejo directamente.
//   // En un proyecto real, la creación de la vista o función RPC es la mejor solución.
//   console.warn("getVacantesConMasReferencias no está implementado de forma óptima sin una vista o RPC en la DB. Devolviendo array vacío.");
//   return [];

//   // Si tuvieramos los datos:
//   // if (error) {
//   //   console.error('Error fetching top vacantes:', error);
//   //   return [];
//   // }
//   // return data as VacanteConteoReferencias[];
// }
// --- FIN SECCIÓN DE DIAGNÓSTICO ---


export default async function AdminDashboardPage() {
  // const supabase = createSupabaseServerClient(); // Eliminado
  // const { data: { session } } = await supabase.auth.getSession(); // Eliminado

  // if (!session) { // Eliminado - El middleware protege esta ruta
  //   redirect('/admin/login');
  // }

  // Temporalmente, no llamaremos a estas funciones para evitar errores de cookies()
  // hasta que refactoricemos cómo obtienen datos (ej. Route Handlers o pasados como props).
  const totalReferencias = 0; // await getTotalReferencias(); // Comentado
  const topVacantes: VacanteConteoReferencias[] = []; // await getVacantesConMasReferencias(5); // Comentado

  // Obtener nombre del admin (opcional) - Comentado temporalmente
  // const { data: userProfile } = await supabase // Necesitaría `session` que ya no tenemos aquí
  //   .from('usuarios')
  //   .select('nombre, email')
  //   .eq('id', session.user.id) // session no está definido aquí
  //   .single();

  const adminName = "Administrador"; // Placeholder // userProfile?.nombre || session?.user?.email || "Admin";

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
          {/* <p className="text-gray-600 mt-1">Bienvenido, {adminName}.</p> */}
          <p className="text-gray-600 mt-1">Bienvenido. (Nombre de admin deshabilitado temporalmente)</p>
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

          {/* Placeholder para otras métricas */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
             <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <BriefcaseIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Vacantes Activas</p>
                {/* Necesitaríamos una función para esto */}
                <p className="text-3xl font-bold text-gray-800">N/A</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Vacantes con más Referencias (si hay datos) */}
      {topVacantes.length > 0 && (
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
