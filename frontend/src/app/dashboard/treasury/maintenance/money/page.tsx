import ButtonForm from '@/components/dashboard/ButtonForm';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import Table from '@/components/dashboard/Table';
import { getData } from '@/services';
import { AppstoreOutlined } from '@ant-design/icons';
import ButtonEcxel from '@/components/dashboard/ButtonEcxel';
import ButtonImporExcel from '@/components/dashboard/ButtonImporExcel';
import FilterContainer from '@/components/dashboard/FilterContainer';

const moduleName = 'treasury/maintenance/money';

export interface DataTypeActions {
    id: number;
    money: string;
    symbol: string;
    file: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}

const MoneyPage = async ({ searchParams }: any) => {

    const getList = await getData(moduleName, searchParams);
    const data: DataTypeActions[] = getList['data'];
    const totalRows: number = getList['totalRows'];

    const pageName = 'Moneda';
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Maestros' }, { title: pageName }];

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
            title: 'Moneda',
            index: 'money'
        },
        {
            title: 'Simbolo',
            index: 'symbol'
        },
        {
            title: 'Logo',
            index: 'file',
        },
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
            title: 'Fecha registro',
            index: 'createAt',
            responsive: ['md'],
            type: 'date'
        },
        {
            title: 'Fecha actualización',
            index: 'updateAt',
            responsive: ['md'],
            type: 'date',
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
            index: 'actions', fixed: 'right', width: 100,
            actions: [
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
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <ButtonForm module={'money'} description={'Nueva Moneda'} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end' }}>
                    <FilterContainer columns={columns} moduleName={moduleName} />
                    <ButtonImporExcel moduleName={moduleName} />
                    <ButtonEcxel moduleName={moduleName} searchParams={searchParams} />
                </div>
            </div>
            <Table
                columnsProp={columns}
                dataSource={data}
                moduleName={moduleName}
                totalRows={totalRows}
            />
        </>
    );
};

export default MoneyPage;