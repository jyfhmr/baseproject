import React, { useEffect } from 'react';
import { Button, Card, Col, Divider, Modal, Row } from 'antd';
import './ModalPayment.css';
import SeparatorOfData from './SeparatorOfData';

const ModalProvider = ({ paymentInfo, isOpen, onClose }: any) => {
    useEffect(() => {
        console.log('info del pago', paymentInfo);
    }, [paymentInfo]);

    function convertToDateFormat(isoDate: any) {
        const date = new Date(isoDate);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses comienzan en 0
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    return (
        <Modal
            title={`Detalles de Pago`}
            centered
            open={isOpen}
            onOk={onClose}
            onCancel={onClose}
            width="60vw" // Ancho reducido
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
            modalRender={(modal) => (
                <div
                    style={{
                        maxHeight: 'calc(100vh - 120px)', // Altura máxima adaptada a la pantalla
                        overflowY: 'auto', // Habilitar desplazamiento vertical
                        padding: '10px',
                    }}
                >
                    {modal}
                </div>
            )}
        >
            <Card bordered={false} style={{ backgroundColor: '#f7f7f7', padding: '8px' }}>
                <Row gutter={[8, 8]} style={{ marginBottom: '4px' }}>
                    <Col span={24}>
                        <div className="titleOfThemes">Datos de la contraparte</div>
                        <Divider />

                        <SeparatorOfData title1={"Nombre de Contraparte"} title2={paymentInfo.name_of_counterparty} />
                        <SeparatorOfData title1={"Tipo de Identificación"} title2={paymentInfo.type_of_identification.name} />
                        <SeparatorOfData title1={"Número de Identificación"} title2={paymentInfo.document_of_counterparty} />

                        {paymentInfo.provider_who_gets_the_payment && (
                            <>
                                <SeparatorOfData title1={"Número de Teléfono"} title2={paymentInfo.provider_who_gets_the_payment.phone} />
                                <SeparatorOfData title1={"Correo Electrónico"} title2={paymentInfo.provider_who_gets_the_payment.email} />
                            </>
                        )}

                        <div className="titleOfThemes">Información de Pago</div>
                        <Divider />

                        <SeparatorOfData title1={"Estatus del Pago"} title2={paymentInfo.paymentStatus.status} color={paymentInfo.paymentStatus.color} />

                        {paymentInfo.paymentReference && (
                            <SeparatorOfData title1={"Referencia de Pago"} title2={paymentInfo.paymentReference} />
                        )}

                        <SeparatorOfData title1={"Moneda Usada"} title2={paymentInfo.currencyUsed.money} />

                        <SeparatorOfData title1={"Método de Pago"} title2={paymentInfo.payment_method.method} />

                        <SeparatorOfData title1={"Monto del Pago"} title2={paymentInfo.amountPaid} />

                        <SeparatorOfData title1={"Saldo/Balance del Pago"} title2={paymentInfo.balance} />

                        <SeparatorOfData title1={"Fecha de Realización del Pago"} title2={convertToDateFormat(paymentInfo.paymentDate)} />


                        {paymentInfo.bankEmissor && (
                            <SeparatorOfData title1={"Banco Usado"} title2={paymentInfo.bankEmissor.name} />
                        )}

                        {paymentInfo.
                            bankReceptor && (
                                <SeparatorOfData title1={"Banco Receptor"} title2={paymentInfo.
                                    bankReceptor.name} />
                            )}

                        {paymentInfo.
                            transfer_account_number
                            && (
                                <SeparatorOfData title1={"Cuenta Utilizada"} title2={paymentInfo.
                                    transfer_account_number.nameAccount
                                } />
                            )}

                        {paymentInfo.
                            transfer_account_number_of_receiver

                            && (
                                <SeparatorOfData title1={"Número de cuenta de Receptor"} title2={paymentInfo.transfer_account_number_of_receiver

                                } />
                            )}


                        {paymentInfo.
                            pagomovilDocument

                            && (
                                <SeparatorOfData title1={"Número de Documento del receptor del Pago Movil"} title2={paymentInfo.pagomovilDocument
                                } />
                            )}

                        {paymentInfo.
                            pagomovilPhoneNumber

                            && (
                                <SeparatorOfData title1={"Número de Teléfono del receptor del Pago Movil"} title2={paymentInfo.pagomovilPhoneNumber
                                } />
                            )}


                        {paymentInfo.emailEmisor
                            && (
                                <SeparatorOfData title1={"Email Usado"} title2={paymentInfo.emailEmisor
                                } />
                            )}

                        {paymentInfo.emailEmisor
                            && (
                                <SeparatorOfData title1={"Email del Receptor"} title2={paymentInfo.emailEmisor
                                } />
                            )}


                        {paymentInfo.addressee_name

                            && (
                                <SeparatorOfData title1={"Nombre del Receptor del Zelle"} title2={paymentInfo.addressee_name
                                } />
                            )}


                        {paymentInfo.deposit_account_number

                            && (
                                <SeparatorOfData title1={"Número de cuenta para el receptor del depósito"} title2={paymentInfo.deposit_account_number
                                } />
                            )}



                        {
                            paymentInfo.voucher_image_url != null ?
                                <>
                                    <div className='titleOfThemes'>
                                        Comprobante de Pago
                                    </div>
                                    <Divider />
                                    <div style={{ width: "80%", height: "35vh", margin: "auto" }}>
                                        <img style={{ width: "100%", height: "100%" }} src={process.env.NEXT_PUBLIC_URL_IMAGE + "uploads/payments/" + paymentInfo.voucher_image_url} />
                                    </div>

                                </>

                                : <></>
                        }

                    </Col>
                </Row>
            </Card>
        </Modal>
    );
};

export default ModalProvider;

