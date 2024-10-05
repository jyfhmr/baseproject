'use client';
import Loading from '@/components/Loading';
import ButtonBack from '@/components/dashboard/ButtonBack';
import ButtonSubmit from '@/components/dashboard/ButtonSubmit';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import { getFormData } from '@/helpers';
import { createOrUpdate, getActiveList, getOne } from '@/services';
import Filepond from '@/utils/filepond';
import { AppstoreOutlined, DeleteFilled, EyeFilled, PlusCircleOutlined } from '@ant-design/icons';
import {
    Alert,
    Button,
    Card,
    Col,
    DatePicker,
    Descriptions,
    Form,
    FormProps,
    Input,
    InputNumber,
    Popover,
    Row,
    Select,
    Table,
    Tag,
    Tooltip,
    TreeSelect,
} from 'antd';
import ModalPurchase from '@/components/dashboard/inventory/purchase/ModalPurchase';
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import ColumnGroup from 'antd/es/table/ColumnGroup';
import Column from 'antd/es/table/Column';
import { CSSProperties } from 'react';

type FieldType = {
    name: string;
    phone: string;
    address: string;
    rif: string;
    provider: number;
    invoiceDate: Date;
    expirationDate: Date;
    controlNumber: string;
    invoiceNumber: string;
    invoiceType: number;
    creditDays: number;
    money: number;
    exchangeRate: number;
    discountType: number;
};

const moduleName = 'inventory/purchase';

