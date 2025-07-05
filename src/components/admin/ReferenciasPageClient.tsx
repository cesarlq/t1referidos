"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Chip,
  Card,
  CardContent,
  Button,
  Avatar,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  ArrowBackOutlined,
  PersonOutlined,
  EmailOutlined,
  PhoneOutlined,
  LinkedIn,
  BusinessOutlined,
  DescriptionOutlined,
  SearchOutlined,
  FilterListOutlined
} from '@mui/icons-material';

interface Referencia {
  id: string;
  vacante_id: string;
  referidor_nombre: string;
  referidor_email: string;
  candidato_nombre: string;
  candidato_email: string;
  candidato_telefono?: string | null;
  candidato_linkedin?: string | null;
  relacion_con_candidato: string;
  justificacion_recomendacion: string;
  cv_url?: string | null;
  cv_filename?: string | null;
  fecha_referencia: string;
  estado_proceso?: string | null;
}

interface ReferenciasPageClientProps {
  referencias: Referencia[];
}

const ReferenciasPageClient: React.FC<ReferenciasPageClientProps> = ({
  referencias
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<string>('todos');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoColor = (estado?: string | null): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (estado?.toLowerCase()) {
      case 'recibido': return 'info';
      case 'en revisión': return 'warning';
      case 'contactado': return 'success';
      case 'rechazado': return 'error';
      default: return 'default';
    }
  };

  const getEstadoLabel = (estado?: string | null) => {
    if (!estado) return 'Sin estado';
    return estado.charAt(0).toUpperCase() + estado.slice(1);
  };

  // Filtrar referencias
  const referenciasFiltradas = referencias.filter(ref => {
    const matchesSearch = 
      ref.candidato_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.referidor_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.candidato_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = estadoFilter === 'todos' || ref.estado_proceso === estadoFilter;
    
    return matchesSearch && matchesEstado;
  });

  const estadosUnicos = Array.from(new Set(referencias.map(ref => ref.estado_proceso).filter(Boolean)));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4,
          border: 1, 
          borderColor: 'divider',
          borderRadius: 3
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Button
            component={Link}
            href="/admin/dashboard"
            startIcon={<ArrowBackOutlined />}
            variant="outlined"
            sx={{ textTransform: 'none' }}
          >
            Dashboard
          </Button>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                mb: 1
              }}
            >
              Referencias Enviadas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gestiona todas las referencias recibidas para las vacantes activas
            </Typography>
          </Box>
          <Chip
            label={`${referencias.length} referencias`}
            color="primary"
            variant="filled"
          />
        </Stack>

        {/* Filtros */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            fullWidth
            placeholder="Buscar por candidato, referidor o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              ),
            }}
            size="small"
            sx={{ flex: 2 }}
          />
          <TextField
            select
            label="Filtrar por estado"
            value={estadoFilter || 'todos'}
            onChange={(e) => setEstadoFilter(e.target.value)}
            SelectProps={{
              native: true,
            }}
            size="small"
            sx={{ minWidth: 200, flex: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterListOutlined />
                </InputAdornment>
              ),
            }}
          >
            <option value="todos">Todos los estados</option>
            {estadosUnicos.map((estado) => (
              <option key={estado} value={estado || ''}>
                {getEstadoLabel(estado)}
              </option>
            ))}
          </TextField>
        </Stack>
      </Paper>

      {/* Lista de Referencias */}
      {referenciasFiltradas.length === 0 ? (
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
          <PersonOutlined sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            {searchTerm || estadoFilter !== 'todos' 
              ? 'No se encontraron referencias con los filtros aplicados'
              : 'No hay referencias enviadas'
            }
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm || estadoFilter !== 'todos'
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Las referencias aparecerán aquí cuando se envíen desde el portal público'
            }
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={3}>
          {referenciasFiltradas.map((referencia) => (
            <Card 
              key={referencia.id}
              elevation={0}
              sx={{ 
                border: 1, 
                borderColor: 'divider',
                borderRadius: 3,
                overflow: 'hidden'
              }}
            >
              {/* Header del Candidato */}
              <Box sx={{ bgcolor: 'grey.50', p: 3, borderBottom: 1, borderColor: 'divider' }}>
                <Stack direction="row" spacing={3} alignItems="flex-start">
                  <Avatar 
                    sx={{ 
                      width: 56, 
                      height: 56, 
                      bgcolor: 'primary.main',
                      fontSize: '1.5rem',
                      fontWeight: 600
                    }}
                  >
                    {referencia.candidato_nombre.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                      {referencia.candidato_nombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Referido por: <strong>{referencia.referidor_nombre}</strong>
                    </Typography>
                    <Stack spacing={1}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <EmailOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {referencia.candidato_email}
                        </Typography>
                      </Stack>
                      {referencia.candidato_telefono && (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <PhoneOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {referencia.candidato_telefono}
                          </Typography>
                        </Stack>
                      )}
                      {referencia.candidato_linkedin && (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <LinkedIn sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography 
                            variant="body2" 
                            component="a"
                            href={referencia.candidato_linkedin.startsWith('http') 
                              ? referencia.candidato_linkedin 
                              : `https://${referencia.candidato_linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ 
                              color: 'primary.main',
                              textDecoration: 'none',
                              '&:hover': { textDecoration: 'underline' }
                            }}
                          >
                            Ver perfil de LinkedIn
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                  </Box>
                  <Stack spacing={1} alignItems="flex-end">
                    <Chip
                      label={getEstadoLabel(referencia.estado_proceso)}
                      color={getEstadoColor(referencia.estado_proceso)}
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(referencia.fecha_referencia)}
                    </Typography>
                    {referencia.cv_url && (
                      <Button
                        href={referencia.cv_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outlined"
                        size="small"
                        startIcon={<DescriptionOutlined />}
                        sx={{ textTransform: 'none' }}
                      >
                        Ver CV
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Box>

              {/* Contenido de la Referencia */}
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={3}>
                  {/* Información del Referidor */}
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Información del Referidor
                    </Typography>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Stack spacing={1}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <PersonOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            <strong>{referencia.referidor_nombre}</strong>
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <EmailOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {referencia.referidor_email}
                          </Typography>
                        </Stack>
                        <Chip
                          label={referencia.relacion_con_candidato.replace('_', ' ')}
                          size="small"
                          variant="outlined"
                          sx={{ alignSelf: 'flex-start' }}
                        />
                      </Stack>
                    </Paper>
                  </Box>

                  {/* Detalles de la Vacante */}
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Detalles de la Vacante
                    </Typography>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <BusinessOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          ID de Vacante: <strong>{referencia.vacante_id}</strong>
                        </Typography>
                        <Button
                          component={Link}
                          href={`/admin/vacantes/${referencia.vacante_id}/referidos`}
                          size="small"
                          variant="text"
                          sx={{ textTransform: 'none', ml: 'auto' }}
                        >
                          Ver todos los referidos
                        </Button>
                      </Stack>
                    </Paper>
                  </Box>

                  {/* Justificación */}
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Justificación de la Recomendación
                    </Typography>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                        {referencia.justificacion_recomendacion}
                      </Typography>
                    </Paper>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default ReferenciasPageClient;
