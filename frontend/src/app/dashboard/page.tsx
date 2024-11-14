"use client"
import React, { useEffect, useState } from 'react';
import { Pie } from '@ant-design/plots';
import { Card, Select, Row, Col } from 'antd';
import { getPercentagesPerSala } from '@/services';

const { Option } = Select;

const Home = () => {
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [pieData, setPieData] = useState([]);


  useEffect(() => {
    const fetchSentencesData = async () => {
      try {
        const data = await getPercentagesPerSala()
        console.log("la data",data)
        setPieData(data);
      } catch (error) {
        console.error('Error fetching sentence data:', error);
      }
    };

    fetchSentencesData();
  }, []);


  const handlePreferencesChange = (value:any) => {
    setSelectedPreferences(value);
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
          <Card title="Distribución de Sentencias por Sala">
            <Pie {...pieConfig} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Selecciona tus preferencias">
            <Select
              mode="multiple"
              placeholder="Selecciona tus preferencias"
              style={{ width: '100%' }}
              onChange={handlePreferencesChange}
            >
              {pieData.map((item:any) => (
                <Option key={item.type} value={item.type}>
                  {item.type}
                </Option>
              ))}
            </Select>
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
