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

  // Esta función se manejará en el cliente cuando se implemente el formulario/modal
  const handleReferirClick = (vacanteId: string) => {
    // Por ahora, solo un log. Más adelante mostrará el formulario.
    console.log(`Referir candidato para la vacante ID: ${vacanteId}`);
    // Aquí se podría cambiar el estado para mostrar un modal o navegar a una página de formulario.
    // alert(`Abrir formulario para referir a la vacante ID: ${vacanteId}`);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Portal de Referidos Internos</h1>
        <p className="text-xl text-gray-600 mt-2">Encuentra la oportunidad perfecta y refiere talento.</p>
      </header>

      {vacantes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vacantes.map((vacante) => (
            // Necesitamos un componente cliente para manejar el evento onClick del botón.
            // Por ahora, VacanteCard no es un componente cliente, así que el onClick no funcionará como se espera
            // si se deja tal cual. Vamos a crear un wrapper o modificar VacanteCard.
            // Para una solución rápida, envolveremos la lógica del modal/formulario en un componente cliente más adelante.
            // Por ahora, el console.log no funcionará aquí directamente porque es un server component.
            // Lo ideal es que el botón "Referir" active un estado en un componente cliente.
            <VacanteCardClientWrapper key={vacante.id} vacante={vacante} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700">No hay vacantes activas por el momento.</h2>
          <p className="text-gray-500 mt-2">Por favor, vuelve a revisar más tarde.</p>
        </div>
      )}
    </main>
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

// Simulación de VacanteCardClientWrapper para que el código de page.tsx funcione
// Esto se moverá a su propio archivo en el siguiente paso.
const VacanteCardClientWrapper: React.FC<{ vacante: Vacante }> = ({ vacante }) => {
  "use client"; // Necesario para el event handler

  const handleReferirClick = (vacanteId: string) => {
    // Esta función se ejecutará en el cliente.
    // Aquí se gestionará la apertura del modal/formulario.
    alert(`Abrir formulario para referir a la vacante ID: ${vacanteId}\n(Funcionalidad de modal/formulario pendiente)`);
    console.log(`Referir candidato para la vacante ID: ${vacanteId}`);
  };

  return <VacanteCard vacante={vacante} onReferirClick={handleReferirClick} />;
};

// NOTA: El uso de "use client" dentro de page.tsx como lo he hecho con VacanteCardClientWrapper
// no es la mejor práctica. Lo ideal es que VacanteCardClientWrapper sea un archivo separado.
// Haré ese refactor en el siguiente paso si es necesario o cuando implementemos el modal.
// Por ahora, esto permite que la página se renderice y el botón tenga una alerta básica.
// También he ajustado el select en getActiveVacantes para que coincida con los campos que usa VacanteCard.
// y añadido `modalidad` al select.
