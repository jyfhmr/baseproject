import ButtonEcxel from '@/components/dashboard/ButtonEcxel';
import ButtonForm from '@/components/dashboard/ButtonForm';
import FilterContainer from '@/components/dashboard/FilterContainer';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import Table from '@/components/dashboard/Table';
import { getData } from '@/services';
import { AppstoreOutlined } from '@ant-design/icons';


const moduleName = 'config/users';

export interface DataTypeActions {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    profile: string;
}

const page = async ({ searchParams }: any) => {
    const getList = await getData(moduleName, searchParams);
    const data: DataTypeActions[] = getList['data'];
    const totalRows: number = getList['totalRows'];

    const pageName = 'Usuarios';
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Usuarios' }, { title: 'Usuarios' }];

    const columns = [
        {
            title: 'ID',
            index: 'id',
            sorter: true,
            defaultSortOrder: 'descend',
            sortDirections: ['descend', 'ascend', 'descend']
            , width: 100,
            fixed: 'left',
        },
        {
            title: 'Nombre de Usuario', index: 'name'
            , width: 200
        },
        {
            title: 'Correo electrónico', index: 'email'
            , width: 200
        },
        {
            title: 'Rol',
            index: 'profile',
            type: 'object',
            property: 'name',
            responsive: ['md']
            , width: 200
        },
        {
            title: 'Fecha Creación',
            index: 'createdAt',
            responsive: ['md'],
            type: 'date'
            , width: 200
        },
        {
            title: 'Fecha Actualización',
            index: 'updatedAt',
            responsive: ['md'],
            type: 'date'
            , width: 200
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
            index: 'actions'
            , width: 100, fixed: 'right',
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
            {/*TODO: hacer un componente diferente que haga una redireccion */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <ButtonForm module={'users'} description={'Crear Usuario'} />
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
