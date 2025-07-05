'use client';

import React, { useState } from 'react';
import {
  Box,
  Modal,
  Typography,
  Paper,
  Stack,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  CloseOutlined,
  EmojiEventsOutlined,
  CheckCircleOutlined,
  EmailOutlined,
  StarOutlined,
  TrendingUpOutlined
} from '@mui/icons-material';

interface PremiosEspecialesModalProps {
  children: React.ReactNode;
}

export default function PremiosEspecialesModal({ children }: PremiosEspecialesModalProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div onClick={handleOpen} style={{ cursor: 'pointer' }}>
        {children}
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Paper
          elevation={0}
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 600,
            maxHeight: '90vh',
            overflow: 'auto',
            border: 1,
            borderColor: 'divider',
            borderRadius: 3,
            outline: 'none'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              position: 'sticky',
              top: 0,
              bgcolor: 'primary.main',
              color: 'white',
              p: 3,
              borderRadius: '12px 12px 0 0',
              zIndex: 1
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={2}>
                <EmojiEventsOutlined sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Recomienda talento Rockstar y gana!
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    🎯 Programa de Recomendados Internos T1
                  </Typography>
                </Box>
              </Stack>
              <IconButton
                onClick={handleClose}
                sx={{
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                <CloseOutlined />
              </IconButton>
            </Stack>
          </Box>

          {/* Content */}
          <Box sx={{ p: 3 }}>
            <Stack spacing={3}>
              {/* Bono */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  bgcolor: 'success.50',
                  border: 1,
                  borderColor: 'success.200',
                  borderRadius: 2
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                  <TrendingUpOutlined sx={{ color: 'success.main', fontSize: 24 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.dark' }}>
                    Bono por Contratación
                  </Typography>
                </Stack>
                <Typography variant="body1" sx={{ fontWeight: 500, color: 'success.dark' }}>
                  Hasta <strong>2 meses de sueldo</strong> (tope $80,000 MXN) por cada contratación exitosa.
                </Typography>
              </Paper>

              {/* Cómo participar */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                  Cómo participar:
                </Typography>
                <List sx={{ py: 0 }}>
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Chip
                        label="1"
                        size="small"
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'white',
                          fontWeight: 600,
                          width: 24,
                          height: 24
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="Postular y enviar tu información por este medio o al correo"
                      secondary={
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                          <EmailOutlined sx={{ fontSize: 16, color: 'primary.main' }} />
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'primary.main',
                              fontWeight: 500
                            }}
                          >
                            talento@t1.com.mx
                          </Typography>
                        </Stack>
                      }
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Chip
                        label="2"
                        size="small"
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'white',
                          fontWeight: 600,
                          width: 24,
                          height: 24
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="Agrega breve razón de por qué es un(a) Rockstar para T1."
                      secondary={
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                          <StarOutlined sx={{ fontSize: 16, color: 'warning.main' }} />
                          <Typography variant="body2" color="text.secondary">
                            Destaca sus fortalezas y experiencia relevante
                          </Typography>
                        </Stack>
                      }
                    />
                  </ListItem>
                </List>
              </Box>

              <Divider />

              {/* Pago del incentivo */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                  Pago del incentivo:
                </Typography>
                <Stack spacing={2}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: 'info.50',
                      border: 1,
                      borderColor: 'info.200',
                      borderRadius: 2
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Chip
                        label="50%"
                        sx={{
                          bgcolor: 'info.main',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                      <Typography variant="body2">
                        Al cumplir <strong>30 días</strong> en el puesto
                      </Typography>
                    </Stack>
                  </Paper>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: 'success.50',
                      border: 1,
                      borderColor: 'success.200',
                      borderRadius: 2
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Chip
                        label="50%"
                        sx={{
                          bgcolor: 'success.main',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                      <Typography variant="body2">
                        Al cumplir <strong>90 días</strong> sin reportes de desempeño
                      </Typography>
                    </Stack>
                  </Paper>
                </Stack>
              </Box>

              <Divider />

              {/* Condiciones clave */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                  Condiciones clave:
                </Typography>
                <List sx={{ py: 0 }}>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleOutlined sx={{ color: 'success.main', fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="El candidato no debe estar en nuestro ATS ni venir de agencias."
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleOutlined sx={{ color: 'success.main', fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Aplica únicamente si el candidato es contratado y permanece durante el periodo requerido."
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleOutlined sx={{ color: 'success.main', fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="No participarás en su evaluación directa."
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                </List>
              </Box>

              {/* Footer motivacional */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  bgcolor: 'primary.50',
                  border: 1,
                  borderColor: 'primary.200',
                  borderRadius: 2,
                  textAlign: 'center'
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: 'primary.dark',
                    mb: 1
                  }}
                >
                  ¡El mejor talento conoce al mejor talento!
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'primary.dark',
                    fontStyle: 'italic'
                  }}
                >
                  Comparte tu recomendación hoy y construyamos juntos el futuro de T1.
                </Typography>
              </Paper>
            </Stack>
          </Box>
        </Paper>
      </Modal>
    </>
  );
}
