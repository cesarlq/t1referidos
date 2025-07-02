import React from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

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
  // --- SECCIÓN DE DIAGNÓSTICO: headers() y pathname comentados ---
  // const headersList = headers();
  // const pathname = headersList.get('x-next-pathname') || headersList.get('next-url') || '';
  // console.log("AdminLayout Diag: Pathname (comentado):", pathname);
  // --- FIN SECCIÓN DE DIAGNÓSTICO ---

  // --- SECCIÓN DE DIAGNÓSTICO: Lógica de sesión Supabase ---
  // La condición if (pathname !== '/admin/login') está eliminada temporalmente.
  // La lógica de sesión se ejecuta para todas las rutas bajo /admin, incluyendo /admin/login.

  console.log("AdminLayout Diag: Intentando obtener sesión...");
  const supabase = createSupabaseServerClient();
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("AdminLayout Diag: Error al obtener la sesión:", sessionError.message);
    // No redirigir para aislar el error primario.
  } else if (!session) {
    console.log("AdminLayout Diag: No se encontró sesión.");
    // No redirigir. Si esto ocurre en /admin/login y causa un error de cookies(),
    // es una pista importante.
  } else {
    console.log("AdminLayout Diag: Sesión encontrada para el usuario:", session.user.email);
    // Lógica de roles (con redirecciones comentadas para evitar bucles durante el diagnóstico)
    const { data: userProfile, error: profileError } = await supabase
      .from('usuarios')
      .select('id, rol')
      .eq('id', session.user.id)
      .single<UserProfile>();

    if (profileError) {
      console.error("AdminLayout Diag: Error al obtener el perfil del usuario:", profileError.message);
      // await supabase.auth.signOut(); // Comentado para diagnóstico
      // return redirect('/admin/login?error=profile_error'); // Comentado para diagnóstico
    } else if (!userProfile || userProfile.rol !== 'administrador') {
      console.warn(`AdminLayout Diag: El usuario ${session.user.email} no tiene rol de administrador o perfil. Rol: ${userProfile?.rol}`);
      // await supabase.auth.signOut(); // Comentado para diagnóstico
      // return redirect('/admin/login?error=unauthorized'); // Comentado para diagnóstico
    } else {
      console.log("AdminLayout Diag: El usuario es administrador.");
    }
  }
  // --- FIN SECCIÓN DE DIAGNÓSTICO ---

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
