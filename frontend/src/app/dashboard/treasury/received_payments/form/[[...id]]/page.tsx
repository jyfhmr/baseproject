'use client';
import React, { useEffect, useState } from 'react';
import { createOrUpdate, getOne, getAllData, getActiveList } from '@/services';
import {
    Form,
    FormProps,
    Row,
    Col,
    Select,
    Input,
    InputNumber,
    Card,
    DatePicker,
    Switch,
    Divider,
} from 'antd';
import { toast } from 'react-toastify';
import ButtonBack from '@/components/dashboard/ButtonBack';
import ButtonSubmit from '@/components/dashboard/ButtonSubmit';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import Loading from '@/components/Loading';
import { AppstoreOutlined } from '@ant-design/icons';
import CreditCardInfo from '../../components/CreditCard';
import Title from 'antd/es/typography/Title';
import '../../payments.css';
import moment from 'moment';
import Filepond from '@/utils/filepond';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import AccountDrawer from '@/app/dashboard/accountManagment/AccountMagment';
dayjs.extend(customParseFormat);
type FieldType = {
    // Información de contraparte
    type_of_document: number;
    type_of_identification: number;
    document_of_counterparty: string;
    name_of_counterparty: string;
    // Proveedor si lo hay
    provider_who_gets_the_payment?: number;
    // Información de pago
    currencyUsed: number;
    payment_method: number;
    amountPaid: number;
    paymentDate: Date;
    // Información específica de cada pago
    transfer_account_number?: number;
    transfer_account_number_of_receiver?: string;
    bankEmissor?: number;
    bankReceptor?: number;
    pagomovilDocument?: string;
    pagomovilPhoneNumber?: string;
    emailReceptor?: string;
    emailEmisor?: string;
    addressee_name?: string;
    paymentReference?: string;

    //status de pago
    paymentStatus: number
};

const moduleName = 'treasury/payments';

