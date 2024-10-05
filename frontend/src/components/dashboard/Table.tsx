'use client';
import { DataTypeActions } from '@/app/dashboard/config/actions/page';
import { formatDate, getPropertyOnObj } from '@/helpers';
import useProfile from '@/hooks/useProfile';
import { changeExchangeRate, changeStatus } from '@/services';
import { EditOutlined, RetweetOutlined, DeleteOutlined, FilePdfFilled } from '@ant-design/icons';
import socket from '@/services/socketconn';
import { getData } from '@/services';
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
import './style/table.css';
import axios from 'axios';

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

    useEffect(() => {
        setLoading(false);
    }, [dataSource]);

    const handleChangeStatus = async (id: number) => {
        await changeStatus(id, moduleName);
        toast.success(`Cambio de estatus realizado con éxito`);
    };

    const downloadPdf = async (id: any) => {
        try {
            // Pasar el dataProvider.id en la URL
            const url = `${process.env.NEXT_PUBLIC_URL_API}/${moduleName}/generate-from-html/${id}`;

            // Realizar la solicitud GET para obtener el PDF
            const response = await axios.get(url, {
                responseType: 'blob', // Importante para recibir el archivo PDF como blob
            });
            console.log(response);

            // Crear una URL temporal para el blob del PDF
            const pdfUrl = window.URL.createObjectURL(new Blob([response.data]));

            // Crear un enlace para descargar el PDF
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.setAttribute('download', 'generated.pdf'); // Nombre del archivo PDF
            document.body.appendChild(link);
            link.click();

        } catch (error) {
            console.error('Error descargando el PDF:', error);
        }
    }

    const columns: TableProps['columns'] = columnsProp.map((item: any) => {
        item.dataIndex = item.index;
        item.key = item.index;

        item.type === 'date' && (item.render = (value: any) => formatDate(value));
        item.type === 'object' &&
            (item.render = (value: any) => getPropertyOnObj(item.property, value));

        if (item.dataIndex === 'isActive') {
            item.render = (value: any) => {
                console.log(value);
                let color = value ? 'green' : 'volcano';

                return (
                    <Tag color={color} key={value}>
                        {value == 1 ? 'ACTIVO' : 'INACTIVO'}
                    </Tag>
                );
            };
        }
        console.log(item);
        if (item.type === 'statusNotecredit') {
            console.log(item.index);
            item.render = (value: any) => {
                console.log(value);
                let color = value ? 'green' : 'volcano';

                return (
                    <Tag color={color} key={value}>
                        {value == 1 ? 'CONFIRMADA' : 'NO CONFIRMADA'}
                    </Tag>
                );
            };
        }

        if (item.index === 'file') {
            item.render = (record: {
                startsWith(arg0: string): unknown;
                file: string | undefined;
                money: string | undefined;
            }) => {
                return record ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={
                            record.startsWith('http')
                                ? record.file
                                : `${process.env.NEXT_PUBLIC_URL_IMAGE}uploads/money/${record}`
                        }
                        alt={record.money}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '100%',
                            objectFit: 'cover',
                        }}
                    />
                ) : (
                    ' '
                );
            };
        }

        if (item.index === 'color') {
            item.render = (color: string) => (
                <div style={{ width: '20px', height: '20px', backgroundColor: color }} />
            );
        }

        if (item.dataIndex === 'paymentStatus') {
            item.render = (status: any) => {
                // Asegúrate de que `status` tenga la propiedad `color` y `status` (texto)
                const color = status?.color || 'default'; // Si no hay color, usa 'default'
                const statusText = status?.status || 'Desconocido'; // Muestra un texto si no hay estado

                return (
                    <Tag color={color}>
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
                            {action.type === 'edit' && actions.includes(3) && (record.statusDebit == null ? record.statusDebit == null : record.statusDebit == false) && (
                                <Tooltip title="Editar">
                                    <EditOutlined
                                        style={{ marginRight: '10px' }}
                                        onClick={() =>
                                            router.push(action.route.replace(':id', record.id))
                                        }
                                    />
                                </Tooltip>
                            )}

                            {action.type === 'changeStatus' && actions.includes(4) && (record.statusDebit == null ? record.statusDebit == null : record.statusDebit == false) && (
                                <Tooltip title="Cambiar Estatus">
                                    <RetweetOutlined
                                        style={{ marginRight: '10px' }}
                                        onClick={() => handleChangeStatus(record.id)}
                                    />
                                </Tooltip>
                            )}
                            {action.type === 'delete' && actions.includes(4) && (
                                <Tooltip title="Cambiar Estatus">
                                    <DeleteOutlined onClick={() => handleChangeStatus(record.id)} />
                                </Tooltip>
                            )}
                            {action.type === 'download' && actions.includes(3) && record.statusDebit == true && (
                                <Tooltip title="Descargar pdf">
                                    <FilePdfFilled
                                        style={{ marginRight: '10px' }}
                                        onClick={() => { downloadPdf(record.id) }}
                                    />
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

    useEffect(() => {
        const handleSuccessChange = async (data: any) => {
            console.log('TASA CAMBIADA CON ÉXITO DESDE LAYOUT', data);
            await changeExchangeRate(moduleName);
        };

        socket.on('successExchangeChange', handleSuccessChange);

        return () => {
            socket.off('successExchangeChange', handleSuccessChange);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

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
            </Col>
        </Row>
    );
};

export default Table;
