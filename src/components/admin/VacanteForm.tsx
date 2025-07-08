"use client";

import React, { useState } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  IconButton,
  Alert,
  Divider,
  CircularProgress
} from '@mui/material';
import { 
  AddOutlined, 
  RemoveOutlined, 
  ArrowBackOutlined,
  SaveOutlined 
} from '@mui/icons-material';
import { Vacante } from '@/components/VacanteCard';
import { useFormWithSnackbar } from '@/hooks/useApiWithSnackbar';
import { textToHtml, htmlToText, isHtmlContent } from '@/util/textToHtml';

// Interfaz para los datos del formulario de vacante
export interface VacanteFormData extends Omit<Partial<Vacante>, 'id' | 'tecnologias_requeridas' | 'modalidad' | 'moneda' | 'salario_rango_min' | 'salario_rango_max' | 'esta_activa'> {
  titulo_puesto: string;
  departamento: string;
  modalidad: 'remoto' | 'presencial' | 'hibrido';
  descripcion_puesto: string;
  tecnologias_requeridas: string[];
  ubicacion?: string;
  salario_rango_min?: number | '';
  salario_rango_max?: number | '';
  moneda?: 'USD' | 'MXN' | 'EUR' | '';
  responsabilidades?: string;
  requisitos?: string;
  beneficios?: string;
  fecha_cierre?: string;
  esta_activa: boolean;
}

// Esquema de validación con Yup
const validationSchema = Yup.object().shape({
  titulo_puesto: Yup.string().required('El título del puesto es requerido'),
  departamento: Yup.string().required('El departamento es requerido'),
  modalidad: Yup.string().oneOf(['remoto', 'presencial', 'hibrido'], 'Modalidad inválida').required('La modalidad es requerida'),
  descripcion_puesto: Yup.string().required('La descripción es requerida').min(50, 'Debe tener al menos 50 caracteres'),
  tecnologias_requeridas: Yup.array().of(Yup.string().required("Tecnología no puede estar vacía")).min(1, 'Debe agregar al menos una tecnología'),
  ubicacion: Yup.string(),
  salario_rango_min: Yup.number().typeError('Debe ser un número').min(0, 'No puede ser negativo').nullable(),
  salario_rango_max: Yup.number().typeError('Debe ser un número').min(0, 'No puede ser negativo')
    .nullable()
    .test('is-greater-than-min', 'El salario máximo debe ser mayor o igual al mínimo', function(value) {
      const { salario_rango_min } = this.parent;
      if (salario_rango_min && value) {
        return value >= salario_rango_min;
      }
      return true;
    }),
  moneda: Yup.string().oneOf(['USD', 'MXN', 'EUR', ''], 'Moneda inválida').nullable(),
  responsabilidades: Yup.string(),
  requisitos: Yup.string(),
  beneficios: Yup.string(),
  fecha_cierre: Yup.date().nullable().min(new Date(), 'La fecha de cierre no puede ser en el pasado'),
  esta_activa: Yup.boolean().required(),
});

interface VacanteFormProps {
  initialData?: Partial<Vacante>;
  onSubmitAction: (data: VacanteFormData) => Promise<{ success: boolean; error?: string; data?: unknown }>;
  isEditMode: boolean;
}

