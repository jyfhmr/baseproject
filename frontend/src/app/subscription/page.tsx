"use client"; // Agrega esto para habilitar el uso de hooks

import { useState } from 'react';
import { Form, Input, Select, Button, Col, Row, Radio } from 'antd';
import { CreditCardOutlined, MobileOutlined } from '@ant-design/icons';
import { RadioChangeEvent } from 'antd/es/radio';
import './subscription.css';

const PaymentForm = () => {
    const [form] = Form.useForm();
    const [paymentMethod, setPaymentMethod] = useState<'credito' | 'pagoMovil'>('pagoMovil'); // Inicializamos con 'pagoMovil'

    const handlePaymentMethodChange = (e: RadioChangeEvent) => {
        setPaymentMethod(e.target.value);
    };

    const handleClearPaymentFields = () => {
        form.resetFields();
    };

    return (
        <div className="checkout-container">
            <h2 className="payment-title">Seleccione su método de pago</h2>

            <div className="payment-form">
            <Radio.Group
  onChange={handlePaymentMethodChange}
  value={paymentMethod}
  className="payment-methods"
  buttonStyle="solid" // Añadido para que mantenga el estilo en línea
        >
        <Radio.Button value="credito">
            <CreditCardOutlined /> Crédito
        </Radio.Button>
        <Radio.Button value="pagoMovil" className="payment-option">
            Pago móvil
            <img src="/img/pagomovil.png" className="payment-icon" />
        </Radio.Button>
        </Radio.Group>
                {paymentMethod && (
                    <Form form={form} layout="vertical" className="payment-form-fields">
                        {paymentMethod === 'credito' && (
                            <>
                                <Form.Item label="Número de Tarjeta" name="cardNumber" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item label="Titular de la Tarjeta" name="cardHolder" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item label="Fecha de Expiración" name="expiryDate" rules={[{ required: true }]}>
                                            <Input placeholder="MM/AA" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="CVC" name="cvc" rules={[{ required: true }]}>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </>
                        )}
                        {paymentMethod === 'pagoMovil' && (
                            <>
                                <Form.Item label="Operación" name="operation" rules={[{ required: true }]}>
                                    <Select defaultValue="Personas">
                                        <Select.Option value="Personas">Personas</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Documento" name="document" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item label="Banco" name="bank" rules={[{ required: true }]}>
                                    <Select defaultValue="0102 - BANCO DE VENEZUELA">
                                        <Select.Option value="0102 - BANCO DE VENEZUELA">0102 - BANCO DE VENEZUELA</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Teléfono" name="phone" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item label="Monto" name="amount" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item label="Concepto" name="concept" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </>
                        )}

                        <div className="payment-buttons">
                            <Button type="primary" htmlType="submit">Pagar</Button>
                            <Button onClick={handleClearPaymentFields}>Limpiar</Button>
                        </div>
                    </Form>
                )}
            </div>
        </div>
    );
};

export default PaymentForm;
