import React from 'react';
import { Table } from 'antd';
import { FrownOutlined } from '@ant-design/icons';
import { formatSentences } from '../services/getSentencesPerMonth';

interface SentencePageProps {
  monthData: any[]; // Los datos de sentencias del mes
  title: any; // Título del mes
  columns: any[]; // Columnas de la tabla
}

const SentencePage: React.FC<SentencePageProps> = ({ monthData, title, columns }) => {
  const data = formatSentences(monthData);

  if (!data) {
    return (
      <div style={{ textAlign: 'center', width: "100%", height: "70vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <h1>No hay Sentencias</h1>
        <p>No se encontraron sentencias para las {title} - 2024</p>
        <FrownOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>{title}</h1>
      <Table
        columns={columns.map(column => ({
          ...column,
          responsive: ['xs', 'sm', 'md', 'lg'], // Controla visibilidad en diferentes tamaños
        }))}
        dataSource={data}
        rowKey="sentence_number"
        rowClassName="fila-sentencia"
        scroll={{ x: 800 }} // Permite desplazamiento horizontal en pantallas pequeñas
        pagination={{ pageSize: 10 }} // Controla el número de filas por página
      />
    </div>
  );
};

export default SentencePage;
