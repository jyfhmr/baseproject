import React from 'react';
import { salasData } from '../../salasData1'; // Ajusta la ruta según sea necesario
import SentencePage from '@/components/SentencePage';
import columns from '@/components/columnsScheme';

// Obtener los datos para Agosto de la sala Plena
const AugustPage: React.FC = () => {
  const augustData = salasData.Plena.Agosto; // Datos de agosto
  return <SentencePage monthData={augustData} title="Sentencias de Agosto" columns={columns} />;
};

export default AugustPage;