const VacanteForm: React.FC<VacanteFormProps> = ({ initialData, onSubmitAction, isEditMode }) => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const { isLoading, submitForm } = useFormWithSnackbar();

  const formInitialValues: VacanteFormData = {
    titulo_puesto: initialData?.titulo_puesto || '',
    departamento: initialData?.departamento || '',
    modalidad: initialData?.modalidad || 'remoto',
    descripcion_puesto: initialData?.descripcion_puesto 
      ? (isHtmlContent(initialData.descripcion_puesto) 
          ? htmlToText(initialData.descripcion_puesto) 
          : initialData.descripcion_puesto)
      : '',
    tecnologias_requeridas: initialData?.tecnologias_requeridas || [''],
    ubicacion: initialData?.ubicacion || '',
    salario_rango_min: initialData?.salario_rango_min ?? '',
    salario_rango_max: initialData?.salario_rango_max ?? '',
    moneda: initialData?.moneda as VacanteFormData['moneda'] || 'USD',
    responsabilidades: initialData?.responsabilidades 
      ? (isHtmlContent(initialData.responsabilidades) 
          ? htmlToText(initialData.responsabilidades) 
          : initialData.responsabilidades)
      : '',
    requisitos: initialData?.requisitos 
      ? (isHtmlContent(initialData.requisitos) 
          ? htmlToText(initialData.requisitos) 
          : initialData.requisitos)
      : '',
    beneficios: initialData?.beneficios 
      ? (isHtmlContent(initialData.beneficios) 
          ? htmlToText(initialData.beneficios) 
          : initialData.beneficios)
      : '',
    fecha_cierre: initialData?.fecha_cierre ? new Date(initialData.fecha_cierre).toISOString().split('T')[0] : '',
    esta_activa: initialData?.esta_activa ?? true,
  };

  const handleSubmit = async (values: VacanteFormData) => {
    setServerError(null);

    // Limpiar valores numéricos vacíos a null para la BD
    const payload = {
      ...values,
      // Convertir campos de texto a HTML para preservar formato
      descripcion_puesto: textToHtml(values.descripcion_puesto),
      responsabilidades: values.responsabilidades ? textToHtml(values.responsabilidades) : null,
      requisitos: values.requisitos ? textToHtml(values.requisitos) : null,
      beneficios: values.beneficios ? textToHtml(values.beneficios) : null,
      // Limpiar valores numéricos vacíos a null para la BD
      salario_rango_min: values.salario_rango_min === '' ? null : Number(values.salario_rango_min),
      salario_rango_max: values.salario_rango_max === '' ? null : Number(values.salario_rango_max),
      moneda: values.moneda === '' ? null : values.moneda,
      fecha_cierre: values.fecha_cierre === '' ? null : values.fecha_cierre,
    };

    const result = await submitForm(async () => {
      const response = await onSubmitAction(payload as VacanteFormData);
      if (!response.success) {
        throw new Error(response.error || 'Error al guardar la vacante');
      }
      return response;
    }, isEditMode ? 'vacante actualizada' : 'vacante creada');

    if (result) {
      router.push('/admin/vacantes');
      router.refresh();
    } else {
      setServerError('Error al guardar la vacante. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          border: 1, 
          borderColor: 'divider',
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box sx={{ p: 4, borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <IconButton 
              onClick={() => router.back()}
              sx={{ 
                bgcolor: 'grey.100',
                '&:hover': { bgcolor: 'grey.200' }
              }}
            >
              <ArrowBackOutlined />
            </IconButton>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                color: 'text.primary'
              }}
            >
              {isEditMode ? 'Editar Vacante' : 'Nueva Vacante'}
            </Typography>
          </Stack>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 600 }}
          >
            {isEditMode 
              ? 'Actualiza la información de la vacante existente'
              : 'Completa la información para crear una nueva vacante'
            }
          </Typography>
        </Box>

        {/* Form */}
        <Box sx={{ p: 4 }}>
          <Formik
            initialValues={formInitialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, errors, touched, setFieldValue }) => (
              <Form>
                <Stack spacing={4}>
                  {/* Información Básica */}
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
                      Información Básica
                    </Typography>
                    <Stack spacing={3}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                          fullWidth
                          name="titulo_puesto"
                          label="Título del Puesto"
                          required
                          value={values.titulo_puesto}
                          onChange={(e) => setFieldValue('titulo_puesto', e.target.value)}
                          error={touched.titulo_puesto && !!errors.titulo_puesto}
                          helperText={touched.titulo_puesto && errors.titulo_puesto}
                          disabled={isLoading}
                        />
                        <TextField
                          fullWidth
                          name="departamento"
                          label="Departamento"
                          required
                          value={values.departamento}
                          onChange={(e) => setFieldValue('departamento', e.target.value)}
                          error={touched.departamento && !!errors.departamento}
                          helperText={touched.departamento && errors.departamento}
                          disabled={isLoading}
                        />
                      </Stack>

                      <FormControl fullWidth disabled={isLoading}>
                        <InputLabel required>Modalidad</InputLabel>
                        <Select
                          name="modalidad"
                          value={values.modalidad}
                          onChange={(e) => setFieldValue('modalidad', e.target.value)}
                          label="Modalidad"
                        >
                          <MenuItem value="remoto">Remoto</MenuItem>
                          <MenuItem value="presencial">Presencial</MenuItem>
                          <MenuItem value="hibrido">Híbrido</MenuItem>
                        </Select>
                      </FormControl>

                      <TextField
                        fullWidth
                        name="descripcion_puesto"
                        label="Descripción del Puesto"
                        required
                        multiline
                        rows={4}
                        value={values.descripcion_puesto}
                        onChange={(e) => setFieldValue('descripcion_puesto', e.target.value)}
                        error={touched.descripcion_puesto && !!errors.descripcion_puesto}
                        helperText={
                          touched.descripcion_puesto && errors.descripcion_puesto 
                            ? errors.descripcion_puesto 
                            : "Los espacios, tabs y saltos de línea se preservarán en la visualización"
                        }
                        disabled={isLoading}
                      />
                    </Stack>
                  </Paper>

                  {/* Tecnologías */}
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
                      Tecnologías Requeridas
                    </Typography>
                    <FieldArray name="tecnologias_requeridas">
                      {({ push, remove }) => (
                        <Stack spacing={2}>
                          {values.tecnologias_requeridas.map((tech: string, index: number) => (
                            <Stack key={index} direction="row" spacing={1} alignItems="center">
                              <TextField
                                fullWidth
                                name={`tecnologias_requeridas.${index}`}
                                label={`Tecnología ${index + 1}`}
                                value={tech}
                                onChange={(e) => setFieldValue(`tecnologias_requeridas.${index}`, e.target.value)}
                                disabled={isLoading}
                              />
                              <IconButton
                                onClick={() => remove(index)}
                                disabled={values.tecnologias_requeridas.length <= 1 || isLoading}
                                color="error"
                                sx={{ minWidth: 40 }}
                              >
                                <RemoveOutlined />
                              </IconButton>
                            </Stack>
                          ))}
                          <Button
                            startIcon={<AddOutlined />}
                            onClick={() => push('')}
                            variant="outlined"
                            disabled={isLoading}
                            sx={{ alignSelf: 'flex-start', textTransform: 'none' }}
                          >
                            Agregar Tecnología
                          </Button>
                          {typeof errors.tecnologias_requeridas === 'string' && (
                            <Typography color="error" variant="body2">
                              {errors.tecnologias_requeridas}
                            </Typography>
                          )}
                        </Stack>
                      )}
                    </FieldArray>
                  </Paper>

                  {/* Información Adicional */}
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
                      Información Adicional
                    </Typography>
                    <Stack spacing={3}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                          fullWidth
                          name="ubicacion"
                          label="Ubicación (si no es remoto)"
                          value={values.ubicacion}
                          onChange={(e) => setFieldValue('ubicacion', e.target.value)}
                          disabled={isLoading}
                        />
                        <FormControl fullWidth disabled={isLoading}>
                          <InputLabel>Moneda</InputLabel>
                          <Select
                            name="moneda"
                            value={values.moneda}
                            onChange={(e) => setFieldValue('moneda', e.target.value)}
                            label="Moneda"
                          >
                            <MenuItem value="USD">USD</MenuItem>
                            <MenuItem value="MXN">MXN</MenuItem>
                            <MenuItem value="EUR">EUR</MenuItem>
                            <MenuItem value="">No especificar</MenuItem>
                          </Select>
                        </FormControl>
                      </Stack>

                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                          fullWidth
                          name="salario_rango_min"
                          label="Salario Mínimo"
                          type="number"
                          value={values.salario_rango_min}
                          onChange={(e) => setFieldValue('salario_rango_min', e.target.value)}
                          error={touched.salario_rango_min && !!errors.salario_rango_min}
                          helperText={touched.salario_rango_min && errors.salario_rango_min}
                          disabled={isLoading}
                        />
                        <TextField
                          fullWidth
                          name="salario_rango_max"
                          label="Salario Máximo"
                          type="number"
                          value={values.salario_rango_max}
                          onChange={(e) => setFieldValue('salario_rango_max', e.target.value)}
                          error={touched.salario_rango_max && !!errors.salario_rango_max}
                          helperText={touched.salario_rango_max && errors.salario_rango_max}
                          disabled={isLoading}
                        />
                      </Stack>

                      <TextField
                        fullWidth
                        name="responsabilidades"
                        label="Responsabilidades"
                        multiline
                        rows={3}
                        value={values.responsabilidades}
                        onChange={(e) => setFieldValue('responsabilidades', e.target.value)}
                        helperText="Los espacios, tabs y saltos de línea se preservarán en la visualización"
                        disabled={isLoading}
                      />

                      <TextField
                        fullWidth
                        name="requisitos"
                        label="Requisitos"
                        multiline
                        rows={3}
                        value={values.requisitos}
                        onChange={(e) => setFieldValue('requisitos', e.target.value)}
                        helperText="Los espacios, tabs y saltos de línea se preservarán en la visualización"
                        disabled={isLoading}
                      />

                      <TextField
                        fullWidth
                        name="beneficios"
                        label="Beneficios"
                        multiline
                        rows={3}
                        value={values.beneficios}
                        onChange={(e) => setFieldValue('beneficios', e.target.value)}
                        helperText="Los espacios, tabs y saltos de línea se preservarán en la visualización"
                        disabled={isLoading}
                      />

                      <TextField
                        fullWidth
                        name="fecha_cierre"
                        label="Fecha de Cierre"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={values.fecha_cierre}
                        onChange={(e) => setFieldValue('fecha_cierre', e.target.value)}
                        error={touched.fecha_cierre && !!errors.fecha_cierre}
                        helperText={touched.fecha_cierre && errors.fecha_cierre}
                        disabled={isLoading}
                      />

                      <FormControlLabel
                        control={
                          <Checkbox
                            name="esta_activa"
                            checked={values.esta_activa}
                            onChange={(e) => setFieldValue('esta_activa', e.target.checked)}
                            disabled={isLoading}
                          />
                        }
                        label="Vacante Activa (visible en el portal público)"
                      />
                    </Stack>
                  </Paper>

                  {serverError && (
                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                      {serverError}
                    </Alert>
                  )}

                  <Divider />

                  {/* Botones de acción */}
                  <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    <Button
                      variant="outlined"
                      onClick={() => router.back()}
                      disabled={isLoading}
                      sx={{ textTransform: 'none' }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isLoading}
                      startIcon={isLoading ? <CircularProgress size={16} /> : <SaveOutlined />}
                      sx={{ 
                        textTransform: 'none',
                        minWidth: 140
                      }}
                    >
                      {isLoading 
                        ? 'Guardando...' 
                        : (isEditMode ? 'Actualizar Vacante' : 'Crear Vacante')
                      }
                    </Button>
                  </Stack>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      </Paper>
    </Container>
  );
};

export default VacanteForm;
