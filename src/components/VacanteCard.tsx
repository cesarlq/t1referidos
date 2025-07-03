import React from 'react';

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
  onReferirClick: (vacante: Vacante) => void; // Cambiado de vacanteId: string a vacante: Vacante
}

const VacanteCard: React.FC<VacanteCardProps> = ({ vacante, onReferirClick }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{vacante.titulo_puesto}</h2>
        <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mb-1 uppercase">{vacante.departamento}</p>
        <div className="mb-4 space-y-2">
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Modalidad:</strong> <span className="capitalize bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-xs">{vacante.modalidad}</span>
          </p>
          {vacante.ubicacion && (
            <p className="text-gray-700 dark:text-gray-300"><strong>Ubicación:</strong> {vacante.ubicacion}</p>
          )}
          {vacante.salario_rango_min && vacante.salario_rango_max && (
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Salario:</strong> ${vacante.salario_rango_min} - ${vacante.salario_rango_max} {vacante.moneda || 'USD'}
            </p>
          )}
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-1"><strong>Tecnologías:</strong></p>
            <div className="flex flex-wrap gap-2">
              {vacante.tecnologias_requeridas.map((tech, index) => (
                <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={() => onReferirClick(vacante)} // Se pasa el objeto vacante completo
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Referir Candidato
        </button>
      </div>
    </div>
  );
};

export default VacanteCard;
