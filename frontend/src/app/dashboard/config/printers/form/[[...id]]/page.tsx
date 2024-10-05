'use client';
import ButtonBack from '@/components/dashboard/ButtonBack';
import ButtonSubmit from '@/components/dashboard/ButtonSubmit';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import { createOrUpdate, getActiveList, getOne } from '@/services';
import { AppstoreOutlined } from '@ant-design/icons';
import { Col, DatePicker, Flex, Form, FormProps, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

type FieldType = {
    model: string;
    printerBrand: number;
    printerModel: number;
    printerType: number;
    serialNumber: string;
    ipAddress: string;
    port: string;
    mac: string;
    conectionUser: string;
    conectionPassword: string;
    instalationDate: Date;
};

const moduleName = 'config/printers';

const ModuleForm = ({ params }: any) => {
    const [loader, setLoader] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState({});
    const [optionsPrinterBrands, setOptionsPrinterBrands] = useState([]);
    const [optionsPrinterModels, setOptionsPrinterModels] = useState([]);
    const [optionsPrinterTypes, setOptionsPrinterTypes] = useState([]);
    const [form] = Form.useForm();

    const id = params.id ? params.id[0] : null;

    useEffect(() => {
        getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const pageName = `${id ? 'Editar' : 'Nueva'} Impresora`;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Configuración' }, { title: 'Impresoras' }, , { title: pageName }];

    const getData = async () => {
        const [getOptionsPrinterBrands, getOptionsPrinterTypes] = await Promise.all([
            getActiveList('printer_brands'),
            getActiveList('printer_types'),
        ]);

        setOptionsPrinterBrands(getOptionsPrinterBrands);
        setOptionsPrinterTypes(getOptionsPrinterTypes);

        if (id) {
            const get = await getOne(moduleName, id);
            get.printerType = get.printerType.id;
            get.printerBrand = get.printerModel.printerBrand.id;
            get.printerModel = get.printerModel.id;
            get.instalationDate = dayjs(get.instalationDate, 'YYYY-MM-DD');
            setData(get);

            const getModels = await getActiveList(
                'printer_models',
                `?printerBrandId=${get.printerBrand}`,
            );
            setOptionsPrinterModels(getModels);
        }
        setSpinner(false);
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoader(true);
        values.instalationDate = new Date(values.instalationDate);

        const res = await createOrUpdate(moduleName, values, id);

        if (res) {
            setLoader(false);
            return toast.warning(res);
        }

        toast.success(`Modelo de impresora ${id ? 'editado' : 'creado'} con éxito`);
    };

    const handleBrandChange = async (value: number) => {
        form.setFieldValue('printerModel', undefined);
        const getModels = await getActiveList('printer_models', `?printerBrandId=${value}`);

        setOptionsPrinterModels(getModels);
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
                        form={form}
                    >
                        <Row gutter={32}>
                            <Col span={24} md={{ span: 8 }}>
                                <Form.Item<FieldType>
                                    label="Marca:"
                                    name="printerBrand"
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
                                        options={optionsPrinterBrands}
                                        fieldNames={{
                                            label: 'brand',
                                            value: 'id',
                                        }}
                                        onChange={handleBrandChange}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24} md={{ span: 8 }}>
                                <Form.Item<FieldType>
                                    noStyle
                                    shouldUpdate={(prevValues, curValues) =>
                                        prevValues.printerModel !== curValues.printerModel
                                    }
                                >
                                    {() => {
                                        return (
                                            <Form.Item<FieldType>
                                                label="Modelo:"
                                                key="printerModel"
                                                name="printerModel"
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
                                                    options={optionsPrinterModels.map(
                                                        (option: any) => ({
                                                            label: option.model,
                                                            value: option.id,
                                                        }),
                                                    )}
                                                />
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                            </Col>
                            <Col span={24} md={{ span: 8 }}>
                                <Form.Item<FieldType>
                                    label="Tipo:"
                                    name="printerType"
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
                                        options={optionsPrinterTypes}
                                        fieldNames={{
                                            label: 'type',
                                            value: 'id',
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={32}>
                            <Col span={24} md={{ span: 8 }}>
                                <Form.Item<FieldType>
                                    label="Número de serie:"
                                    name="serialNumber"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24} md={{ span: 8 }}>
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
                            <Col span={24} md={{ span: 8 }}>
                                <Form.Item<FieldType>
                                    label="Puerto:"
                                    name="port"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={32}>
                            <Col span={24} md={{ span: 8 }}>
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
                            <Col span={24} md={{ span: 8 }}>
                                <Form.Item<FieldType>
                                    label="Usuario:"
                                    name="conectionUser"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24} md={{ span: 8 }}>
                                <Form.Item<FieldType>
                                    label="Contraseña:"
                                    name="conectionPassword"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={32}>
                            <Col span={24} md={{ span: 8 }}>
                                <Flex vertical gap="small">
                                    <Form.Item<FieldType>
                                        label="Fecha de Instalación:"
                                        name="instalationDate"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                    >
                                        <DatePicker format={'DD/MM/YYYY'} />
                                    </Form.Item>
                                </Flex>
                            </Col>
                        </Row>

                        <ButtonSubmit loader={loader}>
                            {!id ? 'Guardar' : 'Editar'} Impresora
                        </ButtonSubmit>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default ModuleForm;
