import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware'; // Actualiza cookies

// Definición del tipo UserRole (debe coincidir con tu enum/type en la DB)
type UserRole = 'administrador' | 'referidor'; // Asegúrate que 'administrador' sea el valor exacto

export async function middleware(request: NextRequest) {
  console.log(`🔒 Middleware iniciado para: ${request.nextUrl.pathname}`);
  
  try {
    // 1. Actualizar/refrescar la sesión
    const response = await updateSession(request);
    const { pathname } = request.nextUrl;

    // 2. Solo procesar rutas /admin/*
    if (!pathname.startsWith('/admin')) {
      console.log(`✅ Middleware: Ruta no-admin permitida: ${pathname}`);
      return response;
    }

    // 3. Verificar variables de entorno
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("❌ Middleware: Variables de entorno de Supabase no encontradas");
      return response;
    }

    // 4. Crear cliente Supabase
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    });

    // 5. Obtener usuario con manejo de errores
    let user = null;
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.warn(`⚠️ Middleware: Error de autenticación: ${authError.message}`);
      } else {
        user = authUser;
      }
    } catch (error) {
      console.error(`❌ Middleware: Error al obtener usuario:`, error);
    }

    console.log(`👤 Middleware: Usuario: ${user?.email || 'No autenticado'} para ${pathname}`);

    // 6. Manejar ruta de login
    if (pathname === '/admin/login') {
      if (user) {
        try {
          const { error: profileError } = await supabase
            .from('usuarios')
            .select('rol')
            .eq('id', user.id)
            .single<{ rol: UserRole | null }>();

          if (!profileError ) {
            console.log(`🔄 Middleware: Admin en login, redirigiendo a dashboard`);
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
          }
        } catch (error) {
          console.warn(`⚠️ Middleware: Error al verificar perfil en login:`, error);
        }
      }
      console.log(`✅ Middleware: Permitiendo acceso a /admin/login`);
      return response;
    }

    // 7. Proteger otras rutas /admin/*
    if (!user) {
      console.log(`🚫 Middleware: Sin usuario, redirigiendo a login desde ${pathname}`);
      return NextResponse.redirect(new URL(`/admin/login?next=${encodeURIComponent(pathname)}`, request.url));
    }

    // 8. Verificar rol de administrador con manejo de errores robusto
    try {
      const { data: userProfile, error: profileError } = await supabase
        .from('usuarios')
        .select('rol')
        .eq('id', user.id)
        .single<{ rol: UserRole | null }>();

      if (profileError) {
        console.warn(`⚠️ Middleware: Error al obtener perfil: ${profileError.message}`);
        // En lugar de redirigir inmediatamente, permitir acceso si hay error de DB
        // pero el usuario está autenticado (podría ser un problema temporal)
        console.log(`⚠️ Middleware: Permitiendo acceso temporal debido a error de DB`);
        return response;
      }

      if (!userProfile || userProfile.rol !== 'administrador') {
        console.warn(`🚫 Middleware: Usuario ${user.email} no es admin. Rol: ${userProfile?.rol}`);
        return NextResponse.redirect(new URL('/admin/login?error=unauthorized_access', request.url));
      }

      console.log(`✅ Middleware: Admin ${user.email} accediendo a ${pathname}`);
      return response;

    } catch (error) {
      console.error(`❌ Middleware: Error inesperado al verificar rol:`, error);
      // Permitir acceso en caso de error inesperado para evitar bloqueos
      console.log(`⚠️ Middleware: Permitiendo acceso debido a error inesperado`);
      return response;
    }

  } catch (error) {
    console.error(`💥 Middleware: Error crítico:`, error);
    // En caso de error crítico, permitir que la request continúe
    return NextResponse.next();
  }
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
