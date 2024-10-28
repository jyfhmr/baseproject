'use client';
import React from 'react';
import { salasData } from '../../salasData1';
import SentencePage from '@/components/SentencePage';
import columns from '@/components/columnsScheme';

const MonthPage: React.FC = ({ params }: any) => {
    console.log("los params", params);
    
    // Ajusta el valor de month para que coincida con las claves de salasData (por ejemplo, capitalizar la primera letra)
    const month = params.month[0];
    const monthStr = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase(); // Capitaliza la primera letra
    
    // Accede al dato de la sala y verifica si el mes existe en los datos
    const salaData = salasData["Penal"];
    const data = salaData[monthStr as keyof typeof salaData] || null; // Asigna null si no existe

    return (
        <>
            <SentencePage
                monthData={data}
                title={`Sentencias de sala Penal - ${monthStr}`}
                columns={columns}
            />
            <>Vengo del monthpage</>
        </>
    );
};

export default MonthPage;
