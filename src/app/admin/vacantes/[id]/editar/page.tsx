'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import VacanteForm, { VacanteFormData } from '@/components/admin/VacanteForm';
import { Vacante } from '@/components/VacanteCard';
import Link from 'next/link';
import { CircularProgress, Alert, Box } from '@mui/material';

// Función para actualizar la vacante usando API route
async function actualizarVacanteAction(id: string, data: VacanteFormData): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const response = await fetch('/api/vacantes', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...data }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      return { success: false, error: result.error || 'Error al actualizar la vacante' };
    }

    return result;
  } catch (error) {
    console.error('Error calling API:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error de conexión' 
    };
  }
}

// Función para obtener la vacante por ID
async function getVacanteById(id: string): Promise<{ success: boolean; data?: Partial<Vacante>; error?: string }> {
  try {
    const response = await fetch(`/api/vacantes/${id}`);
    const result = await response.json();
    
    if (!response.ok) {
      return { success: false, error: result.error || 'Error al cargar la vacante' };
    }

    return result;
  } catch (error) {
    console.error('Error fetching vacante:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error de conexión' 
    };
  }
}

export default function EditarVacantePage() {
  const params = useParams();
  const vacanteId = params.id as string;
  
  const [vacante, setVacante] = useState<Partial<Vacante> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVacante = async () => {
      if (!vacanteId) return;
      
      setLoading(true);
      const result = await getVacanteById(vacanteId);
      
      if (result.success && result.data) {
        setVacante(result.data);
        setError(null);
      } else {
        setError(result.error || 'Error al cargar la vacante');
        setVacante(null);
      }
      
      setLoading(false);
    };

    fetchVacante();
  }, [vacanteId]);

  // Función que bindea el ID a la acción de actualizar
  const boundActualizarVacanteAction = (data: VacanteFormData) => {
    return actualizarVacanteAction(vacanteId, data);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !vacante) {
    return (
      <div className="p-6 bg-white shadow-md rounded-lg">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Vacante no encontrada'}
        </Alert>
        <p className="text-gray-600 mt-2">No se pudo cargar la información de la vacante para editar.</p>
        <Link href="/admin/vacantes" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
          Volver al listado de vacantes
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Editar Vacante</h1>
        <Link href={`/admin/vacantes/${vacanteId}/referidos`} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Ver Referidos
        </Link>
      </div>
      <VacanteForm
        initialData={vacante}
        onSubmitAction={boundActualizarVacanteAction}
        isEditMode={true}
      />
    </div>
  );
}
