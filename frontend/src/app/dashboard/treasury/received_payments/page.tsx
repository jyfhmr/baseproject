import ButtonForm from '@/components/dashboard/ButtonForm';
import ButtonEcxel from '@/components/dashboard/ButtonEcxel';
import FilterContainer from '@/components/dashboard/FilterContainer';
import SetPageInfo from '@/components/dashboard/SetPageInfo';

import { getData } from '@/services';
import { AppstoreOutlined } from '@ant-design/icons';
import Table from './components/Table';

const moduleName = 'treasury/received_payments';

export interface DataTypeActions {
    id: number;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    provider_who_gets_the_payment: any
}

const page = async ({ searchParams }: any) => {
    const getList = await getData(moduleName, searchParams);
    const data: DataTypeActions[] = getList['data'];
    const totalRows: number = getList['totalRows'];

    var alteredData
    if(data?.length > 0){
         alteredData = data.map((item) => ({
            ...item,
            isProvider: item.provider_who_gets_the_payment ? 'SI' : 'NO',
        }));
    }
   

    console.log("LA DATA QUE VIENE DEL BACKEND PARA PAYMENTS RECIBIDOS", data)

    const pageName = 'Pagos Recibidos';
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Tesorería' }, { title: pageName }];

    const columns = [
        {
            title: 'ID',
            index: 'id',
            sorter: true,
            defaultSortOrder: 'descend',
            sortDirections: ['descend', 'ascend', 'descend'],
            fixed: 'left', width: 100,
        },
        {
            title: 'Estatus del Pago',
            index: 'paymentStatus',
            sorter: true,
            responsive: ['md'],
            type: 'object',
            property: 'status',
            fixed: 'left', width: 160,
        },
        { title: '¿Proveedor?', index: 'isProvider', width: 100, },
        { title: 'Nombre de Contraparte', index: 'name_of_counterparty', width: 200, },
        { title: 'Identificación de Contraparte', index: 'document_of_counterparty', width: 180, },
        {
            title: 'Moneda Usada',
            index: 'currencyUsed',
            responsive: ['md'],
            type: 'object',
            property: 'money',
            width: 120,
        },
        {
            title: 'Método de Pago Usado',
            index: 'payment_method',
            responsive: ['md'],
            type: 'object',
            property: 'method',
            width: 150,
        },
        { title: 'Monto', index: 'amountPaid', width: 120, },
        { title: 'Referencia de Pago', index: 'paymentReference', width: 200, },
        { title: 'Fecha de Pago', index: 'paymentDate', width: 200, type: 'date', },
        {
            title: 'Registrado por',
            index: 'user',
            responsive: ['md'],
            type: 'object',
            property: 'name',
            width: 200,
        },
        {
            title: 'Editado por',
            index: 'userUpdate',
            responsive: ['md'],
            type: 'object',
            property: 'name'
            , width: 200,
        },
        {
            title: 'Fecha actualización',
            index: 'updatedAt',
            responsive: ['md'],
            type: 'date', width: 200,
        },
        {
            title: 'Fecha registro',
            index: 'createdAt',
            responsive: ['md'],
            type: 'date', width: 200,
        },
        {
            title: 'Estatus', index: 'isActive',
            width: 100
            , fixed: 'right',
            type: 'boolean',
            options: [{
                true: 'Activo',
                value: true,
                title: 'Activo'
            },
            {
                false: 'Inactivo',
                value: false,
                title: 'Inactivo'
            }]
        },
        {
            title: 'Acciones',
            index: 'actions',
            fixed: 'right', width: 100,
            actions: [
                {
                    type: 'ver',
                },
                {
                    type: 'edit',
                    route: `/dashboard/${moduleName}/form/:id`,
                },
                {
                    type: 'changeStatus',
                },
            ],
        },
    ];

    return (
        <>
            <SetPageInfo pageName={pageName} iconPage={iconPage} breadCrumb={breadCrumb} />
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <ButtonForm module={'payments'} description={'Registrar Pago'} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end' }}>
                    <FilterContainer columns={columns} moduleName={moduleName} />
                    <ButtonEcxel moduleName={moduleName} searchParams={searchParams} />
                </div>
            </div>
            <Table
                columnsProp={columns}
                dataSource={alteredData}
                moduleName={moduleName}
                totalRows={totalRows}
            />
        </>
    );
};

export default page;
