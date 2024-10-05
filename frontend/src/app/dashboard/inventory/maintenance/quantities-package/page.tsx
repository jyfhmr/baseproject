import ButtonEcxel from '@/components/dashboard/ButtonEcxel';
import ButtonForm from '@/components/dashboard/ButtonForm';
import ButtonImporExcel from '@/components/dashboard/ButtonImporExcel';
import FilterContainer from '@/components/dashboard/FilterContainer';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import Table from '@/components/dashboard/Table';
import { getData } from '@/services';
import { AppstoreOutlined } from '@ant-design/icons';

const moduleName = 'inventory/maintenance/quantities-package';

export interface DataTypeActions {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}

const page = async ({ searchParams }: any) => {
    const getList = await getData(moduleName, searchParams);

    const data: DataTypeActions[] = getList['data'];
    const totalRows: number = getList['totalRows'];

    const pageName = 'Cantidades típicas';
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Inventario' }, { title: 'Mantenimiento' }, { title: pageName }];

    const columns = [
        {
            title: 'ID',
            index: 'id',
            sorter: true,
            defaultSortOrder: 'descend',
            sortDirections: ['descend', 'ascend', 'descend'],
        },
        { title: 'Código', index: 'code' },
        { title: 'Cantidad', index: 'name' },

        {
            title: 'Registrado por',
            index: 'user',
            responsive: ['md'],
            type: 'object',
            property: 'name',
        },
        {
            title: 'Fecha registro',
            index: 'createdAt',
            responsive: ['md'],
            type: 'date',
        },
        {
            title: 'Editado por',
            index: 'userUpdate',
            responsive: ['md'],
            type: 'object',
            property: 'name',
        },

        {
            title: 'Fecha actualización',
            index: 'updatedAt',
            responsive: ['md'],
            type: 'date',
        },
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
                <ButtonForm module="quantities-package" description={'Nueva cantidad'} />
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px',
                        alignItems: 'flex-end',
                    }}
                >
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

export default page;
