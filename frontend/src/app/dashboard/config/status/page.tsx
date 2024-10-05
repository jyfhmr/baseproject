import ButtonEcxel from '@/components/dashboard/ButtonEcxel';
import ButtonForm from '@/components/dashboard/ButtonForm';
import FilterContainer from '@/components/dashboard/FilterContainer';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import Table from '@/components/dashboard/Table';
import { getData } from '@/services';
import { AppstoreOutlined } from '@ant-design/icons';

const moduleName = 'config/status';

export interface DataTypeActions {
    id: number;
    status: string;
    module: string;
    color: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

const Page = async ({ searchParams }: any) => {

    const getList = await getData(moduleName, searchParams);
    const data: DataTypeActions[] = getList['data'];
    const totalRows: number = getList['totalRows'];

    const pageName = 'Estatus';
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Estatus' }, { title: 'Estatus' }];

   
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
            title: 'Nombre Del Estatus',
            index: 'status',
            width: 200,
        },
        {
            title: 'Módulo',
            index: 'module',
            width: 200,
        },
        {
            title: 'Color',
            index: 'color',
            width: 100,
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
            title: 'Fecha registro',
            index: 'createdAt',
            responsive: ['md'],
            type: 'date',
            width: 200,
        },
        {
            title: 'Editado por',
            index: 'userUpdate',
            responsive: ['md'],
            type: 'object',
            property: 'name',
            width: 200,
        },
        {
            title: 'Fecha actualización',
            index: 'updatedAt',
            responsive: ['md'],
            type: 'date',
            width: 200,
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
            width: 100,
            fixed: 'right',
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
                <ButtonForm module={'status'} description={'Nuevo Estatus'} />
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
                /*loading={loading}*/
            />
        </>
    );
};

export default Page;