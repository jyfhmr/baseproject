import React from 'react';
import { FrownOutlined } from '@ant-design/icons'; // Asegúrate de importar el ícono

const NoSentencesPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>No hay Sentencias</h1>
      <p>En este mes no se han registrado sentencias.</p>
      <FrownOutlined style={{ fontSize: '64px', color: '#1890ff' }} /> {/* Aumenta el tamaño aquí */}
    </div>
  );
};

export default NoSentencesPage;