const ModuleForm = ({ params }: any) => {
    const [loader, setLoader] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState<Partial<FieldType>>({});
    const [form] = Form.useForm(); // Creamos una instancia del formulario

    // currencys
    const [currencys, setCurrencys] = useState<{ id: number; money: string }[]>([]);
    const [selectedCurrencyId, setSelectedCurrencyId] = useState<number | null>(null);

    // identificacion
    const [optionsIdentificationType, setOptionsIdentificationType] = useState([]);
    const [optionsDocumentType, setOptionsDocumentType] = useState([]);

    // hook para proveedores
    const [providerInfo, setProviderInfo] = useState<any[]>([]);

    //hook para metodos de pago
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const [paymentSelected, setPaymentSelected] = useState<number>();

    //obtener bancos
    const [banks, setBanks] = useState<any[]>([]);
    const [ourBanksWithAccounts, setOurBanksWithAccounts] = useState<any[]>([]);
    const [ourAccounts, setOurAccounts] = useState<any[]>([]);

    //para cuentas
    const [accountSelected, setAccountSelected] = useState<any>();

    //para manejar imagenes
    const [files, setFiles] = useState<any[]>([]); // State for images

    //statuses
    const [statuses, setStatuses] = useState<any>();

    const id = params.id ? params.id[0] : null;



    const handleChangeCurrencyId = (value: number) => {
        setSelectedCurrencyId(value);
    };

    const handleChangeProvider = async (value: number) => {
        const selectedProvider = providerInfo.find((provider) => provider.id === value);
        console.log('El proveedor seleccionado:', selectedProvider);

        if (selectedProvider) {
            // Usamos el método setFieldsValue para establecer el valor del campo en el formulario

            let identificationTypeASD = Number(selectedProvider.documentType.identificationType.id);

            form.setFieldsValue({
                document_of_counterparty: selectedProvider.identification,
                name_of_counterparty: selectedProvider.tradeName,
                type_of_identification: selectedProvider.documentType.identificationType.id,
            });
            await handleIdentificationTypeChange(identificationTypeASD);
            form.setFieldsValue({
                type_of_document: selectedProvider.documentType.id,
            });
        }
    };

    //manejar cambios de metodo de pago
    const handleChangePaymentMethod = async (value: number) => {
        console.log('el payment method sleeccionado', value);
        setPaymentSelected(value);
    };

    const handleSelectOfOurBank = async (value: number, xd?: any) => {
        // Crear una promesa para asegurarte de que setOurAccounts se haya completado
        const updateAccounts = new Promise<void>((resolve, reject) => {
            if (ourBanksWithAccounts.length > 0) {
                const selectedBank = ourBanksWithAccounts.find((bank) => bank.id === value);

                if (selectedBank && selectedBank.accounts) {
                    setOurAccounts(selectedBank.accounts);
                    resolve(); // Resuelve la promesa cuando las cuentas se actualizan
                } else {
                    reject('No se encontraron cuentas para el banco seleccionado');
                }
            } else {
                reject('No hay bancos disponibles');
            }
        });

        // Esperar a que la promesa se complete
        try {
            await updateAccounts;
            console.log('Cuentas actualizadas con éxito');
        } catch (error) {
            console.error('Error actualizando las cuentas:', error);
        }

        // Continuar con el resto del código que depende de las cuentas actualizadas
        console.log('Continuando con el código después de la actualización de las cuentas');
    };

    //get banks with accounts

    // Obtener tipos de identificación y documentos

    const handleIdentificationTypeChange = async (value: number) => {
        // Resetea el valor del campo de documento para evitar problemas
        form.resetFields(['type_of_document']);
        // Obtén los tipos de documentos relacionados con el tipo de identificación seleccionado
        const getDocumentTypes = await getActiveList(
            'masters/document_types',
            `?identificationTypeId=${value}`,
        );
        setOptionsDocumentType(getDocumentTypes);
    };



    const handleSelectedAccount = (account: any) => {
        console.log('la cuenta', account);
        setAccountSelected(account);
    };

    // Obtener datos si existe un ID
    const getData = async () => {
        // Hacemos todas las llamadas a la API en paralelo
        const [
            getCurrencys,
            getIdentificationAndDocumentTypes,
            getProviders,
            getPaymentMethods,
            getBanks,
            getBanksWithAccount,
            getStatuses
        ] = await Promise.all([
            getAllData('treasury/maintenance/money', '1'),
            getActiveList('masters/identification_types'),
            getAllData('masters/providers', '1'),
            getAllData('treasury/maintenance/payment_method', '1'),
            getAllData('treasury/maintenance/banks', '1'),
            getAllData('treasury/maintenance/banks/getBanksWithAccounts'),
            getAllData('config/status', "1"),
        ]);

        // Actualizamos el estado
        setCurrencys(getCurrencys.data);
        setOptionsIdentificationType(getIdentificationAndDocumentTypes);
        setProviderInfo(getProviders.data);
        setPaymentMethods(getPaymentMethods.data);
        setBanks(getBanks.data);
        setOurBanksWithAccounts(getBanksWithAccount);
        setStatuses(getStatuses.data)

        if (id) {
            const [get] = await Promise.all([getOne(moduleName, id)]);

            // Actualizamos los campos del formulario según la respuesta
            if (get) {
                get.currencyUsed = get.currencyUsed?.id || null;
                get.payment_method = get.payment_method?.id || null;
                get.type_of_identification = get.type_of_identification?.id || null;
                get.type_of_document = get.type_of_document?.id || null;
                get.provider_who_gets_the_payment = get.provider_who_gets_the_payment?.id || null;
                get.bankEmissor = get.bankEmissor?.id || null;
                get.bankReceptor = get.bankReceptor?.id || null;
                get.transfer_account_number = get.transfer_account_number?.id || null;
                get.paymentStatus = get.paymentStatus?.id || null 
                setPaymentSelected(get.payment_method);



                const accounts = getBanksWithAccount.map((el: any) => {
                    if (el.id == get.bankEmissor) {
                        return el.accounts;
                    }
                }).filter(Boolean);;

                if (get.paymentDate) {
                    get.paymentDate = dayjs(get.paymentDate, 'YYYY-MM-DDTHH:mm:ss.sssZ');
                }

                console.log('si llega 2')

                // Esperamos a que los bancos estén listos antes de proceder
                await handleIdentificationTypeChange(get.type_of_identification);

                if (accounts.length > 0) {
                    console.log('accounts:', accounts)
                    setOurAccounts(accounts[0]);
                }
                //Espera a que los bancos se seleccionen correctamente
                form.setFieldsValue(get); // Setear los valores en el formulario después de la transformación

                form.setFieldsValue({
                    type_of_document: get.type_of_document,
                    transfer_account_number: get.transfer_account_number,
                });

                console.log('si llega')

                if (get.voucher_image_url) {
                    setFiles([
                        `${process.env.NEXT_PUBLIC_URL_IMAGE}uploads/payments/${get.voucher_image_url}`,
                    ]);
                }

                setSpinner(false);
            }
        } else {
            setSpinner(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const pageName = `${id ? 'Editar' : 'Nuevo'} Pago`;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Tesorería' }, { title: 'Pagos' }, { title: pageName }];


    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        try {
            setLoader(true);
            console.log('LOS VALUES', values);


            // Convertir la fecha de paymentDate a Date si es un objeto dayjs
            if (values.paymentDate && dayjs.isDayjs(values.paymentDate)) {
                values.paymentDate = values.paymentDate.toDate();
            }

            // Crear formData después de la conversión de números
            const formData = new FormData();
            for (let key in values) {
                formData.append(key, values[key as keyof FieldType] as string | Blob);
            }

            if (files[0]) {
                formData.append('file', files[0].file, files[0].filename);
            }

            const res = await createOrUpdate(moduleName, formData, id);
            console.log(res);

            toast.success(`Pago ${id ? 'editado' : 'creado'} con éxito`);
        } catch (error) {
            setLoader(false);
            toast.error('Ha ocurrido un error, inténtalo más tarde');
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
                        form={form} // Vinculamos el formulario con la instancia creada arriba
                        name="wrap"
                        colon={false}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={data}
                    >
                        <Divider />

                        <Row gutter={32}>
                            <Col className="titlesForPayments" md={24}>
                                Información de Receptor
                            </Col>

                            <Col span={24} md={8}>
                                <Form.Item<FieldType>
                                    label="Selecciona al proveedor, si es hacia un proveedor"
                                    name="provider_who_gets_the_payment"
                                    rules={[{ required: false }]}
                                >
                                    <Select
                                        style={{ width: '100%' }}
                                        onChange={handleChangeProvider}
                                        options={providerInfo.map((provider) => ({
                                            value: provider.id,
                                            label: provider.tradeName,
                                        }))}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={24} md={8}>
                                <Form.Item<FieldType>
                                    label="Tipo de Identificación"
                                    name="type_of_identification"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Seleccione un tipo de identificación',
                                        },
                                    ]}
                                >
                                    <Select
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Seleccione"
                                        options={optionsIdentificationType}
                                        fieldNames={{ label: 'name', value: 'id' }}
                                        onChange={handleIdentificationTypeChange}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={24} md={8}>
                                <Form.Item<FieldType>
                                    label="Tipo de Documento"
                                    name="type_of_document"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Seleccione un tipo de documento',
                                        },
                                    ]}
                                >
                                    <Select
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Seleccione"
                                        options={optionsDocumentType}
                                        fieldNames={{ label: 'code', value: 'id' }}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={24} md={12}>
                                <Form.Item<FieldType>
                                    label="Número de Identificación"
                                    name="document_of_counterparty"
                                    rules={[{ required: true }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col span={24} md={12}>
                                <Form.Item<FieldType>
                                    label="Nombre Legal de Contraparte"
                                    name="name_of_counterparty"
                                    rules={[{ required: true }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Divider />

                            <Col className="titlesForPayments" md={24}>
                                Información de Pago
                            </Col>

                            <Col span={24} md={10}>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item<FieldType>
                                            label="Moneda usada en el pago"
                                            name="currencyUsed"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Este campo es obligatorio',
                                                },
                                            ]}
                                        >
                                            <Select
                                                style={{ width: '100%' }}
                                                onChange={handleChangeCurrencyId}
                                                options={currencys.map((currency) => ({
                                                    value: currency.id,
                                                    label: currency.money,
                                                }))}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item<FieldType>
                                            label="Fecha de Pago"
                                            name="paymentDate"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "La fecha de pago es obligatoria",
                                                },
                                            ]}
                                        >
                                            <DatePicker style={{ width: '100%' }} />
                                        </Form.Item>
                                    </Col>

                                    {
                                        !id ? <Col span={12}>
                                            <Form.Item<FieldType>
                                                label="Método de Pago"
                                                name="payment_method"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Seleccione un método de pago',
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    allowClear
                                                    style={{ width: '100%' }}
                                                    placeholder="Seleccione"
                                                    options={paymentMethods}
                                                    onChange={handleChangePaymentMethod}
                                                    fieldNames={{ label: 'method', value: 'id' }}
                                                />
                                            </Form.Item>
                                        </Col> : <Col span={12}>
                                            <Form.Item<FieldType>
                                                label="Método de Pago"
                                                name="payment_method"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Seleccione un método de pago',
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    allowClear
                                                    style={{ width: '100%' }}
                                                    placeholder="Seleccione"
                                                    options={paymentMethods}
                                                    onChange={handleChangePaymentMethod}
                                                    fieldNames={{ label: 'method', value: 'id' }}
                                                    disabled
                                                />
                                            </Form.Item>
                                        </Col>
                                    }

                                    <Col span={12}>
                                        <Form.Item<FieldType>
                                            label="Monto Pagado"
                                            name="amountPaid"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Debe escribir el monto del pago',
                                                },
                                            ]}
                                        >
                                            <InputNumber
                                                placeholder="100.55"
                                                style={{ width: '100%' }}
                                                step="0.01"
                                                max={999000000}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={24}>
                                        <Form.Item<FieldType>
                                            label="Estatus de Pago"
                                            name="paymentStatus"
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                        >
                                            <Select
                                                allowClear
                                                style={{ width: '100%' }}
                                                placeholder="Seleccione"
                                                options={statuses}
                                                fieldNames={{ label: 'status', value: 'id' }}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={24}>
                                        <Filepond files={files} setFiles={setFiles} />

                                    </Col>
                                </Row>
                            </Col>

                            {/* Campos condicionales basados en paymentSelected */}
                            {paymentSelected === 1 && (
                                <Col span={24} md={14}>
                                    <Card
                                        title="Tarjeta de Crédito"
                                        bordered={true}
                                        className="cardStyles"
                                    >
                                        <Row gutter={16}>
                                            <Col span={24}>
                                                <Form.Item<FieldType>
                                                    label="Referencia de pago por tarjeta de crédito"
                                                    name="paymentReference"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                'Debe escribir una referencia',
                                                        },
                                                    ]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            )}

                            {paymentSelected === 2 && (
                                <Col span={24} md={14}>
                                    <Card
                                        title="Tarjeta de Débito"
                                        bordered={true}
                                        className="cardStyles"
                                    >
                                        <Row gutter={16}>
                                            <Col span={24}>
                                                <Form.Item<FieldType>
                                                    label="Referencia de pago por tarjeta de débito"
                                                    name="paymentReference"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                'Debe escribir una referencia',
                                                        },
                                                    ]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            )}

                            {paymentSelected === 3 && (
                                <Col span={24} md={14}>
                                    <Card
                                        title="Transferencia Bancaria"
                                        bordered={true}
                                        className="cardStyles"
                                    >
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item<FieldType>
                                                    label="Número de cuenta Receptor"
                                                    name="transfer_account_number_of_receiver"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                'Debe escribir el número de cuenta del receptor',
                                                        },
                                                    ]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>

                                            <Col span={12}>
                                                <Form.Item<FieldType>
                                                    label="Banco que recibió la transferencia"
                                                    name="bankReceptor"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                'Debe seleccionar el banco que recibió la transferencia',
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        allowClear
                                                        style={{ width: '100%' }}
                                                        placeholder="Seleccione"
                                                        options={banks}
                                                        fieldNames={{ label: 'name', value: 'id' }}
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col span={12}>
                                                <Form.Item<FieldType>
                                                    label="Banco utilizado para realizar la transferencia"
                                                    name="bankEmissor"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                'Debe seleccionar el banco que usó para la transferencia',
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        allowClear
                                                        style={{ width: '100%' }}
                                                        placeholder="Seleccione"
                                                        options={ourBanksWithAccounts}
                                                        onChange={handleSelectOfOurBank}
                                                        fieldNames={{ label: 'name', value: 'id' }}
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col span={12}>
                                                <Form.Item<FieldType>
                                                    label="Cuenta utilizada para realizar la transferencia"
                                                    name="transfer_account_number"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                'Debe seleccionar la cuenta que usó para la transferencia',
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        allowClear
                                                        style={{ width: '100%' }}
                                                        placeholder="Cuenta Utilizada para realizar la transferencia"
                                                        options={ourAccounts}
                                                        fieldNames={{
                                                            label: 'nameAccount',
                                                            value: 'id',
                                                        }}
                                                        onChange={handleSelectedAccount}
                                                        value={accountSelected}
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col span={24}>
                                                <Form.Item<FieldType>
                                                    label="Referencia de la transferencia bancaria"
                                                    name="paymentReference"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                'Debe escribir la referencia de la transferencia bancaria',
                                                        },
                                                    ]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            )}

                            {paymentSelected === 4 && (
                                <Col span={24} md={14}>
                                    <Card title="Pago Movil" bordered={true} className="cardStyles">
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item<FieldType>
                                                    label="Documento del receptor"
                                                    name="pagomovilDocument"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                'Debe escribir la cédula del receptor del pago movil',
                                                        },
                                                    ]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>

                                            <Col span={12}>
                                                <Form.Item<FieldType>
                                                    label="Teléfono del receptor"
                                                    name="pagomovilPhoneNumber"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                'Debe escribir el teléfono del receptor usado para el pago movil',
                                                        },
                                                    ]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>

                                            <Col span={24}>
                                                <Form.Item<FieldType>
                                                    label="Número de referencia del Pago Movil"
                                                    name="paymentReference"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                'Debe escribir la referencia del pago movil',
                                                        },
                                                    ]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>

                                            <Col span={12}>
                                                <Form.Item<FieldType>
                                                    label="Banco usado para hacer el Pago Movil"
                                                    name="bankEmissor"
                                                    rules={[{ required: true }]}
                                                >
                                                    <Select
                                                        allowClear
                                                        style={{ width: '100%' }}
                                                        placeholder="Seleccione"
                                                        options={ourBanksWithAccounts}
                                                        fieldNames={{ label: 'name', value: 'id' }}

                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col span={12}>
                                                <Form.Item<FieldType>
                                                    label="Banco usado para recibir el Pago Movil"
                                                    name="bankReceptor"
                                                    rules={[{ required: true }]}
                                                >
                                                    <Select
                                                        allowClear
                                                        style={{ width: '100%' }}
                                                        placeholder="Seleccione"
                                                        options={banks}
                                                        fieldNames={{ label: 'name', value: 'id' }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            )}

                            {paymentSelected === 5 && (
                                <Col span={24} md={14}>
                                    <Card title="PayPal" bordered={true} className="cardStyles">
                                        <Row gutter={16}>
                                            <Col span={8}>
                                                <Form.Item<FieldType>
                                                    label="Correo Receptor"
                                                    name="emailReceptor"
                                                    rules={[{ required: true }]}
                                                >
                                                    <Input type="email" />
                                                </Form.Item>
                                            </Col>

                                            <Col span={8}>
                                                <Form.Item<FieldType>
                                                    label="Correo Emisor"
                                                    name="emailEmisor"
                                                    rules={[{ required: true }]}
                                                >
                                                    <Input type="email" />
                                                </Form.Item>
                                            </Col>

                                            <Col span={8}>
                                                <Form.Item<FieldType>
                                                    label="Referencia de Pago"
                                                    name="paymentReference"
                                                    rules={[{ required: true }]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            )}

                            {paymentSelected === 8 && (
                                <Col span={24} md={14}>
                                    <Card title="Zelle" bordered={true} className="cardStyles">
                                        <Row gutter={16}>
                                            <Col span={8}>
                                                <Form.Item<FieldType>
                                                    label="Nombre del receptor"
                                                    name="addressee_name"
                                                    rules={[{ required: true }]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>

                                            <Col span={8}>
                                                <Form.Item<FieldType>
                                                    label="Correo Receptor"
                                                    name="emailReceptor"
                                                    rules={[{ required: true }]}
                                                >
                                                    <Input type="email" />
                                                </Form.Item>
                                            </Col>

                                            <Col span={8}>
                                                <Form.Item<FieldType>
                                                    label="Correo Emisor"
                                                    name="emailEmisor"
                                                    rules={[{ required: true }]}
                                                >
                                                    <Input type="email" />
                                                </Form.Item>
                                            </Col>

                                            <Col span={24}>
                                                <Form.Item<FieldType>
                                                    label="Referencia de Pago"
                                                    name="paymentReference"
                                                    rules={[{ required: true }]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            )}

                            {paymentSelected === 9 && (
                                <Col span={24} md={14}>
                                    <Card
                                        title="Depósito Bancario"
                                        bordered={true}
                                        className="cardStyles"
                                    >
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item<FieldType>
                                                    label="Número de cuenta Receptor"
                                                    name="transfer_account_number_of_receiver"
                                                    rules={[{ required: false }]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>

                                            <Col span={12}>
                                                <Form.Item<FieldType>
                                                    label="Banco que recibió el depósito"
                                                    name="bankReceptor"
                                                    rules={[{ required: false }]}
                                                >
                                                    <Select
                                                        allowClear
                                                        style={{ width: '100%' }}
                                                        placeholder="Seleccione"
                                                        options={banks}
                                                        fieldNames={{ label: 'name', value: 'id' }}
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col span={12}>
                                                <Form.Item<FieldType>
                                                    label="Banco utilizado para realizar el depósito"
                                                    name="bankEmissor"
                                                    rules={[{ required: false }]}
                                                >
                                                    <Select
                                                        allowClear
                                                        style={{ width: '100%' }}
                                                        placeholder="Seleccione"
                                                        options={ourBanksWithAccounts}
                                                        onChange={handleSelectOfOurBank}
                                                        fieldNames={{ label: 'name', value: 'id' }}
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col span={12}>
                                                <Form.Item<FieldType>
                                                    label="Cuenta utilizada para realizar el depósito"
                                                    name="transfer_account_number"
                                                    rules={[{ required: false }]}
                                                >
                                                    <Select
                                                        allowClear
                                                        style={{ width: '100%' }}
                                                        placeholder="Cuenta Utilizada para realizar el depósito"
                                                        options={ourAccounts}
                                                        fieldNames={{
                                                            label: 'nameAccount',
                                                            value: 'id',
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col span={24}>
                                                <Form.Item<FieldType>
                                                    label="Referencia del depósito"
                                                    name="paymentReference"
                                                    rules={[{ required: false }]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            )}
                        </Row>

                        <Divider />

                        <ButtonSubmit loader={loader}>
                            {!id ? 'Registrar' : 'Editar'} Pago
                        </ButtonSubmit>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default ModuleForm;
