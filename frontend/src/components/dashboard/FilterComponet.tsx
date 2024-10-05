'use client';
import { useState } from 'react';
import { Form, Input, DatePicker, Select, Button } from 'antd';
import type { DrawerProps } from 'antd';
import { Drawer } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

const FilterComponent = ({ columns, onFilter }: any) => {
    const [form] = Form.useForm();

    const handleFinish = (values: any) => {
        onFilter(values);
    };

    const handleReset = () => {
        form.resetFields();
    };

    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState<DrawerProps['placement']>('left');

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };


    const renderInput = (column: any) => {
        switch (column.type) {
            case 'date':
                return <RangePicker format="YYYY-MM-DD" />;
            case 'boolean':
                return (
                    <Select placeholder='Filtrar por estatus'>
                        {column.options.map((option: any) => (
                            <Option key={option.value} value={option.value}>
                                {option.title}
                            </Option>
                        ))}
                    </Select>
                );
            default:
                return <Input placeholder={`Filtrar por ${column.title}`} />;
        }
    };

    const filteredColumns = columns.filter((column: any) =>
        !['actions', 'file', "color"].includes(column.index)
    );

    return (
        <div>
            <Button type="primary" onClick={showDrawer}>
                <EyeOutlined /> <b>Mostrar filtros</b>
            </Button>
            <Drawer
                size={'large'}
                title="FILTRO"
                placement={placement}
                closable={false}
                onClose={onClose}
                open={open}
                key={placement}
            >
                <Form form={form} onFinish={handleFinish} layout="vertical" style={{ marginTop: 20 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {filteredColumns.map((column: any) => (
                            <Form.Item
                                key={column.index}
                                name={column.index}
                                label={column.title}
                                style={{ flex: '0 0 200px', marginRight: '10px', marginBottom: '10px' }}
                            >
                                {renderInput(column)}
                            </Form.Item>
                        ))}
                    </div>
                    <Button type="primary" onClick={onClose} htmlType="submit" style={{ marginRight: '10px' }}>
                        Filtrar
                    </Button>
                    <Button type="default" htmlType="submit" onClick={handleReset}>
                        Limpiar Filtros
                    </Button>
                </Form>
            </Drawer>
        </div>
    );
};

export default FilterComponent;

