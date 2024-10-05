'use client';
import ButtonBack from '@/components/dashboard/ButtonBack';
import ButtonSubmit from '@/components/dashboard/ButtonSubmit';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import { createOrUpdate, getActiveList, getAllData, getOne } from '@/services';
import { toast } from 'react-toastify';
import Loading from '@/components/Loading';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useRef, useState } from 'react';
import { AppstoreOutlined, PlusCircleOutlined } from '@ant-design/icons';
import ModalPurchase from '@/components/dashboard/inventory/purchase/ModalPurchase';
import dayjs from 'dayjs'
import {
    Button,
    Card,
    Checkbox,
    Col,
    DatePicker,
    Form,
    FormProps,
    Input,
    Modal,
    Row,
    Select,
    Space,
    Tooltip,
    Typography,
} from 'antd';
import TableCreditNote from '@/components/dashboard/accounts_payable/documents/credit_note/TableCreditNote';

type FieldType = {
    // provedor
    address: string;
    company: string;
    rif: string;
    ssn: string;
    phone: string;

    // otros
    typePayment: string;
    typeMoney: number;

    // datos de nota de debito

    applyBook: string;
    module: string;
    numberCreditNote: string;
    controlNumber: string;
    createAtDebit: Date;
    dueDate: Date;
    // tabla

    observation: string;
    subtotal: string;
    discount: string;
    vat: string;
    total: string;
    balance: string;
    exempt: string;
    // exonerated: string;
    igtf: string;
    motive: string;
    motiveBalances: string;

    statusDebit: boolean;
    rage: number;
};

const inTypePayment = [
    {
        id: 1,
        name: 'Contado',
    },
    {
        id: 2,
        name: 'Crédito',
    },
];

const bookOptionType = [
    {
        id: 1,
        name: 'Si',
    },
    {
        id: 2,
        name: 'No',
    },
];

const moduleName = 'accounts_payable/documents/credit_note';

