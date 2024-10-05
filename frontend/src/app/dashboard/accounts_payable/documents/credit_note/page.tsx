import ButtonForm from '@/components/dashboard/ButtonForm';
import ButtonEcxel from '@/components/dashboard/ButtonEcxel';
import FilterContainer from '@/components/dashboard/FilterContainer';
import SetPageInfo from '@/components/dashboard/SetPageInfo';
import Table from '@/components/dashboard/Table';
import { getData } from '@/services';
import { AppstoreOutlined } from '@ant-design/icons';
import { Tag } from 'antd';

const moduleName = 'accounts_payable/documents/credit_note';

export interface DataTypeActions {
    id: number;
    company: string;
    // provedor
    companyName: string;
    address: string;
    lic: string;
    phone: string;
    creditDays: string;
    typePayment: string;
    // datos de nota de debito

    applyBook: string;
    module: string;
    numberCreditNote: string;
    controlNumber: string;
    createAtDebit: string;
    // tabla

    observation: string;
    discount: string;
    vat: string;
    exempt: string;
    exonerated: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}

const page = async ({ searchParams }: any) => {
    const getList = await getData(moduleName, searchParams);
    const data: DataTypeActions[] = getList['data'];
    const totalRows: number = getList['totalRows'];
    const pageName = 'Nota de credito';
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
            title: 'Empresa',
            index: 'company',
            responsive: ['md'],
            type: 'object',
            property: 'businessName',
            width: 200,
        },
        {
            title: 'Tipo de moneda',
            index: 'typeMoney',
            responsive: ['md'],
            type: 'object',
            property: 'money',
            width: 200,
        },
        {
            title: 'Estado',
            type: 'statusNotecredit',
            width: 150,
            index: 'statusDebit',
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
            width: 100, fixed: 'right',
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
                {
                    type: 'download',
                },
            ],
        },
    ];
    // console.log(data);
    return (
        <>
            <SetPageInfo pageName={pageName} iconPage={iconPage} breadCrumb={breadCrumb} />
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <ButtonForm module={'credit_note'} description={'Nota de credito'} />
                <div style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
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
