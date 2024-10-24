'use client';
import ButtonBack from '@/components/dashboard/ButtonBack';
import ButtonSubmit from '@/components/dashboard/ButtonSubmit';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import { createOrUpdate, getOne } from '@/services';
import { AppstoreOutlined } from '@ant-design/icons';
import { Button, Col, Form, FormProps, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Loading from '@/components/Loading';

type FieldType = {
    minimumAmountPaid: any;
    maximumAmountPaid: any,
    retentionPorcentage: any,
    sustractingUT: any,
    sustractingBs: any,
};

const moduleName = 'config/administrative/rates2_ranges';

const ModuleForm = ({ params }: any) => {

    const [loader, setLoader] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState({});

    const id = params.id ? params.id[0] : null;

    const pageName = `${id ? 'Editar' : 'Nuevo'} rango `;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Maestros' }, { title: 'Tasa 2, Rango' }, , { title: pageName }];

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
    }, []);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values: any) => {
        setLoader(true);

        console.log("values", values);

        for (let strings in values) {
            console.log(strings)
            values[strings] = Number(values[strings])
        }

        console.log("values again", values)

        const res = await createOrUpdate(moduleName, values, id);
        if (res) {
            setLoader(false);
            return toast.warning(res.message);
        }

        toast.success(`Nueva tasa de unidad tributaria ${id ? 'editada' : 'creada'} con éxito`);

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
                                    label="Monto mínimo pagado:"
                                    name="minimumAmountPaid"
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
                                    label="Monto máximo pagado:"
                                    name="maximumAmountPaid"
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
                                    label="Porcentaje de retención:"
                                    name="retentionPorcentage"
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
                                    label="Sustraendo UT"
                                    name="sustractingUT"
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
                                    label="Sustraendo Bs"
                                    name="sustractingBs"
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
                            {!id ? 'Guardar' : 'Editar'} Rango
                        </ButtonSubmit>
                    </Form>
                </Col>
            </Row >

        </>
    );
};

export default ModuleForm;