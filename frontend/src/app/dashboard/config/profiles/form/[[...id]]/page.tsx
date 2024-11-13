'use client';
import { useState, useEffect } from 'react';
import { Button, Col, Form, Input, Row, Steps, message } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

import ButtonBack from '@/components/dashboard/ButtonBack';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import CheckBoxProfile from '@/components/dashboard/profile/CheckBoxProfile';
import { createOrUpdate, getAllData, getOne } from '@/services';
import Loading from '@/components/Loading';

type FieldType = {
    profile: {
        name: string;
        description?: string;
        pages?: never[];
    };
};

const moduleName = 'config/profiles';

const ModuleForm = ({ params }: any) => {
    const [current, setCurrent] = useState(0);
    const [loader, setLoader] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [optionsApplications, setOptionsApplications] = useState([]);
    const [formData, setFormData] = useState<FieldType>({ profile: { name: '' } });

    const [form] = Form.useForm();

    const id = params.id ? params.id[0] : null;

    useEffect(() => {
        const getData = async () => {
            try {
                if (id) {
                    const get = await getOne(moduleName, id);

                    setOptionsApplications(get.pages);

                    let fordDataUpdate = formData;
                    fordDataUpdate.profile.name = get.name;
                    fordDataUpdate.profile.description = get.description;

                    setFormData(fordDataUpdate);
                } else {
                    const [getOptionsApplications] = await Promise.all([
                        getAllData('applications/profile'),
                        1,
                    ]);
                    setOptionsApplications(getOptionsApplications.data);
                }
            } catch (error) {
                console.error('Error fetching options:', error);
            } finally {
                setSpinner(false);
            }
        };

        getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const pageName = `${id ? 'Editar' : 'Nuevo'} Perfil`;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Configuración' }, { title: 'Perfiles' }, { title: pageName }];

    const onFinish = async (values: FieldType) => {
        values.profile.pages = optionsApplications;
        try {
            setLoader(true);
            const res = await createOrUpdate(moduleName, values.profile, id);
            if (res && res.statusCode && res.statusCode != 200 && res.statusCode != 201) {
                toast.warning(res.message);
            } else {
                toast.success(`Perfil ${id ? 'editado' : 'creado'} con éxito`);
            }
        } catch (error) {
            toast.error('Ha ocurrido un error');
        } finally {
            setLoader(false);
        }
    };

    const steps = [
        {
            title: 'Perfil',
            content: (
                <>
                    <Form.Item
                        name={['profile', 'name']}
                        label="Nombre"
                        rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name={['profile', 'description']}
                        label="Descripción"
                        rules={[{ required: true, message: 'Por favor ingrese la descripción' }]}
                    >
                        <Input />
                    </Form.Item>
                </>
            ),
        },
        {
            title: 'Aplicaciones',
            content: (
                <CheckBoxProfile
                    optionsApplications={optionsApplications}
                    setOptionsApplications={setOptionsApplications}
                    type={1}
                />
            ),
        },
        {
            title: 'Modulos',
            content: (
                <CheckBoxProfile
                    optionsApplications={optionsApplications}
                    setOptionsApplications={setOptionsApplications}
                    type={2}
                />
            ),
        },
        {
            title: 'Paginas',
            content: (
                <CheckBoxProfile
                    optionsApplications={optionsApplications}
                    setOptionsApplications={setOptionsApplications}
                    type={3}
                />
            ),
        },
        {
            title: 'Paquetes',
            content: (
                <CheckBoxProfile
                    optionsApplications={optionsApplications}
                    setOptionsApplications={setOptionsApplications}
                    type={4}
                />
            ),
        },
    ];

    const next = () => {
        form.validateFields()
            .then((values) => {
                setFormData((prev) => ({ ...prev, ...values }));
                setCurrent(current + 1);
            })
            .catch((info) => {
                console.error('Validate Failed:', info);
            });
    };

    const prev = () => setCurrent(current - 1);

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    return spinner ? (
        <Loading/>
    ) : (
        <Form
            form={form}
            initialValues={formData}
            onFinish={(values) => {
                setFormData((prev) => ({ ...prev, ...values }));
                onFinish(formData);
            }}
        >
            <SetPageInfo pageName={pageName} iconPage={iconPage} breadCrumb={breadCrumb} />
            <Row>
                <Col span={24}>
                    <ButtonBack />
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <Steps current={current} items={items} style={{ marginTop: 24 }} />
                    <div style={{ marginTop: 16 }}>
                        <Form.Item noStyle>{steps[current].content}</Form.Item>
                    </div>
                    <div
                        style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}
                    >
                        <div>
                            {current > 0 && (
                                <Button style={{ margin: '0 8px' }} onClick={prev}>
                                    Atrás
                                </Button>
                            )}
                        </div>
                        <div>
                            {current < steps.length - 1 && (
                                <Button type="primary" onClick={next}>
                                    Siguiente
                                </Button>
                            )}
                            {current === steps.length - 1 && (
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={loader}>
                                        {id ? 'Editar Perfil' : 'Guardar Perfil'}
                                    </Button>
                                </Form.Item>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>
        </Form>
    );
};

export default ModuleForm;
