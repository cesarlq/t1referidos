"use client";

import React, { useState } from 'react';
import VacanteCard, { Vacante } from './VacanteCard';
import Modal from './Modal';
import FormularioReferencia from './FormularioReferencia';

interface VacanteCardClientWrapperProps {
  vacante: Vacante;
}

const VacanteCardClientWrapper: React.FC<VacanteCardClientWrapperProps> = ({ vacante }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVacante, setSelectedVacante] = useState<Vacante | null>(null);

  const handleReferirClick = (clickedVacante: Vacante) => {
    setSelectedVacante(clickedVacante);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVacante(null);
  };

  const handleFormSubmitSuccess = () => {
    // Aquí podrías añadir lógica adicional si es necesario después de un envío exitoso
    // por ejemplo, mostrar un mensaje de "gracias", etc.
    console.log("Formulario enviado con éxito");
    handleCloseModal(); // Cierra el modal después del envío
  };

  return (
    <>
      <VacanteCard vacante={vacante} onReferirClick={() => handleReferirClick(vacante)} />

      {isModalOpen && selectedVacante && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={`Referir Candidato para: ${selectedVacante.titulo_puesto}`}
        >
          <FormularioReferencia
            vacanteId={selectedVacante.id}
            onSubmitSuccess={handleFormSubmitSuccess}
            onCancel={handleCloseModal} // El botón "Cancelar" del formulario también cierra el modal
          />
        </Modal>
      )}
    </>
  );
};

export default VacanteCardClientWrapper;
