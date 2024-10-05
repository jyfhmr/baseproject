import React, { useEffect } from 'react';
import { Button, Card, Col, Modal, Row } from 'antd';

const ModalProvider = ({ dataProvider, isOpen, onClose }: any) => {
    useEffect(() => {
        console.log('Datos del proveedor:', dataProvider.id);
    }, [dataProvider]);

    console.log(dataProvider.paymentConcepts);
    const formatNumber = (value: any) => {
        const number = parseFloat(value);
        return isNaN(number) ? '0.0' : number.toFixed(1);
    };


    return (
        <Modal
            title={`Detalles del Proveedor`}
            centered
            open={isOpen}
            onOk={onClose}
            onCancel={onClose}
            width="60vw" // Ancho reducido
            bodyStyle={{
                maxHeight: 'calc(100vh - 120px)', // Altura máxima adaptada a la pantalla
                overflowY: 'auto', // Habilitar desplazamiento vertical
                padding: '10px',
            }}
            style={{
                top: 20, // Mantener un pequeño margen superior
            }}
            footer={
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                    <Button type="primary" onClick={onClose}>
                        Cerrar
                    </Button>

                </div>
            }
        >
            <Card bordered={false} style={{ backgroundColor: '#f7f7f7', padding: '8px' }}>
                <Row gutter={[8, 8]} style={{ marginBottom: '4px' }}>
                    <Col span={24}>
                        <h3 style={{ fontSize: '14px', marginBottom: '4px' }}>
                            <b>Datos de Identificación</b>
                        </h3>
                        <hr style={{ margin: '4px 0' }} />
                        <Row gutter={8} style={{ marginBottom: '4px' }}>
                            <Col span={10}>
                                <h5
                                    style={{
                                        fontWeight: 'bold',
                                        marginBottom: '2px',
                                        fontSize: '12px',
                                    }}
                                >
                                    Razón Social:
                                </h5>
                            </Col>
                            <Col span={14}>
                                <h5 style={{ marginBottom: '2px', fontSize: '12px' }}>
                                    {dataProvider.businessName}
                                </h5>
                            </Col>
                        </Row>
                        <Row gutter={8} style={{ marginBottom: '4px' }}>
                            <Col span={10}>
                                <h5
                                    style={{
                                        fontWeight: 'bold',
                                        marginBottom: '2px',
                                        fontSize: '12px',
                                    }}
                                >
                                    Identificación:
                                </h5>
                            </Col>
                            <Col span={14}>
                                <h5
                                    style={{ marginBottom: '2px', fontSize: '12px' }}
                                >{`${dataProvider.documentType.identificationType.name}: ${dataProvider.documentType.code} ${dataProvider.identification}`}</h5>
                            </Col>
                        </Row>

                        <h3 style={{ fontSize: '14px', margin: '8px 0 4px 0' }}>
                            <b>Datos de Contacto</b>
                        </h3>
                        <hr style={{ margin: '4px 0' }} />
                        <Row gutter={8} style={{ marginBottom: '4px' }}>
                            <Col xs={24} sm={8}>
                                <h5
                                    style={{
                                        fontWeight: 'bold',
                                        marginBottom: '2px',
                                        fontSize: '12px',
                                    }}
                                >
                                    Sitio Web:
                                </h5>
                                <h5 style={{ marginBottom: '2px', fontSize: '12px' }}>
                                    {dataProvider.website}
                                </h5>
                            </Col>
                            <Col xs={24} sm={8}>
                                <h5
                                    style={{
                                        fontWeight: 'bold',
                                        marginBottom: '2px',
                                        fontSize: '12px',
                                    }}
                                >
                                    Teléfono:
                                </h5>
                                <h5 style={{ marginBottom: '2px', fontSize: '12px' }}>
                                    {dataProvider.phone}
                                </h5>
                            </Col>
                            <Col xs={24} sm={8}>
                                <h5
                                    style={{
                                        fontWeight: 'bold',
                                        marginBottom: '2px',
                                        fontSize: '12px',
                                    }}
                                >
                                    Correo:
                                </h5>
                                <h5 style={{ marginBottom: '2px', fontSize: '12px' }}>
                                    {dataProvider.email}
                                </h5>
                            </Col>
                        </Row>

                        <Row gutter={8} style={{ marginBottom: '4px' }}>
                            <Col span={10}>
                                <h5
                                    style={{
                                        fontWeight: 'bold',
                                        marginBottom: '2px',
                                        fontSize: '12px',
                                    }}
                                >
                                    Estado:
                                </h5>
                            </Col>
                            <Col span={14}>
                                <h5 style={{ marginBottom: '2px', fontSize: '12px' }}>
                                    {dataProvider.city.state.name}
                                </h5>
                            </Col>
                        </Row>
                        <Row gutter={8} style={{ marginBottom: '4px' }}>
                            <Col span={10}>
                                <h5
                                    style={{
                                        fontWeight: 'bold',
                                        marginBottom: '2px',
                                        fontSize: '12px',
                                    }}
                                >
                                    Ciudad:
                                </h5>
                            </Col>
                            <Col span={14}>
                                <h5 style={{ marginBottom: '2px', fontSize: '12px' }}>
                                    {dataProvider.city.name}
                                </h5>
                            </Col>
                        </Row>
                        <Row gutter={8} style={{ marginBottom: '4px' }}>
                            <Col span={10}>
                                <h5
                                    style={{
                                        fontWeight: 'bold',
                                        marginBottom: '2px',
                                        fontSize: '12px',
                                    }}
                                >
                                    Dirección:
                                </h5>
                            </Col>
                            <Col span={14}>
                                <h5 style={{ marginBottom: '2px', fontSize: '12px' }}>
                                    {dataProvider.address}
                                </h5>
                            </Col>
                        </Row>

                        <h3 style={{ fontSize: '14px', margin: '8px 0 4px 0' }}>
                            <b>Información Legal</b>
                        </h3>
                        <hr style={{ margin: '4px 0' }} />
                        <Row gutter={8} style={{ marginBottom: '4px' }}>
                            <Col span={10}>
                                <h5
                                    style={{
                                        fontWeight: 'bold',
                                        marginBottom: '2px',
                                        fontSize: '12px',
                                    }}
                                >
                                    Representante Legal:
                                </h5>
                            </Col>
                            <Col span={14}>
                                <h5
                                    style={{ marginBottom: '2px', fontSize: '12px' }}
                                >{`${dataProvider.legalRepresentativeName} ${dataProvider.legalRepresentativeLastName}`}</h5>
                            </Col>
                        </Row>
                        <Row gutter={8} style={{ marginBottom: '4px' }}>
                            <Col span={10}>
                                <h5
                                    style={{
                                        fontWeight: 'bold',
                                        marginBottom: '2px',
                                        fontSize: '12px',
                                    }}
                                >
                                    Fecha de Constitución:
                                </h5>
                            </Col>
                            <Col span={14}>
                                <h5 style={{ marginBottom: '2px', fontSize: '12px' }}>
                                    {dataProvider.constitutionDate}
                                </h5>
                            </Col>
                        </Row>

                        <h3 style={{ fontSize: '14px', margin: '8px 0 4px 0' }}>
                            <b>Información Fiscal</b>
                        </h3>
                        <hr style={{ margin: '4px 0' }} />
                        <Row gutter={8} style={{ marginBottom: '4px' }}>
                            <Col span={10}>
                                <h5
                                    style={{
                                        fontWeight: 'bold',
                                        marginBottom: '2px',
                                        fontSize: '12px',
                                    }}
                                >
                                    Tipo de Contribuyente:
                                </h5>
                            </Col>
                            <Col span={14}>
                                <h5 style={{ marginBottom: '2px', fontSize: '12px' }}>
                                    {dataProvider.taxpayer.name}
                                </h5>
                            </Col>
                        </Row>
                        <Row gutter={8} style={{ marginBottom: '4px' }}>
                            <Col span={10}>
                                <h5
                                    style={{
                                        fontWeight: 'bold',
                                        marginBottom: '2px',
                                        fontSize: '12px',
                                    }}
                                >
                                    Porcentaje:
                                </h5>
                            </Col>
                            <Col span={14}>
                                <h5 style={{ marginBottom: '2px', fontSize: '12px' }}>
                                    {dataProvider.taxRetentionPercentage.description}
                                </h5>
                            </Col>
                        </Row>
                        <Row gutter={8} style={{ marginBottom: '4px' }}>
                            <Col span={10}>
                                <h5
                                    style={{
                                        fontWeight: 'bold',
                                        marginBottom: '2px',
                                        fontSize: '12px',
                                    }}
                                >
                                    Tipo de Proveedor ISRL:
                                </h5>
                            </Col>
                            <Col span={14}>
                                <h5
                                    style={{ marginBottom: '2px', fontSize: '12px' }}
                                >{`${dataProvider.typePeopleIsrl?.type} (${dataProvider.typePeopleIsrl?.code})`}</h5>
                            </Col>
                        </Row>
                        <div>
                            {dataProvider.paymentConcepts.map((concept: any) => (
                                <div key={concept.id} style={{ marginBottom: '24px', padding: '16px', border: '1px solid #f0f0f0', borderRadius: '4px' }}>
                                    {/* Información del Concepto de Pago */}
                                    <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                                        <Col span={24}>
                                            <h4 style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                                {concept.name} ({concept.numeroLiteral})
                                            </h4>
                                        </Col>
                                    </Row>

                                    {/* Tabla de IsrlWitholdings */}
                                    <Row gutter={[16, 16]}>
                                        {concept.IsrlWitholdings.length > 0 ? (
                                            concept.IsrlWitholdings.map((witholding: any, index: any) => (
                                                witholding.typesPeopleIsrl.type == dataProvider.typePeopleIsrl?.type ? <Col span={24} key={witholding.id}>
                                                    <div >
                                                        <strong>Tipo de Persona:</strong>
                                                        <p>{witholding.typesPeopleIsrl.type}</p>
                                                    </div>
                                                    <div style={{ padding: '12px', backgroundColor: '#fafafa', border: '1px solid #d9d9d9', borderRadius: '4px' }}>
                                                        <Row gutter={[16, 16]}>
                                                            <Col span={4}>
                                                                <strong>Código Seniat:</strong>
                                                                <p>{witholding.codeSeniat}</p>
                                                            </Col>
                                                            <Col span={4}>
                                                                <strong>Base Imponible:</strong>
                                                                <p>{formatNumber(witholding.taxBase)}</p>
                                                            </Col>
                                                            <Col span={4}>
                                                                <strong>Rango BS:</strong>
                                                                <p>{formatNumber(witholding.pageRangeBS)}</p>
                                                            </Col>
                                                            <Col span={4}>
                                                                <strong>Sustraendo BS:</strong>
                                                                <p>{formatNumber(witholding.sustractingBS)}</p>
                                                            </Col>
                                                            <Col span={4}>
                                                                <strong>Porcentaje:</strong>
                                                                <p>{witholding.ratesOrPorcentage.value}</p>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Col> : ' '
                                            ))
                                        ) : (
                                            <Col span={24}>
                                                <p>No hay retenciones ISLR asociadas a este concepto de pago.</p>
                                            </Col>
                                        )}
                                    </Row>
                                </div>
                            ))}
                        </div>

                    </Col>
                </Row>
            </Card >
        </Modal >
    );
};

export default ModalProvider;
