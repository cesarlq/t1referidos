import LoginForm from '@/components/admin/LoginForm';
import React from 'react';

// Esta página puede ser un Server Component si no necesita interactividad directa
// o si el LoginForm maneja toda la lógica del cliente.
// Si queremos verificar si el usuario ya está logueado y redirigir,
// necesitaríamos lógica del lado del servidor aquí o en un layout.

// Por ahora, la mantenemos simple. El LoginForm es un Client Component.
export default function LoginPage() {
  return <LoginForm />;
}
