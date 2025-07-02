"use client";

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { Vacante } from '@/components/VacanteCard'; // Reutilizamos la interfaz base

// Interfaz para los datos del formulario de vacante
export interface VacanteFormData extends Omit<Partial<Vacante>, 'id' | 'tecnologias_requeridas' | 'modalidad' | 'moneda' | 'salario_rango_min' | 'salario_rango_max' | 'esta_activa'> {
  // Campos que son obligatorios en el formulario o tienen un tipo específico
  titulo_puesto: string;
  departamento: string;
  modalidad: 'remoto' | 'presencial' | 'hibrido';
  descripcion_puesto: string;
  tecnologias_requeridas: string[]; // Se manejará como array de strings

  // Campos opcionales con tipos específicos
  ubicacion?: string;
  salario_rango_min?: number | ''; // Permitir string vacío para el input number
  salario_rango_max?: number | ''; // Permitir string vacío para el input number
  moneda?: 'USD' | 'MXN' | 'EUR' | '';
  responsabilidades?: string;
  requisitos?: string;
  beneficios?: string;
  fecha_cierre?: string; // Formato YYYY-MM-DD
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
  moneda: Yup.string().oneOf(['USD', 'MXN', 'EUR', '', null] as const, 'Moneda inválida').nullable(),
  responsabilidades: Yup.string(),
  requisitos: Yup.string(),
  beneficios: Yup.string(),
  fecha_cierre: Yup.date().nullable().min(new Date(), 'La fecha de cierre no puede ser en el pasado'),
  esta_activa: Yup.boolean().required(),
});


interface VacanteFormProps {
  initialData?: Partial<Vacante>; // Para editar
  onSubmitAction: (data: VacanteFormData) => Promise<{ success: boolean; error?: string; data?: any }>;
  isEditMode: boolean;
}

