'use client';
import ButtonBack from '@/components/dashboard/ButtonBack';
import ButtonSubmit from '@/components/dashboard/ButtonSubmit';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import { createOrUpdate, getActiveList, getOne } from '@/services';
import { AppstoreOutlined } from '@ant-design/icons';
import { Col, Form, FormProps, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type FieldType = {
    name: string;
    ipAddress: string;
    mac: string;
    cashierType: number;
    printer: number;
};

const moduleName = 'config/cashiers';

const ModuleForm = ({ params }: any) => {
    const [loader, setLoader] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState({});
    const [optionsCashierTypes, setOptionsCashierTypes] = useState([]);
    const [optionsPrinters, setOptionsPrinters] = useState([]);

    const id = params.id ? params.id[0] : null;

    useEffect(() => {
        getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const pageName = `${id ? 'Editar' : 'Nueva'} Caja`;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Configuración' }, { title: 'Cajas' }, , { title: pageName }];

    const getData = async () => {
        const [getOptionsCashierTypes, getOptionsPrintes] = await Promise.all([
            getActiveList('config/cashier_types'),
            getActiveList('config/printers'),
        ]);

        setOptionsCashierTypes(getOptionsCashierTypes);
        setOptionsPrinters(getOptionsPrintes);

        if (id) {
            const get = await getOne(moduleName, id);
            get.cashierType = get.cashierType.id;
            get.printer = get.printer.id;
            setData(get);
        }
        setSpinner(false);
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoader(true);
        const res = await createOrUpdate(moduleName, values, id);

        if (res) {
            setLoader(false);
            return toast.warning(res);
        }

        toast.success(`Caja ${id ? 'editada' : 'creada'} con éxito`);
    };

    return spinner ? (
        <p>loading</p>
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
                        <Row gutter={32}>
                            <Col span={24} md={{ span: 6 }}>
                                <Form.Item<FieldType>
                                    label="Tipo de caja:"
                                    name="cashierType"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Select
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Seleccione"
                                        options={optionsCashierTypes}
                                        fieldNames={{
                                            label: 'type',
                                            value: 'id',
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24} md={{ span: 6 }}>
                                <Form.Item<FieldType>
                                    label="Nombre de la caja:"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24} md={{ span: 6 }}>
                                <Form.Item<FieldType>
                                    label="Dirección IP:"
                                    name="ipAddress"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24} md={{ span: 6 }}>
                                <Form.Item<FieldType>
                                    label="Dirección MAC:"
                                    name="mac"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24} md={{ span: 6 }}>
                                <Form.Item<FieldType>
                                    label="Impresora:"
                                    name="printer"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Select
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Seleccione"
                                        options={optionsPrinters}
                                        fieldNames={{
                                            label: 'serialNumber',
                                            value: 'id',
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <ButtonSubmit loader={loader}>
                            {!id ? 'Guardar' : 'Editar'} Caja
                        </ButtonSubmit>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default ModuleForm;
