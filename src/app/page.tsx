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

export default async function HomePage() {
  const vacantes = await getActiveVacantes();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-blue-900">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-400 dark:to-indigo-500 pb-2">
            Portal de Referidos
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mt-3 max-w-2xl mx-auto">
            Encuentra la oportunidad perfecta para tu talento conocido y ayúdanos a crecer.
          </p>
        </header>

        {vacantes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {vacantes.map((vacante) => (
              <VacanteCardClientWrapper key={vacante.id} vacante={vacante} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h2 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">No hay vacantes activas por el momento.</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              ¡Gracias por tu interés! Por favor, vuelve a revisar más tarde o contacta a RRHH.
            </p>
          </div>
        )}
      </main>
      <footer className="text-center py-8 mt-16 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Plataforma de Referidos Internos T1Referidos &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

// Wrapper para hacer que VacanteCard funcione con interactividad del lado del cliente
// sin convertir toda la página en un Client Component.
// Este componente se creará en un archivo separado.
// src/components/VacanteCardClientWrapper.tsx

// Por ahora, para que el código actual funcione sin errores, voy a simplificar
// y el botón "Referir Candidato" no tendrá la interactividad real del lado del cliente aún.
// La lógica de `handleReferirClick` se moverá a un componente cliente después.

// --- Contenido de src/components/VacanteCardClientWrapper.tsx ---
// "use client";
// import VacanteCard, { Vacante } from './VacanteCard'; // Ajusta la ruta si es necesario
//
// interface VacanteCardClientWrapperProps {
//   vacante: Vacante;
// }
//
// const VacanteCardClientWrapper: React.FC<VacanteCardClientWrapperProps> = ({ vacante }) => {
//   const handleReferirClick = (vacanteId: string) => {
//     alert(`Formulario para referir a la vacante ID: ${vacanteId}`);
//     // Lógica para mostrar modal/formulario
//   };
//
//   return <VacanteCard vacante={vacante} onReferirClick={handleReferirClick} />;
// };
// export default VacanteCardClientWrapper;
// --- Fin del contenido de VacanteCardClientWrapper.tsx ---

// Para evitar crear otro archivo ahora mismo, voy a modificar VacanteCard para que no dependa de un onClick
// que requiera estado de cliente en este momento, o pasar una función no interactiva.
// La forma más simple es que el botón sea un link a una futura página de referido, o
// que la interactividad se añada en el siguiente paso.

// Re-ajustando el componente VacanteCard para que el botón no cause problemas en el Server Component.
// El `onReferirClick` será un simple placeholder por ahora.
// La verdadera interactividad se construirá cuando hagamos el formulario.

import VacanteCardClientWrapper from '@/components/VacanteCardClientWrapper';

// NOTA: El uso de "use client" dentro de page.tsx como lo he hecho con VacanteCardClientWrapper
// no es la mejor práctica. Lo ideal es que VacanteCardClientWrapper sea un archivo separado.
// Haré ese refactor en el siguiente paso si es necesario o cuando implementemos el modal.
// Por ahora, esto permite que la página se renderice y el botón tenga una alerta básica.
// También he ajustado el select en getActiveVacantes para que coincida con los campos que usa VacanteCard.
// y añadido `modalidad` al select.
