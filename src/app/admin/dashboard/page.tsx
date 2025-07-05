import React from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  Stack,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import {
  BarChartOutlined,
  PeopleOutlined,
  WorkOutlineOutlined,
  BusinessOutlined,
  VisibilityOutlined,
  LogoutOutlined
} from '@mui/icons-material';

// Componente para el botón de Logout
const LogoutButton = () => {
  const handleLogout = async () => {
    "use server";
    const supabase = createSupabaseServerClient();
    await supabase.auth.signOut();
    redirect('/admin/login');
  };

  return (
    <form action={handleLogout}>
      <Button
        type="submit"
        variant="outlined"
        color="error"
        startIcon={<LogoutOutlined />}
        sx={{
          textTransform: 'none',
          fontWeight: 500
        }}
      >
        Cerrar Sesión
      </Button>
    </form>
  );
};

// Funciones para obtener métricas
async function getTotalReferencias(): Promise<number> {
  const supabase = createSupabaseServerClient();
  const { count, error } = await supabase
    .from('referencias')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error fetching total referencias:', error.message);
    return 0;
  }
  return count || 0;
}

async function getTotalVacantesActivas(): Promise<number> {
  const supabase = createSupabaseServerClient();
  const { count, error } = await supabase
    .from('vacantes')
    .select('*', { count: 'exact', head: true })
    .eq('esta_activa', true);

  if (error) {
    console.error('Error fetching active vacantes count:', error.message);
    return 0;
  }
  return count || 0;
}

interface VacanteConteoReferencias {
  id: string;
  titulo_puesto: string;
  conteo_referencias: number;
}

export default async function AdminDashboardPage() {
  const totalReferencias = await getTotalReferencias();
  const totalVacantesActivas = await getTotalVacantesActivas();
  const topVacantes: VacanteConteoReferencias[] = [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                mb: 0.5
              }}
            >
              Panel de Administración
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontWeight: 400 }}
            >
              Bienvenido al sistema de gestión de referidos T1
            </Typography>
          </Box>
          <LogoutButton />
        </Stack>
        <Divider />
      </Box>

      {/* Métricas */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <BarChartOutlined sx={{ color: 'primary.main' }} />
          <Typography
            variant="h5"
            component="h2"
            sx={{ fontWeight: 600, color: 'text.primary' }}
          >
            Métricas Clave
          </Typography>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            },
            gap: 3
          }}
        >
          {/* Total de Referencias */}
          <Card
            elevation={0}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                borderColor: 'primary.main'
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: 'primary.main',
                    color: 'white'
                  }}
                >
                  <PeopleOutlined />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500, mb: 0.5 }}
                  >
                    Total de Referencias
                  </Typography>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{ fontWeight: 700, color: 'text.primary' }}
                  >
                    {totalReferencias}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Vacantes Activas */}
          <Card
            elevation={0}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                borderColor: 'success.main'
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: 'success.main',
                    color: 'white'
                  }}
                >
                  <WorkOutlineOutlined />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500, mb: 0.5 }}
                  >
                    Vacantes Activas
                  </Typography>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{ fontWeight: 700, color: 'text.primary' }}
                  >
                    {totalVacantesActivas}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Vacantes Populares (si hay datos) */}
      {topVacantes.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}
          >
            Vacantes Más Populares
          </Typography>
          <Card
            elevation={0}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 2
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <List>
                {topVacantes.map((vacante, index) => (
                  <React.Fragment key={vacante.id}>
                    <ListItem sx={{ py: 2, px: 3 }}>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 500, color: 'text.primary' }}
                          >
                            {vacante.titulo_puesto}
                          </Typography>
                        }
                      />
                      <Chip
                        label={`${vacante.conteo_referencias} Referencias`}
                        color="primary"
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </ListItem>
                    {index < topVacantes.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Accesos Directos */}
      <Box>
        <Typography
          variant="h5"
          component="h2"
          sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}
        >
          Accesos Directos
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)'
            },
            gap: 3
          }}
        >
          <Card
            component={Link}
            href="/admin/vacantes"
            elevation={0}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                borderColor: 'primary.main',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: 'primary.main',
                    color: 'white'
                  }}
                >
                  <BusinessOutlined />
                </Box>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{ fontWeight: 600, color: 'text.primary' }}
                >
                  Gestionar Vacantes
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.6 }}
              >
                Crear, editar y eliminar listados de vacantes disponibles
              </Typography>
            </CardContent>
          </Card>

          <Card
            component={Link}
            href="/admin/referencias"
            elevation={0}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                borderColor: 'info.main',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: 'info.main',
                    color: 'white'
                  }}
                >
                  <VisibilityOutlined />
                </Box>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{ fontWeight: 600, color: 'text.primary' }}
                >
                  Ver Referencias
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.6 }}
              >
                Revisar todas las postulaciones referidas y sus detalles
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
