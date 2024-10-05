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
    actions: any;
};

const moduleName = 'config/packages';

const ModuleForm = ({ params }: any) => {
    const [loader, setLoader] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState({}) as any;
    const [optionsActions, setOptionsActions] = useState([]);
    const id = params.id ? params.id[0] : null;

    useEffect(() => {
        const getData = async () => {
            const getOptionsActions = await getActiveList('actions');
            setOptionsActions(getOptionsActions);
            if (id) {
                const get = await getOne(moduleName, id);
                setData(get);
            }
            setSpinner(false);
        };

        getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const pageName = `${id ? 'Editar' : 'Nuevo'} Paquete`;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Configuración' }, { title: 'Paquetes' }, , { title: pageName }];

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        try {
            setLoader(true);
            values.actions = values.actions.map((item: any) => {
                return {
                    id: item,
                };
            });
            await createOrUpdate(moduleName, values, id);
            toast.success(`Paquete ${id ? 'editado' : 'creado'} con éxito`);
        } catch (error) {
            setLoader(false);
            toast.success(`Ha ocurrido un error`);
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
                        initialValues={
                            id && {
                                ...data,
                                actions: data.actions.map((action: any) => action.id),
                            }
                        }
                    >
                        <Row>
                            <Col span={24} md={{ span: 12, offset: 6 }}>
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
                        </Row>

                        <Row>
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
                        </Row>

                        <ButtonSubmit loader={loader}>
                            {!id ? 'Guardar' : 'Editar'} Paquete
                        </ButtonSubmit>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default ModuleForm;
