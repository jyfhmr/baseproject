'use client';
import Loading from '@/components/Loading';
import ButtonBack from '@/components/dashboard/ButtonBack';
import ButtonSubmit from '@/components/dashboard/ButtonSubmit';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import { getFormData } from '@/helpers';
import { createOrUpdate, getActiveList, getOne } from '@/services';
import Filepond from '@/utils/filepond';
import { AppstoreOutlined } from '@ant-design/icons';
import {
    Col,
    Descriptions,
    Form,
    FormProps,
    Input,
    InputNumber,
    Row,
    Select,
    TreeSelect,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

type FieldType = {
    name: string;
    activeIngredient: string;
    code: any;
    category: any;
    subCategory: any;
    brand: any;
    typesPresentation: any;
    concentration: any;
    unitConcentration: any;
    typesPackaging: any;
    unitMeasurement: any;
    description: any;
    quantityPackage: any;
    pharmaceuticalDescription: any;
    barcode: any;
};

const moduleName = 'inventory/catalogue';

const ModuleForm = ({ params }: any) => {
    const [loader, setLoader] = useState(false);
    const [files, setFiles] = useState<any[]>([]);
    const [spinner, setSpinner] = useState(true);
    const [disableSelect, setDisableSelect] = useState(true);
    const [data, setData] = useState({});
    const [optionsCategories, setOptionsCategories] = useState([]) as any;
    const [optionsSubCategoriesInput, setOptionsSubCategoriesInput] = useState([]);
    const [optionsSubCategories, setOptionsSubCategories] = useState([]);
    const [optionsBrands, setOptionsBrands] = useState([]) as any;
    const [optionsTypesPresentation, setOptionsTypesPresentation] = useState([]) as any;
    const [optionsConcentrations, setOptionsConcentrations] = useState([]) as any;
    const [optionsUnistConcentration, setOptionsUnistConcentration] = useState([]) as any;
    const [optionsTypesPackaging, setOptionsTypesPackaging] = useState([]) as any;
    const [optionsUnistMeasurement, setOptionsUnistMeasurement] = useState([]) as any;
    const [optionsQuantitiesPackage, setOptionsQuantitiesPackage] = useState([]) as any;
    const [description, setDescription] = useState([
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
    ]);

    const id = params.id ? params.id[0] : null;
    let formRef = useRef<any>(null);

    useEffect(() => {
        //

        getData();
    }, []);

    const pageName = `${id ? 'Editar' : 'Nuevo'} Producto`;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Inventario' }, { title: 'Catálogo' }, { title: pageName }];

    const getData = async () => {
        const [
            getOptionsCategories,
            getOptionsSubCategories,
            getOptionsBrands,
            getOptionsTypesPresentation,
            getOptionsConcentrations,
            getOptionsUnistConcentration,
            getOptionsTypesPackaging,
            getOptionsUnistMeasurement,
            getOptionsQuantitiesPackage,
        ] = await Promise.all([
            getActiveList('inventory/maintenance/categories'),
            getActiveList('inventory/maintenance/sub-categories'),
            getActiveList('inventory/maintenance/brands'),
            getActiveList('inventory/maintenance/types-presentation'),
            getActiveList('inventory/maintenance/concentration'),
            getActiveList('inventory/maintenance/units-concentration'),
            getActiveList('inventory/maintenance/types-packaging'),
            getActiveList('inventory/maintenance/units-measurement'),
            getActiveList('inventory/maintenance/quantities-package'),
        ]);

        setOptionsCategories(getOptionsCategories);
        setOptionsBrands(getOptionsBrands);
        setOptionsSubCategories(getOptionsSubCategories);
        setOptionsTypesPresentation(getOptionsTypesPresentation);
        setOptionsConcentrations(getOptionsConcentrations);
        setOptionsUnistConcentration(getOptionsUnistConcentration);
        setOptionsTypesPackaging(getOptionsTypesPackaging);
        setOptionsUnistMeasurement(getOptionsUnistMeasurement);
        setOptionsQuantitiesPackage(getOptionsQuantitiesPackage);

        if (id) {
            const get = await getOne(moduleName, id);

            const newDescription = description;

            if (get?.subCategory?.category?.id) {
                newDescription[1] = ' ,' + get?.brand.name;
                newDescription[2] = ' ,' + get?.subCategory?.name;
                newDescription[3] = ' ,' + get?.typesPresentation?.name;
                newDescription[4] = ' ,' + get?.concentration?.name;
                newDescription[5] = ' ' + get?.unitConcentration?.name;
                newDescription[6] = ' ,' + get?.typesPackaging?.name;
                newDescription[7] = ' ' + get?.quantityPackage?.name;
                newDescription[8] = ' ' + get?.unitMeasurement?.name;

                setDescription(newDescription);
                //setFielsDescription();
                get.category = get.subCategory.category.id;

                const optionSubCategoriesNew = getOptionsSubCategories.filter(
                    (el: any) => el.category?.id === get.category,
                );
                setOptionsSubCategoriesInput(optionSubCategoriesNew);

                get.subCategory = get.subCategory.id;
            }

            if (get?.brand?.id) get.brand = get.brand.id;
            if (get?.typesPresentation?.id) get.typesPresentation = get.typesPresentation.id;
            if (get?.concentration?.id) get.concentration = get.concentration.id;
            if (get?.unitConcentration?.id) get.unitConcentration = get.unitConcentration.id;
            if (get?.typesPackaging?.id) get.typesPackaging = get.typesPackaging.id;
            if (get?.unitMeasurement?.id) get.unitMeasurement = get.unitMeasurement.id;
            if (get?.quantityPackage?.id) get.quantityPackage = get.quantityPackage.id;

            setData(get);
            setDisableSelect(false);
            if (get.img) {
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

        values.category = optionsCategories.find((el: any) => el?.id === values.category);
        values.brand = optionsBrands.find((el: any) => el?.id === values.brand);
        let subCategories: any = null;

        optionsSubCategories.find((el: any) => {
            if (el.id === values.subCategory) {
                subCategories = el;
                return true;
            } else if (el.children && el.children.length > 0) {
                const child = el.children.find((sub: any) => sub.id === values.subCategory);
                if (child) {
                    subCategories = child;
                    return true;
                }
            }
            return false;
        });

        if (!subCategories) {
            console.log('Subcategory not found');
            return;
        }

        values.subCategory = subCategories;

        values.unitMeasurement = values.unitMeasurement
            ? optionsUnistMeasurement.find((el: any) => el?.id === values.unitMeasurement)
            : null;

        values.typesPresentation = values.typesPresentation
            ? optionsTypesPresentation.find((el: any) => el?.id === values.typesPresentation)
            : null;

        values.unitConcentration = values.unitConcentration
            ? optionsUnistConcentration.find((el: any) => el?.id === values.unitConcentration)
            : null;

        values.typesPackaging = values.typesPackaging
            ? optionsTypesPackaging.find((el: any) => el?.id === values.typesPackaging)
            : null;

        values.quantityPackage = values.quantityPackage
            ? optionsQuantitiesPackage.find((el: any) => el?.id === values.quantityPackage)
            : null;

        values.concentration = values.concentration
            ? optionsConcentrations.find((el: any) => el?.id === values.concentration)
            : null;

        values.pharmaceuticalDescription = values.pharmaceuticalDescription
            ? values.pharmaceuticalDescription
            : 'Sin descripcion medica';

        let formData = getFormData(values);

        files[0] && formData.append('img', files[0].file, files[0].filename);
        // if (!files[0]) {
        //     setLoader(false);
        //     return toast.warning(`La imagen del producto es requerido`);
        //     //return false;
        // }

        const res = await createOrUpdate(moduleName, formData, id);
        if (res) {
            setLoader(false);
            if (res && res.statusCode && res.statusCode != 200 && res.statusCode != 201) {
                toast.warning(res.message);
            } else {
                toast.success(`Perfil ${id ? 'editado' : 'creado'} con éxito`);
            }
            return toast.warning(res);
        }

        toast.success(`Producto ${id ? 'editado' : 'registrado'} con éxito`);
    };

    const handlerSetBrand = (value: number) => {
        const brand: any = optionsBrands.find((el: any) => el.id === value);
        let originalCode = formRef.current.getFieldValue('code') || '0000000000000000000000';
        let newCode =
            brand && brand.code
                ? brand.code + originalCode.substring(3)
                : '000' + originalCode.substring(3);
        formRef.current.setFieldsValue({ code: newCode });

        const newDescription = description;
        newDescription[0] = ',' + brand.name + ' ';
        setDescription(newDescription);
        setFielsDescription();
    };

    const handlerSetCategory = (value: number) => {
        setOptionsSubCategoriesInput([]);
        const optionSubCategoriesNew = optionsSubCategories.filter(
            (el: any) => el.category?.id == value,
        );
        formRef.current.setFieldsValue({ subCategory: null }); // Resetear el valor de subCategory
        setOptionsSubCategoriesInput(optionSubCategoriesNew);

        const category: any = optionsCategories.find((el: any) => el.id === value);

        let originalCode = formRef.current.getFieldValue('code') || '0000000000000000000000';
        let newCode =
            category && category.code
                ? originalCode.substring(0, 3) + category.code + originalCode.substring(5)
                : originalCode.substring(0, 3) + '00' + originalCode.substring(5);
        formRef.current.setFieldsValue({ code: newCode });

        // const newDescription = description;
        // newDescription[1] =' - ';
        // setDescription(newDescription);
        // setFielsDescription();
    };

    const handlerChangeSubCategory = (value: number) => {
        let subCategories: any = null;

        optionsSubCategories.find((el: any) => {
            if (el.id === value) {
                subCategories = el;
                return true;
            } else if (el.children && el.children.length > 0) {
                const child = el.children.find((sub: any) => sub.id === value);
                if (child) {
                    subCategories = child;
                    return true;
                }
            }
            return false;
        });

        if (!subCategories) {
            console.log('Subcategory not found');
            return;
        }

        let originalCode = formRef.current.getFieldValue('code') || '0000000000000000000000';
        let newCode =
            subCategories && subCategories.code
                ? originalCode.substring(0, 5) + subCategories.code + originalCode.substring(8)
                : originalCode.substring(0, 5) + '000' + originalCode.substring(8);
        formRef.current.setFieldsValue({ code: newCode });

        const newDescription = description;
        newDescription[2] = ' ' + subCategories.name;

        setDescription(newDescription);
        setFielsDescription();
    };

    const handlerchange = (
        value: number,
        options: any,
        positionInit: number,
        positionFinally: number,
        positionsDescription: number,
    ) => {
        const dta: any = options.find((el: any) => el.id === value);

        let originalCode = formRef.current.getFieldValue('code') || '0000000000000000000000';
        let newCode =
            dta && dta.code
                ? originalCode.substring(0, positionInit) +
                  dta.code +
                  originalCode.substring(positionFinally)
                : originalCode.substring(0, positionInit) +
                  (positionFinally - positionInit === 3 ? '000' : '00') +
                  originalCode.substring(positionFinally);
        formRef.current.setFieldsValue({ code: newCode });

        const newDescription = description;
        newDescription[positionsDescription] =
            positionsDescription == 5 || positionsDescription == 8 || positionsDescription == 7
                ? ' ' + dta.name
                : ', ' + dta.name;
        setDescription(newDescription);
        setFielsDescription();
    };

    const setFielsDescription = () => {
        let newDescription = formRef.current.getFieldValue('name') + ' ';
        for (let index = 0; index < description.length; index++) {
            newDescription += description[index];
        }

        formRef.current.setFieldsValue({ description: newDescription });
    };

    const setInputName = (value: any) => {
        value ? setDisableSelect(false) : setDisableSelect(true);

        setFielsDescription();
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
                        ref={formRef}
                        name="wrap"
                        colon={false}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={data}
                    >
                        <Row gutter={32}>
                            <Col span={12} md={{ span: 24 }} lg={{ span: 12 }}>
                                <Form.Item<FieldType>
                                    label="Codígo:"
                                    name="code"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={32}>
                            <Col md={{ span: 12 }} lg={{ span: 8 }} span={8}>
                                <Form.Item<FieldType>
                                    label="Codígo de Barra:"
                                    name="barcode"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input type="number" />
                                </Form.Item>
                            </Col>
                            <Col md={{ span: 12 }} lg={{ span: 8 }} span={8}>
                                <Form.Item<FieldType>
                                    label="Nombre del producto:"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input onChange={(e) => setInputName(e.target.value)} />
                                </Form.Item>
                            </Col>
                            <Col md={{ span: 12 }} lg={{ span: 8 }} span={8}>
                                <Form.Item<FieldType>
                                    label="Principio activo:"
                                    name="activeIngredient"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input onChange={(e) => setInputName(e.target.value)} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={32}>
                            <Col md={{ span: 12 }} lg={{ span: 8 }} span={8}>
                                <Form.Item<FieldType>
                                    label="Marca:"
                                    name="brand"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Select
                                        allowClear
                                        style={{ width: '100%' }}
                                        disabled={disableSelect}
                                        placeholder="Seleccione"
                                        options={optionsBrands}
                                        onChange={(value) => handlerSetBrand(value)}
                                        showSearch
                                        filterOption={(input, optionsBrands) =>
                                            (optionsBrands?.name ?? '')
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
                            <Col md={{ span: 12 }} lg={{ span: 8 }} span={8}>
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
                                        disabled={disableSelect}
                                        onChange={(value) => handlerSetCategory(value)}
                                        options={optionsCategories}
                                        showSearch
                                        filterOption={(input, optionsCategories) =>
                                            (optionsCategories?.name ?? '')
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
                            <Col md={{ span: 12 }} lg={{ span: 8 }} span={8}>
                                <Form.Item<FieldType>
                                    label="Sub Categoria:"
                                    name="subCategory"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    {/* <Select
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Seleccione"
                                        disabled={disableSelect}
                                        onChange={(value) =>
                                            handlerchange(value, optionsSubCategoriesInput, 4, 6, 2)
                                        }
                                        options={optionsSubCategoriesInput}
                                        showSearch
                                        filterOption={(input, optionsSubCategoriesInput) =>
                                            (optionsSubCategoriesInput?.name ?? '')
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        fieldNames={{
                                            label: 'name',
                                            value: 'id',
                                        }}
                                    /> */}
                                    <TreeSelect
                                        style={{ width: '100%' }}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        treeData={optionsSubCategoriesInput}
                                        placeholder="Please select"
                                        showSearch
                                        onChange={(value) => handlerChangeSubCategory(value)}
                                        fieldNames={{
                                            label: 'name',
                                            value: 'id',
                                        }}
                                        filterTreeNode={(inputValue, treeNode) =>
                                            treeNode.name
                                                .toLowerCase()
                                                .includes(inputValue.toLowerCase())
                                        }
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={32}>
                            <Col md={{ span: 12 }} lg={{ span: 8 }} span={8}>
                                <Form.Item<FieldType>
                                    label="Presentación:"
                                    name="typesPresentation"
                                    // rules={[
                                    //     {
                                    //         required: true,
                                    //     },
                                    // ]}
                                >
                                    <Select
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Seleccione"
                                        disabled={disableSelect}
                                        onChange={(value) =>
                                            handlerchange(value, optionsTypesPresentation, 8, 10, 3)
                                        }
                                        options={optionsTypesPresentation}
                                        showSearch
                                        filterOption={(input, optionsTypesPresentation) =>
                                            (optionsTypesPresentation?.name ?? '')
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
                            <Col md={{ span: 12 }} lg={{ span: 8 }} span={8}>
                                <Form.Item<FieldType>
                                    label="Concentración:"
                                    name="concentration"
                                    // rules={[
                                    //     {
                                    //         required: true,
                                    //     },
                                    // ]}
                                >
                                    <Select
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Seleccione"
                                        disabled={disableSelect}
                                        onChange={(value) =>
                                            handlerchange(value, optionsConcentrations, 10, 13, 4)
                                        }
                                        options={optionsConcentrations}
                                        showSearch
                                        filterOption={(input, optionsConcentrations) =>
                                            (optionsConcentrations?.name ?? '')
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
                            <Col md={{ span: 12 }} lg={{ span: 8 }} span={8}>
                                <Form.Item<FieldType>
                                    label="Unidad de medida concentración:"
                                    name="unitConcentration"
                                    // rules={[
                                    //     {
                                    //         required: true,
                                    //     },
                                    // ]}
                                >
                                    <Select
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Seleccione"
                                        disabled={disableSelect}
                                        onChange={(value) =>
                                            handlerchange(
                                                value,
                                                optionsUnistConcentration,
                                                13,
                                                15,
                                                5,
                                            )
                                        }
                                        options={optionsUnistConcentration}
                                        showSearch
                                        filterOption={(input, optionsUnistConcentration) =>
                                            (optionsUnistConcentration?.name ?? '')
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
                        <Row gutter={32}>
                            <Col md={{ span: 12 }} lg={{ span: 8 }} span={8}>
                                <Form.Item<FieldType>
                                    label="Tipo de empaque:"
                                    name="typesPackaging"
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
                                        disabled={disableSelect}
                                        onChange={(value) =>
                                            handlerchange(value, optionsTypesPackaging, 15, 17, 6)
                                        }
                                        options={optionsTypesPackaging}
                                        showSearch
                                        filterOption={(input, optionsTypesPackaging) =>
                                            (optionsTypesPackaging?.name ?? '')
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
                            <Col md={{ span: 12 }} lg={{ span: 8 }} span={8}>
                                <Form.Item<FieldType>
                                    label="Cantidad Típica:"
                                    name="quantityPackage"
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
                                        options={optionsQuantitiesPackage}
                                        disabled={disableSelect}
                                        showSearch
                                        filterOption={(input, optionsQuantitiesPackage) =>
                                            (optionsQuantitiesPackage?.name ?? '')
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        onChange={(value) =>
                                            handlerchange(
                                                value,
                                                optionsQuantitiesPackage,
                                                17,
                                                20,
                                                7,
                                            )
                                        }
                                        fieldNames={{
                                            label: 'name',
                                            value: 'id',
                                        }}
                                    />
                                </Form.Item>
                            </Col>

                            <Col md={{ span: 12 }} lg={{ span: 8 }} span={8}>
                                <Form.Item<FieldType>
                                    label="Unidad de medida del empaque:"
                                    name="unitMeasurement"
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
                                        options={optionsUnistMeasurement}
                                        disabled={disableSelect}
                                        onChange={(value) =>
                                            handlerchange(value, optionsUnistMeasurement, 20, 22, 8)
                                        }
                                        showSearch
                                        filterOption={(input, optionsUnistMeasurement) =>
                                            (optionsUnistMeasurement?.name ?? '')
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
                        <Row gutter={32}>
                            <Col span={12} md={{ span: 32 }} lg={{ span: 12 }}>
                                <Form.Item<FieldType>
                                    label="Descripción:"
                                    name="description"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <TextArea disabled />
                                </Form.Item>
                            </Col>
                            <Col span={12} md={{ span: 32 }} lg={{ span: 12 }}>
                                <Form.Item<FieldType>
                                    label="Descripción Medica:"
                                    name="pharmaceuticalDescription"
                                >
                                    <TextArea />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={32}>
                            <Col span={12} md={{ span: 32 }} lg={{ span: 12 }}>
                                <Filepond files={files} setFiles={setFiles} />
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

export default ModuleForm;
