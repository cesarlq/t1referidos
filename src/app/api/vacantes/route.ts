import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { VacanteFormData } from '@/components/admin/VacanteForm';
import { debugLog, debugError, checkEnvironmentVariables } from '@/lib/debug';

export async function POST(request: NextRequest) {
  debugLog('API /vacantes POST called');
  
  // Verificar variables de entorno
  if (!checkEnvironmentVariables()) {
    return NextResponse.json({ 
      success: false, 
      error: 'Configuración del servidor incorrecta' 
    }, { status: 500 });
  }

  try {
    const data: VacanteFormData = await request.json();
    debugLog('Request data received', { 
      titulo_puesto: data.titulo_puesto,
      departamento: data.departamento,
      modalidad: data.modalidad 
    });
    
    const supabase = createSupabaseServerClient();

    // Validación de sesión y rol
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      debugError('Session error:', sessionError);
      return NextResponse.json({ success: false, error: 'Error de sesión.' }, { status: 401 });
    }
    
    if (!session) {
      debugLog('No session found');
      return NextResponse.json({ success: false, error: 'No autenticado.' }, { status: 401 });
    }

    debugLog('Session found for user:', session.user.email);

    const { data: userProfile, error: profileError } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      debugError('Profile error:', profileError);
      return NextResponse.json({ success: false, error: 'Error al verificar perfil.' }, { status: 500 });
    }

    debugLog('User profile:', { rol: userProfile?.rol });

    if (userProfile?.rol !== 'administrador') {
      debugLog('User is not admin');
      return NextResponse.json({ success: false, error: 'No autorizado.' }, { status: 403 });
    }

    // Preparar datos para insertar
    const vacanteToInsert = {
      ...data,
      tecnologias_requeridas: data.tecnologias_requeridas.filter(t => t.trim() !== ''),
      creada_por_admin_id: session.user.id,
    };

    debugLog('Inserting vacante:', { 
      titulo_puesto: vacanteToInsert.titulo_puesto,
      creada_por_admin_id: vacanteToInsert.creada_por_admin_id 
    });

    const { data: newData, error } = await supabase
      .from('vacantes')
      .insert(vacanteToInsert)
      .select()
      .single();

    if (error) {
      debugError('Supabase insert error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    debugLog('Vacante created successfully:', { id: newData?.id });
    return NextResponse.json({ success: true, data: newData });
  } catch (error) {
    debugError('API Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Error interno del servidor' 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  debugLog('API /vacantes PUT called');
  
  // Verificar variables de entorno
  if (!checkEnvironmentVariables()) {
    return NextResponse.json({ 
      success: false, 
      error: 'Configuración del servidor incorrecta' 
    }, { status: 500 });
  }

  try {
    const { id, ...data }: { id: string } & VacanteFormData = await request.json();
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID de vacante requerido' }, { status: 400 });
    }

    debugLog('Update request data received', { 
      id,
      titulo_puesto: data.titulo_puesto,
      departamento: data.departamento,
      modalidad: data.modalidad 
    });
    
    const supabase = createSupabaseServerClient();

    // Validación de sesión y rol
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      debugError('Session error:', sessionError);
      return NextResponse.json({ success: false, error: 'Error de sesión.' }, { status: 401 });
    }
    
    if (!session) {
      debugLog('No session found');
      return NextResponse.json({ success: false, error: 'No autenticado.' }, { status: 401 });
    }

    debugLog('Session found for user:', session.user.email);

    const { data: userProfile, error: profileError } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      debugError('Profile error:', profileError);
      return NextResponse.json({ success: false, error: 'Error al verificar perfil.' }, { status: 500 });
    }

    debugLog('User profile:', { rol: userProfile?.rol });

    if (userProfile?.rol !== 'administrador') {
      debugLog('User is not admin');
      return NextResponse.json({ success: false, error: 'No autorizado.' }, { status: 403 });
    }

    // Preparar datos para actualizar
    const vacanteToUpdate = {
      ...data,
      tecnologias_requeridas: data.tecnologias_requeridas.filter(t => t.trim() !== ''),
    };

    debugLog('Updating vacante:', { 
      id,
      titulo_puesto: vacanteToUpdate.titulo_puesto 
    });

    const { data: updatedData, error } = await supabase
      .from('vacantes')
      .update(vacanteToUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      debugError('Supabase update error:', error);
      if (error.code === 'PGRST116' && error.details?.includes('0 rows')) {
        return NextResponse.json({ 
          success: false, 
          error: 'La vacante no fue encontrada o ya ha sido eliminada.' 
        }, { status: 404 });
      }
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    debugLog('Vacante updated successfully:', { id: updatedData?.id });
    return NextResponse.json({ success: true, data: updatedData });
  } catch (error) {
    debugError('API Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Error interno del servidor' 
    }, { status: 500 });
  }
}
