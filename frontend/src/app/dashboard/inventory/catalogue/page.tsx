import ButtonEcxel from '@/components/dashboard/ButtonEcxel';
import ButtonForm from '@/components/dashboard/ButtonForm';
import ButtonImporExcel from '@/components/dashboard/ButtonImporExcel';
import FilterContainer from '@/components/dashboard/FilterContainer';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import Table from '@/components/dashboard/Table';
import { getData } from '@/services';
import { AppstoreOutlined } from '@ant-design/icons';

const moduleName = 'inventory/catalogue';

export interface DataTypeActions {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    description?: string;
    subCategory?: {
        name: string;
        category: {
            name: string;
        };
    }; // Añade esta propiedad para el contenido expandido
}

const page = async ({ searchParams }: any) => {
    const getList = await getData(moduleName, searchParams);

    const data: DataTypeActions[] = getList['data'];
    const totalRows: number = getList['totalRows'];

    const pageName = 'Catálogo de productos';
    const iconPage = <AppstoreOutlined />;
    const breadCrumb = [{ title: 'Inventario' }, { title: pageName }];

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
        { title: 'Codígo', index: 'code', width: 200, fixed: 'left' },
        { title: 'Procducto', index: 'name', width: 200, fixed: 'left' },
        {
            title: 'Categoría',
            index: 'category',
            width: 200,
            fixed: 'left',
        },
        {
            title: 'Sub Categoria',
            index: 'subCategory',
            responsive: ['md'],
            type: 'object',
            property: 'name',
            width: 200,
        },
        {
            title: 'Codigo de barras',
            index: 'barcode',
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
                <ButtonForm module="catalogue" description={'Nuevo Producto'} />
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
                expandable={true} // Aquí decides si la tabla debe ser expandible
            />
        </>
    );
};

export default page;
