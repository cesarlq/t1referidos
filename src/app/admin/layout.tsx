"use client";

import Image from 'next/image'
import React from 'react';
import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  Stack,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  DashboardOutlined,
  WorkOutlineOutlined,
  PeopleOutlined,
  LogoutOutlined,
  MenuOutlined
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useAuthWithSnackbar } from '@/hooks/useApiWithSnackbar';
import  T1ReferidosIcon  from '@/assets/svg-icons/T1Referidos.svg';

export const dynamic = 'force-dynamic';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const { logout } = useAuthWithSnackbar();

  const handleLogout = async () => {
    await logout(async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
      return { success: true };
    });
    
    router.push('/admin/login');
    router.refresh();
  };

  const navigationItems = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: <DashboardOutlined />
    },
    {
      label: 'Vacantes',
      href: '/admin/vacantes',
      icon: <WorkOutlineOutlined />
    },
    {
      label: 'Referencias',
      href: '/admin/referencias',
      icon: <PeopleOutlined />
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* AppBar */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: 'white',
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
          <Container maxWidth="xl" sx={{ px: '0 !important' }}>
            <Stack 
              direction="row" 
              alignItems="center" 
              justifyContent="space-between"
              sx={{ width: '100%' }}
            >
              {/* Logo/Brand */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant="h5"
                  component={Link}
                  href="/admin/dashboard"
                  sx={{
                    fontWeight: 700,
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'primary.dark'
                    }
                  }}
                >
                  <Image 
                    src={T1ReferidosIcon}
                    height={20}
                    width={100}
                    className='w-[10rem]'
                    alt='T1ReferidosIcon'
                  />
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    ml: 2,
                    px: 1.5,
                    py: 0.5,
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5
                  }}
                >
                  Admin
                </Typography>
              </Box>

              {/* Navigation - Desktop */}
              {!isMobile && (
                <Stack direction="row" spacing={1}>
                  {navigationItems.map((item) => (
                    <Button
                      key={item.href}
                      component={Link}
                      href={item.href}
                      startIcon={item.icon}
                      sx={{
                        color: 'white!important',
                        textTransform: 'none',
                        fontWeight: 500,
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        '&:hover': {
                          bgcolor: 'grey.100',
                          color: 'black!important',
                        }
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Stack>
              )}

              {/* Actions */}
              <Stack direction="row" alignItems="center" spacing={1}>
                {/* Mobile Menu Button */}
                {isMobile && (
                  <IconButton
                    sx={{ 
                      color: 'text.primary',
                      '&:hover': { bgcolor: 'grey.100' }
                    }}
                  >
                    <MenuOutlined />
                  </IconButton>
                )}

                {/* Logout Button */}
                <Button
                  onClick={handleLogout}
                  startIcon={<LogoutOutlined />}
                  variant="outlined"
                  size="small"
                  sx={{
                    textTransform: 'none',
                    borderColor: 'divider',
                    color: 'text.secondary',
                    '&:hover': {
                      borderColor: 'error.main',
                      color: 'error.main',
                      bgcolor: 'error.50'
                    }
                  }}
                >
                  {!isMobile && 'Cerrar Sesión'}
                </Button>
              </Stack>
            </Stack>
          </Container>
        </Toolbar>

        {/* Mobile Navigation */}
        {isMobile && (
          <Box sx={{ borderTop: 1, borderColor: 'divider', bgcolor: 'white' }}>
            <Container maxWidth="xl">
              <Stack direction="row" sx={{ overflowX: 'auto', py: 1 }}>
                {navigationItems.map((item) => (
                  <Button
                    key={item.href}
                    component={Link}
                    href={item.href}
                    startIcon={item.icon}
                    size="small"
                    sx={{
                      color: 'text.primary',
                      textTransform: 'none',
                      fontWeight: 500,
                      minWidth: 'auto',
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      flexShrink: 0,
                      '&:hover': {
                        bgcolor: 'grey.100'
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Stack>
            </Container>
          </Box>
        )}
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
}
