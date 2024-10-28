'use client';
import React from 'react';
import { salasData } from '../../../salasData1';
import SentencePage from '@/components/SentencePage';
import columns from '@/components/columnsScheme';

const MonthPage: React.FC = ({ params }: any) => {
    console.log("los params", params);
    
    // Capitalizar sala y mes para coincidir con las claves en salasData
    const sala = params.sala;
    const salaStr = sala.charAt(0).toUpperCase() + sala.slice(1).toLowerCase();
    const month = params.mes;
    const monthStr = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
    
    // Especificar que salaStr es una clave de salasData
    const salaData = salasData[salaStr as keyof typeof salasData];
    const data = salaData?.[monthStr as keyof typeof salaData] || null; // Asigna null si el mes no existe

    return (
        <>
            <SentencePage
                monthData={data}
                title={`Sentencias de sala ${salaStr} - ${monthStr}`}
                columns={columns}
            />
        </>
    );
};

export default MonthPage;
