'use client';
import ButtonBack from '@/components/dashboard/ButtonBack';
import ButtonSubmit from '@/components/dashboard/ButtonSubmit';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import { createOrUpdate, getOne } from '@/services';
import { AppstoreOutlined } from '@ant-design/icons';
import { Col, Form, FormProps, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Loading from '@/components/Loading';
import './banks.css';

type FieldType = {
    // data bank
    name: string;
    branch: string;
    adress: string;
    bankCode: string;
    ssn: string;
    phone: string;
    email: string;
    aba: string;
    routeNumber: string;
    swift: string;
    // adress bancks
    urbanization: string;
    street: string;
    building: string;
    municipality: string;
    city: string;
    codeZip: string;
};

const moduleName = 'treasury/maintenance/banks';

const ModuleForm = ({ params }: any) => {

    const [loader, setLoader] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState({});

    const id = params.id ? params.id[0] : null;

    const pageName = `${id ? 'Editar' : 'Nuevo'} Banco`;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Maestros' }, { title: 'Bancos' }, , { title: pageName }];

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getData = async () => {
        if (id) {
            const get = await getOne(moduleName, id);
            setData(get);
        }
        setSpinner(false);
    };

    useEffect(() => {
        getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoader(true);

        const res = await createOrUpdate(moduleName, values, id);
        if (res) {
            setLoader(false);
            return toast.warning(res.message);
        }

        toast.success(`Banco ${id ? 'editado' : 'creado'} con éxito`);
    };

    const { TextArea } = Input;


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
                        <Row gutter={32}>
                            <Col span={24} md={{ span: 8, offset: 6 }}>
                                {/* Data back */}

                                <div className="container-data-bank">
                                    <Form.Item<FieldType>
                                        label="Nombre:"
                                        name="name"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Este campo es obligatorio',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item<FieldType>
                                        label="Sucursal:"
                                        name="branch"

                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item<FieldType>
                                        label="Dirección (corta):"
                                        name="adress"
                                    >
                                        <TextArea rows={4} />
                                    </Form.Item>
                                    <Form.Item<FieldType>
                                        label="Código Banco:"
                                        name="bankCode"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Este campo es obligatorio',
                                            },
                                        ]}
                                    >
                                        <Input  />
                                    </Form.Item>
                                    <Form.Item<FieldType>
                                        label="SSN:"
                                        name="ssn"

                                    >
                                        <Input  />
                                    </Form.Item>
                                    <Form.Item<FieldType>
                                        label="Telefono:"
                                        name="phone"

                                    >
                                        <Input  />
                                    </Form.Item>
                                    <Form.Item<FieldType>
                                        label="Correo Electronico:"
                                        name="email"

                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item<FieldType>
                                        label="Aba:"
                                        name="aba"

                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item<FieldType>
                                        label="Numero De Ruta:"
                                        name="routeNumber"

                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item<FieldType>
                                        label="swift:"
                                        name="swift"

                                    >
                                        <Input />
                                    </Form.Item>
                                </div>
                                {/* adress bancks */}
                                <div className="container-grid-address-banks">
                                    <div>
                                        <h3>Dirección Banco</h3>
                                    </div>
                                    <div className="container-address-banks">
                                        <Form.Item<FieldType>
                                            label="Urbanización / Barrio:"
                                            name="urbanization"

                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item<FieldType>
                                            label="Calla / Av:"
                                            name="street"

                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item<FieldType>
                                            label="Casa / Edificio:"
                                            name="building"

                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item<FieldType>
                                            label="Municipio / Pueblo:"
                                            name="municipality"

                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item<FieldType>
                                            label="Ciudad / Banco:"
                                            name="city"

                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item<FieldType>
                                            label="ZIP Code:"
                                            name="codeZip"

                                        >
                                            <Input />
                                        </Form.Item>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <ButtonSubmit loader={loader}>
                            {!id ? 'Guardar' : 'Editar'} Banco
                        </ButtonSubmit>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default ModuleForm;
