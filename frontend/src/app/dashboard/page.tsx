"use client"
import React, { useEffect, useState } from 'react';
import { Pie } from '@ant-design/plots';
import { Card, Select, Row, Col, Button } from 'antd';
import { getPercentagesPerSala, getPreferences, savePreferences } from '@/services';

const { Option } = Select;

const Home = () => {
  const [selectedPreferences, setSelectedPreferences] = useState([]); // Para almacenar las preferencias seleccionadas
  const [preferencesFromServer, setPreferencesFromServer] = useState([]); // Para almacenar las preferencias del backend
  const [pieData, setPieData] = useState([]);

  // Función para obtener los datos de las sentencias
  useEffect(() => {
    const fetchSentencesData = async () => {
      try {
        const data = await getPercentagesPerSala()
        console.log("la data", data)
        setPieData(data);
      } catch (error) {
        console.error('Error fetching sentence data:', error);
      }
    };

    // Función para obtener las preferencias del usuario
    const fetchPreferences = async () => {
      try {
        const data = await getPreferences(); // Asumiendo que este endpoint devuelve un array de tipos de sentencia
        console.log("las preferencias", data);
        setPreferencesFromServer(data); // Guardamos las preferencias en el estado
        setSelectedPreferences(data); // Si el usuario ya tiene preferencias, las seteamos por defecto en el Select
      } catch (error) {
        console.error('Error fetching preferences:', error);
      }
    };

    fetchSentencesData();
    fetchPreferences(); // Llamamos a la función para obtener las preferencias al cargar el componente
  }, []);

  // Maneja el cambio de selección en el Select
  const handlePreferencesChange = (value:any) => {
    setSelectedPreferences(value); // Actualizamos las preferencias seleccionadas
  };

  // Guarda las preferencias seleccionadas por el usuario
  const handleSavePreferences = async () => {
    if (selectedPreferences.length === 0) {
      alert('Por favor, selecciona al menos una preferencia');
      return;
    }

    try {
      const responseForSavingPreferences = await savePreferences(selectedPreferences);
      console.log("selected preferences", selectedPreferences);
      console.log("response for saving preferences", responseForSavingPreferences);

      if (responseForSavingPreferences) {
        alert("Preferencias guardadas");
      }

    } catch (error) {
      console.error('Error al enviar las preferencias', error);
      alert('Hubo un error al guardar las preferencias');
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
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <h2>Dashboard de Sentencias - JudisMail</h2>
        </Col>
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
              value={selectedPreferences} // Establecemos el valor del Select como las preferencias seleccionadas
              onChange={handlePreferencesChange}
            >
              {pieData.map((item:any) => (
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
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={8}>
          <Card title="Sentencias este mes" bordered={false}>
            <p>120</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Usuarios nuevos" bordered={false}>
            <p>35</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Total de sentencias del año" bordered={false}>
            <p>1,200</p>
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Card cover={<img alt="example" src="/path/to/your/image.jpg" />}>
            <Card.Meta title="Imagen descriptiva" description="Descripción de la imagen o información relevante." />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