const ModuleForm = ({ params }: any) => {
    const [loader, setLoader] = useState(false);
    const [files, setFiles] = useState<any[]>([]);
    const [spinner, setSpinner] = useState(true);
    const [disableSelect, setDisableSelect] = useState(true);
    const [data, setData] = useState({});
    const [optionsProviders, setOptionsProviders] = useState([]) as any;
    const [optionsInvoiceTypes, setOptionsInvoiceTypes] = useState([]) as any;
    const [optionDiscountType, setOptionDiscountType] = useState([]) as any;
    const [optionsMoney, setOptionsMoney] = useState([]) as any;

    const [providerSelected, setProviderSelected] = useState<boolean | false>(false); // Estado para el proveedor seleccionado
    const [invoiceTypeSelected, setInvoiceTypeSelected] = useState<number | false>(1); // Estado para el proveedor seleccionado
    const [moneySelected, setMoneySelected] = useState<number | false>(1);
    const [moneySymbolSelected, setMoneySymbolSelected] = useState<string | false>('$'); // Estado para el proveedor seleccionado
    const [identification, setIdentificationProvider] = useState('') as any;
    const [products, setProducts] = useState([]) as any;
    const [totals, setTotals] = useState({
        subTotal: 0,
        saldo: 0,
        discount: 0,
        totalIva: 0,
        totalIgtf: 0,
        total: 0,
    }) as any;

    const [discountTypeSelected, setDiscountTypeSelected] = useState<number | 1>(1); // Estado para el proveedor seleccionado
    const [discountAmount, setDiscountAmount] = useState<number | 0>(0); // Estado para el proveedor seleccionado

    const id = params.id ? params.id[0] : null;
    let formRef = useRef<any>(null);

    useEffect(() => {
        getData();
        // setDiscountTypeSelected(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        calculoTotales();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products]);

    //  id: el.id,
    //                 barcode: el.barcode,
    //                 name: el.name,
    //                 description: el.description,
    //                 batchNumber: '',
    //                 expirationDate: '',
    //                 quantity: 0,
    //                 unitCost: 0.0,
    //                 unitPrice: 0.0,
    //                 profitPercentage: 0,
    //                 iva: 1,
    //                 discount: 0.0,
    //                 total: 0.0,

    const dateFormat = 'YYYY/MM/DD';

    const columns: any = [
        {
            title: 'Accion',
            dataIndex: 'id',
            key: 'id', // Agrega una propiedad key única
            width: 30,
            fixed: 'left',
            render: (text: any, record: any) => (
                <>
                    <div style={{ display: 'inline-flex', gap: '5px' }}>
                        <Button
                            color="danger"
                            size="small"
                            onClick={() => handleDeselect(record.id)}
                        >
                            <DeleteFilled style={{ cursor: 'pointer', color: 'red' }} />
                        </Button>
                        <Popover content={record.description} title={record.name}>
                            <Button type="primary" size="small">
                                <EyeFilled />
                            </Button>
                        </Popover>
                    </div>
                </>
            ),
        },
        { title: 'Código', dataIndex: 'barcode', width: 100, fixed: 'left' },
        { title: 'Producto', dataIndex: 'name', width: 150, fixed: 'left' },
        //{ title: 'Descripcion', dataIndex: 'description', width: 100, fixed: 'left' },
        {
            title: 'N° Lote',
            dataIndex: 'batchNumber',
            width: 150,
            fixed: 'left',
            render: (text: any, record: any) => (
                <Input
                    onChange={(e) => handleChangeInput(record.id, 'batchNumber', e.target.value)}
                />
            ),
        },
        {
            title: 'Vencimiento',
            dataIndex: 'expirationDate',
            width: 150,
            fixed: 'left',
            render: (text: any, record: any) => (
                <DatePicker
                    format={'DD/MM/YYYY'}
                    style={{ width: '100%' }}
                    onChange={(value) =>
                        handleChangeInput(
                            record.id,
                            'expirationDate',
                            dayjs(value).format('DD-MM-YYYY'),
                        )
                    }
                />
            ),
        },
        {
            title: 'Cant.',
            dataIndex: 'quantity',
            width: 100,
            fixed: 'left',
            render: (text: any, record: any) => (
                <Input
                    type="number"
                    onChange={(e) => handleChangeInput(record.id, 'quantity', e.target.value)}
                    min={1}
                    status={record.quantity <= 0 ? 'error' : ''}
                    step={1}
                />
            ),
        },
        {
            title: 'Costo Unit.',
            dataIndex: 'unitCost',
            width: 150,
            fixed: 'left',
            render: (text: any, record: any) => (
                <Input
                    suffix={moneySymbolSelected}
                    type="number"
                    onChange={(e) => handleChangeInput(record.id, 'unitCost', e.target.value)}
                    min={0}
                    status={record.unitCost <= 0 ? 'error' : ''}
                    step={0}
                />
            ),
        },
        {
            title: 'Precio Unit.',
            dataIndex: 'unitPrice',
            width: 150,
            fixed: 'left',
            render: (text: any, record: any) => (
                <Input
                    suffix={moneySymbolSelected}
                    type="number"
                    onChange={(e) => handleChangeInput(record.id, 'unitPrice', e.target.value)}
                    min={parseFloat(record.unitCost)}
                    status={record.unitCost > record.unitPrice ? 'error' : ''}
                    step={record.unitCost}
                />
            ),
        },
        // {
        //     title: '% Desc.',
        //     dataIndex: 'profitPercentage',
        //     width: 150,
        //     fixed: 'left',
        //     render: (text: any, record: any) => (
        //         <Input
        //             type="number"
        //             onChange={(e) =>
        //                 handleChangeInput(record.id, 'profitPercentage', e.target.value)
        //             }
        //         />
        //     ),
        // },
        {
            title: 'Desc.',
            dataIndex: 'discount',
            width: 150,
            fixed: 'left',
            render: (text: any, record: any) => (
                <Input
                    suffix={`${moneySymbolSelected} (${record.profitPercentage}%)`}
                    type="number"
                    onChange={(e) => handleChangeInput(record.id, 'discount', e.target.value)}
                    value={record.discount}
                    min={0}
                    step={0}
                    disabled={discountTypeSelected != 2}
                />
            ),
        },
        {
            title: 'Total.',

            dataIndex: 'total',
            width: 150,
            fixed: 'left',
            render: (text: any, record: any) => (
                <Alert
                    message={`${record.total} ${moneySymbolSelected}`}
                    type="success"
                    showIcon={false}
                    banner
                />
            ),
        },
    ];

    const handleDeselect = async (id: number) => {
        let product = products;
        await Promise.all((product = product.filter((el: any) => el.id != id)));

        await setProducts(product);
    };

    const pageName = `${id ? 'Editar' : 'Nueva'} Compra`;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Inventario' }, { title: 'Compra' }, { title: pageName }];

    const getData = async () => {
        const [
            getOptionsProviders,
            getOptionsMoney,
            getOptionsInvoiceTypes,
            getOptionsDiscountTypes,
        ] = await Promise.all([
            getActiveList('masters/providers'),
            getActiveList('treasury/maintenance/money'),
            getActiveList('config/administrative/invoice-types'),
            getActiveList('config/administrative/discount-types'),
        ]);


        setOptionsProviders(getOptionsProviders);
        setOptionsMoney(getOptionsMoney);
        setOptionsInvoiceTypes(getOptionsInvoiceTypes);
        setOptionDiscountType(getOptionsDiscountTypes);

        if (id) {
            const get = await getOne(moduleName, id);

            setData(get);
            setDisableSelect(false);
            if (get?.img) {
                setFiles([
                    `${process.env.NEXT_PUBLIC_URL_IMAGE}uploads/inventory/catalogue/img/${get.img}`,
                ]);
            }

            //formRef.current.setFieldsValue(get); // Set form values after fetching data
        }

        setSpinner(false);
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoader(true);

        //     const res = await createOrUpdate(moduleName, formData, id);
        //     if (res) {
        //         setLoader(false);
        //         if (res && res.statusCode && res.statusCode != 200 && res.statusCode != 201) {
        //             toast.warning(res.message);
        //         } else {
        //             toast.success(`Perfil ${id ? 'editado' : 'creado'} con éxito`);
        //         }
        //         return toast.warning(res);
        //     }

        //     toast.success(`Producto ${id ? 'editado' : 'registrado'} con éxito`);
    };

    const handlerSetProviders = async (value: number) => {
        const optionProciderNew = await optionsProviders.find((el: any) => el.id == value);
        formRef.current.setFieldsValue({
            rif: '',
            phone: '',
            address: '',
        });
        setProviderSelected(false);
        if (optionProciderNew) {
            formRef.current.setFieldsValue({
                rif: 'J' + optionProciderNew.identification,
                phone: optionProciderNew.phone,
                address: optionProciderNew.address,
            });

            setProviderSelected(true);
        }
    };

    const handlerSetInvoiceType = async (value: number) => {
        setInvoiceTypeSelected(value);
    };

    const handlerSetMoney = async (value: number) => {
        setMoneySelected(value);
        setMoneySymbolSelected(optionsMoney.find((el: any) => el.id == value).symbol);
    };

    const handlerSetReloadProviders = async () => {
        if (identification) {
            const [getOptionsProviders] = await Promise.all([getActiveList('masters/providers')]);

            await setOptionsProviders(getOptionsProviders);

            const provider = await getOptionsProviders.find(
                (el: any) => el.identification == identification,
            );
            if (provider) {
                await handlerSetProviders(provider?.id);
                formRef.current.setFieldsValue({
                    provider: provider?.id,
                });
            }

            await setIdentificationProvider('');
        }
    };

    const handleChangeInput = async (index: any, property: any, value: any) => {
        const updatedProducts = await Promise.all(
            products.map(async (el: any) => {
                if (el.id === index) {
                    el[property] = value; // Actualiza el valor de forma asíncrona si fuera necesario
                }
                return { ...el };
            }),
        );

        await setProducts(updatedProducts); // Actualización de productos
        await calculo(); // Llamamos al cálculo después de la actualización
    };

    const calculo = async () => {
        const product = products;
        const updatedProducts = await Promise.all(
            products.map(async (el: any) => {
                el.total = 0;
                el.discount = discountTypeSelected == 2 ? el.discount : 0;
                if (el.quantity > 0) {
                    el.total = parseFloat(el.quantity) * parseFloat(el.unitCost);

                    if (el.discount > 0) {
                        el.profitPercentage =
                            (parseFloat(el.discount) * 100) / parseFloat(el.total);
                        el.profitPercentage = parseFloat(el.profitPercentage).toPrecision(3);
                    } else {
                        el.discount = 0;
                        el.profitPercentage = 0;
                    }

                    el.total = parseFloat(el.total) - parseFloat(el.discount);
                } else {
                    el.discount = 0;
                    el.profitPercentage = 0;
                }

                return { ...el };
            }),
        );

        await setProducts(updatedProducts);
        await calculoTotales();
    };

    const calculoTotales = async () => {
        let subTotal = 0;
        let saldo = 0;
        let discount = discountTypeSelected == 3 ? discountAmount : 0;
        let totalIva = 0;
        let totalIgtf = 0;
        let total = 0;

        await setTotals({
            subTotal: 0,
            saldo: 0,
            discount: 0,
            totalIva: 0,
            totalIgtf: 0,
            total: 0,
        });

        // Simulamos un procesamiento asíncrono de los productos con `Promise.all`
        await Promise.all(
            products.map(async (product: any) => {
                // Supongamos que aquí puedes hacer alguna operación asíncrona con cada producto
                subTotal += parseFloat(product.total || 0);

                return product;
            }),
        );

        // Supongamos que el IVA es del 16%
        totalIva = moneySelected == 2 ? subTotal * 0.16 : 0;

        // Calcular el IGTF, si aplica (por ejemplo, el 3%)
        totalIgtf = moneySelected != 2 ? subTotal * 0.03 : 0; // Puedes ajustar el porcentaje según sea necesario
        // Calculamos el saldo restando el descuento y sumando el IVA
        saldo = subTotal + totalIva + totalIgtf - discount;

        total = saldo;

        // Actualiza el estado de los totales de manera asíncrona
        await setTotals({
            subTotal: isNaN(subTotal) ? '0.00' : subTotal.toFixed(2),
            saldo: isNaN(saldo) ? '0.00' : saldo.toFixed(2),
            discount: isNaN(discount) ? '0.00' : discount.toFixed(2),
            totalIva: isNaN(totalIva) ? '0.00' : totalIva.toFixed(2),
            totalIgtf: isNaN(totalIgtf) ? '0.00' : totalIgtf.toFixed(2),
            total: isNaN(total) ? '0.00' : total.toFixed(2),
        });
    };

    const handleSetDiscountType = async (value: number) => {
        await setDiscountTypeSelected(value);
        await setDiscountAmount(0);
        await calculoTotales();
    };

    useEffect(() => {
        calculoTotales();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products, discountAmount, moneySelected]);

    useEffect(() => {
        const product = products;
        const updatedProducts = product.map((el: any) => {
            el.total = 0;
            el.discount = 0;
            el.profitPercentage = 0;

            return { ...el };
        });

        setProducts(updatedProducts);
        calculo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [discountTypeSelected]);

    return spinner ? (
        <Loading />
    ) : (
        <>
            <SetPageInfo pageName={pageName} iconPage={iconPage} breadCrumb={breadCrumb} />
            <ButtonBack />

            <Row style={{ paddingTop: 3 }}>
                <Col span={24}>
                    <Form
                        ref={formRef}
                        name="purchase"
                        colon={false}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={data}
                    >
                        <Row gutter={16} style={{ marginTop: 0, paddingTop: 0 }}>
                            <Col md={{ span: 24 }} lg={{ span: 8 }} span={16} xs={{ span: 24 }}>
                                <Card
                                    title="Información de proveedor"
                                    bordered={false}
                                    type="inner"
                                >
                                    <Row
                                        gutter={16}
                                        style={{
                                            alignItems: 'end',
                                        }}
                                    >
                                        <Col md={{ span: 12 }} lg={{ span: 20 }}>
                                            <Form.Item<FieldType>
                                                label="Proveedor:"
                                                name="provider"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                                style={{ marginBottom: '8px' }} // Reducir espacio entre inputs
                                            >
                                                <Select
                                                    allowClear
                                                    style={{ width: '100%' }}
                                                    placeholder="Seleccione"
                                                    options={optionsProviders}
                                                    onChange={(value) => handlerSetProviders(value)}
                                                    showSearch
                                                    filterOption={(input, optionsProviders) =>
                                                        (optionsProviders?.name ?? '')
                                                            .toLowerCase()
                                                            .includes(input.toLowerCase())
                                                    }
                                                    fieldNames={{
                                                        label: 'businessName',
                                                        value: 'id',
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 12 }} lg={{ span: 4 }}>
                                            <Tooltip title="Agregar proveeedor">
                                                <ModalPurchase
                                                    moduleName={moduleName}
                                                    setIdentificationProvider={
                                                        setIdentificationProvider
                                                    }
                                                    handlerSetReloadProviders={handlerSetReloadProviders()}
                                                    typeModal={1}
                                                />
                                            </Tooltip>
                                        </Col>
                                    </Row>
                                    {providerSelected && (
                                        <>
                                            <Row gutter={16}>
                                                <Col md={{ span: 12 }} lg={{ span: 12 }} span={12}>
                                                    <Form.Item<FieldType>
                                                        label="Rif de proveedor:"
                                                        name="rif"
                                                        rules={[
                                                            {
                                                                required: true,
                                                            },
                                                        ]}
                                                        style={{ marginBottom: '8px' }} // Reducir espacio entre inputs
                                                    >
                                                        <Input disabled />
                                                    </Form.Item>
                                                </Col>
                                                <Col md={{ span: 12 }} lg={{ span: 12 }} span={12}>
                                                    <Form.Item<FieldType>
                                                        label="N° de teléfono:"
                                                        name="phone"
                                                        rules={[
                                                            {
                                                                required: true,
                                                            },
                                                        ]}
                                                        style={{ marginBottom: '8px' }} // Reducir espacio entre inputs
                                                    >
                                                        <Input disabled />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row gutter={16}>
                                                <Col md={{ span: 12 }} lg={{ span: 24 }} span={24}>
                                                    <Form.Item<FieldType>
                                                        label="Dirección:"
                                                        name="address"
                                                        rules={[
                                                            {
                                                                required: true,
                                                            },
                                                        ]}
                                                        style={{ marginBottom: '8px' }} // Reducir espacio entre inputs
                                                    >
                                                        <Input disabled />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </>
                                    )}
                                </Card>
                            </Col>
                            <Col md={{ span: 24 }} lg={{ span: 16 }} span={16} xs={{ span: 24 }}>
                                <Card
                                    title="Información de la Factura"
                                    bordered={false}
                                    type="inner"
                                >
                                    <Row gutter={16} style={{ marginBottom: 0 }}>
                                        <Col md={{ span: 12 }} lg={{ span: 6 }} xs={{ span: 12 }}>
                                            <Form.Item<FieldType>
                                                label="N° Factura:"
                                                name="invoiceNumber"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                                style={{ marginBottom: '8px' }} // Reducir espacio entre inputs
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 12 }} lg={{ span: 6 }} xs={{ span: 24 }}>
                                            <Form.Item<FieldType>
                                                label="N° de Control:"
                                                name="controlNumber"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                                style={{ marginBottom: '8px' }} // Reducir espacio entre inputs
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 12 }} lg={{ span: 6 }} xs={{ span: 24 }}>
                                            <Form.Item<FieldType>
                                                label="Tipo de Factura:"
                                                name="invoiceType"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                                style={{ marginBottom: '8px' }} // Reducir espacio entre inputs
                                            >
                                                <Select
                                                    allowClear
                                                    style={{ width: '100%' }}
                                                    placeholder="Seleccione"
                                                    options={optionsInvoiceTypes}
                                                    showSearch
                                                    onChange={(value) =>
                                                        handlerSetInvoiceType(value)
                                                    }
                                                    filterOption={(input, optionsProviders) =>
                                                        (optionsProviders?.name ?? '')
                                                            .toLowerCase()
                                                            .includes(input.toLowerCase())
                                                    }
                                                    fieldNames={{
                                                        label: 'name',
                                                        value: 'id',
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        {invoiceTypeSelected != 1 && (
                                            <Col
                                                md={{ span: 12 }}
                                                lg={{ span: 6 }}
                                                xs={{ span: 24 }}
                                            >
                                                <Form.Item<FieldType>
                                                    label="Cantidad de días:"
                                                    name="creditDays"
                                                    rules={[
                                                        {
                                                            required: true,
                                                        },
                                                    ]}
                                                    style={{ marginBottom: '8px' }} // Reducir espacio entre inputs
                                                >
                                                    <Input type="number" />
                                                </Form.Item>
                                            </Col>
                                        )}
                                    </Row>
                                    <Row gutter={16}>
                                        <Col md={{ span: 12 }} lg={{ span: 6 }} xs={{ span: 24 }}>
                                            <Form.Item<FieldType>
                                                label="Moneda:"
                                                name="money"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                                style={{ marginBottom: '8px' }} // Reducir espacio entre inputs
                                            >
                                                <Select
                                                    allowClear
                                                    style={{ width: '100%' }}
                                                    placeholder="Seleccione"
                                                    options={optionsMoney}
                                                    showSearch
                                                    onChange={(value) => handlerSetMoney(value)}
                                                    filterOption={(input, optionsMoney) =>
                                                        (optionsMoney?.name ?? '')
                                                            .toLowerCase()
                                                            .includes(input.toLowerCase())
                                                    }
                                                    fieldNames={{
                                                        label: 'money',
                                                        value: 'id',
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        {moneySelected && moneySelected == 1 && (
                                            <Col
                                                md={{ span: 12 }}
                                                lg={{ span: 6 }}
                                                xs={{ span: 24 }}
                                            >
                                                <Form.Item<FieldType>
                                                    label="Tasa de cambio Bs.:"
                                                    name="exchangeRate"
                                                    rules={[
                                                        {
                                                            required: true,
                                                        },
                                                    ]}
                                                    style={{ marginBottom: '8px' }} // Reducir espacio entre inputs
                                                >
                                                    <Input type="number" />
                                                </Form.Item>
                                            </Col>
                                        )}
                                        <Col md={{ span: 12 }} lg={{ span: 6 }} xs={{ span: 24 }}>
                                            <Form.Item<FieldType>
                                                label="Tipo de descuento:"
                                                name="discountType"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                                style={{ marginBottom: '8px' }} // Reducir espacio entre inputs
                                            >
                                                <Select
                                                    allowClear
                                                    style={{ width: '100%' }}
                                                    placeholder="Seleccione"
                                                    options={optionDiscountType}
                                                    showSearch
                                                    onChange={(e) => handleSetDiscountType(e)}
                                                    filterOption={(input, optionDiscountType) =>
                                                        (optionDiscountType?.name ?? '')
                                                            .toLowerCase()
                                                            .includes(input.toLowerCase())
                                                    }
                                                    fieldNames={{
                                                        label: 'name',
                                                        value: 'id',
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col md={{ span: 12 }} lg={{ span: 6 }} xs={{ span: 24 }}>
                                            <Form.Item<FieldType>
                                                label="Fecha de factura:"
                                                name="invoiceDate"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                                style={{ marginBottom: '8px' }} // Reducir espacio entre inputs
                                            >
                                                <DatePicker
                                                    format={'DD/MM/YYYY'}
                                                    style={{ width: '100%' }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 12 }} lg={{ span: 6 }} xs={{ span: 24 }}>
                                            <Form.Item<FieldType>
                                                label="Fecha de vencimiento:"
                                                name="expirationDate"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                                style={{ marginBottom: '8px' }} // Reducir espacio entre inputs
                                            >
                                                <DatePicker
                                                    format={'DD/MM/YYYY'}
                                                    style={{ width: '100%' }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                        <Row gutter={32} style={{ paddingTop: 6 }}>
                            <Col md={{ span: 24 }} lg={{ span: 24 }} span={16} xs={{ span: 24 }}>
                                <Card
                                    type="inner"
                                    title="Artículos"
                                    bordered={false}
                                    extra={
                                        <Tooltip title="Agregar proveeedor">
                                            <ModalPurchase
                                                moduleName={moduleName}
                                                setIdentificationProvider={
                                                    setIdentificationProvider
                                                }
                                                handlerSetReloadProviders={handlerSetReloadProviders()}
                                                typeModal={2}
                                                params={params}
                                                setProducts={setProducts}
                                                products={products}
                                            />
                                        </Tooltip>
                                    }
                                >
                                    <Row gutter={32} style={{ paddingTop: 6 }}>
                                        <Col
                                            md={{ span: 24 }}
                                            lg={{ span: 24 }}
                                            span={16}
                                            xs={{ span: 24 }}
                                        >
                                            <Table
                                                columns={columns}
                                                dataSource={products}
                                                rowKey={(record) => record.id}
                                            />
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                        <Row gutter={32}>
                            <Col span={12} md={{ span: 32 }} lg={{ span: 12 }}>
                                <Filepond files={files} setFiles={setFiles} />
                            </Col>
                        </Row>
                        <Row gutter={32}>
                            <Col span={12} md={{ span: 32 }} lg={{ span: 12 }}>
                                <Card
                                    title="Totales"
                                    bordered={false}
                                    style={{
                                        width: '100%',
                                        borderRadius: '10px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    }} // Ancho al 100%
                                >
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={cellStyle}>Sub Total:</td>
                                                <td style={cellStyle}></td>
                                                <td style={valueStyle}>
                                                    {Number(totals.subTotal || 0).toFixed(2) +
                                                        moneySymbolSelected}
                                                </td>
                                            </tr>
                                            {moneySelected && moneySelected == 2 ? (
                                                <tr>
                                                    <td style={cellStyle}>Iva :</td>
                                                    <td style={cellStyle}></td>
                                                    <td style={valueStyle}>
                                                        {Number(totals.totalIva || 0).toFixed(2) +
                                                            moneySymbolSelected}
                                                    </td>
                                                </tr>
                                            ) : (
                                                <tr>
                                                    <td style={cellStyle}>Igtf:</td>
                                                    <td style={cellStyle}></td>
                                                    <td style={valueStyle}>
                                                        {Number(totals.totalIgtf || 0).toFixed(2) +
                                                            moneySymbolSelected}
                                                    </td>
                                                </tr>
                                            )}
                                            <tr>
                                                <td style={cellStyle}>Descuento:</td>
                                                <td style={valueStyle}>
                                                    <Input
                                                        type="number"
                                                        onChange={(e) =>
                                                            setDiscountAmount(
                                                                parseInt(e.target.value),
                                                            )
                                                        }
                                                        disabled={discountTypeSelected != 3}
                                                        suffix={moneySymbolSelected}
                                                        value={discountAmount}
                                                    />
                                                </td>
                                                <td style={valueStyle}>
                                                    {Number(totals.discount || 0).toFixed(2) +
                                                        moneySymbolSelected}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td
                                                    style={{
                                                        ...cellStyle,
                                                        backgroundColor: '#e6f7ff',
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    Total:
                                                </td>
                                                <td
                                                    style={{
                                                        ...valueStyle,
                                                        backgroundColor: '#e6f7ff',
                                                        fontWeight: 'bold',
                                                    }}
                                                ></td>
                                                <td
                                                    style={{
                                                        ...valueStyle,
                                                        backgroundColor: '#e6f7ff',
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    {Number(totals.total || 0).toFixed(2) +
                                                        moneySymbolSelected}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td
                                                    style={{
                                                        ...cellStyle,
                                                        backgroundColor: '#e6f7ff',
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    Saldo:
                                                </td>
                                                <td
                                                    style={{
                                                        ...valueStyle,
                                                        backgroundColor: '#e6f7ff',
                                                        fontWeight: 'bold',
                                                    }}
                                                ></td>
                                                <td
                                                    style={{
                                                        ...valueStyle,
                                                        backgroundColor: '#e6f7ff',
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    {Number(totals.saldo || 0).toFixed(2) +
                                                        moneySymbolSelected}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Card>
                            </Col>
                        </Row>

                        <ButtonSubmit loader={loader}>
                            {!id ? 'Guardar' : 'Editar'} Producto
                        </ButtonSubmit>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

const cellStyle: CSSProperties = {
    textAlign: 'right',
    padding: '10px',
    fontWeight: 'bold',
    borderBottom: '1px solid #e8e8e8',
    width: '40%', // Ancho menor para los títulos
};

const valueStyle: CSSProperties = {
    textAlign: 'right',
    padding: '10px',
    borderBottom: '1px solid #e8e8e8',
    width: '60%', // Ancho mayor para los valores
};

export default ModuleForm;
