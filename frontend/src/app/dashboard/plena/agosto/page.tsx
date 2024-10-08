import React from 'react';
import { Table } from 'antd';
import { salasData } from '../../salasData1'; // Ajusta la ruta según sea necesario

// Columnas para la tabla
const columns = [
  {
    title: 'Fecha',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Número de Sentencia',
    dataIndex: 'sentence_number',
    key: 'sentence_number',
  },
  {
    title: 'Número de Expediente',
    dataIndex: 'proceedings_number',
    key: 'proceedings_number',
  },
  {
    title: 'Tipo de Procedimiento',
    dataIndex: 'proceedings_type',
    key: 'proceedings_type',
  },
  {
    title: 'Partes',
    dataIndex: 'parts',
    key: 'parts',
  },
  {
    title: 'Decisión',
    dataIndex: 'choice',
    key: 'choice',
  },
  {
    title: 'Ponente',
    dataIndex: 'speaker',
    key: 'speaker',
  },
  { title: 'Enlace', dataIndex: 'url_content', key: 'url_content' },
];

// Obtener los datos para Febrero de la sala Plena
const AugustPage: React.FC = () => {
  const augustData = salasData.Plena.Agosto; // Accede a los datos de febrero directamente

  // Formatear los datos para la tabla
  const data = augustData.flatMap(day => 
    day.sentences.map((sentence) => ({
      ...sentence,
      date: day.date,
      url_content: <a href={sentence.url_content} target="_blank" rel="noopener noreferrer">Ver Sentencia</a>,
    }))
  );

  return (
    <div>
      <h1>Sentencias de Agosto</h1>
      <Table columns={columns} dataSource={data} rowKey="sentence_number" />
    </div>
  );
};

export default AugustPage;
