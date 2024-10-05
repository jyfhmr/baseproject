'use client';
import ButtonBack from '@/components/dashboard/ButtonBack';
import ButtonSubmit from '@/components/dashboard/ButtonSubmit';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import { createOrUpdate, getActiveList, getAllData, getOne } from '@/services';
import { AppstoreOutlined } from '@ant-design/icons';
import { Col, DatePicker, Flex, Form, FormProps, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Loading from '@/components/Loading';
dayjs.extend(customParseFormat);

type FieldType = {
    businessName: string;
    tradeName: string;
    ssn: string;
    identificationType: number;
    documentType: number;
    identification: string;
    state: number;
    city: number;
    address: string;
    phone: number;
    email: string;
    website: string;
    taxpayer: number;
    taxRetentionPercentage: number;
    legalRepresentativeName: string;
    legalRepresentativeLastName: string;
    constitutionDate: Date;
    paymentConcepts: any;
    typePeopleIsrl: any;
};

interface PaymentConceptOption {
    id: number;
    concept: string;
}

const moduleName = 'masters/providers';

const ModuleForm = ({
    params,
    purchase,
    setIsModalOpen,
    setIdentificationProvider,
    isModalOpen = false,
}: any) => {
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
    const [optionsTaxpayerType, setOptionsTaxpayerType] = useState([]);
    const [optionsIdentificationType, setOptionsIdentificationType] = useState([]);
    const [optionsDocumentType, setOptionsDocumentType] = useState([]);
    const [optionsTypePeopleIsrl, setOptionsTypePeopleIsrl] = useState([]);
    const [optionsPaymentConsept, setOptionsPaymentConsept] = useState<PaymentConceptOption[]>([]);
    const [optionsPorcentages, setOptionsPorcentages] = useState([]);
    const [form] = Form.useForm();

    const id = params?.id ? params?.id[0] : null;

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const pageName = `${id ? 'Editar' : 'Nuevo'} Proveedor`;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Maestros' }, { title: 'Proveedors' }, , { title: pageName }];

    const getData = async () => {
        const [
            getOptionsStates,
            getOptionsTaxpayerType,
            getOptionsIdentificationType,
            getOptionsTypePeopleIsrl,
            getOptionsPaymentConsept,
            getOptionsPorcentages,
        ] = await Promise.all([
            getActiveList('masters/states'),
            getActiveList('masters/taxpayer_types'),
            getActiveList('masters/identification_types'),
            getActiveList('config/administrative/types-people-isrl'),
            getActiveList('config/administrative/payment_concepts'),
            getAllData('masters/taxpayer_types/listPorcentage'),
        ]);

        setOptionsStates(getOptionsStates);
        setOptionsTaxpayerType(getOptionsTaxpayerType);
        setOptionsIdentificationType(getOptionsIdentificationType);
        setOptionsTypePeopleIsrl(getOptionsTypePeopleIsrl);
        setOptionsPaymentConsept(getOptionsPaymentConsept);
        setOptionsPorcentages(getOptionsPorcentages);

        let getCities;
        let getDocumentTypes;

        if (id) {
            const get = await getOne(moduleName, id);
            get.state = get.city.state.id;
            get.city = get.city.id;
            get.taxpayer = get.taxpayer.id;
            get.identificationType = get.documentType.identificationType.id;
            get.documentType = get.documentType.id;
            get.constitutionDate = dayjs(get.constitutionDate, 'YYYY-MM-DD');
            get.paymentConcepts = get.paymentConcepts.map((item: any) => item.id);
            get.typePeopleIsrl = get.typePeopleIsrl?.id;
            get.taxRetentionPercentage = get.taxRetentionPercentage?.id;

            setData(get);

            getCities = await getActiveList('masters/cities', `?stateId=${get.state}`);
            getDocumentTypes = await getActiveList(
                'masters/document_types',
                `?identificationTypeId=${get.identificationType}`,
            );
        } else {
            getCities = await getActiveList('masters/cities', `?stateId=${24}`);
            getDocumentTypes = await getActiveList(
                'masters/document_types',
                `?identificationTypeId=${1}`,
            );
        }

        setOptionsCities(getCities);
        setOptionsDocumentType(getDocumentTypes);
        setSpinner(false);
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoader(true);
        values.constitutionDate = new Date(values.constitutionDate);

        const valuesPaymentConcepts = optionsPaymentConsept.filter((el) =>
            values.paymentConcepts.includes(el.id),
        );

        values.paymentConcepts = valuesPaymentConcepts;

        const res = await createOrUpdate(moduleName, values, id, purchase);

        if (res) {
            setLoader(false);
            if (isModalOpen) {
                setIsModalOpen(false);
            }

            return toast.warning(res);
        }
        setLoader(false);
        toast.success(`Proveedor ${id ? 'editado' : 'creado'} con éxito`);

        if (isModalOpen) {
            setIdentificationProvider(values.identification);
            setIsModalOpen(false);
        }
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
        <Loading />
    ) : (
        <>
            <SetPageInfo pageName={pageName} iconPage={iconPage} breadCrumb={breadCrumb} />
            {!isModalOpen && <ButtonBack />}

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
                            <Col>
                                <h3>
                                    <b>Datos de Identificación</b>
                                </h3>
                            </Col>
                        </Row>

                        <Row gutter={32}>
                            <Col span={24} md={12}>
                                <Form.Item<FieldType>
                                    label="Razón Social:"
                                    name="businessName"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24} md={12}>
                                <Form.Item<FieldType>
                                    label="Nombre Comercial:"
                                    name="tradeName"
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
                            <Col span={24} md={8}>
                                <Form.Item<FieldType>
                                    label="SSN:"
                                    name="ssn"
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

                        <Row>
                            <Col>
                                <h3>
                                    <b>Datos de Contacto</b>
                                </h3>
                            </Col>
                        </Row>

                        <Row gutter={32}>
                            <Col span={24} md={8}>
                                <Form.Item<FieldType> label="Sitio Web:" name="website">
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
                            <Col span={24} md={12}>
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
                            <Col span={24} md={12}>
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

                        <Row>
                            <Col>
                                <h3>
                                    <b>Información Fiscal</b>
                                </h3>
                            </Col>
                        </Row>

                        <Row gutter={32}>
                            <Col span={24} md={12}>
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
                            <Col span={24} md={12}>
                                <Form.Item<FieldType>
                                    label="Porcentaje de Retención:"
                                    name="taxRetentionPercentage"
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
                                        options={optionsPorcentages}
                                        fieldNames={{
                                            label: 'description',
                                            value: 'id',
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={32}>
                            <Col span={24} md={12}>
                                <Form.Item<FieldType>
                                    label="Tipo de proveedor ISRL:"
                                    name="typePeopleIsrl"
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
                                        options={optionsTypePeopleIsrl}
                                        fieldNames={{
                                            label: 'type',
                                            value: 'id',
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24} md={12}>
                                <Form.Item<FieldType>
                                    label="Conceptos de pago:"
                                    name="paymentConcepts"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Seleccione"
                                        options={optionsPaymentConsept}
                                        fieldNames={{
                                            label: 'concept',
                                            value: 'id',
                                        }}
                                        filterOption={(input, optionsPaymentConsept) =>
                                            (optionsPaymentConsept?.concept ?? '')
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <h3>
                                    <b>Información Legal</b>
                                </h3>
                            </Col>
                        </Row>

                        <Row gutter={32}>
                            <Col span={24} md={12}>
                                <Form.Item<FieldType>
                                    label="Nombre del representante legal:"
                                    name="legalRepresentativeName"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24} md={12}>
                                <Form.Item<FieldType>
                                    label="Apellido del representante legal:"
                                    name="legalRepresentativeLastName"
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
                            <Col span={24}>
                                <Flex vertical gap="small">
                                    <Form.Item<FieldType>
                                        label="Fecha de constitución de la empresa:"
                                        name="constitutionDate"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            format={'DD/MM/YYYY'}
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </Flex>
                            </Col>
                        </Row>
                        <ButtonSubmit loader={loader}>
                            {!id ? 'Guardar' : 'Editar'} Proveedor
                        </ButtonSubmit>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default ModuleForm;
