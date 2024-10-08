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
        </ConfigProvider>
    );
};

export default SubHeader;
