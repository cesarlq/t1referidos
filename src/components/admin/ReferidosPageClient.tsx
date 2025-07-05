"use client";

import React from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Chip,
  IconButton,
  Card,
  CardContent,
  Button,
  Avatar
} from '@mui/material';
import {
  ArrowBackOutlined,
  PersonOutlined,
  EmailOutlined,
  PhoneOutlined,
  LinkedIn,
  BusinessOutlined,
  DescriptionOutlined,
  StarOutlined
} from '@mui/icons-material';
import { Vacante } from '@/components/VacanteCard';
import { Referencia } from '@/app/admin/vacantes/[id]/referidos/page';

interface ReferidosPageClientProps {
  vacante: Partial<Vacante> | null;
  referidos: Referencia[];
  vacanteId: string;
}

const ReferidosPageClient: React.FC<ReferidosPageClientProps> = ({
  vacante,
  referidos,
  vacanteId
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getModalidadColor = (modalidad?: string): 'primary' | 'secondary' | 'info' | 'default' => {
    switch (modalidad) {
      case 'remoto': return 'primary';
      case 'presencial': return 'secondary';
      case 'hibrido': return 'info';
      default: return 'default';
    }
  };

  if (!vacante) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 6, 
            textAlign: 'center',
            border: 1,
            borderColor: 'error.main',
            borderRadius: 3
          }}
        >
          <Typography variant="h5" color="error" sx={{ mb: 2, fontWeight: 600 }}>
            Vacante no encontrada
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            No se pudo cargar la información de la vacante.
          </Typography>
          <Button
            component={Link}
            href="/admin/vacantes"
            variant="contained"
            startIcon={<ArrowBackOutlined />}
            sx={{ textTransform: 'none' }}
          >
            Volver al listado de vacantes
          </Button>
        </Paper>
      </Container>
    );
  }

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
          <IconButton 
            component={Link}
            href="/admin/vacantes"
            sx={{ 
              bgcolor: 'grey.100',
              '&:hover': { bgcolor: 'grey.200' }
            }}
          >
            <ArrowBackOutlined />
          </IconButton>
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
              Referidos para: {vacante.titulo_puesto}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body1" color="text.secondary">
                {vacante.departamento}
              </Typography>
              {vacante.modalidad && (
                <Chip
                  label={vacante.modalidad}
                  color={getModalidadColor(vacante.modalidad)}
                  size="small"
                  variant="outlined"
                />
              )}
              <Chip
                label={`${referidos.length} referidos`}
                color="info"
                size="small"
                variant="filled"
              />
            </Stack>
          </Box>
          <Button
            component={Link}
            href={`/admin/vacantes/${vacanteId}/editar`}
            variant="outlined"
            sx={{ textTransform: 'none' }}
          >
            Editar Vacante
          </Button>
        </Stack>
      </Paper>

      {/* Lista de Referidos */}
      {referidos.length === 0 ? (
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
            No hay referidos para esta vacante
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Los referidos aparecerán aquí cuando se envíen a través del portal público.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={3}>
          {referidos.map((referido) => (
            <Card 
              key={referido.id}
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
                    {referido.candidato_nombre.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                      {referido.candidato_nombre}
                    </Typography>
                    <Stack spacing={1}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <EmailOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {referido.candidato_email}
                        </Typography>
                      </Stack>
                      {referido.candidato_telefono && (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <PhoneOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {referido.candidato_telefono}
                          </Typography>
                        </Stack>
                      )}
                      {referido.candidato_linkedin && (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <LinkedIn sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography 
                            variant="body2" 
                            component="a"
                            href={referido.candidato_linkedin}
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
                    <Typography variant="caption" color="text.secondary">
                      Enviado el
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {formatDate(referido.created_at)}
                    </Typography>
                    {referido.cv_url && (
                      <Button
                        href={referido.cv_url}
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

              {/* Contenido del Referido */}
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
                            <strong>{referido.referidor_nombre}</strong> ({referido.referidor_email})
                          </Typography>
                        </Stack>
                        {referido.referidor_empresa && (
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <BusinessOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {referido.referidor_empresa}
                            </Typography>
                          </Stack>
                        )}
                        <Stack direction="row" spacing={2}>
                          <Chip
                            label={referido.relacion_con_candidato.replace('_', ' ')}
                            size="small"
                            variant="outlined"
                          />
                          {referido.años_conociendo && (
                            <Chip
                              label={`${referido.años_conociendo} años conociéndolo`}
                              size="small"
                              variant="outlined"
                              color="info"
                            />
                          )}
                        </Stack>
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
                        {referido.justificacion_recomendacion}
                      </Typography>
                    </Paper>
                  </Box>

                  {/* Fortalezas */}
                  {referido.fortalezas_principales && referido.fortalezas_principales.length > 0 && (
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Principales Fortalezas
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {referido.fortalezas_principales.map((fortaleza, index) => (
                          <Chip
                            key={index}
                            label={fortaleza}
                            size="small"
                            color="success"
                            variant="outlined"
                            icon={<StarOutlined />}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default ReferidosPageClient;
