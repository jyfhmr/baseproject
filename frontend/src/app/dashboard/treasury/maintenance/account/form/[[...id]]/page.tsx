'use client';
import ButtonBack from '@/components/dashboard/ButtonBack';
import ButtonSubmit from '@/components/dashboard/ButtonSubmit';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import { createOrUpdate, getAllData, getOne } from '@/services';
import { AppstoreOutlined } from '@ant-design/icons';
import { Col, Form, FormProps, Input, Row, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Loading from '@/components/Loading';
import Swal from "sweetalert2"
type FieldType = {
    nameAccount: string;
    typeAccount: string;
    description: string;
    bank: number;
    commissions: Array<{ paymentMethodId: number; type: string; value: number }>;
};

const moduleName = 'treasury/maintenance/account';

const ModuleForm = ({ params }: any) => {
    const [loader, setLoader] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState({});
    const [currencys, setCurrencys] = useState<{ id: number; name: string }[]>([]);
    const [payment_methods, setPaymentMethods] = useState<any>([]);
    const [selectedMethods, setSelectedMethods] = useState<number[]>([]);
    const [form] = Form.useForm();
    const id = params.id ? params.id[0] : null;

    const pageName = `${id ? 'Editar' : 'Nuevo'} cuenta`;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Maestros' }, { title: 'Cuentas' }, { title: pageName }];

    const getData = async () => {
        if (id) {
            const get = await getOne(moduleName, id);
            setData(get);
            console.log('La data para editar una cuenta', get);

            // Establecer los valores del formulario
            form.setFieldsValue({
                nameAccount: get.nameAccount,
                description: get.description,
                typeAccount: get.typeAccount,
                bank: get.bank.id,
            });

            // Extraer los IDs de los métodos de pago y las comisiones
            const commissionsData = get.commissions.map((commission: any) => ({
                paymentMethodId: commission.paymentMethod.id,
                type: commission.type || 'percent',
                value: parseFloat(commission.amount),
            }));

            const paymentMethodIds = commissionsData.map((commission: any) => commission.paymentMethodId);

            // Establecer los métodos de pago seleccionados
            setSelectedMethods(paymentMethodIds);

            // Establecer los valores de las comisiones en el formulario
            form.setFieldsValue({
                commissions: commissionsData,
            });

            // Llamar a handlePaymentMethodChange para generar los campos dinámicos
            handlePaymentMethodChange(paymentMethodIds);
        }
        setSpinner(false);
    };

    const getCurrencys = async () => {
        const response = await getAllData('treasury/maintenance/banks', '1');
        setCurrencys(response.data);
    };

    const getPaymentMethods = async () => {
        const response = await getAllData('treasury/maintenance/payment_method', '1');
        setPaymentMethods(response.data);
        console.log('Métodos de pago', response.data);
    };

    useEffect(() => {
        getCurrencys();
        getData();
        getPaymentMethods();
    }, []);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoader(true);
        values.typeAccount = String(values.typeAccount);
        values.bank = Number(values.bank);

      
        if(selectedMethods.length <= 0){
            Swal.fire({
                icon: 'warning',
                title: 'Necesita seleccionar al menos un método de pago y comisión',
                text: 'Después podrá continuar con las comisiones',
              });
              setLoader(false)
              return
        }

 
        // Asegurarse de que commissions incluye paymentMethodId
        values.commissions = values.commissions.map((commission) => ({
            paymentMethodId: commission.paymentMethodId,
            type: commission.type,
            value: commission.value,
        }));

        console.log('Los valores enviados: ', values);

        const res = await createOrUpdate(moduleName, values, id);
        if (res) {
            setLoader(false);
            return toast.warning(res.message);
        }

        toast.success(`Cuenta ${id ? 'editada' : 'creada'} con éxito`);
    };

    const options = [
        { value: 'percent', label: '%' },
        { value: 'absolute', label: 'ENTERO' },
    ];

    const handlePaymentMethodChange = (values: number[]) => {
        setSelectedMethods(values);
        const existingCommissions = form.getFieldValue('commissions') || [];
        const updatedCommissions = values.map((id) => {
            // Buscar si ya existe una comisión para este método de pago
            const existingCommission = existingCommissions.find(
                (commission: any) => commission.paymentMethodId === id
            );
            if (existingCommission) {
                return existingCommission;
            } else {
                return {
                    paymentMethodId: id,
                    type: 'percent',
                    value: 0,
                };
            }
        });
        form.setFieldsValue({ commissions: updatedCommissions });
    };

    return spinner ? (
        <Loading />
    ) : (
        <>
            <SetPageInfo pageName={pageName} iconPage={iconPage} breadCrumb={breadCrumb} />
            <ButtonBack />

            <Row>
                <Col span={24}>
                    <Form form={form} name="wrap" colon={false} layout="vertical" onFinish={onFinish}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                            <div style={{ width: '20vw' }}>
                                <Form.Item<FieldType>
                                    label="Nombre de cuenta:"
                                    name="nameAccount"
                                    rules={[{ required: true, message: 'Por favor ingrese el nombre de la cuenta' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item<FieldType>
                                    label="Descripción"
                                    name="description"
                                    rules={[{ required: true, message: 'Por favor ingrese la descripción' }]}
                                >
                                    <Input.TextArea rows={4} />
                                </Form.Item>
                            </div>

                            <div style={{ width: '20vw' }}>
                                <Form.Item<FieldType>
                                    label="Tipo de cuenta:"
                                    name="typeAccount"
                                    rules={[{ required: true, message: 'Por favor seleccione el tipo de cuenta' }]}
                                >
                                    <Select
                                        showSearch
                                        style={{ width: 200 }}
                                        placeholder="Seleccionar"
                                        optionFilterProp="label"
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '')
                                                .toLowerCase()
                                                .localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                        options={[
                                            { value: 'Ahorro', label: 'Ahorro' },
                                            { value: 'Corriente', label: 'Corriente' },
                                        ]}
                                    />
                                </Form.Item>
                                <Form.Item<FieldType>
                                    label="Banco:"
                                    name="bank"
                                    rules={[{ required: true, message: 'Por favor seleccione el banco' }]}
                                >
                                    <Select
                                        showSearch
                                        style={{ width: 200 }}
                                        placeholder="Seleccionar"
                                        optionFilterProp="label"
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '')
                                                .toLowerCase()
                                                .localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                        options={currencys.map((currency) => ({
                                            value: currency.id,
                                            label: currency.name,
                                        }))}
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        <Form.Item
                            label="Selecciona un método de pago"
                            rules={[{ required: true, message: 'Por favor seleccione al menos un método de pago' }]}
                            required
                        >
                            <Select
                                mode="multiple"
                                size="middle"
                                placeholder="Selecciona un método de pago"
                                value={selectedMethods}
                                onChange={handlePaymentMethodChange}
                                style={{ width: '100%' }}
                                options={payment_methods.map((paymentMethod: any) => ({
                                    value: paymentMethod.id,
                                    label: paymentMethod.method,
                                }))}
                               
                            />
                        </Form.Item>

                        {/* Obtener las comisiones del formulario */}
                        {form.getFieldValue('commissions')?.map((commission: any, index: number) => (
                            <div key={commission.paymentMethodId} style={{ marginBottom: '10px', width: '40vw' }}>
                                <h4>
                                    {
                                        payment_methods.find(
                                            (method: any) => method.id === commission.paymentMethodId
                                        )?.method
                                    }
                                </h4>
                                <Space.Compact>
                                    <Form.Item
                                        name={['commissions', index, 'type']}
                                        initialValue={commission.type}
                                        rules={[{ required: true, message: 'Por favor seleccione el tipo' }]}
                                    >
                                        <Select options={options} />
                                    </Form.Item>
                                    <Form.Item
                                        name={['commissions', index, 'value']}
                                        initialValue={commission.value}
                                        rules={[{ required: true, message: 'Por favor ingrese el valor' }]}
                                    >
                                        <Input
                                            type="number"
                                            min={0.001}
                                            max={100.0}
                                            step={0.001}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name={['commissions', index, 'paymentMethodId']}
                                        initialValue={commission.paymentMethodId}
                                        hidden
                                    >
                                        <Input type="hidden" />
                                    </Form.Item>
                                </Space.Compact>
                            </div>
                        ))}

                        <ButtonSubmit loader={loader}>{!id ? 'Guardar' : 'Editar'} Cuenta</ButtonSubmit>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default ModuleForm;

