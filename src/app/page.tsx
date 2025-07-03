import { supabase } from '@/lib/supabaseClient';
import { Vacante } from '@/components/VacanteCard';
import React from 'react';
import VacanteCardClientWrapper from '@/components/VacanteCardClientWrapper';
import Link from 'next/link';
import { Box, Button, Container, Grid, Typography, AppBar, Toolbar, Paper } from '@mui/material'; // MUI imports

// Data fetching function remains the same
async function getActiveVacantes(): Promise<Vacante[]> {
  const { data, error } = await supabase
    .from('vacantes')
    .select(`
      id,
      titulo_puesto,
      departamento,
      modalidad,
      ubicacion,
      salario_rango_min,
      salario_rango_max,
      moneda,
      descripcion_puesto,
      tecnologias_requeridas,
      responsabilidades,
      requisitos,
      beneficios,
      fecha_publicacion,
      esta_activa
    `)
    .eq('esta_activa', true)
    .order('fecha_publicacion', { ascending: false });

  if (error) {
    console.error('Error fetching vacantes:', error);
    return [];
  }
  return data as Vacante[];
}

export default async function HomePage() {
  const vacantes = await getActiveVacantes();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' /* Using theme background */ }}>
      {/* Navigation Bar */}
      <AppBar position="sticky" sx={{ bgcolor: 'common.white', boxShadow: 1 }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Typography
              variant="h5"
              noWrap
              component={Link}
              href="/"
              sx={{
                fontWeight: 700,
                color: 'primary.main', // Using theme primary color
                textDecoration: 'none',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              T1Referidos
            </Typography>
            <Button
              variant="contained"
              component={Link}
              href="/admin/login"
              sx={{ fontWeight: 'bold' }}
            >
              Admin Login
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 4, md: 6 }, // Adjusted padding for the outer Box
          // bgcolor: 'secondary.main', // Will move this to the Paper or keep for full-width background
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg"> {/* Changed maxWidth to lg to match VacanteCards container */}
          <Paper
            elevation={3} // Add some shadow to make it look like a card
            sx={{
              p: { xs: 3, md: 4 }, // Padding inside the card
              textAlign: 'center',
              bgcolor: 'secondary.main', // Apply background to the Paper
              // maxWidth: 'md', // Control width if needed, but lg container should handle it
              mx: 'auto', // Center the paper if it's narrower than the container
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 'extrabold',
                color: 'primary.main',
                mb: 2,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              }}
            >
              Encuentra y Refiere Talento Excepcional
            </Typography>
            <Typography
              variant="h6"
              component="p"
              color="text.secondary"
              sx={{ mt: 2, mb: 4, maxWidth: '700px', mx: 'auto' }} // Keep inner text constrained if desired
            >
              Explora nuestras vacantes activas y ayúdanos a construir el mejor equipo. Tu red de contactos es invaluable para T1.
            </Typography>
          </Paper>
        </Container>
      </Box>

      {/* Main Content: Listado de Vacantes */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        {vacantes.length > 0 ? (
          <Grid container spacing={3}> {/* MUI Grid with spacing from theme */}
            {vacantes.map((vacante) => (
              <Grid size={{ xs: 12, sm: 12, md: 12 }} key={vacante.id}>
                <VacanteCardClientWrapper vacante={vacante} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper elevation={0} sx={{ textAlign: 'center', py: 8, bgcolor: 'transparent' }}>
            <Box sx={{ color: 'text.disabled', mb: 2 }}> {/* Using theme color for icon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ height: '3rem', width: '3rem', margin: 'auto' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </Box>
            <Typography variant="h5" component="h2" sx={{ mb: 1, fontWeight: 'semibold', color: 'text.primary' }}>
              No hay vacantes activas por el momento.
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              ¡Gracias por tu interés! Por favor, vuelve a revisar más tarde o contacta a RRHH.
            </Typography>
          </Paper>
        )}
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          textAlign: 'center',
          py: 3,
          mt: 'auto', // Pushes footer to bottom if content is short
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper' // Using theme paper background
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Plataforma de Referidos Internos T1Referidos &copy; {new Date().getFullYear()}
        </Typography>
      </Box>
    </Box>
  );
}
