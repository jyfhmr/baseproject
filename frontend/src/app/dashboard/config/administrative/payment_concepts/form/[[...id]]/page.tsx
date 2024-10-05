'use client';
import ButtonBack from '@/components/dashboard/ButtonBack';
import ButtonSubmit from '@/components/dashboard/ButtonSubmit';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import { createOrUpdate, getAllData, getOne } from '@/services';
import { AppstoreOutlined } from '@ant-design/icons';
import { Card, Col, Form, FormProps, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Loading from '@/components/Loading';

type FieldType = {
    name: string;
    numeroLiteral: string;
    codeSeniat: string;
    taxBase: number;
    pageRangeBS: number;
    ratesOrPorcentage: any;
    sustractingBS: number;
    typesPeopleIsrl: any;
    IsrlWitholdings: any;
};

const moduleName = 'config/administrative/payment_concepts';

const ModuleForm = ({ params }: any) => {

    const [loader, setLoader] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState({});
    const [currencysR, setCurrencysR] = useState<{ id: number, name: string, value: any, label: string, type: any }[]>([]);
    const [currencysT, setCurrencysT] = useState<{ id: number, name: string, value: any, label: string, type: any }[]>([]);
    const [selectedItems, setSelectedItems] = useState([]);

    const id = params.id ? params.id[0] : null;

    const pageName = `${id ? 'Editar' : 'Nuevo'} concepto de pago`;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Maestros' }, { title: 'Concepto de pago' }, , { title: pageName }];

    const getCurrencys = async () => {
        const responseRates = await getAllData("config/administrative/rates_or_porcentage", "1");
        const responsePeople = await getAllData("config/administrative/types-people-isrl", "1");
        setCurrencysT(responsePeople.data);
        setCurrencysR(responseRates.data);
        console.log(responsePeople);
    };

    function transformPaymentConcept(data: any): any {
        // Obtén un array de todos los typesPeopleIsrl únicos
        const typesPeopleIsrlArray = Array.from(new Set(data.IsrlWitholdings.map((witholding: any) => witholding.typesPeopleIsrl?.type)));

        // Genera el objeto transformado
        const transformed: any = {
            name: data.name,
            numeroLiteral: data.numeroLiteral,
            typesPeopleIsrl: typesPeopleIsrlArray,
        };

        data.IsrlWitholdings.forEach((witholding: any, index: any) => {
            const baseKey = (() => {
                switch (witholding.typesPeopleIsrl.type) {
                    case 'Persona Juridica Domiciliada':
                        return '_0';
                    case 'Persona Juridica No Domiciliada':
                        return '_1';
                    case 'Persona Natural No Residente':
                        return '_2';
                    case 'Persona Natural Residente':
                        return '_3';
                    default:
                        return '';
                }
            })();

            transformed[`codeSeniat${baseKey}`] = witholding.codeSeniat;
            transformed[`taxBase${baseKey}`] = witholding.taxBase;
            transformed[`pageRangeBS${baseKey}`] = witholding.pageRangeBS;
            transformed[`ratesOrPorcentage${baseKey}`] = witholding.ratesOrPorcentage.value;
            transformed[`sustractingBS${baseKey}`] = witholding.sustractingBS;
            console.log(witholding.typesPeopleIsrl.type);
        });

        return transformed;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getData = async () => {
        if (id) {
            const get = await getOne(moduleName, id);
            console.log(get);
            const transformedData = transformPaymentConcept(get)
            setData(transformedData);
            setSelectedItems(transformedData.typesPeopleIsrl.map((item: any, index: number) => ({
                label: item,
            })));

            getCurrencys();

        }
        setSpinner(false);
    };

    useEffect(() => {
        getData();
        getCurrencys();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoader(true);

        const createValueObject = (values: any) => {
            const keys = [
                "codeSeniat",
                "taxBase",
                "pageRangeBS",
                "ratesOrPorcentage",
                "sustractingBS"
            ];

            const valueObject: any = {
                name: values?.name,
                numeroLiteral: values?.numeroLiteral,
                IsrlWitholdings: []
            };

            let index = 0;
            while (values.hasOwnProperty(`codeSeniat_${index}`)) {
                const witholding: any = keys.reduce((acc: any, key) => {
                    if (key === 'codeSeniat') {
                        acc[key] = values[`${key}_${index}`];
                    } else if (key === 'ratesOrPorcentage') {

                        const foundCurrency = currencysR.find(currency => currency.value === values[`${key}_${index}`]);
                        // If found, replace the value with the corresponding id
                        acc[key] = foundCurrency ? foundCurrency.id : values[`${key}_${index}`];

                    } else {
                        acc[key] = Number(values[`${key}_${index}`]);
                    }
                    return acc;
                }, {});

                witholding.typesPeopleIsrl = values.typesPeopleIsrl.map((type: any, index: any) => {
                    if (id) {
                        // In edit mode: Check if the value in the form matches the corresponding type in currencysT
                        const foundCurrency = currencysT.find((currency) => currency.type === type);
                        return foundCurrency ? foundCurrency.id : type;
                    } else {
                        // In create mode or if no match is found, return the original value
                        const matchingCurrency = currencysT.find((currency) => currency.type === values.typesPeopleIsrl[index]);
                        return matchingCurrency ? matchingCurrency.id : type;
                    }
                });

                console.log(witholding);
                witholding.typesPeopleIsrl = witholding.typesPeopleIsrl[index]
                console.log(witholding.typesPeopleIsrl[index]);
                valueObject.IsrlWitholdings.push(witholding);
                index++;
            }

            return valueObject;
        };

        const value = createValueObject(values);
        console.log(values);
        console.log(value);
        const res = await createOrUpdate(moduleName, value, id);
        console.log(res);
        if (res) {
            setLoader(false);
            return toast.warning(res.message);
        }
        toast.success(`Concepto de pago ${id ? 'editado' : 'creado'} con éxito`);

    };

    const options = Object.keys(currencysT).map((key: any) => ({
        label: currencysT[key].type,
        value: currencysT[key].id,
    }));

    const optionsT = Object.keys(currencysR).map((key: any) => ({
        label: currencysR[key]?.value,
        value: currencysR[key]?.id,
    }));

    const handleChange = (value: any, date: any) => {
        console.log(value);
        console.log(date);
        setSelectedItems(date);
    };
    const handleChangeT = (value: any, date: any) => {
        console.log(date);
    };

    console.log(data);

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
                            gap: '20px',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <div style={{ width: '60vw', gap: '10px', display: 'flex', justifyContent: 'center' }}>
                                <Form.Item
                                    label="Concepto de pago:"
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

                                <Form.Item
                                    label="Numeral/Literal"
                                    name="numeroLiteral"
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Tipo de persona"
                                    name="typesPeopleIsrl"
                                >
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        style={{ width: '280px' }}
                                        placeholder="Seleccionar"
                                        options={options}
                                        showSearch
                                        onChange={handleChange}
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                    />
                                </Form.Item>
                            </div>

                            {selectedItems.map((item: any, index: number) => {

                                return (
                                    <div key={index} style={{ width: '60vw', gap: '10px', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                                        <h2>
                                            {item.label}
                                        </h2>
                                        <Row gutter={16}>
                                            <Col span={8}>
                                                <Form.Item
                                                    label="Código de concepto seniat"
                                                    name={item.label === 'Persona Juridica Domiciliada' ? 'codeSeniat_0'
                                                        : item.label === 'Persona Juridica No Domiciliada' ? 'codeSeniat_1'
                                                            : item.label === 'Persona Natural No Residente' ? 'codeSeniat_2'
                                                                : item.label === 'Persona Natural Residente' ? 'codeSeniat_3'
                                                                    : ''}
                                                >

                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    label="Base imponible"
                                                    name={item.label === 'Persona Juridica Domiciliada' ? 'taxBase_0'
                                                        : item.label === 'Persona Juridica No Domiciliada' ? 'taxBase_1'
                                                            : item.label === 'Persona Natural No Residente' ? 'taxBase_2'
                                                                : item.label === 'Persona Natural Residente' ? 'taxBase_3'
                                                                    : ''
                                                    }
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    label="Tarifa o porcentaje"
                                                    name={
                                                        item.label === 'Persona Juridica Domiciliada' ? 'ratesOrPorcentage_0'
                                                            : item.label === 'Persona Juridica No Domiciliada' ? 'ratesOrPorcentage_1'
                                                                : item.label === 'Persona Natural No Residente' ? 'ratesOrPorcentage_2'
                                                                    : item.label === 'Persona Natural Residente' ? 'ratesOrPorcentage_3'
                                                                        : ''
                                                    }
                                                >
                                                    <Select
                                                        placeholder="Seleccionar"
                                                        options={optionsT}
                                                        showSearch
                                                        onChange={handleChangeT}
                                                        filterOption={(input, option) =>
                                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                        }
                                                        filterSort={(optionA, optionB) =>
                                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                                        }
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    label="Pagos mayores a BS"
                                                    name={
                                                        item.label === 'Persona Juridica Domiciliada' ? 'pageRangeBS_0'
                                                            : item.label === 'Persona Juridica No Domiciliada' ? 'pageRangeBS_1'
                                                                : item.label === 'Persona Natural No Residente' ? 'pageRangeBS_2'
                                                                    : item.label === 'Persona Natural Residente' ? 'pageRangeBS_3'
                                                                        : ''
                                                    }
                                                >
                                                    <Input disabled={item.label === 'Persona Juridica Domiciliada'
                                                        || item.label === 'Persona Juridica No Domiciliada'
                                                        || item.label === 'Persona Natural No Residente'
                                                        ? true : false} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    label="Sustraendo en BS"
                                                    name={item.label === 'Persona Juridica Domiciliada' ? 'sustractingBS_0'
                                                        : item.label === 'Persona Juridica No Domiciliada' ? 'sustractingBS_1'
                                                            : item.label === 'Persona Natural No Residente' ? 'sustractingBS_2'
                                                                : item.label === 'Persona Natural Residente' ? 'sustractingBS_3'
                                                                    : ''}
                                                >
                                                    <Input disabled={item.label === 'Persona Juridica Domiciliada'
                                                        || item.label === 'Persona Juridica No Domiciliada'
                                                        || item.label === 'Persona Natural No Residente'
                                                        ? true : false} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                );
                            })}
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