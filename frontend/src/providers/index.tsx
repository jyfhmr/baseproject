'use client';
import { PageProvider } from '@/contexts/PageProvider';
import { ProfileProvider } from '@/contexts/ProfileProvider';
import { SessionProvider } from 'next-auth/react';
import { ConfigProvider } from 'antd';
import es_ES from 'antd/es/locale/es_ES';

const Providers = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <SessionProvider>
            <PageProvider>
                <ProfileProvider>
                    <ConfigProvider locale={es_ES}>{children}</ConfigProvider>
                </ProfileProvider>
            </PageProvider>
        </SessionProvider>
    );
};

export default Providers;
