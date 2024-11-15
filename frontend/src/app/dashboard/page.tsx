"use client"
import React, { useEffect, useState } from 'react';
import { Pie } from '@ant-design/plots';
import { Card, Select, Row, Col, Button } from 'antd';
import { getPercentagesPerSala, getPreferences, savePreferences } from '@/services';
import { ToastContainer, toast } from 'react-toastify';

const { Option } = Select;

const Home = () => {
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [preferencesFromServer, setPreferencesFromServer] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const fetchSentencesData = async () => {
      try {
        const data = await getPercentagesPerSala();
        setPieData(data);
      } catch (error) {
        toast.error('Error al obtener los datos de sentencias');
      }
    };

    const fetchPreferences = async () => {
      try {
        const data = await getPreferences();
        setPreferencesFromServer(data);
        setSelectedPreferences(data);
      } catch (error) {
        toast.error('Error al obtener las preferencias del usuario');
      }
    };

    fetchSentencesData();
    fetchPreferences();
  }, []);

  const handlePreferencesChange = (value: any) => {
    setSelectedPreferences(value);
  };

  const handleSavePreferences = async () => {
    if (selectedPreferences.length === 0) {
      toast.warn('Por favor, selecciona al menos una preferencia');
      return;
    }

    try {
      const response = await savePreferences(selectedPreferences);
      if (response) {
        toast.success('Preferencias guardadas con éxito');
      }
    } catch (error) {
      toast.error('Hubo un error al guardar las preferencias');
    }
  };

  const pieConfig = {
    appendPadding: 10,
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.75,
  };

  return (
    <div style={{ padding: '20px' }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      <h2>Dashboard de Sentencias - JudisMail</h2>
      
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Porcentaje de Sentencias del año actual">
            <Pie {...pieConfig} />
          </Card>
        </Col>
        
        <Col span={12}>
          <Card title="Selecciona tus preferencias">
            <Select
              mode="multiple"
              placeholder="Selecciona tus preferencias"
              style={{ width: '100%' }}
              value={selectedPreferences}
              onChange={handlePreferencesChange}
            >
              {pieData.map((item: any) => (
                <Option key={item.type} value={item.type}>
                  {item.type}
                </Option>
              ))}
            </Select>
            <Button
              type="primary"
              style={{ backgroundColor: "#cf286a", marginTop: "10px" }}
              onClick={handleSavePreferences}
            >
              Guardar Preferencias
            </Button>
          </Card>

          {/* Aquí agregamos las tarjetas directamente debajo de la selección de preferencias */}
          <Row gutter={[, 16]} style={{ marginTop: '20px' }}>
            <Col span={12}>
              <Card title="Sentencias este mes" bordered={false}>
                <p>120</p>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Usuarios nuevos" bordered={false}>
                <p>35</p>
              </Card>
            </Col>
            <Col span={24}>
              <Card title="Total de sentencias del año" bordered={false}>
                <p>1,200</p>
              </Card>
            </Col>
            <Col span={24}>
             {/*<Card cover={<img alt="example" src="/img/prueba.jpg" />}>
              </Card> */} 
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
