'use client';
import ButtonBack from '@/components/dashboard/ButtonBack';
import ButtonSubmit from '@/components/dashboard/ButtonSubmit';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import { createOrUpdate, getAllData, getOne } from '@/services';
import { AppstoreOutlined } from '@ant-design/icons';
import { Col, Form, FormProps, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Loading from '@/components/Loading';
import TextArea from 'antd/es/input/TextArea';

type FieldType = {
    module: string;
    description: string;
    transactionType: string;
};

const moduleName = 'config/administrative/reason';

const ModuleForm = ({ params }: any) => {

    const [loader, setLoader] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState({});

    const id = params.id ? params.id[0] : null;

    const pageName = `${id ? 'Editar' : 'Nuevo'} motivo de pago`;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Maestros' }, { title: 'Motivo de pago' }, , { title: pageName }];

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
    }, [id]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values: any) => {
        setLoader(true);
        try {
            const res = await createOrUpdate(moduleName, values, id);
            if (res) {
                setLoader(false);
                return toast.warning(res.message);
            }
            toast.success(`Motivo ${id ? 'editada' : 'creada'} con éxito`);
        } catch (error) {
            toast.error('Ha ocurrido un error');
        } finally {
            setLoader(false);
        }
    };

    const transactionType = [
        "Ingreso",
        "Egreso",
    ];

    const options = transactionType.map((method, index) => ({
        label: method,
        value: method // O puedes usar `method` si prefieres el nombre como valor
    }));

    const moduleSelect = [
        "Cuentas por  pagar",
        "Cuentas por cobrar",
        "Tesoreria",
        "Caja",
    ];

    const optionsModule = moduleSelect.map((method, index) => ({
        label: method,
        value: method // O puedes usar `method` si prefieres el nombre como valor
    }));


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
                            gap: '20px',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <div style={{ width: '60vw', gap: '10px', display: 'flex', justifyContent: 'center' }}>
                                <div>
                                    <Form.Item
                                        label="Modulo:"
                                        name="module"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Este campo es obligatorio',
                                            },
                                        ]}
                                    >
                                        <Select
                                            showSearch
                                            style={{ width: 200 }}
                                            placeholder="Selecionar"
                                            optionFilterProp="label"
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                            }
                                            options={optionsModule}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="Tipo de transaccion"
                                        name="transactionType"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Este campo es obligatorio',
                                            },
                                        ]}
                                    >
                                        <Select
                                            showSearch
                                            style={{ width: 200 }}
                                            placeholder="Selecionar"
                                            optionFilterProp="label"
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                            }
                                            options={options}
                                        />
                                    </Form.Item>
                                </div>
                                <div>
                                    <Form.Item
                                        label="Descripción"
                                        name="description"
                                    >
                                        <TextArea rows={5} />

                                    </Form.Item>
                                </div>

                            </div>
                        </div>

                        <ButtonSubmit loader={loader}>
                            {!id ? 'Guardar' : 'Editar'} Método
                        </ButtonSubmit>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default ModuleForm;