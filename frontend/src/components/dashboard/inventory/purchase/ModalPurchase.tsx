import { useState } from 'react';
import { Button, Modal } from 'antd';
import { PlusCircleOutlined, ProductFilled } from '@ant-design/icons';
import Form from '@/app/dashboard/masters/providers/form/[[...id]]/page';
import Tableproducts from './Tableproducts';
import TableMotivo from '../../accounts_payable/documents/credit_note/TableMotivo';
import { getData } from '@/services';

export interface DataTypeActions {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    description?: string;
    subCategory?: {
        name: string;
        category: {
            name: string;
        };
    }; // Añade esta propiedad para el contenido expandido
}

const ModalPurchase = ({
    moduleName,
    setIdentificationProvider,
    handlerSetReloadProviders,
    typeModal,
    params,
    setProducts,
    products,
    dataMotive,
    setDataMotive,
}: any) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [jose, setjose] = useState<number>(1);

    const showModal = () => {
        setIsModalOpen(true); // Mostrar el modal
    };

    const handleOk = () => {
        setIsModalOpen((prevState) => !prevState); // Cerrar el modal
    };

    const handleCancel = () => {
        setIsModalOpen((prevState) => !prevState); // Cambiar el estado a false
        if (typeModal === 1 && handlerSetReloadProviders) {
            handlerSetReloadProviders(); // Ejecutar la función correctamente
        }
    };
    return (
        <>
            {typeModal === 1 ? (
                <>
                    <Button
                        icon={<PlusCircleOutlined />}
                        style={{ margin: '8px' }}
                        type="primary"
                        onClick={showModal}
                    ></Button>

                    <Modal
                        title="Agregar Proveedor"
                        width={'50%'}
                        open={isModalOpen}
                        onOk={handleOk}
                        footer={null}
                        onCancel={handleCancel}
                        destroyOnClose
                    >
                        <Form
                            purchase={moduleName}
                            setIsModalOpen={setIsModalOpen}
                            setIdentificationProvider={setIdentificationProvider}
                            isModalOpen={isModalOpen}
                        />
                    </Modal>
                </>
            ) : typeModal === 2 ? (
                <>
                    <Button
                        icon={<ProductFilled />}
                        style={{ margin: '8px' }}
                        type="primary"
                        onClick={showModal}
                    >
                        Agregar Artículos
                    </Button>

                    <Modal
                        title="Agregar Artículos"
                        width={'60%'}
                        open={isModalOpen}
                        onOk={handleOk}
                        footer={null}
                        destroyOnClose
                        onCancel={handleCancel}
                    >
                        <Tableproducts
                            searchParams={params}
                            isModalOpen={isModalOpen}
                            setProducts={setProducts}
                            products={products}
                            setIsModalOpen={setIsModalOpen}
                        />
                    </Modal>
                </>
            ) : typeModal === 3 ? (
                <>
                    <Button
                        icon={<ProductFilled />}
                        style={{ margin: '8px' }}
                        type="primary"
                        onClick={showModal}
                    >
                        Agregar Motivo
                    </Button>

                    <Modal
                        title="Agregar Motivo"
                        width={'60%'}
                        open={isModalOpen}
                        onOk={handleOk}
                        footer={null}
                        destroyOnClose
                        onCancel={handleCancel}
                    >
                        <TableMotivo
                            searchParams={params}
                            isModalOpen={isModalOpen}
                            dataMotive={dataMotive}
                            setDataMotive={setDataMotive}
                            setIsModalOpen={setIsModalOpen}
                        />
                    </Modal>
                </>
            ) : (
                ''
            )}
        </>
    );
};

export default ModalPurchase;
