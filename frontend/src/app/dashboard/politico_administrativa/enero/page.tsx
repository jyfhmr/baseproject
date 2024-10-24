'use client'
import React from 'react';
import { salasData } from '../../salasData1'; // Ajusta la ruta según sea necesario
import SentencePage from '@/components/SentencePage';
import columns from '@/components/columnsScheme';
import { useSearchParams ,useRouter, useParams} from 'next/navigation';

// Obtener los datos para Enero de la sala Plena
const JanuaryPage: React.FC = () => {
  //const januaryData = salasData.Plena?.Enero ?? null; // Verificar si existen datos para enero

  const sala = "Político Administrativa"
  const month = "Enero"

   const januaryData = (salasData as any )?.['Político Administrativa'].Enero

return <SentencePage monthData={januaryData} title={`Sentencias de sala ${sala} - ${month}`} columns={columns} />;
};

export default JanuaryPage;
