'use client';
import ButtonBack from '@/components/dashboard/ButtonBack';
import ButtonSubmit from '@/components/dashboard/ButtonSubmit';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import { createOrUpdate, getOne } from '@/services';
import { AppstoreOutlined } from '@ant-design/icons';
import { Col, ColorPicker, Form, FormProps, Input, Row } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type FieldType = {
    name: string;
    color: string;
    description: string;
};

const moduleName = 'config/module';

const ModuleForm = ({ params }: any) => {
    const [loader, setLoader] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState({ color: '' });
    const id = params.id ? params.id[0] : null;

    useEffect(() => {
        if (id) getData();
        else setSpinner(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const pageName = `${id ? 'Editar' : 'Nuevo'} modulo`;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Configuración' }, { title: 'Modulo' }, , { title: pageName }];

    const getData = async () => {
        const get = await getOne(moduleName, id);
        setData(get);
        setSpinner(false);
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const colorObject = values.color.metaColor;

        // Convertir los valores a hexadecimal usando el método toHexString()
        if (colorObject) {
            const hexColor = colorObject.toHexString();
            // Asignar el color hexadecimal al objeto values
            values.color = hexColor;
        }
        console.log(values);
        try {
            setLoader(true);
            const res = await createOrUpdate(moduleName, values, id);
            console.log(res);
            toast.success(`Modulo ${id ? 'editada' : 'creada'} con éxito`);
        } catch (error) {
            setLoader(false);
            toast.error(`Ha ocurrido un error`);
        }
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
                        <Row>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                width: '100%',
                                gap: '15px'
                            }}>
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
                                    label="Color:"
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
                                <Form.Item<FieldType>
                                    label="Descripcion:"
                                    name="description"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Este campo es obligatorio',
                                        },
                                    ]}
                                >
                                    <TextArea />
                                </Form.Item>
                            </div>
                        </Row>

                        <ButtonSubmit loader={loader}>
                            {!id ? 'Guardar' : 'Editar'} Acción
                        </ButtonSubmit>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default ModuleForm;
