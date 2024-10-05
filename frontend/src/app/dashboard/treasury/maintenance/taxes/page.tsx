import ButtonForm from '@/components/dashboard/ButtonForm';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import Table from '@/components/dashboard/Table';
import { getData } from '@/services';
import { AppstoreOutlined } from '@ant-design/icons';
import ButtonEcxel from '@/components/dashboard/ButtonEcxel';
import FilterContainer from '@/components/dashboard/FilterContainer';

const moduleName = 'treasury/maintenance/taxes';

export interface DataTypeActions {
    id: number;
    name: string;
    typeTax: string;
    value: string;
    applicableCurrency: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}

const TaxesPage = async ({ searchParams }: any) => {

    const getList = await getData(moduleName, searchParams);
    const data: DataTypeActions[] = getList['data'];
    const totalRows: number = getList['totalRows'];
    const pageName = 'Impuestos';
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
            title: 'Nombre de Impuesto',
            index: 'name',
            width: 200,
        },
        {
            title: 'Tipo de Impuesto',
            index: 'typeTax',
            width: 200,
        },
        {
            title: 'Descripción',
            index: 'description',
            width: 200,
        },
        {
            title: 'Valor',
            index: 'value',
            width: 200,
        },
        {
            title: 'Moneda Aplicable',
            index: 'applicableCurrency',
            responsive: ['md'],
            type: 'object',
            property: 'money'
            , width: 200,
        },
          {
            title: 'Creado por',
            index: 'user',
            responsive: ['md'],
            type: 'object',
            property: 'name'
            , width: 200,
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
                <ButtonForm module={'taxes'} description={'Nuevo Impuesto'} />
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

export default TaxesPage;
