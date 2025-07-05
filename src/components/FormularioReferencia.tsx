"use client";

import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  FormHelperText,
  Divider
} from '@mui/material';
import { CloudUploadOutlined } from '@mui/icons-material';
import { useFormWithSnackbar } from '@/hooks/useApiWithSnackbar';

export interface ReferenciaFormData {
  vacante_id: string;
  referidor_nombre: string;
  referidor_email: string;
  referidor_empresa?: string;
  candidato_nombre: string;
  candidato_email: string;
  candidato_telefono?: string;
  candidato_linkedin?: string;
  relacion_con_candidato: string;
  años_conociendo?: number;
  justificacion_recomendacion: string;
  fortalezas_principales?: string;
  cv?: File | null;
}

const validationSchema = Yup.object().shape({
  referidor_nombre: Yup.string().required('Tu nombre es requerido'),
  referidor_email: Yup.string().email('Email inválido').required('Tu email es requerido'),
  referidor_empresa: Yup.string(),
  candidato_nombre: Yup.string().required('El nombre del candidato es requerido'),
  candidato_email: Yup.string().email('Email del candidato inválido').required('El email del candidato es requerido'),
  candidato_telefono: Yup.string().matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, {message: 'Número de teléfono inválido', excludeEmptyString: true}),
  candidato_linkedin: Yup.string().url('URL de LinkedIn inválida').nullable(),
  relacion_con_candidato: Yup.string().required('La relación con el candidato es requerida'),
  años_conociendo: Yup.number().typeError('Debe ser un número').min(0, 'Debe ser un número positivo').integer('Debe ser un número entero').nullable(),
  justificacion_recomendacion: Yup.string().required('La justificación es requerida').min(50, 'La justificación debe tener al menos 50 caracteres'),
  fortalezas_principales: Yup.string(),
  cv: Yup.mixed<File>()
    .nullable()
    .test('fileSize', 'El archivo es demasiado grande (máx. 5MB)', (value) => {
      if (!value) return true;
      return value.size <= 5 * 1024 * 1024;
    })
    .test('fileType', 'Formato no soportado (PDF, DOC, DOCX)', (value) => {
      if (!value) return true;
      return ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(value.type);
    })
});

interface FormularioReferenciaProps {
  vacanteId: string;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

const FormularioReferencia: React.FC<FormularioReferenciaProps> = ({ vacanteId, onSubmitSuccess, onCancel }) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { isLoading: isSubmitting, submitForm } = useFormWithSnackbar();

  const initialValues: ReferenciaFormData = {
    vacante_id: vacanteId,
    referidor_nombre: '',
    referidor_email: '',
    referidor_empresa: '',
    candidato_nombre: '',
    candidato_email: '',
    candidato_telefono: '',
    candidato_linkedin: '',
    relacion_con_candidato: '',
    años_conociendo: undefined,
    justificacion_recomendacion: '',
    fortalezas_principales: '',
    cv: null,
  };

