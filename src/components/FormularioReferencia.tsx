"use client";

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { XMarkIcon } from '@heroicons/react/24/solid'; // Icono para cerrar

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
  // vacanteTitulo ya no es necesario aquí, se pasará al Modal
  onSubmitSuccess: () => void;
  onCancel: () => void; // Podría ser útil para lógica interna del form si es necesario, o para el botón Cancelar
}

const FormularioReferencia: React.FC<FormularioReferenciaProps> = ({ vacanteId, onSubmitSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // El efecto de overflow del body lo manejará el Modal genérico si es necesario,
  // o se puede decidir mantenerlo si este formulario siempre va en un modal que lo requiera.
  // Por ahora, lo comentaré para evitar duplicidad si Modal.tsx lo gestiona.
  // useEffect(() => {
  //   document.body.style.overflow = 'hidden';
  //   return () => {
  //     document.body.style.overflow = 'unset';
  //   };
  // }, []);


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
    setIsSubmitting(true);
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

    try {
      const response = await fetch('/api/referencias', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || `Error del servidor: ${response.status}`);
      onSubmitSuccess();
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setSubmitError(error instanceof Error ? error.message : 'Ocurrió un error desconocido.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const commonInputClass = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-50";
  const errorTextClass = "text-red-600 text-sm mt-1";

  // El div principal que simula el modal y el botón de cierre superior han sido removidos.
  // El título también se ha removido de aquí, ya que será manejado por el componente Modal.
  // Los estilos de padding, overflow, etc., del contenido del formulario se mantienen o ajustan según sea necesario.
  return (
    <div className="space-y-6"> {/* Anteriormente p-4 sm:p-6, ahora el padding lo da el Modal */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, errors, touched }) => (
          <Form className="space-y-6">
            <fieldset className="border p-4 rounded-md">
              <legend className="text-base font-medium text-gray-700 dark:text-gray-300 px-2">Tu Información</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
                <div>
                  <label htmlFor="referidor_nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre Completo <span className="text-red-500">*</span></label>
                  <Field name="referidor_nombre" type="text" className={`${commonInputClass} dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.referidor_nombre && touched.referidor_nombre ? 'border-red-500' : ''}`} />
                  <ErrorMessage name="referidor_nombre" component="div" className={errorTextClass} />
                </div>
                <div>
                  <label htmlFor="referidor_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo Electrónico <span className="text-red-500">*</span></label>
                  <Field name="referidor_email" type="email" className={`${commonInputClass} dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.referidor_email && touched.referidor_email ? 'border-red-500' : ''}`} />
                  <ErrorMessage name="referidor_email" component="div" className={errorTextClass} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="referidor_empresa" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Empresa (Opcional)</label>
                  <Field name="referidor_empresa" type="text" className={`${commonInputClass} dark:bg-gray-700 dark:border-gray-600 dark:text-white`} />
                </div>
              </div>
            </fieldset>

            <fieldset className="border p-4 rounded-md">
              <legend className="text-base font-medium text-gray-700 dark:text-gray-300 px-2">Información del Candidato</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
                <div>
                  <label htmlFor="candidato_nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre Completo del Candidato <span className="text-red-500">*</span></label>
                  <Field name="candidato_nombre" type="text" className={`${commonInputClass} dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.candidato_nombre && touched.candidato_nombre ? 'border-red-500' : ''}`} />
                  <ErrorMessage name="candidato_nombre" component="div" className={errorTextClass} />
                </div>
                <div>
                  <label htmlFor="candidato_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo Electrónico del Candidato <span className="text-red-500">*</span></label>
                  <Field name="candidato_email" type="email" className={`${commonInputClass} dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.candidato_email && touched.candidato_email ? 'border-red-500' : ''}`} />
                  <ErrorMessage name="candidato_email" component="div" className={errorTextClass} />
                </div>
                <div>
                  <label htmlFor="candidato_telefono" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono (Opcional)</label>
                  <Field name="candidato_telefono" type="tel" className={`${commonInputClass} dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.candidato_telefono && touched.candidato_telefono ? 'border-red-500' : ''}`} />
                  <ErrorMessage name="candidato_telefono" component="div" className={errorTextClass} />
                </div>
                <div>
                  <label htmlFor="candidato_linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Perfil de LinkedIn (Opcional)</label>
                  <Field name="candidato_linkedin" type="url" placeholder="https://linkedin.com/in/..." className={`${commonInputClass} dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.candidato_linkedin && touched.candidato_linkedin ? 'border-red-500' : ''}`} />
                  <ErrorMessage name="candidato_linkedin" component="div" className={errorTextClass} />
                </div>
              </div>
            </fieldset>

            <fieldset className="border p-4 rounded-md">
              <legend className="text-base font-medium text-gray-700 dark:text-gray-300 px-2">Detalles de la Referencia</legend>
              <div className="space-y-5">
                <div>
                  <label htmlFor="relacion_con_candidato" className="block text-sm font-medium text-gray-700 dark:text-gray-300">¿Cuál es tu relación con el candidato? <span className="text-red-500">*</span></label>
                  <Field name="relacion_con_candidato" as="select" className={`${commonInputClass} dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.relacion_con_candidato && touched.relacion_con_candidato ? 'border-red-500' : ''}`}>
                    <option value="">Selecciona una opción</option>
                    <option value="colega_actual">Colega Actual</option>
                    <option value="ex_colega">Ex Colega</option>
                    <option value="amigo_conocido">Amigo/Conocido Personal</option>
                    <option value="contacto_profesional">Contacto Profesional (Networking)</option>
                    <option value="mentor_mentee">Mentor/Mentee</option>
                    <option value="otro">Otro</option>
                  </Field>
                  <ErrorMessage name="relacion_con_candidato" component="div" className={errorTextClass} />
                </div>
                <div>
                  <label htmlFor="años_conociendo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">¿Años conociendo al candidato? (Opcional)</label>
                  <Field name="años_conociendo" type="number" min="0" className={`${commonInputClass} dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.años_conociendo && touched.años_conociendo ? 'border-red-500' : ''}`} />
                  <ErrorMessage name="años_conociendo" component="div" className={errorTextClass} />
                </div>
                <div>
                  <label htmlFor="justificacion_recomendacion" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Justificación de la Recomendación <span className="text-red-500">*</span></label>
                  <Field name="justificacion_recomendacion" as="textarea" rows="3" className={`${commonInputClass} dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.justificacion_recomendacion && touched.justificacion_recomendacion ? 'border-red-500' : ''}`} />
                  <ErrorMessage name="justificacion_recomendacion" component="div" className={errorTextClass} />
                </div>
                <div>
                  <label htmlFor="fortalezas_principales" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Principales Fortalezas (Opcional, separadas por comas)</label>
                  <Field name="fortalezas_principales" type="text" placeholder="Ej: Liderazgo, Comunicación" className={`${commonInputClass} dark:bg-gray-700 dark:border-gray-600 dark:text-white`} />
                </div>
                <div>
                  <label htmlFor="cv" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Adjuntar CV (PDF, DOC, DOCX - Máx 5MB)</label>
                  <input
                    id="cv"
                    name="cv"
                    type="file"
                    accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(event) => {
                      setFieldValue("cv", event.currentTarget.files ? event.currentTarget.files[0] : null);
                    }}
                    className={`mt-1 block w-full text-sm text-gray-700 dark:text-gray-300 file:cursor-pointer
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-50 file:text-indigo-700
                      dark:file:bg-indigo-800 dark:file:text-indigo-300
                      hover:file:bg-indigo-100 dark:hover:file:bg-indigo-700
                      ${errors.cv && touched.cv ? 'ring-1 ring-red-500' : 'border border-gray-300 dark:border-gray-600 rounded-md'} ${commonInputClass} p-0`}
                  />
                  <ErrorMessage name="cv" component="div" className={errorTextClass} />
                </div>
              </div>
            </fieldset>

            {submitError && <div className="my-3 text-red-700 dark:text-red-400 text-sm text-center p-3 bg-red-100 dark:bg-red-900 dark:bg-opacity-30 rounded-md border border-red-300 dark:border-red-700">{submitError}</div>}

            {/* Los botones de acción ahora estarán fuera del scroll del formulario, usualmente en el pie del Modal */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 transition-colors duration-150"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  'Enviar Referencia'
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormularioReferencia;
