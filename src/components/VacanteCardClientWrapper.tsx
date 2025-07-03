"use client";

import React from 'react';
import VacanteCard, { Vacante } from './VacanteCard'; // Ajusta la ruta si es necesario

interface VacanteCardClientWrapperProps {
  vacante: Vacante;
}

const VacanteCardClientWrapper: React.FC<VacanteCardClientWrapperProps> = ({ vacante }) => {
  const handleReferirClick = (vacanteId: string) => {
    // Esta función se ejecutará en el cliente.
    // Aquí se gestionará la apertura del modal/formulario.
    alert(`Abrir formulario para referir a la vacante ID: ${vacanteId}\n(Funcionalidad de modal/formulario pendiente)`);
    console.log(`Referir candidato para la vacante ID: ${vacanteId}`);
  };

  return <VacanteCard vacante={vacante} onReferirClick={handleReferirClick} />;
};

export default VacanteCardClientWrapper;
