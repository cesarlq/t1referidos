import LoginForm from '@/components/admin/LoginForm';
import React from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers'; // Necesario si queremos leer query params, aunque para sesión no directamente.

import LoginForm from '@/components/admin/LoginForm';
import React from 'react';
// Las siguientes importaciones están comentadas para el diagnóstico:
// import { createSupabaseServerClient } from '@/lib/supabase/server';
// import { redirect } from 'next/navigation';
// import { headers } from 'next/headers';

export const dynamic = 'force-dynamic'; // Mantenemos esto por si acaso

export default async function LoginPage() {
  // --- SECCIÓN DE DIAGNÓSTICO: headers() y getSession() completamente comentados ---
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
  // --- FIN SECCIÓN DE DIAGNÓSTICO ---

  return <LoginForm />;
}
