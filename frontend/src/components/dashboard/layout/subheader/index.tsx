'use client';

import usePage from '@/hooks/usePage';
import { Breadcrumb, BreadcrumbProps, ConfigProvider, theme } from 'antd';
import { Header } from 'antd/es/layout/layout';

const SubHeader = () => {
    const { pageName, iconPage, breadCrumb } = usePage();
    const {
        token: { borderRadiusLG },
    } = theme.useToken();

    return (
        <ConfigProvider
            theme={{
                components: {
                    Layout: {
                        headerHeight: 50,
                        headerBg: '#fff',
                    },
                },
            }}
        >
            <Header
                style={{
                    margin: '20px 16px 0px',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <h3>
                    {iconPage}
                    <span style={{ marginLeft: '10px' }}>{pageName}</span>
                </h3>

                <Breadcrumb items={breadCrumb} />
            </Header>
        </ConfigProvider>
    );
};

export default SubHeader;
