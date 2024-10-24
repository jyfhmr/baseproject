import React from 'react';
import { salasData } from '../../salasData1'; // Ajusta la ruta según sea necesario
import SentencePage from '@/components/SentencePage';
import columns from '@/components/columnsScheme'


// Obtener los datos para Febrero de la sala Plena
const FebruaryPage: React.FC = () => {
 
  const februaryData = (salasData as any )?.Plena.Febrero

  return <SentencePage monthData={februaryData} title="Sentencias de Plena - Febrero" columns={columns} />;

};

export default FebruaryPage;
