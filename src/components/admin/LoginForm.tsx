"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  CircularProgress
} from '@mui/material';
import { LoginOutlined } from '@mui/icons-material';
import { useAuthWithSnackbar } from '@/hooks/useApiWithSnackbar';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { isLoading, login } = useAuthWithSnackbar();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const result = await login(async () => {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // Mapear errores comunes a mensajes más amigables
        let errorMessage = 'Correo electrónico o contraseña incorrectos.';
        if (signInError.message.includes('Invalid login credentials')) {
          errorMessage = 'Correo electrónico o contraseña incorrectos.';
        } else {
          errorMessage = signInError.message;
        }
        throw new Error(errorMessage);
      }

      return { success: true };
    });

    if (result) {
      // Leer el parámetro 'next' de la URL
      const nextUrl = searchParams.get('next');
      let redirectTo = '/admin/dashboard'; // Fallback

      if (nextUrl) {
        // Validar que nextUrl sea una ruta relativa interna para evitar redirecciones abiertas
        // y que pertenezca a la sección de administración.
        if (nextUrl.startsWith('/admin/') || nextUrl.startsWith('/')) {
          try {
            // Decodificar en caso de que esté codificado como %2Fadmin%2Fvacantes
            const decodedNextUrl = decodeURIComponent(nextUrl);
            // Simple validación para asegurar que es una ruta admin
            if (decodedNextUrl.startsWith('/admin/')) {
              redirectTo = decodedNextUrl;
            } else {
              console.warn(`LoginForm: El parámetro 'next' (${decodedNextUrl}) no es una ruta de admin válida. Redirigiendo al dashboard.`);
            }
          } catch (e) {
            console.error("LoginForm: Error al decodificar nextUrl", e);
            // Mantener el fallback al dashboard
          }
        } else {
          console.warn(`LoginForm: El parámetro 'next' (${nextUrl}) no parece ser una ruta relativa interna. Redirigiendo al dashboard.`);
        }
      }

      // Primero redirigir, luego refrescar la nueva página.
      // Esto evita que el middleware redirija desde /admin/login al dashboard
      // antes de que hayamos tenido la oportunidad de ir a `redirectTo`.
      router.push(redirectTo);
      // Considerar si router.refresh() es necesario aquí o si la navegación a la nueva ruta
      // ya carga los datos frescos. Si la nueva página usa Server Components que dependen de la sesión,
      // un refresh podría ser útil, pero a menudo la navegación a una nueva ruta ya hace lo necesario.
      // Por ahora, lo comentaremos para ver el comportamiento, ya que el middleware se ejecutará en la nueva ruta.
      // router.refresh();

    } else {
      setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.50',
        py: 3
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={0}
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  color: 'white',
                  mb: 2
                }}
              >
                <LoginOutlined sx={{ fontSize: 32 }} />
              </Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 1
                }}
              >
                Admin Login
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 300, mx: 'auto' }}
              >
                Ingresa tus credenciales para acceder al panel de administración
              </Typography>
            </Box>

            {/* Form */}
            <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Correo Electrónico"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                id="password"
                name="password"
                label="Contraseña"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                sx={{ mb: 3 }}
              />

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    borderRadius: 2
                  }}
                >
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  position: 'relative'
                }}
              >
                {isLoading ? (
                  <>
                    <CircularProgress
                      size={20}
                      sx={{
                        color: 'white',
                        mr: 1
                      }}
                    />
                    Ingresando...
                  </>
                ) : (
                  'Ingresar'
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
