import React from 'react';
import { salasData } from '../../salasData1'; // Ajusta la ruta según sea necesario
import SentencePage from '@/components/SentencePage';
import columns from '@/components/columnsScheme';

// Obtener los datos para Octubre de la sala Plena
const OctoberPage: React.FC = () => {
  const octoberData = salasData.Plena.Octubre; // Datos de octubre
  return <SentencePage monthData={octoberData} title="Sentencias de Octubre" columns={columns} />;
};

export default OctoberPage;

