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
    value: string;
    valueNumber: number;
};

const moduleName = 'config/administrative/rates_or_porcentage';

const ModuleForm = ({ params }: any) => {

    const [loader, setLoader] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState({});

    const id = params.id ? params.id[0] : null;

    const pageName = `${id ? 'Editar' : 'Nuevo'} Tarifa o porcentaje`;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Maestros' }, { title: 'Tarifa o porcentaje' }, , { title: pageName }];

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

        values.valueNumber = Number(values.value);

        if (typeof values.valueNumber === 'number') {
            console.log(values);
            const res = await createOrUpdate(moduleName, values, id);
            console.log(res);
            if (res) {
                setLoader(false);
                return toast.warning(res.message);
            }

            toast.success(`Tarifa o porcentaje ${id ? 'editado' : 'creado'} con éxito`);
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

                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '20px'
                        }}>
                            <div style={{ width: '20vw' }}>
                                <Form.Item<FieldType>
                                    label="Método:"
                                    name="value"
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
                            {!id ? 'Guardar' : 'Editar'} Tarifa o porcentaje
                        </ButtonSubmit>
                    </Form>
                </Col>
            </Row >
        </>
    );
};

export default ModuleForm;
