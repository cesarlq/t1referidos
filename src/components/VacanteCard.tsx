import React from 'react';
import { Button } from '@mui/material'; // Import MUI Button

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
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{vacante.titulo_puesto}</h2>
        {/* Departamento con color primario y un poco más de peso */}
        <p className="text-sm text-primary dark:text-secondary font-semibold mb-3 uppercase tracking-wide">{vacante.departamento}</p>

        <div className="mb-5 space-y-2 text-sm text-text_primary_dark dark:text-gray-300">
          <p>
            <strong>Modalidad:</strong>
            {/* Tag de modalidad con color secundario y texto primario */}
            <span className="capitalize bg-secondary text-primary px-2 py-0.5 rounded-full text-xs font-medium ml-2">
              {vacante.modalidad}
            </span>
          </p>
          {vacante.ubicacion && (
            <p><strong>Ubicación:</strong> {vacante.ubicacion}</p>
          )}
          {vacante.salario_rango_min && vacante.salario_rango_max && (
            <p>
              <strong>Salario:</strong> ${vacante.salario_rango_min} - ${vacante.salario_rango_max} {vacante.moneda || 'USD'}
            </p>
          )}
          <div>
            <p className="mb-1"><strong>Tecnologías:</strong></p>
            <div className="flex flex-wrap gap-2">
              {vacante.tecnologias_requeridas.map((tech, index) => (
                // Tags de tecnologías con un estilo más neutro o usando el secundario
                <span
                  key={index}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* MUI Button using theme's primary color */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => onReferirClick(vacante)}
          // sx={{ py: 1.2, fontSize: '0.875rem', fontWeight: 'bold' }} // Example sx prop if further fine-tuning needed beyond theme
        >
          Referir Candidato
        </Button>
      </div>
    </div>
  );
};

export default VacanteCard;
