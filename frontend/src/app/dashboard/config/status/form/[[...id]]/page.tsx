'use client';
import Loading from '@/components/Loading';
import ButtonBack from '@/components/dashboard/ButtonBack';
import ButtonSubmit from '@/components/dashboard/ButtonSubmit';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import { createOrUpdate, getOne } from '@/services';
import { AppstoreOutlined } from '@ant-design/icons';
import { Col, ColorPicker, Form, FormProps, Input, Row } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type FieldType = {
    status: string;
    module: string;
    color: any;
};

const moduleName = 'config/status';

const ModuleForm = ({ params }: any) => {
    const [loader, setLoader] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState<FieldType | undefined>(undefined);
    const id = params.id ? params.id[0] : null;

    useEffect(() => {
        if (id) {
            getData();
        } else {
            setSpinner(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const pageName = `${id ? 'Editar' : 'Nuevo'} Status`;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Configuración' }, { title: 'Status' }, { title: pageName }];

    const getData = async () => {
        try {
            const get = await getOne(moduleName, id);
            setData(get);
        } catch (error) {
            toast.error('Error al obtener los datos');
        } finally {
            setSpinner(false);
        }
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        try {
            setLoader(true);
            const colorObject = values.color.metaColor;

            // Convertir los valores a hexadecimal usando el método toHexString()
            if (colorObject) {
                const hexColor = colorObject.toHexString();
                // Asignar el color hexadecimal al objeto values
                values.color = hexColor;
            }




            await createOrUpdate(moduleName, values, id);
            toast.success(`Status ${id ? 'editado' : 'creado'} con éxito`);
        } catch (error) {
            toast.error(`Ha ocurrido un error`);
            console.log(" el error", error)
        } finally {
            setLoader(false);
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
                                    label="Status Nombre:"
                                    name="status"
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
                                    label="Módulo Nombre:"
                                    name="module"
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
                                    label="Color del Status"
                                    name="color"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Este campo es obligatorio',
                                        },
                                    ]}
                                >
                                    <ColorPicker
                                        defaultValue={data?.color || "#000000"}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <ButtonSubmit loader={loader}>
                            {!id ? 'Guardar' : 'Editar'} Status
                        </ButtonSubmit>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default ModuleForm;