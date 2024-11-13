'use client';
import React, { useState, useEffect } from 'react';
import { salasData } from '../../../salasData1';
import SentencePage from '@/components/SentencePage';
import columns from '@/components/columnsScheme';
import { getSentencesPerMonthAndSalaFromBackend } from "@/services/getSentencesPerMonthAndSalaFromBackend"
import Loading from '@/components/Loading';

const MonthPage: React.FC = ({ params }: any) => {
    console.log("Los params", params);

    // Capitalizar sala y mes para coincidir con las claves en salasData
    const sala = params.sala;
    const salaStr = sala.charAt(0).toUpperCase() + sala.slice(1).toLowerCase();
    const month = params.mes;
    const monthStr = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();

    // Especificar que salaStr es una clave de salasData
    const salaData = salasData[salaStr as keyof typeof salasData];

    // Estado para manejar el estado de carga y errores
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedData = await getSentencesPerMonthAndSalaFromBackend(sala, month);
                console.log("FETCHED DATA",fetchedData)
                setData(fetchedData);
            } catch (err: any) {
                setError("Hubo un error al obtener las sentencias. Por favor, inténtelo de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [sala, month]); // Se ejecuta solo cuando cambia la sala o el mes

    if (loading) {
        return <Loading/>;
    }

    if (error) {
        return <div>{error}</div>;
    }

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
