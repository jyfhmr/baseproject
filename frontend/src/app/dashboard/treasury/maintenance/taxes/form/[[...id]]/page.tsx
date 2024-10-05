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


const moduleName = 'treasury/maintenance/taxes';

type FieldType = {
    name: string;
    typeTax: string;
    value: string;
    applicableCurrency: string;
    description: string;
};


const ModuleForm = ({ params }: any) => {
    const [loader, setLoader] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState({});
    const [currencys, setCurrencys] = useState<{ id: number, money: string }[]>([]);

    const id = params.id ? params.id[0] : null;
    const pageName = `${id ? 'Editar' : 'Nuevo'} Impuesto`;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Administrativo' }, { title: 'Impuestos' }, { title: pageName }];

    const getCurrencys = async () => {
        const response = await getAllData("treasury/maintenance/money", "1");
        setCurrencys(response.data);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getData = async () => {
        getCurrencys();
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

    console.log(data);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values: any) => {
        setLoader(true);
        values.value = Number(values.value);
        console.log(values);
        try {
            const res = await createOrUpdate(moduleName, values, id);
            console.log(res);
            if (res) {
                setLoader(false);
                return toast.warning(res.message);
            }
            toast.success(`Impuesto ${id ? 'editado' : 'creado'} con éxito`);
        } catch (error) {
            toast.error('Ha ocurrido un error');
        } finally {
            setLoader(false);
        }
    };
    const [selectedItems, setSelectedItems] = useState({});
    const { TextArea } = Input;


    const paymentMethods = [
        "Alicuota Adicional / Impuesto al Consumo de Compras",  // Aplicado sobre productos de lujo o especiales
        "Alicuota Adicional / Impuesto al Consumo de Ventas",   // Venta de productos gravados adicionalmente
        "Alicuota General / IVA Compras",                      // IVA general en compras (16% o tasa vigente)
        "Alicuota General / IVA Ventas",                       // IVA general en ventas (16% o tasa vigente)
        "Alicuota Reducida en Compras",                        // Tasa reducida de IVA aplicada a ciertos productos
        "Alicuota Reducida en Ventas",                         // Tasa reducida de IVA para ventas de ciertos productos
        "Impuesto sobre Fletes",                               // Impuesto aplicado a los costos de transporte o flete
        "Impuesto IGTF (Impuesto a Grandes Transacciones Financieras)", // Impuesto aplicado a transacciones en divisas
        "Retención IVA",                                       // Retención de IVA en el pago a proveedores
        "Retención ISLR",                                      // Retención del Impuesto sobre la Renta (ISLR)
    ];


    const options = paymentMethods.map((method, index) => ({
        label: method,
        value: method // O puedes usar `method` si prefieres el nombre como valor
    }));

    const handleChange = (value: any, date: any) => {
        setSelectedItems(value);
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
                                    label="Nombre del impuesto:"
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
                                    label="Descripción"
                                    name="description"

                                >
                                    <TextArea rows={5} />

                                </Form.Item>
                            </div>


                            <div style={{ width: '20vw' }}>

                                <Form.Item<FieldType>
                                    label="Tipo de impuesto:"
                                    name="typeTax"

                                >
                                    <Select
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Selecionar"
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                        onChange={handleChange}
                                        options={options}
                                    />
                                </Form.Item>

                                <Form.Item<FieldType>
                                    label="Valor:"
                                    name="value"
                                >
                                    <Input />

                                </Form.Item>
                                <Form.Item<FieldType>
                                    label="Moneda Aplicable:"
                                    name={"applicableCurrency"}
                                >
                                    <Select
                                        showSearch
                                        style={{ width: 200 }}
                                        placeholder="Selecionar"
                                        optionFilterProp="label"
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                        options={currencys.map(currency => ({
                                            value: currency.id,
                                            label: currency.money
                                        }))}
                                    />

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
