'use client';
import ButtonBack from '@/components/dashboard/ButtonBack';
import ButtonSubmit from '@/components/dashboard/ButtonSubmit';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import Loading from '@/components/Loading';
import { getFormData } from '@/helpers';
import { createOrUpdate, getActiveList, getAllData, getOne } from '@/services';
import Filepond from '@/utils/filepond';
import { AppstoreOutlined } from '@ant-design/icons';
import { Col, DatePicker, Form, FormProps, Input, Row, Select, Switch } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

type FieldType = {
    // Propiedades específicas
    name: string;
    email: string;
    phone: string;
    address: string;
    rif: string;
    logo: any;
    businessName: string;
    rifDueDate: string;
    fiscalAddress: string;
    nameLegalRepresentative: string;
    lastNameLegalRepresentative: string;
    identificationTypeLegalRepresentative: number;
    documentTypeLegalRepresentative: number;
    identificationLegalRepresentative: any;
    dueDateLegalRepresentative: string;
    web: string;
    headquarterOf?: any;
    isHeadquarters: boolean;
    // Firma de índice para propiedades adicionales
    [key: string]: any;
};



const moduleName = 'config/companies';

const ModuleForm = ({ params }: any) => {
    const [loader, setLoader] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState({
        identificationTypeLegalRepresentative: 1,
        documentTypeLegalRepresentative: 1,
        isHeadquarters: true, // Valor por defecto
    });
    const [rifFile, setRifFile] = useState<any[]>([]);
    const [logoFile, setLogoFile] = useState<any[]>([]);
    const [rifLegalRepresentativeFile, setRifLegalRepresentativeFile] = useState<any[]>([]);
    const [optionsIdentificationType, setOptionsIdentificationType] = useState([]);
    const [optionsDocumentType, setOptionsDocumentType] = useState([]);
    const [companies, setCompanies] = useState<any[]>([]);
    const [headquarters, setHeadquarters] = useState(true);
    const [form] = Form.useForm();

    const id = params.id ? params.id[0] : null;

    useEffect(() => {
        getData();
    }, []);

    const handleChangeExchangeToCurrency = (value: number) => {
        console.log(`selected ${value}`);
    };

    const onChangeHeadquarters = (checked: boolean) => {
        console.log(`switch to ${checked}`);
        setHeadquarters(checked);
        if (checked) {
            form.setFieldsValue({ headquarterOf: null });
        }
    };

    const getData = async () => {
        const companiesData = await getAllData(moduleName, "a");
        setCompanies(companiesData.data);

        const [getOptionsIdentificationType] = await Promise.all([
            getActiveList('masters/identification_types'),
        ]);

        console.log(companiesData);

        setOptionsIdentificationType(getOptionsIdentificationType);

        let getDocumentTypes;

        if (id) {
            const get = await getOne(moduleName, id);

            get.identificationTypeLegalRepresentative =
                get.documentTypeLegalRepresentative.identificationType.id;
            get.documentTypeLegalRepresentative = get.documentTypeLegalRepresentative.id;
            get.rifDueDate = dayjs(get.rifDueDate, 'YYYY-MM-DD');
            get.dueDateLegalRepresentative = dayjs(get.dueDateLegalRepresentative, 'YYYY-MM-DD');

            getDocumentTypes = await getActiveList(
                'masters/document_types',
                `?identificationTypeId=${get.identificationTypeLegalRepresentative}`,
            );

            setData(get);
            if (get.logo)
                setLogoFile([
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/companies/${get.logo}`,
                ]);
            if (get.rifLegalRepresentativeFile)
                setRifLegalRepresentativeFile([
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/companies/${get.rifLegalRepresentativeFile}`,
                ]);
            if (get.rifFile)
                setRifFile([
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/companies/${get.rifFile}`,
                ]);
        } else {
            getDocumentTypes = await getActiveList('masters/document_types', `?identificationTypeId=${1}`);
        }

        setOptionsDocumentType(getDocumentTypes);
        setSpinner(false);
    };
    console.log("companies", companies);

    const pageName = `${id ? 'Editar' : 'Nueva'} Empresa`;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Configuración' }, { title: 'Empresas' }, , { title: pageName }];

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoader(true);

     
    
        // Clonar los valores para no mutar el objeto original
        const transformedValues = { ...values };

      
    
        // Convertir los campos de fecha a cadenas ISO
        if (transformedValues.dueDateLegalRepresentative && dayjs.isDayjs(transformedValues.dueDateLegalRepresentative)) {
            transformedValues.dueDateLegalRepresentative = transformedValues.dueDateLegalRepresentative.toISOString();
        }
    
        if (transformedValues.rifDueDate && dayjs.isDayjs(transformedValues.rifDueDate)) {
            transformedValues.rifDueDate = transformedValues.rifDueDate.toISOString();
        }
    
        // Convertir identificationLegalRepresentative a número si es necesario
        if (typeof transformedValues.identificationLegalRepresentative === 'string') {
            transformedValues.identificationLegalRepresentative = Number(transformedValues.identificationLegalRepresentative);
        }
    
        // Crear el FormData
        const formData = new FormData();
    
        // Agregar campos que no son archivos
        Object.keys(transformedValues).forEach((key) => {
            const value = transformedValues[key];
            if (value !== undefined && value !== null && value !== 'undefined') {
                formData.append(key, value);
            }
        });
    
        // Agregar archivos si existen
        if (logoFile[0]) {
            formData.append('logo', logoFile[0].file, logoFile[0].filename);
        }
    
        if (rifFile[0]) {
            formData.append('rifFile', rifFile[0].file, rifFile[0].filename);
        }
    
        if (rifLegalRepresentativeFile[0]) {
            formData.append('rifLegalRepresentativeFile', rifLegalRepresentativeFile[0].file, rifLegalRepresentativeFile[0].filename);
        }
    
        try {
            const res = await createOrUpdate(moduleName, formData, id);
            console.log("LA RESPUESTAAAA", res);
    
            if (res) {
                setLoader(false);
                return toast.warning(res);
            }
    
            toast.success(`Empresa ${id ? 'editada' : 'creada'} con éxito`);
        } catch (error) {
            setLoader(false);
            toast.error('Error al enviar el formulario');
            console.error('Error al enviar el formulario:', error);
        }
    };
    
    

    const handleIdentifycationTypeChange = async (value: number) => {
        form.setFieldValue('documentTypeLegalRepresentative', undefined);
        const getDocumentTypes = await getActiveList(
            'document_types',
            `?identificationTypeId=${value}`,
        );
        setOptionsDocumentType(getDocumentTypes);
    };

    return spinner ? (
        <Loading />
    ) : (
        <>
            <SetPageInfo pageName={pageName} iconPage={iconPage} breadCrumb={breadCrumb} />
            <ButtonBack />

            <Row>
                <Col>
                    <h3>Información de la Empresa</h3>
                </Col>
            </Row>

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
                            <Col span={24} md={{ span: 12 }}>
                                <Form.Item<FieldType>
                                    label="¿Empresa Principal?, si eres una sede, desactiva esta opción"
                                    name="isHeadquarters"
                                    valuePropName="checked"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Switch defaultChecked={headquarters} onChange={onChangeHeadquarters} />
                                </Form.Item>
                            </Col>
                        </Row>

                        {!headquarters && (
                            <Row gutter={32}>
                                <Col span={24} md={{ span: 12 }}>
                                    <Form.Item<FieldType>
                                        label="Escoge la empresa a la que pertenece tu sede:"
                                        name="headquarterOf"
                                    >
                                        <Select
                                            style={{ width: '100%' }}
                                            onChange={handleChangeExchangeToCurrency}
                                            options={companies.map(companie => ({
                                                value: companie.id,
                                                label: companie.name,
                                            }))}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        )}

                        <Row gutter={32}>
                            <Col span={24} md={{ span: 12 }}>
                                <Form.Item<FieldType>
                                    label="Nombre"
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

                            <Col span={24} md={{ span: 12 }}>
                                <Form.Item<FieldType>
                                    label="Razón Social"
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

                            <Col span={24} md={{ span: 8 }}>
                                <Form.Item<FieldType>
                                    label="Correo"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                        {
                                            type: 'email',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col span={24} md={{ span: 8 }}>
                                <Form.Item<FieldType>
                                    label="Teléfono"
                                    name="phone"
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
                                    label="Página Web"
                                    name="web"
                                    rules={[{ type: 'url' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={32}>
                            <Col xs={24} md={12}>
                                <Form.Item<FieldType>
                                    label="RIF"
                                    name="rif"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item<FieldType>
                                    label="Fecha de vencimiento"
                                    name="rifDueDate"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                        {
                                            type: 'date',
                                        },
                                    ]}
                                >
                                    <DatePicker format={'DD/MM/YYYY'} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={24}>
                                <Form.Item label="Imagen RIF" name="rifFile">
                                    <Filepond files={rifFile} setFiles={setRifFile} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={32}>
                            <Col span={24}>
                                <Form.Item<FieldType>
                                    label="Dirección Física"
                                    name="address"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <TextArea rows={4} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={32}>
                            <Col span={24}>
                                <Form.Item<FieldType>
                                    label="Dirección Fiscal"
                                    name="fiscalAddress"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <TextArea rows={4} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row style={{ marginBottom: '30px' }}>
                            <Col span={24}>
                                <Form.Item label="Imagen Logo" name="logo">
                                    <Filepond files={logoFile} setFiles={setLogoFile} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <h3>Datos del Representante Legal</h3>
                            </Col>
                        </Row>

                        <Row gutter={32}>
                            <Col span={24} md={{ span: 12 }}>
                                <Form.Item<FieldType>
                                    label="Nombre"
                                    name="nameLegalRepresentative"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24} md={{ span: 12 }}>
                                <Form.Item<FieldType>
                                    label="Apellido"
                                    name="lastNameLegalRepresentative"
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
                            <Col span={24} md={6}>
                                <Form.Item<FieldType>
                                    label="Tipo de Identificación"
                                    name="identificationTypeLegalRepresentative"
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
                            <Col span={24} md={6}>
                                <Form.Item<FieldType>
                                    label="Tipo de Documento"
                                    name="documentTypeLegalRepresentative"
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
                            <Col span={24} md={6}>
                                <Form.Item<FieldType>
                                    label="Número de Identificación"
                                    name="identificationLegalRepresentative"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input type="number" />
                                </Form.Item>
                            </Col>
                            <Col span={24} md={6}>
                                <Form.Item<FieldType>
                                    label="Fecha de Vencimiento"
                                    name="dueDateLegalRepresentative"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                        {
                                            type: 'date',
                                        },
                                    ]}
                                >
                                    <DatePicker format={'DD/MM/YYYY'} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row style={{ marginBottom: '30px' }}>
                            <Col span={24}>
                                <Form.Item label="Imagen RIF" name="rifLegalRepresentativeFile">
                                    <Filepond
                                        files={rifLegalRepresentativeFile}
                                        setFiles={setRifLegalRepresentativeFile}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <ButtonSubmit loader={loader}>
                            {!id ? 'Guardar' : 'Editar'} Empresa
                        </ButtonSubmit>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default ModuleForm;