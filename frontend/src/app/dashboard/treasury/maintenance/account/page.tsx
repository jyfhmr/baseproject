import ButtonForm from '@/components/dashboard/ButtonForm';
import ButtonEcxel from '@/components/dashboard/ButtonEcxel';
import FilterContainer from '@/components/dashboard/FilterContainer';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import Table from '@/components/dashboard/Table';
import { getData } from '@/services';
import { AppstoreOutlined } from '@ant-design/icons';

const moduleName = 'treasury/maintenance/account';

export interface DataTypeActions {
    id: number;
    nameAccount: string;
    typeAccount: string;
    description: string;
    bank: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    commissions: Object
}

const page = async ({ searchParams }: any) => {

    const getList = await getData(moduleName, searchParams);
    const data: DataTypeActions[] = getList['data'];

    console.log("la data de getAllCuentas",data)
    data.forEach(account => {
        console.log(`Cuenta ID: ${account.id}`);
        console.log("Comisiones:", JSON.stringify(account.commissions, null, 2)); // Mostrar comisiones con JSON.stringify
    });
    const totalRows: number = getList['totalRows'];
    const pageName = 'Cuenta';
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
        { title: 'Nombre de cuenta', index: 'nameAccount', width: 200, },
        { title: 'Tipo de cuenta', index: 'typeAccount', width: 200, },
        { title: 'Descripción', index: 'description', width: 200, },
        { title: 'Banco', index: 'bank', responsive: ['md'],
            type: 'object',
            property: 'name',
            width: 200, },
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
            index: 'updateAt',
            responsive: ['md'],
            type: 'date', width: 200,
        },
        {
            title: 'Fecha registro',
            index: 'createAt',
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
                <ButtonForm module={'account'} description={'Nueva cuenta'} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end' }}>
                    <FilterContainer columns={columns} moduleName={moduleName} />
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

export default page;
