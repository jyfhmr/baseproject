import ButtonEcxel from '@/components/dashboard/ButtonEcxel';
import ButtonForm from '@/components/dashboard/ButtonForm';
import FilterContainer from '@/components/dashboard/FilterContainer';
import TableProviders from '@/components/dashboard/providers/TableProvider';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import { getData } from '@/services';
import { AppstoreOutlined } from '@ant-design/icons';

const moduleName = 'masters/providers';

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

    const pageName = 'Proveedores';
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Maestros' }, { title: pageName }];

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
        { title: 'Razón Social', index: 'businessName', width: 200 },
        { title: 'Nombre Comercial', index: 'tradeName', width: 200 },
        {
            title: 'Estado',
            index: 'city',
            responsive: ['md'],
            type: 'object',
            property: 'state.name',
            width: 200,
        },
        {
            title: 'Ciudad',
            index: 'city',
            responsive: ['md'],
            type: 'object',
            property: 'name',
            width: 200,
        },
        {
            title: 'Tipo de Contribuyente',
            index: 'taxpayer',
            responsive: ['md'],
            type: 'object',
            property: 'name',
            width: 200,
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
            width: 150,
            fixed: 'right',
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
                {
                    type: 'download',
                },
            ],
        },
    ];

    return (
        <>
            <SetPageInfo pageName={pageName} iconPage={iconPage} breadCrumb={breadCrumb} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <ButtonForm module={'providers'} description={'Nuevo Proveedor'} />
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px',
                        alignItems: 'flex-end',
                    }}
                >
                    <FilterContainer columns={columns} moduleName={moduleName} />
                    <ButtonEcxel moduleName={moduleName} searchParams={searchParams} />
                </div>
            </div>
            <TableProviders
                columnsProp={columns}
                dataSource={data}
                moduleName={moduleName}
                totalRows={totalRows}
            />
        </>
    );
};

export default page;
