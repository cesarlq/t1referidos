import React from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation'; // Aunque las redirecciones estén comentadas, la importación puede estar
import Link from 'next/link';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

// Definición del tipo UserRole (debería coincidir con tu enum/type en la DB)
type UserRole = 'administrador' | 'referidor';

interface UserProfile {
  id: string;
  email?: string;
  rol?: UserRole | null;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const pathname = headersList.get('next-url') || ''; // Usar 'next-url'
  console.log("AdminLayout Current Pathname:", pathname);

  if (pathname !== '/admin/login') {
    console.log("AdminLayout: Path is NOT /admin/login. Proceeding with session check.");
    const supabase = createSupabaseServerClient();
    console.log("AdminLayout: Attempting to get session (protected route)...");
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("AdminLayout: Error getting session (protected route):", sessionError.message);
      // return redirect('/admin/login?error=session_error'); // Mantener comentado
    } else if (!session) {
      console.log("AdminLayout: No session found (protected route).");
      // return redirect('/admin/login'); // Mantener comentado
    } else {
      console.log("AdminLayout: Session found for user (protected route):", session.user.email);
      const { data: userProfile, error: profileError } = await supabase
        .from('usuarios')
        .select('id, rol')
        .eq('id', session.user.id)
        .single<UserProfile>();

      if (profileError) {
        console.error("AdminLayout: Error fetching user profile (protected route):", profileError.message);
        // await supabase.auth.signOut(); // Mantener comentado
        // return redirect('/admin/login?error=profile_error'); // Mantener comentado
      } else if (!userProfile || userProfile.rol !== 'administrador') {
        console.warn(`AdminLayout: User ${session.user.email} is not admin or no profile (protected route). Role: ${userProfile?.rol}`);
        // await supabase.auth.signOut(); // Mantener comentado
        // return redirect('/admin/login?error=unauthorized'); // Mantener comentado
      } else {
        console.log("AdminLayout: User is admin (protected route).");
      }
    }
  } else {
    console.log("AdminLayout: Path IS /admin/login. Skipping session check in layout.");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="font-bold text-xl text-indigo-600">
                Admin Panel T1Referidos
              </Link>
            </div>
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
