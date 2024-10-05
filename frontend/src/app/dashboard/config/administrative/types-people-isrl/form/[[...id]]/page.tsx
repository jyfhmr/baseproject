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

type FieldType = {
    type: string;
    code: string;
};

const moduleName = 'config/administrative/types-people-isrl';

const ModuleForm = ({ params }: any) => {

    const [loader, setLoader] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState({});

    const id = params.id ? params.id[0] : null;

    const pageName = `${id ? 'Editar' : 'Nuevo'} Tipo de persona ISRL`;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Maestros' }, { title: 'Tipo de persona ISRL' }, , { title: pageName }];

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


        console.log(values);
        const res = await createOrUpdate(moduleName, values, id);
        console.log(res);
        if (res) {
            setLoader(false);
            return toast.warning(res.message);
        }

        toast.success(`Tipo de persona ISRL ${id ? 'editado' : 'creado'} con éxito`);

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

                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '20px'
                        }}>
                            <div style={{ width: '20vw' }}>
                                <Form.Item<FieldType>
                                    label="Tipo de persona ISRL:"
                                    name="type"
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
                                    label="Codigo:"
                                    name="code"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Este campo es obligatorio',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </div>
                        </div>



                        <ButtonSubmit loader={loader}>
                            {!id ? 'Guardar' : 'Editar'} Tipo de persona ISRL
                        </ButtonSubmit>
                    </Form>
                </Col>
            </Row >
        </>
    );
};

export default ModuleForm;
