'use client'
import React from 'react';
import { salasData } from '../../salasData1'; // Ajusta la ruta según sea necesario
import SentencePage from '@/components/SentencePage';
import columns from '@/components/columnsScheme';
import { useSearchParams ,useRouter, useParams} from 'next/navigation';

// Obtener los datos para Enero de la sala Plena
const SeptemberPage: React.FC = () => {
  //const januaryData = salasData.Plena?.Enero ?? null; // Verificar si existen datos para enero

  const sala = "Electoral"
  const month = "Septiembre"

   const septemberData = (salasData as any )?.Electoral.Septiembre

return <SentencePage monthData={septemberData} title={`Sentencias de sala ${sala} - ${month}`} columns={columns} />;
};

export default SeptemberPage;
