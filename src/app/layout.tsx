import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope as FontManrope } from "next/font/google"; // Importar Manrope
import "./globals.css";
import ThemeRegistry from './ThemeRegistry'; // Import the new client component
import { SnackbarProvider } from '@/contexts/SnackbarContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Configurar Manrope
const manrope = FontManrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'], // Especificar los pesos que se usarán
  display: 'swap',
});

export const metadata: Metadata = {
  title: "T1Referidos - Portal de Referencias", // Actualizado para el proyecto
  description: "Plataforma interna de referencias para reclutamiento.", // Actualizado
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es"><body>
        <ThemeRegistry>
          <SnackbarProvider>
            <div className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} font-sans antialiased`}>
              {children}
            </div>
          </SnackbarProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
