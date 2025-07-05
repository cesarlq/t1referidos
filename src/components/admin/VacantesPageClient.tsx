"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Stack,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import {
  AddOutlined,
  EditOutlined,
  VisibilityOutlined,
  DeleteOutlined,
  WorkOutlineOutlined,
  WarningAmberOutlined
} from '@mui/icons-material';
import { Vacante } from '@/components/VacanteCard';
import { useApiWithSnackbar } from '@/hooks/useApiWithSnackbar';

interface AdminVacante extends Vacante {
  vistas_count?: number;
  aplicaciones_count?: number;
  referencias_count?: number;
  created_at?: string;
  updated_at?: string;
}

interface VacantesPageClientProps {
  vacantes: AdminVacante[];
  eliminarVacanteAction: (formData: FormData) => Promise<void>;
}

const VacantesPageClient: React.FC<VacantesPageClientProps> = ({ 
  vacantes, 
  eliminarVacanteAction 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { remove, isLoading } = useApiWithSnackbar();
  
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    vacante: AdminVacante | null;
  }>({
    open: false,
    vacante: null
  });

  const handleDeleteClick = (vacante: AdminVacante) => {
    setDeleteModal({
      open: true,
      vacante
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.vacante) return;
    
    const formData = new FormData();
    formData.append('id', deleteModal.vacante.id);
    
    await remove(async () => {
      await eliminarVacanteAction(formData);
      return { success: true };
    }, 'vacante');
    
    setDeleteModal({ open: false, vacante: null });
    
    // Recargar la página para mostrar los cambios
    window.location.reload();
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ open: false, vacante: null });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString + 'T00:00:00').toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getModalidadColor = (modalidad: string): 'primary' | 'secondary' | 'info' | 'default' => {
    switch (modalidad) {
      case 'remoto': return 'primary';
      case 'presencial': return 'secondary';
      case 'hibrido': return 'info';
      default: return 'default';
    }
  };

  if (isMobile) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: 'text.primary'
            }}
          >
            Gestionar Vacantes
          </Typography>
          <Button
            component={Link}
            href="/admin/vacantes/nueva"
            variant="contained"
            startIcon={<AddOutlined />}
            sx={{ textTransform: 'none' }}
          >
            Nueva
          </Button>
        </Stack>

        {/* Mobile Cards */}
        {vacantes.length === 0 ? (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 6, 
              textAlign: 'center',
              border: 1,
              borderColor: 'divider',
              borderRadius: 3
            }}
          >
            <WorkOutlineOutlined sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No hay vacantes creadas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Comienza agregando una nueva vacante
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {vacantes.map((vacante) => (
              <Card 
                key={vacante.id}
                elevation={0}
                sx={{ 
                  border: 1, 
                  borderColor: 'divider',
                  borderRadius: 2
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {vacante.titulo_puesto}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {vacante.departamento}
                        </Typography>
                      </Box>
                      <Chip
                        label={vacante.esta_activa ? 'Activa' : 'Inactiva'}
                        color={vacante.esta_activa ? 'success' : 'error'}
                        size="small"
                      />
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={vacante.modalidad}
                        color={getModalidadColor(vacante.modalidad)}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={`${vacante.referencias_count || 0} referidos`}
                        color="info"
                        size="small"
                        variant="filled"
                        sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}
                      />
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      Publicada: {formatDate(vacante.fecha_publicacion || undefined)}
                    </Typography>

                    <Divider />

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          component={Link}
                          href={`/admin/vacantes/${vacante.id}/editar`}
                          size="small"
                          color="primary"
                        >
                          <EditOutlined />
                        </IconButton>
                        <IconButton
                          component={Link}
                          href={`/admin/vacantes/${vacante.id}/referidos`}
                          size="small"
                          color="info"
                        >
                          <VisibilityOutlined />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(vacante)}
                          size="small"
                          color="error"
                        >
                          <DeleteOutlined />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: 'text.primary'
          }}
        >
          Gestionar Vacantes
        </Typography>
        <Button
          component={Link}
          href="/admin/vacantes/nueva"
          variant="contained"
          startIcon={<AddOutlined />}
          sx={{ textTransform: 'none' }}
        >
          Agregar Nueva Vacante
        </Button>
      </Stack>

      {/* Desktop Table */}
      {vacantes.length === 0 ? (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 6, 
            textAlign: 'center',
            border: 1,
            borderColor: 'divider',
            borderRadius: 3
          }}
        >
          <WorkOutlineOutlined sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No hay vacantes creadas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comienza agregando una nueva vacante
          </Typography>
        </Paper>
      ) : (
        <TableContainer 
          component={Paper} 
          elevation={0}
          sx={{ 
            border: 1, 
            borderColor: 'divider',
            borderRadius: 3
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>Título</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Departamento</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Modalidad</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Referidos</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Publicada</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vacantes.map((vacante) => (
                <TableRow 
                  key={vacante.id}
                  sx={{ 
                    '&:hover': { bgcolor: 'grey.50' },
                    '&:last-child td, &:last-child th': { border: 0 }
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {vacante.titulo_puesto}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {vacante.departamento}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={vacante.modalidad}
                      color={getModalidadColor(vacante.modalidad)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={vacante.esta_activa ? 'Activa' : 'Inactiva'}
                      color={vacante.esta_activa ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {vacante.referencias_count || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        referidos
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(vacante.fecha_publicacion || undefined)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        component={Link}
                        href={`/admin/vacantes/${vacante.id}/editar`}
                        size="small"
                        color="primary"
                        title="Editar"
                      >
                        <EditOutlined />
                      </IconButton>
                      <IconButton
                        component={Link}
                        href={`/admin/vacantes/${vacante.id}/referidos`}
                        size="small"
                        color="info"
                        title="Ver Referidos"
                      >
                        <VisibilityOutlined />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(vacante)}
                        size="small"
                        color="error"
                        title="Eliminar"
                      >
                        <DeleteOutlined />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal de Confirmación de Eliminación */}
      <Dialog
        open={deleteModal.open}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          elevation: 0,
          sx: {
            border: 1,
            borderColor: 'divider',
            borderRadius: 3
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            pb: 2
          }}
        >
          <WarningAmberOutlined color="error" />
          <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
            Confirmar Eliminación
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ pb: 3 }}>
          <DialogContentText sx={{ mb: 2 }}>
            ¿Estás seguro de que deseas eliminar la siguiente vacante?
          </DialogContentText>
          
          {deleteModal.vacante && (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                bgcolor: 'grey.50',
                border: 1,
                borderColor: 'divider',
                borderRadius: 2
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                {deleteModal.vacante.titulo_puesto}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {deleteModal.vacante.departamento} • {deleteModal.vacante.modalidad}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <Chip
                  label={deleteModal.vacante.esta_activa ? 'Activa' : 'Inactiva'}
                  color={deleteModal.vacante.esta_activa ? 'success' : 'error'}
                  size="small"
                />
                <Chip
                  label={`${deleteModal.vacante.referencias_count || 0} referidos`}
                  color="info"
                  size="small"
                  variant="outlined"
                />
              </Stack>
            </Paper>
          )}
          
          <DialogContentText sx={{ mt: 2, color: 'error.main' }}>
            <strong>Esta acción no se puede deshacer.</strong> Se eliminarán también todas las referencias asociadas a esta vacante.
          </DialogContentText>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
            disabled={isLoading}
            sx={{ textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={isLoading}
            sx={{ textTransform: 'none' }}
          >
            {isLoading ? 'Eliminando...' : 'Eliminar Vacante'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VacantesPageClient;
