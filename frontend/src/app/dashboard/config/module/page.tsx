import ButtonEcxel from '@/components/dashboard/ButtonEcxel';
import ButtonForm from '@/components/dashboard/ButtonForm';
import FilterContainer from '@/components/dashboard/FilterContainer';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import Table from '@/components/dashboard/Table';
import { getData } from '@/services';
import { AppstoreOutlined } from '@ant-design/icons';

const moduleName = 'config/module';

export interface DataTypeActions {
    id: number;
    name: string;
    color: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}

const page = async ({ searchParams }: any) => {
    const getList = await getData(moduleName, searchParams);
    const data: DataTypeActions[] = getList['data'];
    const totalRows: number = getList['totalRows'];

    console.log(getList);

    const pageName = 'Modulos';
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Configuración' }, { title: pageName }];

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
            title: 'Nombre', index: 'name'
            , width: 200
        },
        {
            title: 'Color', index: 'color'
            , width: 200
        },
        {
            title: 'Descripcion', index: 'description'
            , width: 200
        },
        {
            title: 'Registrado por',
            index: 'user',
            responsive: ['md'],
            type: 'object',
            property: 'name'
            , width: 200
        },
        {
            title: 'Editado por',
            index: 'userUpdate',
            responsive: ['md'],
            type: 'object',
            property: 'name'
            , width: 200
        }, {
            title: 'Fecha registro',
            index: 'createAt',
            responsive: ['md'],
            type: 'date'
            , width: 200
        },
        {
            title: 'Fecha actualización',
            index: 'updateAt',
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
            , width: 100,
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
            <SetPageInfo
                pageName={pageName}
                iconPage={iconPage}
                breadCrumb={breadCrumb}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <ButtonForm module={'module'} description={'Nuevo modulo'} />
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
