'use client';
import ButtonBack from '@/components/dashboard/ButtonBack';
import ButtonSubmit from '@/components/dashboard/ButtonSubmit';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import { createOrUpdate, getOne } from '@/services';
import { AppstoreOutlined } from '@ant-design/icons';
import { Col, Form, FormProps, Input, Row } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type FieldType = {
    brand: string;
};

const moduleName = 'config/printer_brands';

const ModuleForm = ({ params }: any) => {
    const [loader, setLoader] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState({});
    const id = params.id ? params.id[0] : null;

    useEffect(() => {
        if (id) getData();
        else setSpinner(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const pageName = `${id ? 'Editar' : 'Nueva'} Marca de Impresora`;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [
        { title: 'Configuración' },
        { title: 'Marca de Impresoras' },
        ,
        { title: pageName },
    ];

    const getData = async () => {
        const get = await getOne(moduleName, id);
        setData(get);
        setSpinner(false);
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoader(true);
        const res = await createOrUpdate(moduleName, values, id);

        if (res) {
            setLoader(false);
            return toast.warning(res);
        }

        toast.success(
            `Marca de impresora ${id ? 'editada' : 'creada'} con éxito`,
        );
    };

    return spinner ? (
        <p>loading</p>
    ) : (
        <>
            <SetPageInfo
                pageName={pageName}
                iconPage={iconPage}
                breadCrumb={breadCrumb}
            />
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
                                    label="Nombre de la Marca:"
                                    name="brand"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <ButtonSubmit loader={loader}>
                            {!id ? 'Guardar' : 'Editar'} Marca de Impresora
                        </ButtonSubmit>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default ModuleForm;
