'use client';
import { DataTypeActions } from '@/app/dashboard/config/actions/page';
import { formatDate, getPropertyOnObj } from '@/helpers';
import useProfile from '@/hooks/useProfile';
import { changeExchangeRate, changeStatus, getOne } from '@/services';
import { EditOutlined, RetweetOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import {
    Col,
    InputRef,
    PaginationProps,
    Row,
    Table as TableAnt,
    TableProps,
    Tag,
    Tooltip,
} from 'antd';
import { FilterDropdownProps, TablePaginationConfig } from 'antd/es/table/interface';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import './table.css';
import ModalPayment from './ModalPayment';

type DataIndex = keyof DataTypeActions;

const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
    if (type === 'prev') return <a>{'<'}</a>;
    if (type === 'next') return <a>{'>'}</a>;
    return originalElement;
};

const Table = ({ columnsProp, dataSource, moduleName, totalRows, expandable }: any) => {
    const router = useRouter();
    const searchInput = useRef<InputRef>(null);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const params = new URLSearchParams(searchParams);
    const { actions } = useProfile() as any;
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState<any>(null);
    useEffect(() => {
        setLoading(false);
    }, [dataSource]);

    const handleChangeStatus = async (id: number) => {
        await changeStatus(id, moduleName);
        toast.success(`Cambio de estatus realizado con éxito`);
    };

    const handleWiew = async (id: number) => {
        console.log("asdsad")

        const get = await getOne(moduleName, id);

        console.log("el get cuando presiono el ojo", get)

        setPaymentInfo(get);
        if(get){
            setIsModalOpen(true)
        }
       ;
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setPaymentInfo(null);
    };

    const columns: TableProps['columns'] = columnsProp.map((item: any) => {
        item.dataIndex = item.index;
        item.key = item.index;

        item.type === 'date' && (item.render = (value: any) => formatDate(value));
        item.type === 'object' &&
            (item.render = (value: any) => getPropertyOnObj(item.property, value));

        if (item.dataIndex === 'isActive') {
            item.render = (value: any) => {
                let color = value ? 'green' : 'volcano';

                return (
                    <Tag color={color} key={value}>
                        {value == 1 ? 'ACTIVO' : 'INACTIVO'}
                    </Tag>
                );
            };
        }




        if (item.dataIndex === 'paymentStatus') {
            item.render = (status: any) => {
                // Asegúrate de que `status` tenga la propiedad `color` y `status` (texto)
                const color = status?.color || 'default'; // Si no hay color, usa 'default'
                const statusText = status?.status || 'Desconocido'; // Muestra un texto si no hay estado

                return (
                    <Tag color={color} style={{ width: "100%", textAlign: "center" }}>
                        <span style={{ color: "black", fontWeight: "bolder" }}>      {statusText} </span>

                    </Tag>
                );
            };
        }


        if (item.dataIndex === 'actions') {
            item.render = (_: any, record: any) => (
                <>
                    {item.actions.map((action: any, index: number) => (
                        <span key={`${record.id}-${index}`}>


                            {action.type === 'ver' && (
                                <Tooltip title="Vista previa">
                                    <EyeOutlined
                                        style={{ marginRight: '10px' }}
                                        onClick={() => handleWiew(record.id)}
                                    />
                                </Tooltip>
                            )}

                            {action.type === 'edit' && actions.includes(3) && record.paymentStatus?.id !== 2 && (
                                <Tooltip title="Editar">
                                    <EditOutlined
                                        style={{ marginRight: '10px' }}
                                        onClick={() =>
                                            router.push(action.route.replace(':id', record.id))
                                        }
                                    />
                                </Tooltip>
                            )}

                            {action.type === 'changeStatus' && actions.includes(4) && (
                                <Tooltip title="Cambiar Estatus">
                                    <RetweetOutlined
                                        onClick={() => handleChangeStatus(record.id)}
                                    />
                                </Tooltip>
                            )}
                            {action.type === 'delete' && actions.includes(4) && (
                                <Tooltip title="Eliminar">
                                    <DeleteOutlined onClick={() => handleChangeStatus(record.id)} />
                                </Tooltip>
                            )}
                        </span>
                    ))}
                </>
            );
        }


        item.dataIndex !== 'actions' &&
            (item = {
                ...item,
                // ...getColumnSearchProps(item.dataIndex, item.title),
            });

        return item;
    });

    const onChange: TableProps['onChange'] = (pagination, _, sorter: any) => {
        params.set('order', sorter.order === 'descend' ? 'DESC' : 'ASC');
        params.set('page', pagination.current?.toString() as string);
        params.set('rows', pagination.pageSize?.toString() as string);
        router.replace(`${pathname}?${params.toString()}`);
    };

    const paginationOptions: TablePaginationConfig = {
        current: searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1,
        pageSize: searchParams.get('rows') ? parseInt(searchParams.get('rows') as string) : 5,
        pageSizeOptions: [5, 10, 25, 50, 100],
        total: totalRows,
        showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} registros`,
        itemRender,
        showSizeChanger: true,
        size: 'default',
    };


    return (
        <Row style={{ marginTop: '40px' }}>
            <Col span={24}>
                <div className="custom-scrollbar">
                    <TableAnt
                        loading={loading}
                        columns={columns}
                        dataSource={dataSource}
                        rowKey={(record) => record.id} // Asegúrate de que cada fila tenga una key única
                        size="middle"
                        scroll={{ x: 1500, y: 300 }}
                        pagination={paginationOptions}
                        onChange={onChange}
                        expandable={
                            expandable
                                ? {
                                    expandedRowRender: (record) => (
                                        <p style={{ margin: 0 }}>
                                            {record.description || 'No disponible'}
                                        </p>
                                    ),
                                    rowExpandable: (record) => !!record.description,
                                }
                                : undefined
                        }
                    />
                </div>
                {isModalOpen && (
                    <ModalPayment
                        paymentInfo={paymentInfo}
                        isOpen={isModalOpen}
                        onClose={handleModalClose}
                    />
                )}
            </Col>
        </Row>
    );
};

export default Table;
