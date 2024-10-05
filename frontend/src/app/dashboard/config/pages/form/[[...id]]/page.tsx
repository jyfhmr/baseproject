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
    route: string;
    icon: string;
    application: number;
    pageFather: number;
    packages: any;
    order: number;
};

const moduleName = 'config/pages';

const ModuleForm = ({ params }: any) => {
    const [loader, setLoader] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState({}) as any;
    const [optionsPackages, setOptionsPackages] = useState([]);
    const [optionsApplications, setOptionsApplications] = useState([]);
    const [optionsPages, setOptionsPages] = useState([]);
    const id = params.id ? params.id[0] : null;

    useEffect(() => {
        const getData = async () => {
            const [getOptionsPackages, getOptionsApplications, getOptionsPages] = await Promise.all(
                [
                    getActiveList('config/packages'),
                    getActiveList('config/applications'),
                    getActiveList('config/pages'),
                ],
            );

            setOptionsPackages(getOptionsPackages);
            setOptionsApplications(getOptionsApplications);
            setOptionsPages(getOptionsPages);

            if (id) {
                const get = await getOne(moduleName, id);
                get.application = get.application.id;
                get.pageFather = get.pageFather?.id;
                get.packages = get.packages.map((item: any) => item.id);
                setData(get);
            }
            setSpinner(false);
        };

        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const pageName = `${id ? 'Editar' : 'Nueva'} Página`;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Configuración' }, { title: 'Páginas' }, , { title: pageName }];

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoader(true);

        // Convertir el valor de order a número si es un string
        if (typeof values.order === 'string') {
            values.order = Number(values.order);
        }

        // Asegurarse de que order es un número antes de proceder
        if (typeof values.order === 'number') {
            values.packages = values.packages.map((item: number) => {
                return {
                    id: item,
                };
            });

            try {
                const res = await createOrUpdate(moduleName, values, id);

                if (res) {
                    setLoader(false);
                    return toast.warning(res);
                }

                toast.success(`Página ${id ? 'editada' : 'creada'} con éxito`);
            } catch (error) {
                console.error(error);
                toast.error('Hubo un error al crear o editar la página');
            }
        } else {
            toast.error('El valor de order no es válido');
        }

        setLoader(false);
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
                        initialValues={id && data}
                    >
                        <Row gutter={32}>
                            <Col span={24} md={{ span: 12 }}>
                                <Form.Item<FieldType>
                                    label="Aplicación:"
                                    name="application"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Este campo es obligatorio',
                                        },
                                    ]}
                                >
                                    <Select
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Seleccione"
                                        options={optionsApplications}
                                        fieldNames={{
                                            label: 'name',
                                            value: 'id',
                                        }}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={24} md={{ span: 12 }}>
                                <Form.Item<FieldType>
                                    label="Orden:"
                                    name="order"
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
                        </Row>
                        <Row gutter={32}>
                            <Col span={24} md={{ span: 12 }}>
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
                            </Col>

                            <Col span={24} md={{ span: 12 }}>
                                <Form.Item<FieldType> label="Ruta:" name="route">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={32}>
                            <Col span={24} md={{ span: 12 }}>
                                <Form.Item<FieldType> label="Icono:" name="icon">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24} md={{ span: 12 }}>
                                <Form.Item<FieldType> label="Página padre:" name="pageFather">
                                    <Select
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Seleccione"
                                        options={optionsPages}
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
                                    label="Paquetes:"
                                    name="packages"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Este campo es obligatorio',
                                        },
                                    ]}
                                >
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Seleccione"
                                        options={optionsPackages}
                                        fieldNames={{
                                            label: 'name',
                                            value: 'id',
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* <Row>
                            <Col span={24} md={{ span: 12, offset: 6 }}>
                                <Form.Item<FieldType>
                                    label="Acciones:"
                                    name="actions"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Este campo es obligatorio',
                                        },
                                    ]}
                                >
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Seleccione"
                                        options={optionsActions}
                                        fieldNames={{ label: 'name', value: 'id' }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row> */}

                        <ButtonSubmit loader={loader}>
                            {!id ? 'Guardar' : 'Editar'} Página
                        </ButtonSubmit>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default ModuleForm;
