'use client';
import Loading from '@/components/Loading';
import ButtonBack from '@/components/dashboard/ButtonBack';
import ButtonSubmit from '@/components/dashboard/ButtonSubmit';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import { createOrUpdate, getActiveList, getOne } from '@/services';
import { AppstoreOutlined } from '@ant-design/icons';
import { Col, Form, FormProps, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type FieldType = {
    name: string;
    category: any;
    subCategoryFather: any;
};

const moduleName = 'inventory/maintenance/sub-categories';

const ModuleForm = ({ params }: any) => {
    const [loader, setLoader] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState({});
    const [optionsCategories, setOptionsCategories] = useState([]);
    const [optionsSubCategories, setOptionsSubCategories] = useState([]);
    const [optionsSubCategoriesInput, setOptionsSubCategoriesInput] = useState([]);

    const id = params.id ? params.id[0] : null;

    useEffect(() => {
        getData();
    }, []);

    const pageName = `${id ? 'Editar' : 'Nueva'} Sub Categoría`;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Inventario' }, { title: 'Mantenimiento' }, , { title: pageName }];

    const getData = async () => {
        const [getOptionsCategories] = await Promise.all([
            getActiveList('inventory/maintenance/categories'),
        ]);
        const [getOptionsSubCategories] = await Promise.all([
            getActiveList('inventory/maintenance/sub-categories'),
        ]);

        setOptionsCategories(getOptionsCategories);
        setOptionsSubCategories(getOptionsSubCategories);

        if (id) {
            const get = await getOne(moduleName, id);
            get.category = get.category.id;
            if (get.subCategoryFather) {
                const optionSubCategoriesNew = getOptionsSubCategories.filter(
                    (el: any) => el.category?.id === get.category,
                );
                setOptionsSubCategoriesInput(optionSubCategoriesNew);
                get.subCategoryFather = get.subCategoryFather.id;
            }

            setData(get);
        }
        setSpinner(false);
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoader(true);
        values.category = optionsCategories.find((el: any) => el?.id === values.category);
        values.subCategoryFather = optionsSubCategories.find(
            (el: any) => el?.id === values.subCategoryFather,
        );
        const res = await createOrUpdate(moduleName, values, id);

        if (res) {
            setLoader(false);
            if (res.statusCode == 401) {
                return toast.warning(res.message);
            }
            return toast.warning(res);
        }

        toast.success(`Sub Categoría ${id ? 'editada' : 'creada'} con éxito`);
    };

    const handlerSetCategory = (value: number) => {
        setOptionsSubCategoriesInput([]);
        const optionSubCategoriesNew = optionsSubCategories.filter(
            (el: any) => el.category?.id == value,
        );
        //formRef.current.setFieldsValue({ subCategory: null }); // Resetear el valor de subCategory
        setOptionsSubCategoriesInput(optionSubCategoriesNew);
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
                            <Col span={24} md={{ span: 8, offset: 8 }}>
                                <Form.Item<FieldType>
                                    label="Categoria:"
                                    name="category"
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
                                        options={optionsCategories}
                                        onChange={(value) => handlerSetCategory(value)}
                                        fieldNames={{
                                            label: 'name',
                                            value: 'id',
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={32}>
                            <Col span={24} md={{ span: 8, offset: 8 }}>
                                <Form.Item<FieldType>
                                    label="Sub Categoría:"
                                    name="subCategoryFather"
                                >
                                    <Select
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Seleccione"
                                        options={optionsSubCategoriesInput}
                                        fieldNames={{
                                            label: 'name',
                                            value: 'id',
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={32}>
                            <Col span={24} md={{ span: 8, offset: 8 }}>
                                <Form.Item<FieldType>
                                    label="Nombre:"
                                    name="name"
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
                            {!id ? 'Guardar' : 'Editar'} Sub Categoría
                        </ButtonSubmit>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default ModuleForm;
