'use client'
import React from 'react';
import { salasData } from '../../salasData1'; // Ajusta la ruta según sea necesario
import SentencePage from '@/components/SentencePage';
import columns from '@/components/columnsScheme';
import { useSearchParams ,useRouter, useParams} from 'next/navigation';

// Obtener los datos para Enero de la sala Plena
const DecemberPage: React.FC = () => {
  //const januaryData = salasData.Plena?.Enero ?? null; // Verificar si existen datos para enero

  const sala = "Constitucional"
  const month = "Diciembre"

   const decemberData = (salasData as any )?.Constitucional.Diciembre

return <SentencePage monthData={decemberData} title={`Sentencias de sala ${sala} - ${month}`} columns={columns} />;
};

export default DecemberPage;