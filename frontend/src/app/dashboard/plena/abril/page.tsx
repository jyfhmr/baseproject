import React from 'react';
import { salasData } from '../../salasData1'; // Ajusta la ruta según sea necesario
import SentencePage from '@/components/SentencePage';
import columns from '@/components/columnsScheme';

// Obtener los datos para Abril de la sala Plena
const AprilPage: React.FC = () => {
  const aprilData = salasData.Plena.Abril; // Datos de abril
  return <SentencePage monthData={aprilData} title="Sentencias de Abril" columns={columns} />;
};

export default AprilPage;
