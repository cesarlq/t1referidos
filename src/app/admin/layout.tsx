import React from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

// Definición del tipo UserRole (debería coincidir con tu enum/type en la DB)
type UserRole = 'administrador' | 'referidor'; // Asegúrate que 'administrador' sea el valor exacto en tu DB

interface UserProfile {
  id: string;
  email?: string;
  rol?: UserRole | null;
  // otros campos de tu tabla usuarios si los necesitas
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServerClient();
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("Error getting session in admin layout:", sessionError);
    // Podrías redirigir a una página de error o al login.
    redirect('/admin/login?error=session_error');
  }

  if (!session) {
    // Si no hay sesión, redirigir a login.
    // Asegurarse que la página de login no esté bajo este layout para evitar bucle.
    // La ruta de login es /admin/login, así que necesitamos una condición para no redirigir si ya estamos ahí.
    // Esto se maneja mejor si el login está fuera de /admin/* o si el middleware lo gestiona.
    // Por ahora, si estamos en /admin/login, este layout no debería aplicarse o el `children` sería la página de login.
    // Next.js es inteligente con los layouts, el layout de /admin no se aplica a /admin/login si login tiene su propio layout o es una page.tsx simple.
    redirect('/admin/login');
  }

  // Si hay sesión, verificar el rol del usuario.
  // Hacemos una consulta a la tabla `usuarios` para obtener el rol.
  const { data: userProfile, error: profileError } = await supabase
    .from('usuarios') // Nombre de tu tabla de perfiles/usuarios
    .select('id, rol') // Selecciona los campos que necesitas, especialmente 'rol'
    .eq('id', session.user.id)
    .single<UserProfile>(); // Especifica el tipo esperado

  if (profileError) {
    console.error("Error fetching user profile in admin layout:", profileError);
    // Puede que el perfil no exista aún si el usuario se acaba de registrar y no hay un trigger/función que lo cree.
    // O un error de red.
    // Redirigir a login con un error o a una página de error específica.
    await supabase.auth.signOut(); // Cerrar sesión si el perfil no se puede cargar
    redirect('/admin/login?error=profile_error');
  }

  if (!userProfile || userProfile.rol !== 'administrador') {
    // Si no tiene perfil o el rol no es 'administrador', cerrar sesión y redirigir.
    console.warn(`User ${session.user.email} does not have admin role or profile. Role: ${userProfile?.rol}`);
    await supabase.auth.signOut();
    redirect('/admin/login?error=unauthorized');
  }

  // Si todo está bien (sesión activa y rol de administrador), renderizar el contenido.
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Aquí podrías tener una barra de navegación común para el panel de admin */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="font-bold text-xl text-indigo-600">
                Admin Panel T1Referidos
              </Link>
            </div>
            {/* Podríamos poner el botón de logout aquí también o en cada página */}
          </div>
        </div>
      </nav>
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
