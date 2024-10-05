'use client';
import Loading from '@/components/Loading';
import ButtonBack from '@/components/dashboard/ButtonBack';
import ButtonSubmit from '@/components/dashboard/ButtonSubmit';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import { createOrUpdate, getActiveList, getOne } from '@/services';
import { AppstoreOutlined } from '@ant-design/icons';
import { Col, Form, FormProps, Input, InputNumber, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type FieldType = {
    name: string;
    unitsConcentration: any;
};

const moduleName = 'inventory/maintenance/concentration';

const ModuleForm = ({ params }: any) => {
    const [loader, setLoader] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState({});
    const [optionsUnistConcentration, setOptionsUnistConcentration] = useState([]);

    const id = params.id ? params.id[0] : null;

    useEffect(() => {
        getData();
    }, []);

    const pageName = `${id ? 'Editar' : 'Nueva'} Concentración`;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Inventario' }, { title: 'Mantenimiento' }, { title: pageName }];

    const getData = async () => {
        const [getOptionsUnistConcentration] = await Promise.all([
            getActiveList('inventory/maintenance/units-concentration'),
        ]);

        setOptionsUnistConcentration(getOptionsUnistConcentration);

        if (id) {
            const get = await getOne(moduleName, id);
            //get.unitsConcentration = get.unitsConcentration.id;
            setData(get);
        }
        setSpinner(false);
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoader(true);
        values.unitsConcentration = optionsUnistConcentration.find(
            (el: any) => el?.id === values.unitsConcentration,
        );

        values.name = values.name.toString();
        const res = await createOrUpdate(moduleName, values, id);

        if (res) {
            setLoader(false);
            if (res.statusCode == 401) {
                return toast.warning(res.message);
            }
            return toast.warning(res);
        }

        toast.success(`Concentración ${id ? 'editada' : 'creada'} con éxito`);
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
                        <Row gutter={32}>
                            <Col span={32} md={{ span: 8, offset: 8 }}>
                                <Form.Item<FieldType>
                                    label="Nombre:"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        min={0}
                                        max={100000000}
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </Col>
                            {/* <Col span={32} md={{ span: 8, offset: 8 }}>
                                <Form.Item<FieldType>
                                    label="Unidad de concentración:"
                                    name="unitsConcentration"
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
                                        options={optionsUnistConcentration}
                                        fieldNames={{
                                            label: 'name',
                                            value: 'id',
                                        }}
                                    />
                                </Form.Item>
                            </Col> */}
                        </Row>

                        <ButtonSubmit loader={loader}>
                            {!id ? 'Guardar' : 'Editar'} Concentración
                        </ButtonSubmit>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default ModuleForm;
