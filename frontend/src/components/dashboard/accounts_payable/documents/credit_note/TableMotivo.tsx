import { useEffect, useState } from 'react';
import { Table, Input, Button, Pagination, Spin, TableProps } from 'antd';
import { PlusCircleFilled, SearchOutlined } from '@ant-design/icons';
import { getData } from '@/services'; // Función para obtener datos desde el servidor

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
    };
}

const TableMotivo = ({ isModalOpen, dataMotive, setDataMotive, setIsModalOpen }: any) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [data, setData] = useState<DataTypeActions[]>([]);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [order, setorder] = useState<string>('ASC');
    const [pageSize, setPageSize] = useState<number>(5);
    const [searchText, setSearchText] = useState<string>(''); // Texto de búsqueda
    const [loading, setLoading] = useState<boolean>(false); // Estado de carga

    useEffect(() => {
        console.log(isModalOpen);
        if (isModalOpen) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModalOpen, currentPage, pageSize, searchText]);

    const fetchData = async () => {
        setLoading(true); // Activar el spinner de carga
        try {
            const dataMotiveId = dataMotive.map((el: any) => el.id);
            console.log(dataMotiveId);
            setData([]);

            console.log(dataMotiveId);

            const params = {
                page: currentPage,
                rows: pageSize,
                order: order,
                search: searchText,
                dataMotiveId, // Otros parámetros de búsqueda personalizados
            };

            const getList = await getData('config/administrative/reason', params);
            setData(getList.data); // Asignamos los datos obtenidos a 'data'
            setTotalRows(getList.totalRows); // Guardamos el número total de filas
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false); // Desactivar el spinner de carga
        }
    };

    const onSelectChange = async (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
        // Verificar en consola los productos actualizados
    };

    const handleSetProducts = async () => {
        // Crear una copia del array actual de productos
        let product = [...dataMotive];

        // Filtrar los elementos seleccionados de 'data'
        const prod = data.filter((el) => selectedRowKeys.includes(el.id));

        // Agregar los nuevos elementos a la copia de 'product' si no están ya presentes
        prod.forEach((el: any) => {
            if (!product.some((p) => p.id === el.id)) {
                product.push({
                    id: el.id,
                    barcode: el.barcode,
                    name: el.name,
                    description: el.description,
                    batchNumber: '',
                    expirationDate: '',
                    quantity: 0,
                    unitCost: 0.0,
                    unitPrice: 0.0,
                    profitPercentage: 0,
                    iva: 1,
                    discount: 0.0,
                    total: 0.0,
                });
            }
        });

        // Actualiza el estado de productos
        await setDataMotive(product);

        // Ejecuta la función handleOk correctamente
        await setIsModalOpen(false); // Cambiado para ejecutar la función
    };

    const onSearch = async (value: string) => {
        setSearchText(value);
        setCurrentPage(1); // Reiniciar la paginación en la primera página al buscar
        await fetchData();
    };

    const handleTableChange: TableProps['onChange'] = async (
        pagination: any,
        filters: any,
        sorter: any,
        extra,
    ) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
        const or: string = sorter?.order == 'ascend' ? 'ASC' : 'DESC';
        setorder(or);
        await fetchData();
    };

   
    const columns: any = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: true,
            defaultSortOrder: 'descend',
            fixed: 'left',
            width: 50,
        },
        { title: 'Modulo', dataIndex: 'module', width: 150 },
        { title: 'Tipo de transancion', dataIndex: 'transactionType', width: 200 },
        { title: 'Descripcion', dataIndex: 'description', width: 200, fixed: 'left' },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                {/* Botón a la izquierda */}
                {selectedRowKeys.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                        <Button onClick={handleSetProducts} type="primary">
                            <PlusCircleFilled></PlusCircleFilled> Agregar
                        </Button>
                    </div>
                )}

                {/* Filtro de búsqueda a la derecha */}
                <div>
                    <Input.Search
                        placeholder="Buscar producto"
                        enterButton={<SearchOutlined />}
                        onSearch={onSearch}
                        style={{ width: 300 }}
                    />
                </div>
            </div>

            {/* Spinner de carga y tabla */}
            <Spin spinning={loading} tip="Cargando...">
                <Table
                    rowSelection={{
                        selectedRowKeys,
                        onChange: onSelectChange,
                    }}
                    columns={columns}
                    dataSource={data}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: totalRows,
                        showSizeChanger: true,
                    }}
                    scroll={{ y: 400 }}
                    onChange={handleTableChange}
                    rowKey={(record) => record.id} // Asegúrate de que cada fila tenga una key única
                />
            </Spin>
        </div>
    );
};

export default TableMotivo;
