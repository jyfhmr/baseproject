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
    phone: number;
    email: string;
    state: number;
    city: number;
    clientType: number;
    taxpayer: number;
    observations: string;
    address: string;
    identificationType: number;
    documentType: number;
    identification: string;
};

const moduleName = 'clients';

const ModuleForm = ({ params }: any) => {
    const [loader, setLoader] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState({
        state: 24,
        city: 480,
        clientType: 1,
        taxpayer: 1,
        identificationType: 1,
        documentType: 1,
    });
    const [optionsStates, setOptionsStates] = useState([]);
    const [optionsCities, setOptionsCities] = useState([]);
    const [optionsClientType, setOptionsClientType] = useState([]);
    const [optionsTaxpayerType, setOptionsTaxpayerType] = useState([]);
    const [optionsIdentificationType, setOptionsIdentificationType] = useState([]);
    const [optionsDocumentType, setOptionsDocumentType] = useState([]);
    const [form] = Form.useForm();

    const id = params.id ? params.id[0] : null;

    useEffect(() => {
        getData();
    }, []);

    const pageName = `${id ? 'Editar' : 'Nuevo'} Cliente`;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Maestros' }, { title: 'Clientes' }, , { title: pageName }];

    const getData = async () => {
        const [
            getOptionsStates,
            getOptionsClientType,
            getOptionsTaxpayerType,
            getOptionsIdentificationType,
        ] = await Promise.all([
            getActiveList('masters/states'),
            getActiveList('masters/client_types'),
            getActiveList('masters/taxpayer_types'),
            getActiveList('masters/identification_types'),
        ]);

        setOptionsStates(getOptionsStates);
        setOptionsClientType(getOptionsClientType);
        setOptionsTaxpayerType(getOptionsTaxpayerType);
        setOptionsIdentificationType(getOptionsIdentificationType);

        let getDocumentTypes;
        let getCities;

        if (id) {
            const get = await getOne(moduleName, id);
            get.state = get.city.state.id;
            get.city = get.city.id;
            get.clientType = get.clientType.id;
            get.taxpayer = get.taxpayer.id;
            get.identificationType = get.documentType.identificationType.id;
            get.documentType = get.documentType.id;
            setData(get);

            getDocumentTypes = await getActiveList(
                'masters/document_types',
                `?identificationTypeId=${get.identificationType}`,
            );
            getCities = await getActiveList('masters/cities', `?stateId=${get.state}`);
        } else {
            getDocumentTypes = await getActiveList(
                'masters/document_types',
                `?identificationTypeId=${1}`,
            );
            getCities = await getActiveList('masters/cities', `?stateId=${24}`);
        }

        setOptionsDocumentType(getDocumentTypes);
        setOptionsCities(getCities);
        setSpinner(false);
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoader(true);
        const res = await createOrUpdate(moduleName, values, id);

        if (res) {
            setLoader(false);
            return toast.warning(res);
        }

        toast.success(`Cliente ${id ? 'editado' : 'creado'} con éxito`);
    };

    const handleStateChange = async (value: number) => {
        form.setFieldValue('cities', undefined);
        const getCities = await getActiveList('masters/cities', `?stateId=${value}`);
        setOptionsCities(getCities);
    };

    const handleIdentifycationTypeChange = async (value: number) => {
        form.setFieldValue('documentType', undefined);
        const getDocumentTypes = await getActiveList(
            'masters/document_types',
            `?identificationTypeId=${value}`,
        );
        setOptionsDocumentType(getDocumentTypes);
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
                            <Col span={24} md={8}>
                                <Form.Item<FieldType>
                                    label="Nombre:"
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
                            <Col span={24} md={8}>
                                <Form.Item<FieldType>
                                    label="Teléfono:"
                                    name="phone"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                        {
                                            pattern: new RegExp(/^[0-9]+$/),
                                            message: 'El teléfono ingresado debe ser numérico',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24} md={8}>
                                <Form.Item<FieldType>
                                    label="Correo:"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                        {
                                            type: 'email',
                                            message: 'El correo ingresado no es válido',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={32}>
                            <Col span={24} md={8}>
                                <Form.Item<FieldType>
                                    label="Tipo de Identificación:"
                                    name="identificationType"
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
                                        options={optionsIdentificationType}
                                        fieldNames={{
                                            label: 'name',
                                            value: 'id',
                                        }}
                                        onChange={handleIdentifycationTypeChange}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24} md={8}>
                                <Form.Item<FieldType>
                                    label="Tipo de Documento:"
                                    name="documentType"
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
                                        options={optionsDocumentType}
                                        fieldNames={{
                                            label: 'code',
                                            value: 'id',
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24} md={8}>
                                <Form.Item<FieldType>
                                    label="Número de Identificación:"
                                    name="identification"
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
                                    label="Tipo de cliente:"
                                    name="clientType"
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
                                        options={optionsClientType}
                                        fieldNames={{
                                            label: 'name',
                                            value: 'id',
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24} md={{ span: 8 }}>
                                <Form.Item<FieldType>
                                    label="Estado:"
                                    name="state"
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
                                        options={optionsStates}
                                        fieldNames={{
                                            label: 'name',
                                            value: 'id',
                                        }}
                                        onChange={handleStateChange}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24} md={{ span: 8 }}>
                                <Form.Item<FieldType>
                                    label="Ciudad:"
                                    name="city"
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
                                        options={optionsCities}
                                        fieldNames={{
                                            label: 'name',
                                            value: 'id',
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={32}>
                            <Col span={24}>
                                <Form.Item<FieldType>
                                    label="Dirección:"
                                    name="address"
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
                                    label="Tipo de Contribuyente:"
                                    name="taxpayer"
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
                                        options={optionsTaxpayerType}
                                        fieldNames={{
                                            label: 'name',
                                            value: 'id',
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24} md={{ span: 16 }}>
                                <Form.Item<FieldType>
                                    label="Observaciones:"
                                    name="observations"
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

                        <ButtonSubmit loader={loader}>
                            {!id ? 'Guardar' : 'Editar'} Cliente
                        </ButtonSubmit>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default ModuleForm;
