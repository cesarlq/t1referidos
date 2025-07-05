import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware'; // Actualiza cookies

// Definición del tipo UserRole (debe coincidir con tu enum/type en la DB)
type UserRole = 'administrador' | 'referidor'; // Asegúrate que 'administrador' sea el valor exacto

export async function middleware(request: NextRequest) {
  // 1. Actualizar/refrescar la sesión y obtener la respuesta base.
  // `updateSession` se encarga de las cookies de Supabase y devuelve una NextResponse.
  // La request original puede o no ser modificada por updateSession directamente,
  // pero la `response` que devuelve tendrá las cookies correctas para enviar al cliente.
  // Para leer el estado *después* de updateSession, usaremos un nuevo cliente Supabase
  // con las cookies de la `request` (que `updateSession` debería haber actualizado si es necesario).
  const response = await updateSession(request);

  // Para crear un nuevo cliente Supabase que pueda leer el estado de sesión actualizado,
  // necesitamos asegurarnos de que las cookies en la `request` que le pasamos
  // sean las más recientes. `updateSession` se encarga de esto.
  // Si `updateSession` modifica `request.cookies` internamente, está bien.
  // Si no, clonamos la request ANTES de updateSession si fuera necesario, pero
  // la implementación estándar de Supabase middleware actualiza la request que se le pasa.

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key not defined for main middleware logic.");
    return response; // Devuelve la respuesta original de updateSession
  }

  // Crear un cliente Supabase para leer el estado de sesión DESPUÉS de updateSession.
  // Es crucial que las funciones get/set/remove aquí operen sobre la `request`
  // y la `response` que estamos construyendo.
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        // Esta request es la original, pero `updateSession` ya debería haberla modificado
        // si la sesión cambió. Aquí solo reflejamos en la response.
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        response.cookies.set({ name, value: '', ...options });
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  console.log(`Middleware: Path: ${pathname}, User: ${user?.email || 'No user'}`);

  // Proteger rutas /admin/*
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      if (user) {
        const { data: userProfile } = await supabase
          .from('usuarios')
          .select('rol')
          .eq('id', user.id)
          .single<{ rol: UserRole | null }>();

        console.log(`Middleware: User ${user.email} on /admin/login, rol: ${userProfile?.rol}`);
        if (userProfile?.rol === 'administrador') {
          console.log("Middleware: Admin on login page, redirecting to dashboard.");
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
      }
      // Si no hay usuario, o si el usuario logueado no es admin, permitir acceso a /admin/login
      console.log("Middleware: Allowing access to /admin/login.");
      return response;
    }

    // Para todas las demás rutas /admin/* (ej. /admin/dashboard, /admin/vacantes)
    if (!user) {
      console.log("Middleware: No user, redirecting to login for path:", pathname);
      return NextResponse.redirect(new URL(`/admin/login?next=${encodeURIComponent(pathname)}`, request.url));
    }

    // Usuario autenticado, verificar rol de administrador
    const { data: userProfile, error: profileError } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id', user.id)
      .single<{ rol: UserRole | null }>();

    if (profileError || !userProfile || userProfile.rol !== 'administrador') {
      console.warn(`Middleware: User ${user.email} not admin or profile error for ${pathname}. Rol: ${userProfile?.rol}, Error: ${profileError?.message}`);
      // Opcional: invalidar sesión si el perfil es incorrecto o hay error.
      // await supabase.auth.signOut();
      // response.cookies.delete('sb-auth-token'); // Ejemplo si el nombre de la cookie es conocido y fijo
      return NextResponse.redirect(new URL('/admin/login?error=unauthorized_access', request.url));
    }

    console.log(`Middleware: Admin user ${user.email} accessing ${pathname}. Allowing.`);
    // Si es admin, permitir acceso a la ruta solicitada
    return response;
  }

  // Para todas las demás rutas no /admin/*
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
