'use client';
import ButtonBack from '@/components/dashboard/ButtonBack';
import ButtonSubmit from '@/components/dashboard/ButtonSubmit';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import { createOrUpdate, getActiveList, getOne } from '@/services';
import { AppstoreOutlined } from '@ant-design/icons';
import { Col, Form, FormProps, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type FieldType = {
    model: string;
    printerBrand: number;
};

const moduleName = 'config/printer_models';

const ModuleForm = ({ params }: any) => {
    const [loader, setLoader] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState({});
    const [optionsPrinterBrands, setOptionsPrinterBrands] = useState([]);
    const id = params.id ? params.id[0] : null;

    useEffect(() => {
        const getData = async () => {
            const [getOptionsPrinterBrands] = await Promise.all([
                getActiveList('printer_brands'),
            ]);

            setOptionsPrinterBrands(getOptionsPrinterBrands);

            if (id) {
                const get = await getOne(moduleName, id);
                get.printerBrand = get.printerBrand.id;
                setData(get);
            }
            setSpinner(false);
        };

        getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const pageName = `${id ? 'Editar' : 'Nuevo'} Modelo de Impresora`;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [
        { title: 'Configuración' },
        { title: 'Modelos de Impresoras' },
        ,
        { title: pageName },
    ];

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoader(true);
        const res = await createOrUpdate(moduleName, values, id);

        if (res) {
            setLoader(false);
            return toast.warning(res);
        }

        toast.success(
            `Modelo de impresora ${id ? 'editado' : 'creado'} con éxito`,
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
                                    label="Marca:"
                                    name="printerBrand"
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
                                        options={optionsPrinterBrands}
                                        fieldNames={{
                                            label: 'brand',
                                            value: 'id',
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={24} md={{ span: 12, offset: 6 }}>
                                <Form.Item<FieldType>
                                    label="Nombre del modelo:"
                                    name="model"
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
                            {!id ? 'Guardar' : 'Editar'} Modelo de Impresora
                        </ButtonSubmit>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default ModuleForm;
