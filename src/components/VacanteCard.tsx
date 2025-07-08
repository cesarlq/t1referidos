import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Chip, 
  Box, 
  Stack,
  Divider
} from '@mui/material';
import { 
  LocationOnOutlined, 
  WorkOutlineOutlined, 
  AttachMoneyOutlined 
} from '@mui/icons-material';
import HTMLRenderer from './HTMLRenderer';

// Definición de la interfaz Vacante basada en el esquema de la BD
export interface Vacante {
  id: string; // uuid
  titulo_puesto: string;
  departamento: string;
  modalidad: 'remoto' | 'presencial' | 'hibrido';
  ubicacion?: string | null;
  salario_rango_min?: number | null; // numeric
  salario_rango_max?: number | null; // numeric
  moneda?: string | null;
  descripcion_puesto: string;
  tecnologias_requeridas: string[]; // text[]
  responsabilidades?: string | null;
  requisitos?: string | null;
  beneficios?: string | null;
  fecha_publicacion?: string | null; // date
  fecha_cierre?: string | null; // date
  esta_activa?: boolean | null;
  vistas_count?: number | null;
  aplicaciones_count?: number | null;
  creada_por_admin_id?: string | null; // uuid
  created_at?: string | null; // timestamp with time zone
  updated_at?: string | null; // timestamp with time zone
}

interface VacanteCardProps {
  vacante: Vacante;
  onReferirClick: (vacante: Vacante) => void;
}

const VacanteCard: React.FC<VacanteCardProps> = ({ vacante, onReferirClick }) => {
  return (
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
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
          {/* Contenido principal */}
          <Box sx={{ flex: 1 }}>
            {/* Header */}
            <Box sx={{ mb: 2 }}>
              <Typography 
                variant="h6" 
                component="h2" 
                sx={{ 
                  fontWeight: 600, 
                  color: 'text.primary',
                  mb: 0.5,
                  fontSize: '1.1rem'
                }}
              >
                {vacante.titulo_puesto}
              </Typography>
              <Chip 
                label={vacante.departamento}
                size="small"
                color="primary"
                variant="filled"
                sx={{ 
                  textTransform: 'uppercase',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.5px'
                }}
              />
            </Box>

            {/* Información básica */}
            <Stack spacing={1.5} sx={{ mb: 2 }}>
              {/* Modalidad */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WorkOutlineOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Modalidad:
                </Typography>
                <Chip 
                  label={vacante.modalidad}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    textTransform: 'capitalize',
                    fontSize: '0.75rem',
                    height: 24
                  }}
                />
              </Box>

              {/* Ubicación */}
              {vacante.ubicacion && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Ubicación:
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    {vacante.ubicacion}
                  </Typography>
                </Box>
              )}

              {/* Salario */}
              {vacante.salario_rango_min && vacante.salario_rango_max && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoneyOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Salario:
                  </Typography>
                  <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
                    ${vacante.salario_rango_min.toLocaleString()} - ${vacante.salario_rango_max.toLocaleString()} {vacante.moneda || 'USD'}
                  </Typography>
                </Box>
              )}
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Tecnologías */}
            <Box>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ fontWeight: 500, mb: 1 }}
              >
                Tecnologías requeridas:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {vacante.tecnologias_requeridas.map((tech, index) => (
                  <Chip
                    key={index}
                    label={tech}
                    size="small"
                    variant="outlined"
                    sx={{ 
                      fontSize: '0.7rem',
                      height: 24,
                      bgcolor: 'grey.50',
                      borderColor: 'grey.300',
                      '&:hover': {
                        bgcolor: 'grey.100'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Description Section */}
            <Box sx={{ paddingTop: 2 }}>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ fontWeight: 500, mb: 1 }}
              >
                Descripción del Puesto:
              </Typography>
              <HTMLRenderer 
                content={vacante.descripcion_puesto}
                maxLines={4}
                sx={{ 
                  fontSize: '0.875rem',
                  color: 'text.primary',
                  lineHeight: 1.5
                }}
              />
            </Box>
          </Box>



          {/* Botón de acción */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: { xs: 'stretch', sm: 'flex-start' },
            minWidth: { xs: 'auto', sm: 160 }
          }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => onReferirClick(vacante)}
              fullWidth
              sx={{ 
                height: 'fit-content',
                py: 1.5,
                fontWeight: 700,
                fontSize: '0.875rem',
                textTransform: 'none',
                borderRadius: 2
              }}
            >
              Referir Candidato
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VacanteCard;
