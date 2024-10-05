import ButtonForm from '@/components/dashboard/ButtonForm';
import ButtonEcxel from '@/components/dashboard/ButtonEcxel';
import FilterContainer from '@/components/dashboard/FilterContainer';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import Table from '@/components/dashboard/Table';
import { getData } from '@/services';
import { AppstoreOutlined } from '@ant-design/icons';

const moduleName = 'config/administrative/rates2_ranges';

export interface DataTypeActions {
    id: number;
    value: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    maximumAmountPaid: any
}

const page = async ({ searchParams }: any) => {
    const getList = await getData(moduleName, searchParams);
    const data: DataTypeActions[] = getList['data'];
    const totalRows: number = getList['totalRows'];

    console.log("la data",data)
    console.log(getList);

    //realmente es 99999999999999.0000
    for(let ranges of data){if(ranges.id === 3){ ranges.maximumAmountPaid = "En adelante"}}

    const pageName = 'Tasa 2, Personas Jurídicas no Domiciliadas';
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
        { title: 'Valor Mínimo Pagado UT', index: 'minimumAmountPaid', width: 200, },
        { title: 'Valor Máximo Pagado UT', index: 'maximumAmountPaid', width: 200, },
        { title: 'Porcentaje Retenido', index: 'retentionPorcentage', width: 200, },
        { title: 'Sustraendo UT', index: 'sustractingUT', width: 200, },
        { title: 'Sustraendo Bs', index: 'sustractingBs', width: 200, },
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
            index: 'updatedAt',
            responsive: ['md'],
            type: 'date', width: 200,
        },
        {
            title: 'Fecha registro',
            index: 'createdAt',
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
                <ButtonForm module={'rates2_ranges'} description={'Crear Nuevo Rango'} />
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
