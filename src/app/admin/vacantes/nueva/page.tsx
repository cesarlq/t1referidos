/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import VacanteForm, { VacanteFormData } from '@/components/admin/VacanteForm';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Server Action para crear la vacante
async function crearVacanteAction(data: VacanteFormData): Promise<{ success: boolean; error?: string; data?: any }> {
  "use server";

  try {
    console.log('🚀 Server Action iniciada - crearVacanteAction');
    console.log('📝 Datos recibidos:', JSON.stringify(data, null, 2));

    // Verificar variables de entorno
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Variables de entorno de Supabase no encontradas');
      return { success: false, error: 'Error de configuración del servidor' };
    }

    console.log('✅ Variables de entorno OK');

    const supabase = createSupabaseServerClient();

    // Validación de sesión y rol
    console.log('🔐 Verificando sesión...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Error al obtener sesión:', sessionError);
      return { success: false, error: 'Error de autenticación' };
    }

    if (!session) {
      console.error('❌ No hay sesión activa');
      return { success: false, error: 'No autenticado.' };
    }

    console.log('✅ Sesión válida para usuario:', session.user.email);

    // Verificar rol de administrador
    console.log('👤 Verificando rol de usuario...');
    const { error: profileError } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('❌ Error al obtener perfil de usuario:', profileError);
      return { success: false, error: 'Error al verificar permisos' };
    }


    console.log('✅ Usuario es administrador');

    // Preparar datos para insertar
    console.log('📋 Preparando datos para insertar...');
    const vacanteToInsert = {
      ...data,
      tecnologias_requeridas: data.tecnologias_requeridas.filter(t => t.trim() !== ''),
      creada_por_admin_id: session.user.id,
    };

    console.log('📝 Datos preparados:', JSON.stringify(vacanteToInsert, null, 2));

    // Insertar en la base de datos
    console.log('💾 Insertando en base de datos...');
    const { data: newData, error } = await supabase
      .from('vacantes')
      .insert(vacanteToInsert)
      .select()
      .single();

    if (error) {
      console.error('❌ Error al insertar vacante:', error);
      return { success: false, error: `Error de base de datos: ${error.message}` };
    }

    console.log('✅ Vacante creada exitosamente:', newData);

    revalidatePath('/admin/vacantes');
    return { success: true, data: newData };

  } catch (error) {
    console.error('💥 Error inesperado en crearVacanteAction:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return { success: false, error: `Error del servidor: ${errorMessage}` };
  }
}


export default function NuevaVacantePage() {
  // El layout /admin/layout.tsx ya protege esta página.
  return (
    <div>
      <VacanteForm
        onSubmitAction={crearVacanteAction}
        isEditMode={false}
      />
    </div>
  );
}
