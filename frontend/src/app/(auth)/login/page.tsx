'use client';

import { useState } from 'react';
import { Input, Checkbox, Button, Form } from 'antd';
import type { FormProps } from 'antd';
import Link from 'next/link';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
};

export default function Login() {
    const { data, status } = useSession();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    //const callbackUrl = searchParams.get('callbackUrl') || '/dashboard/actions';
    const callbackUrl = '/dashboard/config/actions';

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoading(true);
        try {
            const result = await signIn('credentials', {
                ...values,
                redirect: false,
            });

            if (result?.status === 401) {
                toast.error(result.error);
                setLoading(false);
                return false;
            }

            toast.success(`Iniciando sesión...`);

            router.push(callbackUrl);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            id="formCont"
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            size="large"
        >
            <div id="goPharmaTitleForResponsive">
                <Image
                    src="/img/favicon.ico"
                    alt="products Marketplace"
                    placeholder="blur"
                    blurDataURL={'a'}
                    width={320}
                    height={200}
                    id="reset_password_image"
                />
            </div>

            <div
                className="formDivs"
                style={{ textAlign: 'center', fontSize: '30px', fontWeight: 'bold' }}
            >
                Bienvenid@
            </div>
            <div className="formDivs formDivs_fc">Iniciar sesión</div>
            <div className="formDivs">
                <Form.Item<FieldType>
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Por favor, introduzca el correo',
                            type: 'email',
                        },
                    ]}
                    style={{ marginBottom: '0px' }}
                >
                    <Input
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="Tu correo electrónico"
                    />
                </Form.Item>
            </div>
            <div className="formDivs">
                <Form.Item<FieldType>
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Por favor, introduzca su contraseña',
                        },
                    ]}
                    style={{ marginBottom: '0px' }}
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        placeholder="Contraseña"
                    />
                </Form.Item>
            </div>

            <div className="formDivs">
                <Form.Item<FieldType>
                    name="remember"
                    valuePropName="checked"
                    style={{ marginBottom: '0px' }}
                >
                    <Checkbox>Recordar contraseña</Checkbox>
                </Form.Item>
            </div>

            <div className="forgotPassword">
                <Link href="request_password_reset">¿Olvidaste tu contraseña?</Link>
            </div>

            <Button
                type="primary"
                htmlType="submit"
                style={{
                    backgroundColor: '#680f82',
                    width: '100%',
                    marginTop: '3vh',
                }}
                className="botonIniciarSesion"
                shape="round"
                size="large"
                loading={loading}
            >
                Iniciar Sesión
            </Button>
        </Form>
    );
}
