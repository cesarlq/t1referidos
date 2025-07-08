"use client";

import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
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
  CircularProgress,
  FormHelperText
} from '@mui/material';
import { 
  AddOutlined, 
  RemoveOutlined, 
  ArrowBackOutlined,
  SaveOutlined 
} from '@mui/icons-material';
import { Vacante } from '@/components/VacanteCard';
import { useFormWithSnackbar } from '@/hooks/useApiWithSnackbar';
import DebugInfo from './DebugInfo';
import RichTextEditor from './RichTextEditor';

// Interfaz para los datos del formulario de vacante
export interface VacanteFormData {
  titulo_puesto: string;
  departamento: string;
  modalidad: 'remoto' | 'presencial' | 'hibrido';
  descripcion_puesto: string;
  tecnologias_requeridas: string[]; // Asegúrate de que esto esté definido como array
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
    descripcion_puesto: initialData?.descripcion_puesto || '',
    tecnologias_requeridas: initialData?.tecnologias_requeridas || [''],
    ubicacion: initialData?.ubicacion || '',
    salario_rango_min: initialData?.salario_rango_min ?? '',
    salario_rango_max: initialData?.salario_rango_max ?? '',
    moneda: initialData?.moneda as VacanteFormData['moneda'] || 'USD',
    responsabilidades: initialData?.responsabilidades || '',
    requisitos: initialData?.requisitos || '',
    beneficios: initialData?.beneficios || '',
    fecha_cierre: initialData?.fecha_cierre ? new Date(initialData.fecha_cierre).toISOString().split('T')[0] : '',
    esta_activa: initialData?.esta_activa ?? true,
  };

  // React Hook Form setup
  const {
    control,
    handleSubmit: hookFormHandleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm<VacanteFormData>({
    defaultValues: formInitialValues,
    mode: 'onChange'
  });

const { fields, append, remove } = useFieldArray<VacanteFormData>({
  control,
  name: 'tecnologias_requeridas'
});

  const watchedValues = watch();

  const handleSubmit = async (values: VacanteFormData) => {
    console.log('🎯 Iniciando handleSubmit en VacanteForm');
    console.log('📋 Valores del formulario:', values);
    
    setServerError(null);

    try {
      // Asegurar que tecnologias_requeridas sea un array
      const formData: VacanteFormData = {
        ...values,
        tecnologias_requeridas: values.tecnologias_requeridas || [''],
        ubicacion: values.ubicacion || '',
        responsabilidades: values.responsabilidades || '',
        requisitos: values.requisitos || '',
        beneficios: values.beneficios || '',
        fecha_cierre: values.fecha_cierre || '',
      };

      // Limpiar valores numéricos vacíos a null para la BD
      const payload = {
        ...formData,
        salario_rango_min: formData.salario_rango_min === '' ? null : Number(formData.salario_rango_min),
        salario_rango_max: formData.salario_rango_max === '' ? null : Number(formData.salario_rango_max),
        moneda: formData.moneda === '' ? null : formData.moneda,
        fecha_cierre: formData.fecha_cierre === '' ? null : formData.fecha_cierre,
      };

      console.log('📦 Payload preparado:', payload);

      const result = await submitForm(async () => {
        console.log('🔄 Ejecutando onSubmitAction...');
        const response = await onSubmitAction(payload as VacanteFormData);
        console.log('📨 Respuesta de onSubmitAction:', response);
        
        if (!response.success) {
          console.error('❌ Error en la respuesta:', response.error);
          throw new Error(response.error || 'Error al guardar la vacante');
        }
        return response;
      }, isEditMode ? 'vacante actualizada' : 'vacante creada');

      console.log('✅ Resultado de submitForm:', result);

      if (result) {
        console.log('🚀 Redirigiendo a /admin/vacantes');
        router.push('/admin/vacantes');
        router.refresh();
      } else {
        console.error('❌ submitForm devolvió null/false');
        setServerError('Error al guardar la vacante. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('💥 Error inesperado en handleSubmit:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setServerError(`Error inesperado: ${errorMessage}`);
    }
  };

  // Función de debug que ejecuta la acción directamente
  const handleDebugSubmit = async (values: VacanteFormData) => {
    console.log('🐛 DEBUG: Iniciando handleDebugSubmit');
    console.log('🐛 DEBUG: Valores recibidos:', values);
    
    try {
      // Datos de prueba mínimos
      const testData: VacanteFormData = {
        titulo_puesto: values.titulo_puesto || 'Test Vacante Debug',
        departamento: values.departamento || 'IT',
        modalidad: values.modalidad || 'remoto',
        descripcion_puesto: values.descripcion_puesto || 'Esta es una vacante de prueba para debugging. '.repeat(5),
        tecnologias_requeridas: values.tecnologias_requeridas.filter(t => t.trim() !== '') || ['JavaScript'],
        ubicacion: values.ubicacion || '',
        salario_rango_min: values.salario_rango_min === '' ? '' : values.salario_rango_min,
        salario_rango_max: values.salario_rango_max === '' ? '' : values.salario_rango_max,
        moneda: values.moneda === '' ? '' : values.moneda,
        responsabilidades: values.responsabilidades || '',
        requisitos: values.requisitos || '',
        beneficios: values.beneficios || '',
        fecha_cierre: values.fecha_cierre || '',
        esta_activa: values.esta_activa ?? true,
      };

      console.log('🐛 DEBUG: Datos de prueba preparados:', testData);
      
      console.log('🐛 DEBUG: Ejecutando onSubmitAction directamente...');
      const response = await onSubmitAction(testData);
      console.log('🐛 DEBUG: Respuesta directa:', response);
      
      if (response.success) {
        console.log('🐛 DEBUG: ¡Éxito! La vacante se creó correctamente');
        setServerError(null);
        alert('¡DEBUG: Vacante creada exitosamente!');
        router.push('/admin/vacantes');
        router.refresh();
      } else {
        console.error('🐛 DEBUG: Error en la respuesta:', response.error);
        setServerError(`DEBUG Error: ${response.error}`);
        alert(`DEBUG Error: ${response.error}`);
      }
    } catch (error) {
      console.error('🐛 DEBUG: Error inesperado:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setServerError(`DEBUG Error inesperado: ${errorMessage}`);
      alert(`DEBUG Error inesperado: ${errorMessage}`);
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
          <DebugInfo 
            data={{
              formInitialValues,
              isLoading,
              serverError,
              isEditMode,
              environment: process.env.NODE_ENV
            }} 
            title="Debug Info - Formulario de Vacante" 
          />
          
          <form onSubmit={hookFormHandleSubmit(handleSubmit)}>
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
                    <Controller
                      name="titulo_puesto"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Título del Puesto"
                          required
                          error={!!error}
                          helperText={error?.message}
                          disabled={isLoading}
                        />
                      )}
                    />
                    <Controller
                      name="departamento"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Departamento"
                          required
                          error={!!error}
                          helperText={error?.message}
                          disabled={isLoading}
                        />
                      )}
                    />
                  </Stack>

                  <Controller
                    name="modalidad"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth disabled={isLoading} error={!!error}>
                        <InputLabel required>Modalidad</InputLabel>
                        <Select
                          {...field}
                          label="Modalidad"
                        >
                          <MenuItem value="remoto">Remoto</MenuItem>
                          <MenuItem value="presencial">Presencial</MenuItem>
                          <MenuItem value="hibrido">Híbrido</MenuItem>
                        </Select>
                        {error && <FormHelperText>{error.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />

                  <Controller
                    name="descripcion_puesto"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        label="Descripción del Puesto"
                        required
                        error={!!error}
                        helperText={error?.message}
                        disabled={isLoading}
                      />
                    )}
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
                <Stack spacing={2}>
                  {fields.map((field, index) => (
                    <Stack key={field.id} direction="row" spacing={1} alignItems="center">
                      <Controller
                        name={`tecnologias_requeridas.${index}`}
                        control={control}
                        render={({ field: inputField, fieldState: { error } }) => (
                          <TextField
                            {...inputField}
                            fullWidth
                            label={`Tecnología ${index + 1}`}
                            error={!!error}
                            helperText={error?.message}
                            disabled={isLoading}
                          />
                        )}
                      />
                      <IconButton
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1 || isLoading}
                        color="error"
                        sx={{ minWidth: 40 }}
                      >
                        <RemoveOutlined />
                      </IconButton>
                    </Stack>
                  ))}
                  <Button
                    startIcon={<AddOutlined />}
                    onClick={() => append('')}
                    variant="outlined"
                    disabled={isLoading}
                    sx={{ alignSelf: 'flex-start', textTransform: 'none' }}
                  >
                    Agregar Tecnología
                  </Button>
                  {errors.tecnologias_requeridas && (
                    <Typography color="error" variant="body2">
                      {errors.tecnologias_requeridas.message}
                    </Typography>
                  )}
                </Stack>
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
                    <Controller
                      name="ubicacion"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Ubicación (si no es remoto)"
                          disabled={isLoading}
                        />
                      )}
                    />
                    <Controller
                      name="moneda"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth disabled={isLoading}>
                          <InputLabel>Moneda</InputLabel>
                          <Select
                            {...field}
                            label="Moneda"
                          >
                            <MenuItem value="USD">USD</MenuItem>
                            <MenuItem value="MXN">MXN</MenuItem>
                            <MenuItem value="EUR">EUR</MenuItem>
                            <MenuItem value="">No especificar</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Controller
                      name="salario_rango_min"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Salario Mínimo"
                          type="number"
                          error={!!error}
                          helperText={error?.message}
                          disabled={isLoading}
                        />
                      )}
                    />
                    <Controller
                      name="salario_rango_max"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Salario Máximo"
                          type="number"
                          error={!!error}
                          helperText={error?.message}
                          disabled={isLoading}
                        />
                      )}
                    />
                  </Stack>

                  <Controller
                    name="responsabilidades"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Responsabilidades"
                        multiline
                        rows={3}
                        disabled={isLoading}
                      />
                    )}
                  />

                  <Controller
                    name="requisitos"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Requisitos"
                        multiline
                        rows={3}
                        disabled={isLoading}
                      />
                    )}
                  />

                  <Controller
                    name="beneficios"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Beneficios"
                        multiline
                        rows={3}
                        disabled={isLoading}
                      />
                    )}
                  />

                  <Controller
                    name="fecha_cierre"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Fecha de Cierre"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        error={!!error}
                        helperText={error?.message}
                        disabled={isLoading}
                      />
                    )}
                  />

                  <Controller
                    name="esta_activa"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value}
                            onChange={field.onChange}
                            disabled={isLoading}
                          />
                        }
                        label="Vacante Activa (visible en el portal público)"
                      />
                    )}
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
                
                {/* Botón de Debug - Solo visible con ?debug=true */}
                {(process.env.NODE_ENV === 'development' || 
                  (typeof window !== 'undefined' && window.location.search.includes('debug=true'))) && (
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={() => handleDebugSubmit(watchedValues)}
                    disabled={isLoading}
                    sx={{ 
                      textTransform: 'none',
                      borderColor: 'warning.main',
                      color: 'warning.main',
                      '&:hover': {
                        borderColor: 'warning.dark',
                        color: 'warning.dark',
                        bgcolor: 'warning.50'
                      }
                    }}
                  >
                    🐛 DEBUG: Crear Vacante
                  </Button>
                )}
                
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading || !isValid}
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
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default VacanteForm;
