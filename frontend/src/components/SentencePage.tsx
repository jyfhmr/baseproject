import React from 'react';
import { Table, TablePaginationConfig } from 'antd';
import { FileSearchOutlined, FrownOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { formatSentences } from '../services/getSentencesPerMonth';

interface SentencePageProps {
  monthData: any; // Los datos de sentencias del mes
  title: any; // Título del mes
  columns: any[]; // Columnas de la tabla
}


const SentencePage: React.FC<SentencePageProps> = ({ monthData, title, columns }) => {
 // const data = formatSentences(monthData);

 console.log("month data",monthData)

  if (monthData.length === 0) {
    return (
      <div style={{ textAlign: 'center', width: "100%", height: "70vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
         <FileSearchOutlined style={{ fontSize: '64px', color: '#cf286a' }} />
        <h1>No hay Sentencias</h1>
        <p>No se encontraron sentencias para las {title} - 2024</p>
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
        dataSource={monthData}
        rowKey="sentence_number"
        rowClassName="fila-sentencia"
        scroll={{ x: 800 }} // Permite desplazamiento horizontal en pantallas pequeñas
        pagination={
          { pageSize: 3,  pageSizeOptions: [3, 10, 25, 50, 100],  showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} registros`, }
        } // Controla el número de filas por página
        
        size='middle'
      />
    </div>
  );
};

export default SentencePage;
