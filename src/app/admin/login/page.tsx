import LoginForm from '@/components/admin/LoginForm';
import React from 'react';

// Las importaciones para Supabase, redirect y headers están intencionalmente comentadas
// para el paso actual de diagnóstico.
// import { createSupabaseServerClient } from '@/lib/supabase/server';
// import { redirect } from 'next/navigation';
// import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  // Toda la lógica de obtención de pathname y sesión está comentada para el diagnóstico.
  // console.log("LoginPage Diag: Renderizando LoginForm...");
  // const headerList = headers();
  // const pathname = headerList.get('x-next-pathname') || headerList.get('next-url') || '';

  // const supabase = createSupabaseServerClient();
  // const { data: { session } } = await supabase.auth.getSession();

  // if (session) {
  //   console.log("LoginPage Diag: Sesión encontrada, intentando redirigir (comentado)");
  //   // redirect('/admin/dashboard');
  // } else {
  //   console.log("LoginPage Diag: No se encontró sesión.");
  // }

  return <LoginForm />;
}
