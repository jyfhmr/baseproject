import { Button, Input, Popover, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { DeleteFilled, EyeFilled } from '@ant-design/icons';
import { useState } from 'react';

interface DataType {
    id: number;
    module: string;
    transactionType: string;
    description: string;
}

export default function TableCreditNote({ dataMotive, setDataMotive, inputValues, setInputValues, moneySelected }: any) {

    const handleInputChange = (e: any, recordId: string) => {
        setInputValues({
            ...inputValues,
            [recordId]: e.target.value,
        });
    };

    const columns: TableColumnsType<DataType> = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: true,
            defaultSortOrder: 'descend',
            fixed: 'left',
            width: 50,
        },
        { title: 'Modulo', dataIndex: 'module', width: 100, },
        { title: 'Tipo de transacción', dataIndex: 'transactionType', width: 100, },
        { title: 'Descripcion', dataIndex: 'description', width: 100, },
        {
            title: 'Total',
            width: 100,
            render: (text: any, record: any) => (
                <Input
                    required
                    prefix={moneySelected?.sym} suffix={moneySelected?.name}
                    value={inputValues?.[record?.id] || ''} // Muestra el valor almacenado o vacío
                    onChange={(e) => handleInputChange(e, record.id)} // Maneja el cambio de cada input
                />
            ),
        },
        {
            title: 'Accion',
            dataIndex: 'id',
            width: 30,
            fixed: 'left',
            render: (text: any, record: any) => (
                <>
                    <div style={{ display: 'inline-flex', gap: '5px' }}>
                        <Button
                            color="danger"
                            size="small"
                            onClick={() => handleDeselect(record.id)}
                        >
                            <Popover content={record.module} title={'Eliminar'}>
                                <DeleteFilled style={{ cursor: 'pointer', color: 'red' }} />
                            </Popover>
                        </Button>
                    </div>
                </>
            ),
        },
    ];

    const handleDeselect = (id: number) => {
        console.log(inputValues?.[id]);
        delete inputValues[id]; // Elimina el input del objeto inputValues
        console.log(inputValues);
        let product = dataMotive;
        product = product.filter((el: any) => el.id != id);
        setDataMotive(product);
    };

    return (
        <Table pagination={false} columns={columns} dataSource={dataMotive} style={{ width: '100%' }} />
    )
}