const ModuleForm = ({ params }: any) => {

    const [data, setData] = useState({
        typeMoney: {
            id: '',
            money: '',
            symbol: '',
        },
        vat: '',
        discount: '',
        exempt: '',
        exonerated: '',
        igtf: '',
        module: {
            id: '',
        }
    });

    const [moneySelected, setMoneySelected] = useState({ sym: '', name: '' });
    const [moduleSelect, setModuleSelected] = useState({ color: '', name: '' });
    const [discountSelect, setDiscountSelected] = useState(1);
    const [typePaymentSelected, setTypePaymentSelected] = useState(0);
    const [loader, setLoader] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [optionsProviders, setOptionsProviders] = useState([]) as any;
    const [optionsMoney, setOptionsMoney] = useState([]) as any;
    const [optionsTaxes, setOptionsTaxes] = useState([]) as any;
    const [optionsRage, setOptionsRage] = useState([]) as any;
    const [optionsModule, setOptionsModule] = useState([]) as any;
    const [optionsRate, setOptionsRate] = useState([]) as any;
    const [optionsTypePayment, setOptionsTypePayment] = useState([]) as any;
    const [optionBook, setOptionBook] = useState([]) as any;
    const [dataMotive, setDataMotive] = useState([]) as any;
    const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
    const [providerSelected, setProviderSelected] = useState<boolean | false>(false); // Estado para el proveedor seleccionado
    const [identification, setIdentificationProvider] = useState('') as any;
    const [totalSum, setTotalSum] = useState(0);
    const [totalSaldo, setTotalSaldo] = useState(0);
    const [valueIgtf, setValueIgtf] = useState(0);
    const [valueDiscount, setValueDiscount] = useState(0);
    const [valueVat, setValueVat] = useState(0);
    const [total, setTotal] = useState(0);
    const [form] = Form.useForm();
    const [isDisabledVat, setIsDisabledVat] = useState(true);
    const [isDisabledDescuent, setIsDisabledDescuent] = useState(true);
    const [isDisabledIgtf, setIsDisabledIgtf] = useState(true);
    const [statusDebit, setStatusDebit] = useState(false);
    const [exemt, setExemt] = useState(0);
    const [valueNewTasa, setValueNewTasa] = useState(0);
    const [discount, setDiscount] = useState(() => { return isDisabledDescuent ? null : 0; });
    const [vat, setVat] = useState(() => { return isDisabledVat ? null : 0; });
    const [igtf, setIgtf] = useState(() => { return isDisabledIgtf ? null : 0; });
    const [tasa, setTasa] = useState(() => { return isDisabledIgtf ? null : 0; });
    const id = params.id ? params?.id[0] : null;
    let formRef = useRef<any>(null);
    const { Title, Text } = Typography;

    const pageName = `${id ? 'Editar' : 'Nuevo'} nota de credito`;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Maestros' }, { title: 'Nota de credito' }, , { title: pageName }];

    console.log(typePaymentSelected);
    useEffect(() => {

        // Verificar si inputValues es válido antes de hacer la suma
        if (inputValues && typeof inputValues === 'object') {
            // Convertir los valores del objeto a números y sumarlos
            const sum = Object.values(inputValues).reduce((acc, value) => acc + Number(value), 0);
            // Actualizar el estado con la suma
            setTotalSum(sum);
        }

    }, [inputValues, dataMotive]);


    const getData = async () => {
        const [getOptionsProviders, getOptionsMoney, getOptionsTaxes, getOptionsRage, getOptionsModule, getOptionsRate] = await Promise?.all([
            getActiveList('masters/providers'),
            getActiveList('treasury/maintenance/money'),
            getAllData('treasury/maintenance/taxes', '1'),
            getAllData('treasury/maintenance/exchange_rate', '1'),
            getAllData('config/module', '1'),
            getAllData('treasury/maintenance/exchange_rate', '1'),
        ]);

        setOptionsProviders(getOptionsProviders);
        setOptionsMoney(getOptionsMoney);
        setOptionsTaxes(getOptionsTaxes.data);
        setOptionsRage(getOptionsRage.data);
        setOptionsModule(getOptionsModule.data);
        setOptionsRate(getOptionsRate.data);
        setOptionsTypePayment(inTypePayment);
        setOptionBook(bookOptionType);

        if (id) {
            const get: any = await getOne(moduleName, id);
            setStatusDebit(get.statusDebit)
            get.createAtDebit = dayjs(get.createAtDebit);
            get.dueDate = get.dueDate ? dayjs(get.dueDate) : null;
            setDataMotive(get.motive)
            setTypePaymentSelected(get.typePayment)
            setInputValues(JSON.parse(get.motiveBalances))
            setIdentificationProvider(get.company.identification)
            handlerSetReloadProviders()
            setIsDisabledVat(get.vat == 0 ? true : false)
            setIsDisabledDescuent(get.discount == 0 ? true : false)
            setIsDisabledIgtf(get.igtf == 0 ? true : false)
            
            setTasa(get.rage);
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

        values.subtotal = Number(totalSum.toFixed(4));
        values.discount = Number(values.discount);
        values.vat = Number(values.vat);
        values.balance = Number(totalSaldo.toFixed(4));
        values.total = Number(total.toFixed(4));
        values.exempt = Number(exemt.toFixed(4));
        values.igtf = igtf == null ? 0 : igtf;
        values.statusDebit = statusDebit;
        values.rage = tasa;
        // values.exonerated = Number(values.exonerated);
        values.motive = dataMotive.map((motive: any) => motive.id);
        values.motiveBalances = JSON.stringify(inputValues)
        values.statusDebit = statusDebit
        values.observation = values.observation == undefined ? ' ' : values.observation
        try {
            console.log(values);
            const res = await createOrUpdate(moduleName, values, id);
            console.log(res);
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


    const handlerSetTypePayment = async (value: number) => {
        setTypePaymentSelected(value);
    }
    const handlerSetMoney = async (value: number) => {

        const tasaNew = optionsRate.filter((options: any) => {
            return options.currencyId.money == optionsMoney.find((el: any) => el.id == value)?.money;
        })

        if (tasaNew) {
            setTasa(tasaNew[0]?.exchange)
            form.setFieldsValue({
                rage: tasaNew[0]?.exchange,
            });
        }

        setMoneySelected({
            name: optionsMoney.find((el: any) => el.id == value)?.money,
            sym: optionsMoney.find((el: any) => el.id == value)?.symbol
        });
    };

    const handlerSetModule = async (value: number) => {
        setModuleSelected({
            name: optionsModule.find((el: any) => el.id == value).name,
            color: optionsModule.find((el: any) => el.id == value).color
        });
    };
    const handlerSetDiscuont = async (value: number) => {
        setDiscountSelected(value);
    };

    const handlerSetProviders = async (value: number) => {
        const optionProciderNew = await optionsProviders.find((el: any) => el.id == value);
        formRef.current.setFieldsValue({
            rif: '',
            phone: '',
            address: '',
            ssn: '',
        });
        setProviderSelected(false);
        if (optionProciderNew) {
            formRef.current.setFieldsValue({
                rif: 'J' + optionProciderNew.identification,
                phone: optionProciderNew.phone,
                address: optionProciderNew.address,
                ssn: optionProciderNew.ssn,
            });

            setProviderSelected(true);
        }
    };

    const handlerSetReloadProviders = async () => {
        if (identification) {
            const [getOptionsProviders] = await Promise.all([getActiveList('masters/providers')]);

            setOptionsProviders(getOptionsProviders);

            const provider = await getOptionsProviders.find(
                (el: any) => el.identification == identification,
            );
            if (provider) {
                await handlerSetProviders(provider?.id);
                formRef.current.setFieldsValue({
                    company: provider?.id,
                });
            }

            await setIdentificationProvider('');
        }
    }

    useEffect(() => {
        // Verifica si `id` o `data?.typeMoney?.money` están disponibles y actualiza el formulario
        if (id || data?.typeMoney?.id) {
            form.setFieldsValue({
                typeMoney: data?.typeMoney?.id,
            });
            setMoneySelected({
                name: data?.typeMoney?.money,
                sym: data?.typeMoney?.symbol
            })
        }
        if (id || data?.module?.id) {
            form.setFieldsValue({
                module: data?.module?.id,
            });
        }
    }, [id, data, form]);


    // Maneja el cambio de estado del checkbox
    const onCheckboxChangeVat = (e: { target: { checked: any; }; }) => {
        setIsDisabledVat(!e.target.checked); // Si está marcado, desactiva el input, si no, lo habilita
        if (e.target.checked === false) {
            setVat(null)
            form.setFieldsValue({
                vat: 0,
            });
        }
    };
    const onCheckboxChangeDescuent = (e: { target: { checked: any; }; }) => {

        setIsDisabledDescuent(!e.target.checked); // Si está marcado, desactiva el input, si no, lo habilita
        if (e.target.checked === false) {
            setDiscount(null)
            form.setFieldsValue({
                discount: 0,
            });
        }
    };

    const onCheckboxChangeIgtf = (e: { target: { checked: any; }; }) => {

        setIsDisabledIgtf(!e.target.checked); // Si está marcado, desactiva el input, si no, lo habilita
        if (e.target.checked === false) {
            setIgtf(null)
            form.setFieldsValue({
                igtf: 0,
            });
        }
    };

    useEffect(() => {
        const ivaTax = optionsTaxes.find((v: any) => v.name === 'IVA'); // Encuentra el IVA

        if (ivaTax && isDisabledVat == false && vat == null) {
            setVat(ivaTax.value); // Actualiza el estado solo si encuentra el IVA
        }

        const igtfTax = optionsTaxes.find((v: any) => v.name === 'IGTF'); // Encuentra el IGTF
        if (igtfTax && isDisabledIgtf == false && igtf == null) {
            setIgtf(igtfTax.value); // Actualiza el estado solo si encuentra el IVA
        }

        form.setFieldsValue({
            vat: vat,
            igtf: igtf,
        });

    }, [optionsTaxes, vat, form, igtf, isDisabledVat, isDisabledIgtf]);

    const onchangeVat = (value: any) => {
        const data = value.target.value
        setVat(data);
    };

    const onchangeIgtf = (value: any) => {
        const data = value.target.value
        setIgtf(data);
    };

    const onchangeDiscount = (value: any) => {
        const data = Number(value.target.value)
        setDiscount(data);
        form.setFieldsValue({
            discount: value.target.value,
        });
    };
    const onchangeRage = (value: any) => {
        const data = Number(value.target.value)
        console.log(data);
        setTasa(data);
        form.setFieldsValue({
            tasa: data,
        });
    };



    useEffect(() => {
        // Aseguramos que todos los valores sean numéricos
        const parsedSubtotal = Number(totalSum) || 0;
        const parsedDiscount = Number(discount) || 0;
        const parsedVat = Number(vat) || 0;
        const parsedIgtf = Number(igtf) || 0;
        const parsedTasa = Number(tasa) || 0;

        // Aplicar descuento
        let subtotalWithDiscount = parsedSubtotal;

        if (discountSelect == 1) {
            if (parsedDiscount > 0) {
                subtotalWithDiscount = parsedSubtotal - (parsedSubtotal * parsedDiscount) / 100;
            }
        } else {
            if (parsedDiscount > 0) {
                subtotalWithDiscount = parsedSubtotal - parsedDiscount;
            }
        }

        // Aplicar IVA sobre el subtotal con descuento
        let vatAmount = 0;
        if (parsedVat > 0) {
            vatAmount = (subtotalWithDiscount * parsedVat) / 100;
        }

        // Aplicar IGTF sobre el subtotal con descuento
        let igtfAmount = 0;
        if (parsedIgtf > 0) {
            igtfAmount = (subtotalWithDiscount * parsedIgtf) / 100;
        }
        let tasaAmount = 0;
        if (parsedTasa > 0) {
            tasaAmount = (subtotalWithDiscount * parsedTasa);
        }

        // Total sin exentos/exonerados
        let totalWithoutExempt = subtotalWithDiscount + vatAmount + igtfAmount;


        // Calcular el saldo como el total final menos los valores exentos/exonerados
        const finalSaldo = totalWithoutExempt;

        // Calcular exento, IGTF e IVA totales
        const vatTotal = vatAmount;
        const igtfTotal = igtfAmount;

        // Calcular exento (sin impuestos aplicados, si lo necesitas)
        const exemtTotal = subtotalWithDiscount;


        // Actualizar el total y saldo
        setExemt((exemtTotal + igtfTotal));
        setValueNewTasa(tasaAmount)     // Exentos
        setValueDiscount((parsedSubtotal - (parsedSubtotal - subtotalWithDiscount))); // Descuento aplicado
        setValueIgtf((igtfTotal + subtotalWithDiscount));    // IGTF
        setValueVat((vatTotal + subtotalWithDiscount));      // IVA
        setTotal(totalWithoutExempt); // Total final
        setTotalSaldo(finalSaldo);  // Saldo final

    }, [totalSum, discount, vat, igtf, tasa, discountSelect]);


    const options = [
        {
            value: 1,
            label: '%',
        },
        {
            value: 2,
            label: 'Monto',
        },
    ];

    function cofirmNoteCredit() {
        form.submit()
        setStatusDebit(true)

    }

    console.log(data);
    console.log(statusDebit);

    return spinner ? (
        <Loading />
    ) : (
        <>
            <SetPageInfo pageName={pageName} iconPage={iconPage} breadCrumb={breadCrumb} />
            <ButtonBack />
            {statusDebit ? <Button type="primary">Confirmado</Button>
                : <Button type="primary" danger>
                    NO CONFIRMADA
                </Button>
            }

            <Row style={{ marginTop: '15px' }}>
                <Col span={24}>
                    <Form
                        form={form}
                        ref={formRef}
                        name="credit_note"
                        colon={false}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={data}
                    >
                        <Row gutter={16} style={{ marginTop: 0, paddingTop: 0 }}>
                            <Col md={{ span: 24 }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} lg={{ span: 8 }} span={16} xs={{ span: 24 }}>
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
                                                label="Razon social:"
                                                name="company"
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
                                            <Row gutter={16}>
                                                <Col md={{ span: 12 }} lg={{ span: 24 }} span={24}>
                                                    <Form.Item<FieldType>
                                                        label="SSN:"
                                                        name="ssn"
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
                            <Col md={{ span: 24 }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} lg={{ span: 16 }} span={16} xs={{ span: 24 }}>
                                <Card
                                    title="Datos de la nota de debito"
                                    bordered={false}
                                    type="inner"
                                >
                                    <Row gutter={16} style={{ marginBottom: 0 }}>
                                        <Col md={{ span: 12 }} lg={{ span: 6 }} xs={{ span: 12 }}>
                                            <Form.Item<FieldType>
                                                label="Aplica a libro:"
                                                name="applyBook"
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
                                                    options={optionBook}
                                                    showSearch
                                                    filterOption={(input, optionsProviders) =>
                                                        (optionsProviders?.name ?? '')
                                                            .toLowerCase()
                                                            .includes(input?.toLowerCase())
                                                    }
                                                    fieldNames={{
                                                        label: 'name',
                                                        value: 'id',
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 12 }} lg={{ span: 6 }} xs={{ span: 24 }}>
                                            <Form.Item<FieldType>
                                                label="Modulo:"
                                                name="module"
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
                                                    options={optionsModule}
                                                    showSearch
                                                    onChange={(value) => handlerSetModule(value)}
                                                    filterOption={(input, optionsProviders) =>
                                                        (optionsProviders?.name ?? '')
                                                            .toLowerCase()
                                                            .includes(input?.toLowerCase())
                                                    }
                                                    fieldNames={{
                                                        label: 'name',
                                                        value: 'id',
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 12 }} lg={{ span: 6 }} xs={{ span: 24 }}>
                                            <Form.Item<FieldType>
                                                label="Nro. Nota de debito:"
                                                name="numberCreditNote"
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
                                    </Row>
                                    <Row gutter={16}>
                                        <Col md={{ span: 12 }} lg={{ span: 6 }} xs={{ span: 24 }}>
                                            <Form.Item<FieldType>
                                                label="Nro Control:"
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
                                                label="Fecha de factura:"
                                                name="createAtDebit"
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
                                <Card>
                                    <Row style={{ display: 'flex', gap: '15px' }}>
                                        <Col>
                                            <Form.Item<FieldType>
                                                label="Tipo moneda:"
                                                name="typeMoney"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                                style={{ marginBottom: '8px' }} // Reducir espacio entre inputs
                                            >
                                                <Select
                                                    allowClear
                                                    style={{ width: '150px' }}
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
                                        <Col>
                                            <Form.Item<FieldType>
                                                label="Tasa de la nota de credito:"
                                                name="rage"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                                style={{ marginBottom: '8px' }} // Reducir espacio entre inputs
                                            >
                                                <Input
                                                    onChange={onchangeRage}
                                                    style={{ width: '150px' }}

                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col>
                                            <Form.Item<FieldType>
                                                label="Tipo de pago:"
                                                name="typePayment"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                                style={{ marginBottom: '8px' }} // Reducir espacio entre inputs
                                            >
                                                <Select
                                                    allowClear
                                                    style={{ width: '150px' }}
                                                    placeholder="Seleccione"
                                                    options={optionsTypePayment}
                                                    showSearch
                                                    onChange={(value) => handlerSetTypePayment(value)}
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
                                        {typePaymentSelected === 2 ? (
                                            <Col md={{ span: 12 }} lg={{ span: 6 }} xs={{ span: 24 }}>
                                                <Form.Item<FieldType>
                                                    label="Fecha de vencimiento:"
                                                    name="dueDate"
                                                    style={{ marginBottom: '8px' }} // Reducir espacio entre inputs
                                                >
                                                    <DatePicker
                                                        format={'DD/MM/YYYY'}
                                                        style={{ width: '100%' }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        ) : ' '
                                        }
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                        <Row gutter={32} style={{ paddingTop: 6 }}>
                            <Col md={{ span: 24 }} lg={{ span: 24 }} span={16} xs={{ span: 24 }}>
                                <Card
                                    type="inner"
                                    title="Motivos"
                                    bordered={false}
                                    extra={
                                        <Tooltip title="Agregar proveeedor">
                                            <ModalPurchase
                                                moduleName={moduleName}
                                                setIdentificationProvider={
                                                    setIdentificationProvider
                                                }
                                                handlerSetReloadProviders={handlerSetReloadProviders()}
                                                typeModal={3}
                                                params={params}
                                                dataMotive={dataMotive}
                                                setDataMotive={setDataMotive}
                                            />
                                        </Tooltip>
                                    }
                                >
                                    <Row
                                        gutter={32}
                                        style={{
                                            justifyContent: 'end',
                                        }}
                                    >
                                        <Col md={{ span: 12 }} lg={{ span: 4 }}></Col>
                                    </Row>
                                    <Row gutter={16} style={{ marginBottom: 0 }}>
                                    </Row>
                                    <Row style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} gutter={16}>
                                        <Form.Item<FieldType>
                                            name="motive"
                                            style={{ marginBottom: '8px' }} // Reducir espacio entre inputs
                                        >
                                            <TableCreditNote
                                                dataMotive={dataMotive}
                                                setDataMotive={setDataMotive}
                                                inputValues={inputValues}
                                                setInputValues={setInputValues}
                                                moneySelected={moneySelected}
                                            />
                                        </Form.Item>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Col md={{ span: 12 }} lg={{ span: 6 }} xs={{ span: 24 }}>
                                                <Form.Item
                                                    label="Observaciones:"
                                                    name="observation"
                                                    style={{ marginBottom: '8px' }}
                                                >
                                                    <TextArea />
                                                </Form.Item>
                                            </Col>
                                            <Col md={{ span: 12 }} lg={{ span: 12 }} xs={{ span: 24 }}>

                                                <Card title=" Totales" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }} bordered={false}>
                                                    <Row justify="space-between" style={{ marginBottom: '8px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                        <Col>
                                                            <Text style={{ width: '100px' }} strong>Subtotal:</Text>
                                                        </Col>
                                                        <Col>
                                                            <Form.Item
                                                                name="subtotal"
                                                                initialValue={totalSum}
                                                                style={{ marginBottom: '0', width: '100px' }}
                                                            >
                                                                <Text style={{ width: '100px' }} strong>{totalSum.toFixed(4)}</Text>
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>

                                                    <Row justify="space-between" style={{ marginBottom: '8px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                        <Col style={{ display: 'flex', flexDirection: 'row' }}>
                                                            <Text style={{ width: '100px' }} strong>Descuento:</Text>

                                                        </Col>
                                                        <Col>
                                                            <Checkbox onChange={onCheckboxChangeDescuent}>
                                                            </Checkbox>
                                                        </Col>
                                                        <Col>

                                                            <Space.Compact>
                                                                <Select style={{ width: '90px' }}
                                                                    defaultValue="%"
                                                                    options={options}
                                                                    disabled={isDisabledDescuent}
                                                                    onChange={(value: any) => handlerSetDiscuont(value)}
                                                                />
                                                                <Form.Item
                                                                    name="discount"
                                                                    style={{ marginBottom: '0' }}
                                                                >
                                                                    <Input suffix={discountSelect == 1 ? '%' : ''} style={{ width: '110px' }} onChange={onchangeDiscount} disabled={isDisabledDescuent} />
                                                                </Form.Item>
                                                            </Space.Compact>

                                                        </Col>
                                                        <Col>
                                                            <Form.Item
                                                                name="discount"
                                                                style={{ marginBottom: '0', width: '100px' }}
                                                            >
                                                                <Text style={{ width: '100px' }} strong>{valueDiscount.toFixed(4)}</Text>
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>

                                                    <Row justify="space-between" style={{ marginBottom: '8px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                        <Col style={{ display: 'flex', flexDirection: 'row' }}>
                                                            <Text style={{ width: '100px' }} strong>IVA (%):</Text>

                                                        </Col>
                                                        <Col>
                                                            <Checkbox onChange={onCheckboxChangeVat}>
                                                            </Checkbox>
                                                        </Col>
                                                        <Col>

                                                            <Form.Item
                                                                name="vat"
                                                                style={{ marginBottom: '0' }}
                                                            >

                                                                <Input suffix="%" onChange={onchangeVat} disabled={isDisabledVat} />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col>
                                                            <Form.Item
                                                                name="vat"
                                                                style={{ marginBottom: '0', width: '100px' }}
                                                            >
                                                                <Text style={{ width: '100px' }} strong>{valueVat.toFixed(4)}</Text>
                                                            </Form.Item>
                                                        </Col>

                                                    </Row>
                                                    <Row
                                                        justify="space-between"
                                                        style={{
                                                            display: moneySelected?.name == 'Bolívar' ? 'none' : 'flex',
                                                            marginBottom: '8px',
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                        }}
                                                    >

                                                        <Col style={{ display: 'flex', flexDirection: 'row' }}>
                                                            <Text style={{ width: '100px' }} strong>IGTF (%):</Text>

                                                        </Col>
                                                        <Col>
                                                            <Checkbox onChange={onCheckboxChangeIgtf}>
                                                            </Checkbox>
                                                        </Col>
                                                        <Col>

                                                            <Form.Item
                                                                name="igtf"
                                                                style={{ marginBottom: '0' }}
                                                            >

                                                                <Input suffix="%" onChange={onchangeIgtf} disabled={isDisabledIgtf} />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col>
                                                            <Form.Item
                                                                name="igtf"
                                                                style={{ marginBottom: '0', width: '100px' }}
                                                            >
                                                                <Text style={{ width: '100px' }} strong>{valueIgtf.toFixed(4)}</Text>
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                    <hr />
                                                    <Row justify="space-between" style={{ backgroundColor: '#BFEFFF' }}>
                                                        <Col>
                                                            <Text style={{ width: '100px' }} strong>Total en {moneySelected?.name == 'Bolívar' ? moneySelected?.sym : 'BSF'}:</Text>
                                                        </Col>
                                                        <Col>
                                                            <Form.Item
                                                                name="total"
                                                                style={{ marginBottom: '0', width: '100px' }}
                                                            >
                                                                <Text style={{ width: '100px' }} strong>{moneySelected?.name == 'Bolívar' ? total.toFixed(4) : valueNewTasa.toFixed(4)}</Text>
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                    <Row justify="space-between" style={{ backgroundColor: '#0f57' }}>
                                                        <Col>
                                                            <Text style={{ width: '100px' }} strong>Total en {moneySelected?.name == 'Bolívar' ? 'USA' : moneySelected?.sym}:</Text>
                                                        </Col>
                                                        <Col>
                                                            <Form.Item
                                                                name="total"
                                                                style={{ marginBottom: '0', width: '100px' }}
                                                            >
                                                                <Text style={{ width: '100px' }} strong>{moneySelected?.name == 'Bolívar' ? valueNewTasa.toFixed(4) : total.toFixed(4)}</Text>
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                    <Row justify="space-between" style={{ marginBottom: '8px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

                                                        <Col>
                                                            <Text style={{ width: '100px' }} strong>Exento:</Text>
                                                        </Col>
                                                        <Col>
                                                            <Form.Item
                                                                name="exempt"
                                                                style={{ marginBottom: '0', width: '100px' }}
                                                            >
                                                                <Text style={{ width: '100px' }} strong>{exemt.toFixed(4)}</Text>
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                    <Row justify="space-between" style={{ marginBottom: '8px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                        <Col>
                                                            <Text style={{ width: '100px' }} strong>Saldo:</Text>
                                                        </Col>
                                                        <Col>
                                                            <Form.Item
                                                                name="balance"
                                                                style={{ marginBottom: '0', width: '100px' }}
                                                            >
                                                                <Text style={{ width: '100px' }} strong>{totalSaldo.toFixed(4)}</Text>
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                </Card>

                                            </Col>
                                        </div>
                                    </Row>
                                    {statusDebit ? ' ' : <Col span={24} md={{ span: 6, offset: 9 }}>
                                        {id ? (
                                            <Button
                                                type="primary"
                                                onClick={() => {
                                                    Modal.confirm({
                                                        title: 'Confirmar Nota de crédito',
                                                        content: '¿Está seguro de confirmar este crédito?',
                                                        okText: 'Confirmar',
                                                        cancelText: 'Cancelar',
                                                        onOk() {
                                                            console.log('Nota de crédito confirmada');
                                                            cofirmNoteCredit();
                                                            // Aquí puedes añadir la lógica para confirmar la nota de crédito
                                                        },
                                                        onCancel() {
                                                            console.log('Cancelado');
                                                        },
                                                    });
                                                }}
                                                block
                                            >
                                                <b>Confirmar Nota de crédito</b>
                                            </Button>
                                        ) : (
                                            ''
                                        )}
                                    </Col>}

                                </Card>
                            </Col>

                        </Row>
                        {statusDebit ?
                            ' ' : <div style={{ padding: '10px' }}>
                                <ButtonSubmit loader={loader}>
                                    {!id ? 'Guardar' : 'Editar'} Nota de credito
                                </ButtonSubmit>
                            </div>}
                    </Form >
                </Col >
            </Row >
        </>
    );
};

export default ModuleForm;