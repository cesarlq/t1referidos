import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { debugLog, debugError, checkEnvironmentVariables } from '@/lib/debug';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  debugLog('API /vacantes/[id] GET called');
  
  // Verificar variables de entorno
  if (!checkEnvironmentVariables()) {
    return NextResponse.json({ 
      success: false, 
      error: 'Configuración del servidor incorrecta' 
    }, { status: 500 });
  }

  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID de vacante requerido' }, { status: 400 });
    }

    debugLog('Fetching vacante with ID:', id);
    
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

    const { data: vacante, error } = await supabase
      .from('vacantes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      debugError('Supabase fetch error:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json({ 
          success: false, 
          error: 'Vacante no encontrada' 
        }, { status: 404 });
      }
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    debugLog('Vacante fetched successfully:', { id: vacante?.id });
    return NextResponse.json({ success: true, data: vacante });
  } catch (error) {
    debugError('API Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Error interno del servidor' 
    }, { status: 500 });
  }
}