const VacanteForm: React.FC<VacanteFormProps> = ({ initialData, onSubmitAction, isEditMode }) => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

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

  const handleSubmit = async (values: VacanteFormData, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    setServerError(null);
    setSubmitting(true);

    // Limpiar valores numéricos vacíos a null para la BD
    const payload = {
      ...values,
      salario_rango_min: values.salario_rango_min === '' ? null : Number(values.salario_rango_min),
      salario_rango_max: values.salario_rango_max === '' ? null : Number(values.salario_rango_max),
      moneda: values.moneda === '' ? null : values.moneda,
      fecha_cierre: values.fecha_cierre === '' ? null : values.fecha_cierre,
    };

    const result = await onSubmitAction(payload);

    if (result.success) {
      router.push('/admin/vacantes'); // Redirigir a la lista
      router.refresh(); // Forzar actualización de la lista
    } else {
      setServerError(result.error || 'Ocurrió un error al guardar la vacante.');
    }
    setSubmitting(false);
  };

  const commonInputClass = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  const errorTextClass = "text-red-600 text-sm mt-1";

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize // Para que el formulario se actualice si initialData cambia
    >
      {({ isSubmitting, values, errors, touched, setFieldValue }) => (
        <Form className="space-y-6 p-4 md:p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {isEditMode ? 'Editar Vacante' : 'Agregar Nueva Vacante'}
          </h2>

          {/* Campos del formulario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="titulo_puesto" className="block text-sm font-medium text-gray-700">Título del Puesto <span className="text-red-500">*</span></label>
              <Field name="titulo_puesto" type="text" className={`${commonInputClass} ${errors.titulo_puesto && touched.titulo_puesto ? 'border-red-500' : ''}`} />
              <ErrorMessage name="titulo_puesto" component="div" className={errorTextClass} />
            </div>
            <div>
              <label htmlFor="departamento" className="block text-sm font-medium text-gray-700">Departamento <span className="text-red-500">*</span></label>
              <Field name="departamento" type="text" className={`${commonInputClass} ${errors.departamento && touched.departamento ? 'border-red-500' : ''}`} />
              <ErrorMessage name="departamento" component="div" className={errorTextClass} />
            </div>
          </div>

          <div>
            <label htmlFor="modalidad" className="block text-sm font-medium text-gray-700">Modalidad <span className="text-red-500">*</span></label>
            <Field name="modalidad" as="select" className={`${commonInputClass} ${errors.modalidad && touched.modalidad ? 'border-red-500' : ''}`}>
              <option value="remoto">Remoto</option>
              <option value="presencial">Presencial</option>
              <option value="hibrido">Híbrido</option>
            </Field>
            <ErrorMessage name="modalidad" component="div" className={errorTextClass} />
          </div>

          <div>
            <label htmlFor="descripcion_puesto" className="block text-sm font-medium text-gray-700">Descripción del Puesto <span className="text-red-500">*</span></label>
            <Field name="descripcion_puesto" as="textarea" rows="5" className={`${commonInputClass} ${errors.descripcion_puesto && touched.descripcion_puesto ? 'border-red-500' : ''}`} />
            <ErrorMessage name="descripcion_puesto" component="div" className={errorTextClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tecnologías Requeridas <span className="text-red-500">*</span></label>
            <FieldArray name="tecnologias_requeridas">
              {({ push, remove, form }) => (
                <div>
                  {form.values.tecnologias_requeridas.map((tech: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 mt-2">
                      <Field name={`tecnologias_requeridas.${index}`} type="text" className={`${commonInputClass} flex-grow`} />
                      <button type="button" onClick={() => remove(index)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <ErrorMessage name="tecnologias_requeridas" component="div" className={errorTextClass} />
                   { typeof errors.tecnologias_requeridas === 'string' && <div className={errorTextClass}>{errors.tecnologias_requeridas}</div> }
                  <button type="button" onClick={() => push('')} className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    + Agregar Tecnología
                  </button>
                </div>
              )}
            </FieldArray>
          </div>

          {/* Campos Opcionales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700">Ubicación (si no es remoto)</label>
              <Field name="ubicacion" type="text" className={commonInputClass} />
            </div>
            <div>
              <label htmlFor="moneda" className="block text-sm font-medium text-gray-700">Moneda Salario</label>
              <Field name="moneda" as="select" className={commonInputClass}>
                <option value="USD">USD</option>
                <option value="MXN">MXN</option>
                <option value="EUR">EUR</option>
                <option value="">No especificar</option>
              </Field>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="salario_rango_min" className="block text-sm font-medium text-gray-700">Salario Mínimo (Opcional)</label>
              <Field name="salario_rango_min" type="number" step="any" className={`${commonInputClass} ${errors.salario_rango_min && touched.salario_rango_min ? 'border-red-500' : ''}`} />
              <ErrorMessage name="salario_rango_min" component="div" className={errorTextClass} />
            </div>
            <div>
              <label htmlFor="salario_rango_max" className="block text-sm font-medium text-gray-700">Salario Máximo (Opcional)</label>
              <Field name="salario_rango_max" type="number" step="any" className={`${commonInputClass} ${errors.salario_rango_max && touched.salario_rango_max ? 'border-red-500' : ''}`} />
              <ErrorMessage name="salario_rango_max" component="div" className={errorTextClass} />
            </div>
          </div>

          <div>
            <label htmlFor="responsabilidades" className="block text-sm font-medium text-gray-700">Responsabilidades (Opcional)</label>
            <Field name="responsabilidades" as="textarea" rows="3" className={commonInputClass} />
          </div>
          <div>
            <label htmlFor="requisitos" className="block text-sm font-medium text-gray-700">Requisitos (Opcional)</label>
            <Field name="requisitos" as="textarea" rows="3" className={commonInputClass} />
          </div>
          <div>
            <label htmlFor="beneficios" className="block text-sm font-medium text-gray-700">Beneficios (Opcional)</label>
            <Field name="beneficios" as="textarea" rows="3" className={commonInputClass} />
          </div>

          <div>
            <label htmlFor="fecha_cierre" className="block text-sm font-medium text-gray-700">Fecha de Cierre (Opcional)</label>
            <Field name="fecha_cierre" type="date" className={`${commonInputClass} ${errors.fecha_cierre && touched.fecha_cierre ? 'border-red-500' : ''}`} />
            <ErrorMessage name="fecha_cierre" component="div" className={errorTextClass} />
          </div>

          <div className="flex items-center">
            <Field type="checkbox" name="esta_activa" id="esta_activa" className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
            <label htmlFor="esta_activa" className="ml-2 block text-sm text-gray-900">
              Vacante Activa (visible en el portal público)
            </label>
          </div>

          {serverError && <div className="text-red-600 text-sm p-3 bg-red-100 border border-red-300 rounded-md">{serverError}</div>}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : (isEditMode ? 'Actualizar Vacante' : 'Crear Vacante')}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default VacanteForm;
