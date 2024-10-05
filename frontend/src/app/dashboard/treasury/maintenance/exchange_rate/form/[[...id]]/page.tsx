"use client"
import React, { useEffect, useState } from 'react';
import { createOrUpdate, getOne, getAllData, getLastExchangeRates } from '@/services';
import { Form, FormProps, InputNumber, Row, Col, Select } from 'antd';
import { toast } from 'react-toastify';
import { useExchangeRate } from '@/components/dashboard/ExchangeRateContext';
import ButtonBack from '@/components/dashboard/ButtonBack';
import ButtonSubmit from '@/components/dashboard/ButtonSubmit';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import Loading from '@/components/Loading';
import { AppstoreOutlined } from '@ant-design/icons';

type FieldType = {
    currencyId: number,
    exchangeToCurrency: number,
    exchange: number
};

const moduleName = 'treasury/maintenance/exchange_rate';

const ModuleForm = ({ params }: any) => {
    const [loader, setLoader] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState<Partial<FieldType>>({});
    const [currencys, setCurrencys] = useState<{ id: number, money: string }[]>([]);
    const [selectedCurrencyId, setSelectedCurrencyId] = useState<number | null>(null);
    const id = params.id ? params.id[0] : null;

    const { setExchangeRates } = useExchangeRate();

    const handleChangeCurrencyId = (value: number) => {
        setSelectedCurrencyId(value);
    };

    const handleChangeExchangeToCurrency = (value: number) => {
        console.log(`selected ${value}`);
    };

    const getData = async () => {
        const get = await getOne(moduleName, id);
        setData(get);
        setSpinner(false);
        console.log("data del form", get);
    };

    const getCurrencys = async () => {
        const response = await getAllData("treasury/maintenance/money","1");
        setCurrencys(response.data);
    };

    useEffect(() => {
        getCurrencys();
        if (id) {
            getData();
        } else {
            setSpinner(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const pageName = `${id ? 'Editar' : 'Nuevo'} Tasa de Cambio`;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Administrative' }, { title: 'Tasas de cambio' }, { title: pageName }];

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        try {
            setLoader(true);
            const res = await createOrUpdate(moduleName, values, id);
            console.log(res);

            if (res?.statusCode) {
                toast.error(res.message);
                setLoader(false);
                return;
            }

            toast.success(`Tasa de cambio ${id ? 'editado' : 'creada'} con éxito`);
            
            const updatedRates = await getLastExchangeRates();
            setExchangeRates(updatedRates);

        } catch (error) {
            setLoader(false);
            toast.error('Ha ocurrido un error, inténtalo más tarde');
        }
    };

    return spinner ? (
        <Loading />
    ) : (
        <>
            <SetPageInfo pageName={pageName} iconPage={iconPage} breadCrumb={breadCrumb} />
            <ButtonBack />

            <Row>
                <Col span={24}>
                    <Form
                        name="wrap"
                        colon={false}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={data}
                    >
                        <Row>
                            <Col span={24} md={{ span: 12, offset: 6 }}>
                                <Form.Item<FieldType>
                                    label="Moneda de Referencia"
                                    name="currencyId"
                                    rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                                >
                                    <Select
                                        style={{ width: '100%' }}
                                        onChange={handleChangeCurrencyId}
                                        options={currencys.map(currency => ({
                                            value: currency.id,
                                            label: currency.money
                                        }))}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24} md={{ span: 12, offset: 6 }}>
                                <Form.Item<FieldType>
                                    label="Moneda transformada"
                                    name="exchangeToCurrency"
                                    rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                                >
                                    <Select
                                        style={{ width: '100%' }}
                                        onChange={handleChangeExchangeToCurrency}
                                        options={currencys
                                            .filter(currency => currency.id !== selectedCurrencyId)
                                            .map(currency => ({
                                                value: currency.id,
                                                label: currency.money
                                            }))}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24} md={{ span: 12, offset: 6 }}>
                                <Form.Item<FieldType>
                                    label="Tasa de Cambio (Insertar decimales usando un . )"
                                    name="exchange"
                                    rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                                >
                                    <InputNumber placeholder='10.5567' style={{ width: '100%' }} step="0.01" max={10000000} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <ButtonSubmit loader={loader}>
                            {!id ? 'Guardar' : 'Editar'} Tasa
                        </ButtonSubmit>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default ModuleForm;
