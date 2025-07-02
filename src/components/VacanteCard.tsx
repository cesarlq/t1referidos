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
}

const VacanteCard: React.FC<VacanteCardProps> = ({ vacante }) => {
  return (
    <div style={{ border: '1px solid #ccc', margin: '10px', padding: '10px', borderRadius: '8px' }}>
      <h2>{vacante.titulo_puesto}</h2>
      <p><strong>Departamento:</strong> {vacante.departamento}</p>
      <p><strong>Modalidad:</strong> {vacante.modalidad}</p>
      {vacante.ubicacion && <p><strong>Ubicación:</strong> {vacante.ubicacion}</p>}
      {vacante.salario_rango_min && vacante.salario_rango_max && (
        <p>
          <strong>Salario:</strong> ${vacante.salario_rango_min} - ${vacante.salario_rango_max} {vacante.moneda || 'USD'}
        </p>
      )}
      <p><strong>Tecnologías:</strong> {vacante.tecnologias_requeridas.join(', ')}</p>
      <button>Referir Candidato</button>
    </div>
  );
};

export default VacanteCard;
