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
    method: any;
    typeMethodPayment: any;
    description: string;
    code: number;
};

const moduleName = 'treasury/maintenance/payment_method';

const ModuleForm = ({ params }: any) => {

    const [loader, setLoader] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState({});
    const [selectedItems, setSelectedItems] = useState({});

    const id = params.id ? params.id[0] : null;

    const pageName = `${id ? 'Editar' : 'Nuevo'} método de pago `;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Maestros' }, { title: 'Método de pago ' }, , { title: pageName }];

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

        values.code = Number(values.code);
        values.method = selectedItems;
        values.typeMethodPayment = String(values.typeMethodPayment);

        if (typeof values.code === 'number') {
            console.log(values);
            const res = await createOrUpdate(moduleName, values, id);
            console.log(res);
            if (res) {
                setLoader(false);
                return toast.warning(res.message);
            }

            toast.success(`Método de pago ${id ? 'editado' : 'creado'} con éxito`);
        }

    };

    const { TextArea } = Input;


    const paymentMethods = [
        "Tranferencia",
        "Pago movil",
        "PayPal",
        "Cash",
        "Bitcoin",
        "Zelle",
        "Efectivo",
    ];

    const options = paymentMethods.map((method, index) => ({
        label: method,
        value: method // O puedes usar `method` si prefieres el nombre como valor
    }));

    const handleChange = (value: any, date: any) => {
        setSelectedItems(value);
    };

    console.log(selectedItems);


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
                                    name="method"
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
                                        placeholder="Selecionar"
                                        onChange={handleChange}
                                        options={options}
                                    />
                                </Form.Item>

                                <Form.Item<FieldType>
                                    label="Descripción"
                                    name="description"

                                >
                                    <TextArea rows={4} />

                                </Form.Item>
                            </div>


                            <div style={{ width: '20vw' }}>

                                <Form.Item<FieldType>
                                    label="Tipo de método de pago:"
                                    name="typeMethodPayment"

                                >
                                    <Select
                                        showSearch
                                        style={{ width: 200 }}
                                        placeholder="Selecionar"
                                        optionFilterProp="label"
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                        options={[
                                            {
                                                value: 'Contado',
                                                label: 'Contado',
                                            },
                                            {
                                                value: 'Credito',
                                                label: 'Credito',
                                            },
                                        ]}
                                    />
                                </Form.Item>

                                <Form.Item<FieldType>
                                    label="Codigo:"
                                    name="code"
                                >
                                    <Input />

                                </Form.Item>
                            </div>
                        </div>



                        <ButtonSubmit loader={loader}>
                            {!id ? 'Guardar' : 'Editar'} Método
                        </ButtonSubmit>
                    </Form>
                </Col>
            </Row >
        </>
    );
};

export default ModuleForm;
