import LoginForm from '@/components/admin/LoginForm';
import React from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
// cookies ya no es necesario importarlo aquí directamente si createSupabaseServerClient lo maneja

export const dynamic = 'force-dynamic';

// Definición simple de UserRole para esta página, o podría importarse si está centralizada
type UserRole = 'administrador' | 'referidor';

export default async function LoginPage() {
  // createSupabaseServerClient obtiene cookies internamente
  const supabase = createSupabaseServerClient();

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("LoginPage: Error al obtener la sesión:", sessionError.message);
    // Continuar para mostrar el formulario de login si hay error de sesión
  }

  if (session) {
    // Verificar si el usuario es administrador.
    // El middleware ya hace esto, pero aquí es una doble verificación
    // o para el caso en que el middleware no haya redirigido aún.
    const { data: userProfile, error: profileError } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id', session.user.id)
      .single<{ rol: UserRole | null }>();

    if (profileError) {
      console.warn("LoginPage: Error al obtener el perfil del usuario:", profileError.message);
      // Si hay error de perfil pero hay sesión, es ambiguo.
      // Podríamos dejar que el middleware maneje la redirección final,
      // o redirigir a dashboard como un intento.
      // Por ahora, si es admin, redirigimos.
    }

    if (userProfile?.rol === 'administrador') {
      // Si el usuario ya tiene una sesión activa y es administrador,
      // redirigirlo al dashboard. El middleware también tiene una lógica similar.
      console.log("LoginPage: Sesión de administrador activa encontrada, redirigiendo a /admin/dashboard.");
      redirect('/admin/dashboard');
    }
    // Si tiene sesión pero no es admin, o el rol es nulo/desconocido,
    // se mostrará el formulario de login. El middleware se encargará de denegar acceso
    // a otras rutas de admin si intenta navegar a ellas.
  }

  // Si no hay sesión, o si la sesión no es de un administrador (y no fue redirigido),
  // se renderiza el LoginForm.
  return <LoginForm />;
}
