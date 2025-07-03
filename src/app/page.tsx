import { supabase } from '@/lib/supabaseClient';
import VacanteCard, { Vacante } from '@/components/VacanteCard';
import React from 'react';

// Tipos para los enums de Supabase (si los usas directamente en el frontend)
// Sería ideal generarlos con `supabase gen types typescript > types/supabase.ts`
// y luego importarlos. Por ahora, los defino de forma simplificada si es necesario.
// export type UserRole = 'referidor' | 'administrador';
// export type ProcesoEstado = 'recibido' | 'en revisión' | 'entrevista' | 'contratado' | 'rechazado';


// Esta función se ejecutará en el servidor para obtener los datos
async function getActiveVacantes(): Promise<Vacante[]> {
  const { data, error } = await supabase
    .from('vacantes')
    .select(`
      id,
      titulo_puesto,
      departamento,
      modalidad,
      ubicacion,
      salario_rango_min,
      salario_rango_max,
      moneda,
      descripcion_puesto,
      tecnologias_requeridas,
      responsabilidades,
      requisitos,
      beneficios,
      fecha_publicacion,
      esta_activa
    `) // Selecciona los campos que necesitas para la tarjeta
    .eq('esta_activa', true)
    .order('fecha_publicacion', { ascending: false });

  if (error) {
    console.error('Error fetching vacantes:', error);
    // En un caso real, podrías manejar el error de forma más elegante
    // o lanzar el error para que un ErrorBoundary lo capture.
    return [];
  }

  // Asegurarse de que los datos coincidan con la interfaz Vacante.
  // Supabase podría devolver todos los campos de la tabla si no especificas el select.
  // El select anterior ya limita los campos, pero es buena práctica validar/mapear.
  return data as Vacante[];
}

import Link from 'next/link';
import VacanteCardClientWrapper from '@/components/VacanteCardClientWrapper';
import { Vacante } from '@/components/VacanteCard'; // Asegúrate que la interfaz Vacante esté disponible
import { supabase } from '@/lib/supabaseClient'; // Para getActiveVacantes

// Esta función se ejecutará en el servidor para obtener los datos
async function getActiveVacantes(): Promise<Vacante[]> {
  const { data, error } = await supabase
    .from('vacantes')
    .select(`
      id,
      titulo_puesto,
      departamento,
      modalidad,
      ubicacion,
      salario_rango_min,
      salario_rango_max,
      moneda,
      descripcion_puesto,
      tecnologias_requeridas,
      responsabilidades,
      requisitos,
      beneficios,
      fecha_publicacion,
      esta_activa
    `)
    .eq('esta_activa', true)
    .order('fecha_publicacion', { ascending: false });

  if (error) {
    console.error('Error fetching vacantes:', error);
    return [];
  }
  return data as Vacante[];
}


export default async function HomePage() {
  const vacantes = await getActiveVacantes();

  return (
    // Aplicando fuente Manrope (ya debería estar en body, pero por si acaso) y un fondo neutro.
    // El color de texto base será text_primary_dark
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-text_primary_dark">
      {/* Navegación Superior y Título del Sitio */}
      {/* Fondo blanco/gris oscuro, sombra sutil. Padding ajustado. */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {/* Título del sitio con color primario */}
              <Link href="/" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
                T1Referidos
              </Link>
            </div>
            <div className="flex items-center">
              {/* Botón Admin Login con estilos del theme */}
              <Link
                href="/admin/login"
                className="px-4 py-2 bg-primary hover:bg-primary_hover text-white text-sm font-bold rounded-lg shadow-none transition-colors duration-150"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Hero Section */}
        {/* Padding vertical aumentado, borde inferior con color del theme. Texto principal con color oscuro. */}
        <header className="py-10 md:py-16 text-center border-b border-border_input dark:border-gray-700 mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-5xl font-extrabold text-gray-900 dark:text-white pb-3 leading-tight">
            Encuentra y Refiere Talento Excepcional
          </h1>
          <p className="text-base sm:text-lg text-text_primary_dark dark:text-gray-300 mt-4 max-w-xl mx-auto">
            Explora nuestras vacantes activas y ayúdanos a construir el mejor equipo. Tu red de contactos es invaluable.
          </p>
        </header>

        {/* Listado de Vacantes */}
        {vacantes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Reducido el gap un poco */}
            {vacantes.map((vacante) => (
              <VacanteCardClientWrapper key={vacante.id} vacante={vacante} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <h2 className="mt-5 text-xl font-semibold text-gray-900 dark:text-white">No hay vacantes activas por el momento.</h2>
            <p className="text-text_primary_dark dark:text-gray-400 mt-2 text-sm">
              ¡Gracias por tu interés! Por favor, vuelve a revisar más tarde o contacta a RRHH.
            </p>
          </div>
        )}
      </main>
      <footer className="text-center py-8 mt-12 md:mt-16 border-t border-border_input dark:border-gray-700">
        <p className="text-xs text-text_primary_dark dark:text-gray-400">
          Plataforma de Referidos Internos T1Referidos &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
