'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, Select, Button, Col, Row } from 'antd';
import ButtonSubmit from '@/components/dashboard/ButtonSubmit';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import Loading from '@/components/Loading';
import { createOrUpdate, getOne, getAllData } from '@/services';
import { AppstoreOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import './subscription.css'; // Importa el archivo CSS aquí

type FieldType = {
    name: string;
    email: string;
    password: string;
    contraseña2?: string;
    file?: any;
    fullName: string;
    phoneNumber: string;
    dni: string;
    profile: number;
};

const moduleName = 'config/users';

const ModuleForm = () => {
    const [loader, setLoader] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState<Partial<FieldType>>({});
    const [profiles, setProfiles] = useState<{ id: number; name: string }[]>([]);
    const [form] = Form.useForm();
    const params = useParams();
    const id = params?.id ? Number(params.id) : null;
    const router = useRouter();

    const getProfiles = async () => {
        try {
            const response = await getAllData("config/profiles");
            setProfiles(response.data);
        } catch (error) {
            console.error("Error al cargar perfiles:", error);
        }
    };

    const getDataForUser = async () => {
        try {
            if (id !== null) {
                const get = await getOne(moduleName, id);
                const profileId = get.profile ? get.profile.id : null;
                setData({ ...get, profile: profileId });
            }
            setSpinner(false);
        } catch (error) {
            console.error("Error al obtener datos del usuario:", error);
        }
    };

    useEffect(() => {
        getProfiles();
        if (id !== null) {
            getDataForUser();
        } else {
            setSpinner(false);
        }
    }, [id]);

    const pageName = `${id ? 'Editar' : 'Nuevo'} Usuario`;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Configuración' }, { title: 'Usuario' }, { title: pageName }];

    const onFinish = async (values: FieldType) => {
        delete values.contraseña2;
        try {
            setLoader(true);
            const res = await createOrUpdate(moduleName, values, id || undefined);
            if (res?.statusCode === 401) {
                toast.error(res.message);
                setLoader(false);
                return;
            }
            toast.success(`Usuario ${id ? 'editado' : 'creado'} con éxito`);
        } catch (error) {
            setLoader(false);
            toast.error('Ha ocurrido un error');
        }
    };

    const handleClearPaymentFields = () => {
        form.resetFields(['bank', 'phone', 'amount', 'concept', 'dni']);
    };

    return spinner ? (
        <Loading />
    ) : (
        <div className="subscription-container">
            {/* Apartado de Registro */}
            <div className="subscription-registration">
                <SetPageInfo pageName={pageName} iconPage={iconPage} breadCrumb={breadCrumb} />
                <h3>Datos del Usuario</h3>
                    <Form
                        name="wrap"
                        colon={false}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={data}
                    >
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Form.Item label="Nombre Completo" name="fullName" rules={[{ required: true, message: 'Este campo es obligatorio' }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Nombre de Usuario" name="name" rules={[{ required: true, message: 'Este campo es obligatorio' }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Correo electrónico" name="email" rules={[{ required: true, message: 'Este campo es obligatorio' }, { type: "email", message: 'Ingresa un correo electrónico válido' }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Número de Teléfono" name="phoneNumber" rules={[{ required: true, message: 'Este campo es obligatorio' }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Documento de identidad" name="dni" rules={[{ required: true, message: 'Este campo es obligatorio' }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            {!id && (
                                <>
                                    <Col span={24}>
                                        <Form.Item label="Contraseña" name="password" rules={[{ required: true, message: 'Este campo es obligatorio' }, { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }]}>
                                            <Input.Password />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="Repetir Contraseña" name="contraseña2" dependencies={["password"]} rules={[{ required: true, message: 'Este campo es obligatorio' }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) { return Promise.resolve(); } return Promise.reject(new Error('Las contraseñas no coinciden')); }, })]} >
                                            <Input.Password />
                                        </Form.Item>
                                    </Col>
                                </>
                            )}
                        </Row>
                        <ButtonSubmit loader={loader}>{!id ? 'Registrar' : 'Editar'}</ButtonSubmit>
                    </Form>
            </div>

            {/* Apartado de Pago */}
            <div className="subscription-payment">
                <h3>Datos del Pago Movil</h3>
                <Form form={form} layout="vertical">
                    <Form.Item label="Banco" name="bank" rules={[{ required: true, message: 'Este campo es obligatorio' }]}>
                        <Select placeholder="Selecciona un banco">
                            <Select.Option value="0102">0102 - BANCO DE VENEZUELA</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Documento de identidad" name="dni" rules={[{ required: true, message: 'Este campo es obligatorio' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Teléfono" name="phone" rules={[{ required: true, message: 'Este campo es obligatorio' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Monto" name="amount" rules={[{ required: true, message: 'Este campo es obligatorio' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Concepto" name="concept">
                        <Input />
                    </Form.Item>
                    <div className="subscription-buttons">
                        <Button type="primary">Pagar</Button>
                        <Button onClick={handleClearPaymentFields}>Limpiar</Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default ModuleForm;