  const handleSubmit = async (values: ReferenciaFormData) => {
    setSubmitError(null);

    const formData = new FormData();
    (Object.keys(values) as Array<keyof ReferenciaFormData>).forEach(key => {
      const value = values[key];
      if (key === 'cv' && value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null && typeof value !== 'object') {
        formData.append(key, String(value));
      } else if (key === 'años_conociendo' && typeof value === 'number') {
        formData.append(key, String(value));
      }
    });

    if (!formData.has('vacante_id')) {
        formData.append('vacante_id', vacanteId);
    }

    const result = await submitForm(async () => {
      const response = await fetch('/api/referencias', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || `Error del servidor: ${response.status}`);
      return result;
    }, 'referencia');

    if (result) {
      onSubmitSuccess();
    } else {
      setSubmitError('Error al enviar la referencia. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <Box>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, errors, touched, values }) => (
          <Form>
            <Stack spacing={4}>
              {/* Tu Información */}
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  border: 1, 
                  borderColor: 'divider',
                  borderRadius: 2 
                }}
              >
                <Typography 
                  variant="h6" 
                  component="h3" 
                  sx={{ 
                    fontWeight: 600, 
                    color: 'text.primary', 
                    mb: 3 
                  }}
                >
                  Tu Información
                </Typography>
                <Stack spacing={3}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      name="referidor_nombre"
                      label="Nombre Completo"
                      required
                      value={values.referidor_nombre}
                      onChange={(e) => setFieldValue('referidor_nombre', e.target.value)}
                      error={touched.referidor_nombre && !!errors.referidor_nombre}
                      helperText={touched.referidor_nombre && errors.referidor_nombre}
                      disabled={isSubmitting}
                    />
                    <TextField
                      fullWidth
                      name="referidor_email"
                      label="Correo Electrónico"
                      type="email"
                      required
                      value={values.referidor_email}
                      onChange={(e) => setFieldValue('referidor_email', e.target.value)}
                      error={touched.referidor_email && !!errors.referidor_email}
                      helperText={touched.referidor_email && errors.referidor_email}
                      disabled={isSubmitting}
                    />
                  </Stack>
                  <TextField
                    fullWidth
                    name="referidor_empresa"
                    label="Empresa (Opcional)"
                    value={values.referidor_empresa}
                    onChange={(e) => setFieldValue('referidor_empresa', e.target.value)}
                    disabled={isSubmitting}
                  />
                </Stack>
              </Paper>

              {/* Información del Candidato */}
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  border: 1, 
                  borderColor: 'divider',
                  borderRadius: 2 
                }}
              >
                <Typography 
                  variant="h6" 
                  component="h3" 
                  sx={{ 
                    fontWeight: 600, 
                    color: 'text.primary', 
                    mb: 3 
                  }}
                >
                  Información del Candidato
                </Typography>
                <Stack spacing={3}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      name="candidato_nombre"
                      label="Nombre Completo del Candidato"
                      required
                      value={values.candidato_nombre}
                      onChange={(e) => setFieldValue('candidato_nombre', e.target.value)}
                      error={touched.candidato_nombre && !!errors.candidato_nombre}
                      helperText={touched.candidato_nombre && errors.candidato_nombre}
                      disabled={isSubmitting}
                    />
                    <TextField
                      fullWidth
                      name="candidato_email"
                      label="Correo Electrónico del Candidato"
                      type="email"
                      required
                      value={values.candidato_email}
                      onChange={(e) => setFieldValue('candidato_email', e.target.value)}
                      error={touched.candidato_email && !!errors.candidato_email}
                      helperText={touched.candidato_email && errors.candidato_email}
                      disabled={isSubmitting}
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      name="candidato_telefono"
                      label="Teléfono (Opcional)"
                      type="tel"
                      value={values.candidato_telefono}
                      onChange={(e) => setFieldValue('candidato_telefono', e.target.value)}
                      error={touched.candidato_telefono && !!errors.candidato_telefono}
                      helperText={touched.candidato_telefono && errors.candidato_telefono}
                      disabled={isSubmitting}
                    />
                    <TextField
                      fullWidth
                      name="candidato_linkedin"
                      label="Perfil de LinkedIn (Opcional)"
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={values.candidato_linkedin}
                      onChange={(e) => setFieldValue('candidato_linkedin', e.target.value)}
                      error={touched.candidato_linkedin && !!errors.candidato_linkedin}
                      helperText={touched.candidato_linkedin && errors.candidato_linkedin}
                      disabled={isSubmitting}
                    />
                  </Stack>
                </Stack>
              </Paper>

              {/* Detalles de la Referencia */}
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  border: 1, 
                  borderColor: 'divider',
                  borderRadius: 2 
                }}
              >
                <Typography 
                  variant="h6" 
                  component="h3" 
                  sx={{ 
                    fontWeight: 600, 
                    color: 'text.primary', 
                    mb: 3 
                  }}
                >
                  Detalles de la Referencia
                </Typography>
                <Stack spacing={3}>
                  <FormControl 
                    fullWidth 
                    error={touched.relacion_con_candidato && !!errors.relacion_con_candidato}
                    disabled={isSubmitting}
                  >
                    <InputLabel required>¿Cuál es tu relación con el candidato?</InputLabel>
                    <Select
                      name="relacion_con_candidato"
                      value={values.relacion_con_candidato}
                      onChange={(e) => setFieldValue('relacion_con_candidato', e.target.value)}
                      label="¿Cuál es tu relación con el candidato?"
                    >
                      <MenuItem value="colega_actual">Colega Actual</MenuItem>
                      <MenuItem value="ex_colega">Ex Colega</MenuItem>
                      <MenuItem value="amigo_conocido">Amigo/Conocido Personal</MenuItem>
                      <MenuItem value="contacto_profesional">Contacto Profesional (Networking)</MenuItem>
                      <MenuItem value="mentor_mentee">Mentor/Mentee</MenuItem>
                      <MenuItem value="mentor_mentee">familiar</MenuItem>
                      <MenuItem value="otro">Otro</MenuItem>
                    </Select>
                    {touched.relacion_con_candidato && errors.relacion_con_candidato && (
                      <FormHelperText>{errors.relacion_con_candidato}</FormHelperText>
                    )}
                  </FormControl>

                  <TextField
                    fullWidth
                    name="años_conociendo"
                    label="¿Años conociendo al candidato? (Opcional)"
                    type="number"
                    inputProps={{ min: 0 }}
                    value={values.años_conociendo || ''}
                    onChange={(e) => setFieldValue('años_conociendo', e.target.value ? parseInt(e.target.value) : undefined)}
                    error={touched.años_conociendo && !!errors.años_conociendo}
                    helperText={touched.años_conociendo && errors.años_conociendo}
                    disabled={isSubmitting}
                  />

                  <TextField
                    fullWidth
                    name="justificacion_recomendacion"
                    label="Justificación de la Recomendación"
                    required
                    multiline
                    rows={4}
                    value={values.justificacion_recomendacion}
                    onChange={(e) => setFieldValue('justificacion_recomendacion', e.target.value)}
                    error={touched.justificacion_recomendacion && !!errors.justificacion_recomendacion}
                    helperText={touched.justificacion_recomendacion && errors.justificacion_recomendacion}
                    disabled={isSubmitting}
                  />

                  <TextField
                    fullWidth
                    name="fortalezas_principales"
                    label="Principales Fortalezas (Opcional, separadas por comas)"
                    placeholder="Ej: Liderazgo, Comunicación"
                    value={values.fortalezas_principales}
                    onChange={(e) => setFieldValue('fortalezas_principales', e.target.value)}
                    disabled={isSubmitting}
                  />

                  {/* File Upload */}
                  <Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ mb: 1, fontWeight: 500 }}
                    >
                      Adjuntar CV (PDF, DOC, DOCX - Máx 5MB)
                    </Typography>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUploadOutlined />}
                      sx={{ 
                        textTransform: 'none',
                        borderStyle: 'dashed',
                        py: 2,
                        px: 3
                      }}
                      disabled={isSubmitting}
                    >
                      {values.cv ? values.cv.name : 'Seleccionar archivo'}
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={(event) => {
                          setFieldValue("cv", event.currentTarget.files ? event.currentTarget.files[0] : null);
                        }}
                      />
                    </Button>
                    {touched.cv && errors.cv && (
                      <FormHelperText error sx={{ mt: 1 }}>{errors.cv}</FormHelperText>
                    )}
                  </Box>
                </Stack>
              </Paper>

              {submitError && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {submitError}
                </Alert>
              )}

              <Divider />

              {/* Botones de acción */}
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button
                  variant="outlined"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  sx={{ textTransform: 'none' }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{ 
                    textTransform: 'none',
                    minWidth: 140
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress size={16} sx={{ mr: 1, color: 'white' }} />
                      Enviando...
                    </>
                  ) : (
                    'Enviar Referencia'
                  )}
                </Button>
              </Stack>
            </Stack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default FormularioReferencia;
