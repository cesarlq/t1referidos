// src/app/admin/vacantes/[id]/referidos/page.tsx
import React from 'react';
import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Vacante } from '@/components/VacanteCard'; // Reutilizamos interfaz

interface VerReferidosPageProps {
  params: { id: string };
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
      <p className="text-gray-600">
        Los referidos para esta vacante (ID: {vacanteId}) se mostrarán aquí.
      </p>
      {/* Aquí se implementará la lógica para mostrar la lista de referidos */}
    </div>
  );
}
