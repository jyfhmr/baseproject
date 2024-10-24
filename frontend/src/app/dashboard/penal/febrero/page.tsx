'use client'
import React from 'react';
import { salasData } from '../../salasData1'; // Ajusta la ruta según sea necesario
import SentencePage from '@/components/SentencePage';
import columns from '@/components/columnsScheme';
import { useSearchParams ,useRouter, useParams} from 'next/navigation';

// Obtener los datos para Enero de la sala Plena
const FebruaryPage: React.FC = () => {
  //const januaryData = salasData.Plena?.Enero ?? null; // Verificar si existen datos para enero

  const sala = "Penal"
  const month = "Febrero"

   const februaryData = (salasData as any )?.Penal.Febrero

return <SentencePage monthData={februaryData} title={`Sentencias de sala ${sala} - ${month}`} columns={columns} />;
};

export default FebruaryPage;
