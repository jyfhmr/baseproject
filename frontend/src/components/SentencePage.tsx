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
    console.log("no hay data xd")
    return (
      <div style={{ textAlign: 'center', width: "100%", height: "70vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",  }}>
        <h1>No hay Sentencias</h1>
        <p>En este mes no se han registrado sentencias.</p>
        <FrownOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
      </div>
    );
  }

  return (
    <div>
      <h1>{title}</h1>
      <Table columns={columns} dataSource={data} rowKey="sentence_number" rowClassName={"hola"} />
    </div>
  );
};

export default SentencePage;
