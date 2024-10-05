import ButtonForm from '@/components/dashboard/ButtonForm';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import Table from '@/components/dashboard/Table';
import { getData } from '@/services';
import { AppstoreOutlined } from '@ant-design/icons';
import ButtonEcxel from '@/components/dashboard/ButtonEcxel';
import FilterContainer from '@/components/dashboard/FilterContainer';

const moduleName = 'treasury/maintenance/exchange_rate';

export interface DataTypeActions {
    id: number;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}

const MoneyPage = async ({ searchParams }: any) => {
    const getList = await getData(moduleName, searchParams);
    const data: DataTypeActions[] = getList['data'];
    const totalRows: number = getList['totalRows'];
    const pageName = 'Tasas de Cambio';
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Administrativo' }, { title: pageName }];

    const columns = [
        {
            title: 'ID',
            index: 'id',
            sorter: true,
            defaultSortOrder: 'descend',
            sortDirections: ['descend', 'ascend', 'descend'],
            fixed: 'left',
            width: 100,
        },
        {
            title: 'Moneda de Referencia',
            index: 'currencyId',
            responsive: ['md'],
            type: 'object',
            property: 'money',
            width: 200,
        },
        {
            title: 'Moneda transformada',
            index: 'exchangeToCurrency',
            responsive: ['md'],
            type: 'object',
            property: 'money',
            width: 200,
        },
        { title: 'Tasa de cambio', index: 'exchange', width: 200 },
        {
            title: 'Registrado por',
            index: 'user',
            responsive: ['md'],
            type: 'object',
            property: 'name',
            width: 200,
        },
        { title: 'Fecha registro', index: 'createdAt', responsive: ['md'], type: 'date', width: 200 },
        {
            title: 'Estatus',
            index: 'isActive',
            width: 100,
            fixed: 'right',
            type: 'boolean',
            options: [
                {
                    true: 'Activo',
                    value: true,
                    title: 'Activo',
                },
                {
                    false: 'Inactivo',
                    value: false,
                    title: 'Inactivo',
                },
            ],
        },
        {
            title: 'Acciones',
            index: 'actions',
            width: 100,
            fixed: 'right',
            actions: [
                /*
                {
                    type: 'edit',
                    route: `/dashboard/${moduleName}/form/:id`,
                },
                */
                {
                    type: 'changeStatus',
                },
            ],
        },
    ];

    return (
        <>
            <SetPageInfo pageName={pageName} iconPage={iconPage} breadCrumb={breadCrumb} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <ButtonForm module="exchange_rate" description="Crear Tasa de Cambio" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end' }}>
                    <FilterContainer columns={columns} moduleName={moduleName} />
                    <ButtonEcxel moduleName={moduleName} searchParams={searchParams} />
                </div>
            </div>
            <Table columnsProp={columns} dataSource={data} moduleName={moduleName} totalRows={totalRows} />
        </>
    );
};

export default MoneyPage;
