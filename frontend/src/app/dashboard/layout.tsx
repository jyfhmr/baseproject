'use client';
import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme } from 'antd';
import { getOne } from '@/services';
import { useSession } from 'next-auth/react';
import * as Icons from '@ant-design/icons';
import Link from 'next/link';
import SubHeader from '@/components/dashboard/layout/subheader';
import { HeaderComponent } from '@/components/dashboard/layout/header';
import Image from 'next/image';
import './layout.css';
import useProfile from '@/hooks/useProfile';
import { redirect, usePathname, useRouter } from 'next/navigation';
import { ExchangeRateProvider } from '@/components/dashboard/ExchangeRateContext';
import { Icon } from 'next/dist/lib/metadata/types/metadata-types';
import type { MenuProps } from 'antd';

const { Sider, Content } = Layout;

const App = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const [collapsed, setCollapsed] = useState(false);
    const { data } = useSession() as Partial<any>;
    const iconMap: { [key: string]: JSX.Element } = {};
    const [ImgSidebar, setImgSidebar] = useState('none');
    const [contImgSidebar, setContImgSidebar] = useState('flex');
    const { actions } = useProfile() as any;
    const pathname = usePathname();

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    type MenuItem = {
        key: string | number;
        label: string | JSX.Element;
        icon?: string;
        children?: MenuItem[];
        route: string;
    };

    useEffect(() => {
        if (actions.length > 0) {
            if (
                (pathname.match(/form$/) && !actions.includes(2)) ||
                (pathname.match(/form/) && !actions.includes(3))
            ) {
                console.log('actions.includes(2)', actions.includes(2));
                redirect('/dashboard');
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions]);

    useEffect(() => {
        getMenu(data?.user?.profileId);
    }, [data]);

    const getMenu = async (id: number) => {
        try {
            if (id) {
                const get = await getOne('auth/menu', id);
                setMenu(get.menu);
            }
        } catch (error) {
            console.error(error);;
        }
    };
    Object.keys(Icons).forEach((key: any) => {
        iconMap[key] = React.createElement(Icons[key as keyof Icon]);
    });
    const [menu, setMenu] = useState([]);
    const handleCollapsedChange = (isCollapsed: any) => {
        setImgSidebar(isCollapsed);

        if (isCollapsed) {
            setContImgSidebar('dissapear_logo_Cont');
        } else {
            setContImgSidebar('sidebar_logocont');
        }
    };

    const transformMenuData = (menuData: MenuItem[]): MenuItem[] => {
        if (!menuData) {
            return [];
        }
        return menuData
            .map((item) => {
                if (item) {
                    const iconName = item.icon?.match(/<(\w+) \/>/)?.[1];
                    return {
                        ...item,
                        icon: iconName ? iconMap[iconName] : undefined,
                        children: item.children
                            ?.map((pag: any) => {
                                if (pag) {
                                    if (pag?.children?.length > 0) {
                                        return {
                                            ...pag,
                                            key: pag.key,
                                            label: pag.label,
                                            children: pag.children
                                                .map((child: any) => {
                                                    if (child) {
                                                        return {
                                                            key: child.key,
                                                            label: (
                                                                <Link
                                                                    href={child.route}
                                                                    key={child.key}
                                                                    rel="noopener noreferrer"
                                                                    className="hover-link"
                                                                >
                                                                    • {child.label}
                                                                </Link>
                                                            ),
                                                        };
                                                    }
                                                    return null;
                                                })
                                                .filter((child: any) => child !== null),
                                        };
                                    } else {
                                        return {
                                            key: pag.key,
                                            label: (
                                                <Link
                                                    href={pag.route}
                                                    key={pag.key}
                                                    rel="noopener noreferrer"
                                                    className="hover-link"
                                                >
                                                    • {pag.label}
                                                </Link>
                                            ),
                                        };
                                    }
                                }
                                return null;
                            })
                            .filter((pag) => pag !== null),
                    };
                }
                return null;
            })
            .filter((item) => item !== null) as MenuItem[];
    };

    const transformedMenu = transformMenuData(menu);

    const [isReversed, setIsReversed] = useState(true);

    const toggleFlexDirection = () => {
        setIsReversed(!isReversed);
    };

    interface LevelKeysProps {
        key?: string;
        children?: LevelKeysProps[];
    }

    const getLevelKeys = (items1: LevelKeysProps[]) => {
        const key: Record<string, number> = {};
        const func = (items2: LevelKeysProps[], level = 1) => {
            items2.forEach((item) => {
                if (item.key) {
                    key[item.key] = level;
                }
                if (item.children) {
                    func(item.children, level + 1);
                }
            });
        };
        func(items1);
        return key;
    };

    const levelKeys = getLevelKeys(transformedMenu as LevelKeysProps[]);

    const [stateOpenKeys, setStateOpenKeys] = useState(['2', '100']);

    const className = `${collapsed ? 'width-80' : 'width-250'} ${!collapsed ? (isReversed ? 'right' : 'left') : ''}`;

    const onOpenChange: MenuProps['onOpenChange'] = (openKeys) => {
        const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
        // open
        if (currentOpenKey !== undefined) {
            const repeatIndex = openKeys
                .filter((key) => key !== currentOpenKey)
                .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

            setStateOpenKeys(
                openKeys
                    // remove repeat key
                    .filter((_, index) => index !== repeatIndex)
                    // remove current level all child
                    .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
            );
        } else {
            // close
            setStateOpenKeys(openKeys);
        }
    };

    return (
        <ExchangeRateProvider>
            <Layout
                className={isReversed ? 'efectButtonOff' : 'efectButtonOn'}
                style={{ minHeight: '100vh', height: 'auto' }}
            >
                <Sider
                    className={className}
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                >
                    <Image
                        src="/img/Logo-GoPharma-Rif-Vector.png"
                        className={
                            ImgSidebar
                                ? 'animate__animated animate__fadeOut'
                                : 'animate__animated animate__fadeIn'
                        }
                        alt="gopharma-logo"
                        style={{ display: ImgSidebar ? 'none' : 'block' }}
                        width={200}
                        height={120}
                        quality={100}
                    />
                    <Image
                        src="/img/img.png"
                        className={
                            collapsed
                                ? 'animate__animated animate__fadeIn'
                                : 'animate__animated animate__fadeOut'
                        }
                        alt="gopharma-logo"
                        style={{ display: !ImgSidebar ? 'none' : 'block' }}
                        width={70}
                        height={50}
                        quality={100}
                    />
                    <Menu
                        theme="dark"
                        mode="inline"
                        // style={{overflow: 'hidden'}}
                        items={transformedMenu}
                        defaultSelectedKeys={['231']}
                        openKeys={stateOpenKeys}
                        onOpenChange={onOpenChange}
                    // style={{ width: 256 }}
                    />
                </Sider>
                <Layout>
                    <HeaderComponent
                        isReversed={isReversed}
                        efectButton={toggleFlexDirection}
                        collapsed={collapsed}
                        toggleCollapse={() => setCollapsed(!collapsed)}
                        onCollapsedChange={handleCollapsedChange} // Pasamos la función para manejar el cambio de collapsed
                    />

                    <SubHeader />
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </ExchangeRateProvider >
    );
};

export default App;
