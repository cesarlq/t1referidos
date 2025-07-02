import LoginForm from '@/components/admin/LoginForm';
import React from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers'; // Necesario si queremos leer query params, aunque para sesión no directamente.

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  // Verificamos si hay un pathname para asegurar que no estamos en una situación inesperada
  // Esto también ayuda a Next.js a tratar esto como dinámico si es necesario.
  const headerList = headers();
  const pathname = headerList.get('x-next-pathname') || headerList.get('next-url') || '';

  // Solo para estar seguros, aunque el layout ya no debería proteger esta página.
  // Si estamos en /admin/login, procedemos a verificar la sesión.
  if (pathname === '/admin/login') {
    const supabase = createSupabaseServerClient();
    const { data: { session } } = await supabase.auth.getSession();

    // Si ya hay sesión, redirigir al dashboard de admin
    // También podríamos verificar el rol aquí si quisiéramos ser extra seguros,
    // pero el AdminLayout ya se encarga de eso para las rutas protegidas.
    if (session) {
      // Antes de redirigir, es buena práctica verificar el rol si el dashboard es específico de admin
      // Para este ejemplo, asumimos que si hay sesión, puede ir al dashboard
      // y el AdminLayout se encargará de la protección de roles allí.
      redirect('/admin/dashboard');
    }
  }

  // Si no hay sesión, o si por alguna razón el pathname no es /admin/login (poco probable aquí),
  // mostrar el formulario de login.
  return <LoginForm />;
}
