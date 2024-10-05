'use client';
import ButtonBack from '@/components/dashboard/ButtonBack';
import ButtonSubmit from '@/components/dashboard/ButtonSubmit';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import { createOrUpdate, getOne } from '@/services';
import { AppstoreOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, Form, Input, Row, Upload, Image } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Loading from '@/components/Loading';
import './money.css';

const moduleName = 'treasury/maintenance/money';

const getBase64 = (file: File) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const ModuleForm = ({ params }: any) => {
    const [loader, setLoader] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState({});
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState() as any;

    const id = params.id ? params.id[0] : null;
    const pageName = `${id ? 'Editar' : 'Nueva'} Moneda`;
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Maestros' }, { title: 'Monedas' }, { title: pageName }];

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getData = async () => {
        if (id) {
            const get = await getOne(moduleName, id);
            setData(get);
            if (get.file) {
                setFileList([
                    {
                        uid: '-1',
                        name: get.file,
                        status: 'done',
                        url: get.file.startsWith('http')
                            ? get.file
                            : `${process.env.NEXT_PUBLIC_URL_IMAGE}uploads/money/${get.file}`,
                    },
                ]);
            }
        }
        setSpinner(false);
    };

    useEffect(() => {
        getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const onFinish = async (values: any) => {
        setLoader(true);

        const formData = new FormData();
        if (fileList?.[0]) {
            formData.append('file', fileList[0]?.originFileObj || fileList[0]?.url);
        }

        formData.append('money', values.money);
        formData.append('symbol', values.symbol);
        try {
            const res = await createOrUpdate(moduleName, formData, id);
            if (res) {
                setLoader(false);
                return toast.warning(res.message);
            }
            toast.success(`Moneda ${id ? 'editada' : 'creada'} con éxito`);
        } catch (error) {
            toast.error('Ha ocurrido un error');
        } finally {
            setLoader(false);
        }
    };

    const handlePreview = async (file: any) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = ({ fileList: newFileList }: any) => setFileList(newFileList);

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

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
                            <Col span={24} md={{ span: 8, offset: 6 }}>
                                <div className="container-data-bank">
                                    <Form.Item
                                        label="Moneda:"
                                        name="money"
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
                                        label="Simbolo:"
                                        name="symbol"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Este campo es obligatorio',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item label="Logo:" name="file">
                                        <Upload
                                            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                                            listType="picture-card"
                                            fileList={fileList}
                                            onPreview={handlePreview}
                                            onChange={handleChange}
                                        >
                                            {fileList?.length >= 1 ? null : uploadButton}
                                        </Upload>
                                        {previewImage && (
                                            // eslint-disable-next-line jsx-a11y/alt-text
                                            <Image
                                                wrapperStyle={{ display: 'none' }}
                                                preview={{
                                                    visible: previewOpen,
                                                    onVisibleChange: (visible) =>
                                                        setPreviewOpen(visible),
                                                    afterOpenChange: (visible) =>
                                                        !visible && setPreviewImage(''),
                                                }}
                                                src={previewImage}
                                            />
                                        )}
                                    </Form.Item>
                                </div>
                            </Col>
                        </Row>

                        <ButtonSubmit loader={loader}>
                            {!id ? 'Guardar' : 'Editar'} Moneda
                        </ButtonSubmit>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default ModuleForm;
