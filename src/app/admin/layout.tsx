import React from 'react';
import Link from 'next/link';

// export const dynamic = 'force-dynamic'; // Ya no es necesario aquí si el middleware maneja todo

// Definición del tipo UserRole (debería coincidir con tu enum/type en la DB)
// type UserRole = 'administrador' | 'referidor'; // Ya no es necesario aquí

// interface UserProfile { // Ya no es necesario aquí
//   id: string;
//   email?: string;
//   rol?: UserRole | null;
// }

export default function AdminLayout({ // Convertido a componente síncrono simple
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("AdminLayout: Rendering simple layout structure.");

  // El layout ahora solo proporciona la estructura visual.
  // Toda la lógica de autenticación/autorización se moverá al middleware.
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
