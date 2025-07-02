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
  const headersList = headers();
  const pathname = headersList.get('x-next-pathname') || headersList.get('next-url') || ''; // 'next-url' es para versiones más nuevas o edge

  // Solo aplicar lógica de autenticación y rol si NO estamos en la página de login
  if (pathname !== '/admin/login') {
    const supabase = createSupabaseServerClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Error getting session in admin layout:", sessionError);
      return redirect('/admin/login?error=session_error');
    }

    if (!session) {
      return redirect('/admin/login');
    }

    const { data: userProfile, error: profileError } = await supabase
      .from('usuarios')
      .select('id, rol')
      .eq('id', session.user.id)
      .single<UserProfile>();

    if (profileError) {
      console.error("Error fetching user profile in admin layout:", profileError);
      await supabase.auth.signOut();
      return redirect('/admin/login?error=profile_error');
    }

    if (!userProfile || userProfile.rol !== 'administrador') {
      console.warn(`User ${session.user.email} does not have admin role or profile. Role: ${userProfile?.rol}`);
      await supabase.auth.signOut();
      return redirect('/admin/login?error=unauthorized');
    }
  }

  // Renderizar el contenido (hijos) para todas las rutas bajo /admin,
  // incluyendo /admin/login si no se redirigió antes.
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
