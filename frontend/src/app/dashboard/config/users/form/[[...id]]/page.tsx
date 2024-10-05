'use client';
import ButtonBack from '@/components/dashboard/ButtonBack';
import ButtonSubmit from '@/components/dashboard/ButtonSubmit';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import { createOrUpdate, getOne } from '@/services';
import { AppstoreOutlined } from '@ant-design/icons';
import { Col, Form, FormProps, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllData } from '@/services';
import Loading from '@/components/Loading';

type FieldType = {
    name: string;
    email: string;
    password: string;
    contraseña2?: string;
    file?: any;
    fullName: string;
    phoneNumber: string;
    dni: string;
    profile: number; // Cambiado a number para representar el ID del perfil
};

const moduleName = 'config/users';

const ModuleForm = ({ params }: any) => {
    const [loader, setLoader] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState<Partial<FieldType>>({}); // Asegúrate de que data sea del tipo FieldType parcial
    const [profiles, setProfiles] = useState<{ id: number, name: string }[]>([]);

    const id = params.id ? params.id[0] : null;

    const handleChangeSelect = (value: number) => { // Cambiado a number
        console.log(`selected ${value}`);
    };

    const getProfiles = async () => {
        try {
            const response = await getAllData("config/profiles");
            console.log("PROFILES DESDE FORM XD", response.data);
            setProfiles(response.data);
        } catch (error) {
            console.error("Error al cargar perfiles:", error);
        }
    };

    const getDataForUser = async () => {
        try {
            const get = await getOne(moduleName, id);
            console.log("data from backend", get);

            // Extrae el ID del perfil y actualiza el estado data
            const profileId = get.profile ? get.profile.id : null;
            setData({ ...get, profile: profileId });
            setSpinner(false);
        } catch (error) {
            console.error("Error al obtener datos del usuario:", error);
        }
    };

    useEffect(() => {
        getProfiles();
        if (id) {
            getDataForUser();
        } else {
            setSpinner(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const pageName = `${id ? 'Editar' : 'Nuevo'} Usuario`;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Configuración' }, { title: 'Usuario' }, { title: pageName }];

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log("Enviando formulario... desde users/form");

        delete values.contraseña2;

        console.log("values del form", values);

        try {
            setLoader(true);
            const res = await createOrUpdate(moduleName, values, id);
            console.log(res)

            if(res?.statusCode===401){
                toast.error(res.message);
                setLoader(false);
                return
            }

            toast.success(`Usuario ${id ? 'editado' : 'creado'} con éxito`);
        } catch (error) {
            setLoader(false);
            toast.error('Ha ocurrido un error');
        }
    };

    return spinner ? (
        <Loading/>
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
                                    label="Nombre Completo"
                                    name="fullName"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Este campo es obligatorio',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24} md={{ span: 12, offset: 6 }}>
                                <Form.Item<FieldType>
                                    label="Nombre de Usuario"
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
                            </Col>
                            <Col span={24} md={{ span: 12, offset: 6 }}>
                                <Form.Item<FieldType>
                                    label="Correo electrónico"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Este campo es obligatorio',
                                        },
                                        {
                                            type: "email",
                                            message: 'Ingresa un correo electrónico válido',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col span={24} md={{ span: 12, offset: 6 }}>
                                <Form.Item<FieldType>
                                    label="Número de Teléfono"
                                    name="phoneNumber"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Este campo es obligatorio',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col span={24} md={{ span: 12, offset: 6 }}>
                                <Form.Item<FieldType>
                                    label="Documento de identidad"
                                    name="dni"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Este campo es obligatorio',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            {!id && (
                                <>
                                    <Col span={24} md={{ span: 12, offset: 6 }}>
                                        <Form.Item<FieldType>
                                            label="Contraseña"
                                            name="password"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Este campo es obligatorio',
                                                },
                                                {
                                                    min: 6,
                                                    message: 'La contraseña debe tener al menos 6 caracteres',
                                                },
                                            ]}
                                        >
                                            <Input.Password />
                                        </Form.Item>
                                    </Col>

                                    <Col span={24} md={{ span: 12, offset: 6 }}>
                                        <Form.Item<FieldType>
                                            label="Repetir Contraseña"
                                            name="contraseña2"
                                            dependencies={["password"]}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Este campo es obligatorio',
                                                },
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        if (!value || getFieldValue('password') === value) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(new Error('Las contraseñas no coinciden'));
                                                    },
                                                }),
                                            ]}
                                        >
                                            <Input.Password />
                                        </Form.Item>
                                    </Col>
                                </>
                            )}

                            <Col span={24} md={{ span: 12, offset: 6 }}>
                                <Form.Item<FieldType>
                                    label="Selecciona el tipo de usuario"
                                    name="profile"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Este campo es obligatorio',
                                        },
                                    ]}
                                >
                                    <Select
                                        style={{ width: 120 }}
                                        onChange={handleChangeSelect}
                                        options={profiles.map(profile => ({ value: profile.id, label: profile.name }))}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <ButtonSubmit loader={loader}>
                            {!id ? 'Guardar' : 'Editar'} Usuario
                        </ButtonSubmit>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default ModuleForm;
