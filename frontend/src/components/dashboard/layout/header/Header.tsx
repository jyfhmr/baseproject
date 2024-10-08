"use client";
import React, { useContext, useEffect, useState } from 'react';
import { Button, Dropdown, Layout, notification, Space, theme } from 'antd';
import {
    LeftOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    RightOutlined,
} from '@ant-design/icons';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import socket from '@/services/socketconn';
import { toast } from 'react-toastify';
import { ExchangeRateContext } from '../../ExchangeRateContext';
import { getOne, getLastExchangeRates } from '@/services'; // Asegúrate de importar las funciones necesarias
import AccountDrawer from '@/app/dashboard/accountManagment/AccountMagment';
import type { NotificationArgsProps } from 'antd';

type NotificationPlacement = NotificationArgsProps['placement'];
const { Header } = Layout;

const Context = React.createContext({ name: 'Default' });

const HeaderComponent = ({ collapsed, toggleCollapse, onCollapsedChange, efectButton, isReversed }: any) => {




    const exchangeRateContext = useContext(ExchangeRateContext);
    const { exchangeRates, setExchangeRates } = exchangeRateContext || { exchangeRates: [], setExchangeRates: () => { } };
    const { data } = useSession() as any;
    const router = useRouter();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [userData, setUserData] = useState(null) as any;

    const handleButtonClick = () => {
        toggleCollapse();
        console.log('Button clicked');
    };

    useEffect(() => {
        onCollapsedChange(collapsed);
    }, [collapsed, onCollapsedChange]);

    useEffect(() => {
        if (data?.user?.userId) {
            getUserData(data.user.userId).then((response) => {
                setUserData(response);
            });
        }
    }, [data?.user?.userId]);

    async function getUserData(userId: number) {
        const user = await getOne('config/users', userId);
        return user;
    }

   

    const getActualRates = async (fromSocket?:any) => {

        if(fromSocket){
            console.log("actualizando desde socket el header")
            const rates = await getLastExchangeRates();
            setExchangeRates(rates);
            return
        }

        if (setExchangeRates) {
            const rates = await getLastExchangeRates();
            console.log("ACTUALIZANDO HEADER")
            setExchangeRates(rates);
        }
    };

    useEffect(() => {
        getActualRates();

        const handleConnect = () => {
            console.log('Connected to server');
            getActualRates(true)
        };

        const handleErrorSendingEmail = (data: any) => {
            console.log("No se pudo enviar el correo", data)
            console.log(" user data", userData)
            if (data === "jyfhmr@gmail.com") {
                console.log("abriendo modal")
                toast.warning("El sistema le informa que no pudo actualizar la tasa automáticamente, chequee de manera manual")
            }
        }

        const handleSuccessChange = (data: any) => {
            console.log("TASA CAMBIADA CON ÉXITO", data);
            toast.success("Tasa actualizada con éxito directamente desde el BCV");

            const parsedData = JSON.parse(data);
            if (setExchangeRates) {
                setExchangeRates((prevRates: any) => {
                    const updatedRates = [...prevRates];
                    if (parsedData.currency === 'USD') {
                        updatedRates[0] = { ...updatedRates[0], exchange: parsedData.rate };
                    } else if (parsedData.currency === 'EUR') {
                        updatedRates[1] = { ...updatedRates[1], exchange: parsedData.rate };
                    }
                    return updatedRates;
                });
            }
        };

        socket.on('connect', handleConnect);
        socket.on("successExchangeChange", handleSuccessChange);
        socket.on("failedwhensendingemail", handleErrorSendingEmail)

        return () => {
            socket.off('connect', handleConnect);
            socket.off("successExchangeChange", handleSuccessChange);
            socket.off("failedwhensendingemail", handleErrorSendingEmail)
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setExchangeRates]);



    const items: any = [
        // Items del menú
    ];

    return (
        <Header
            className={isReversed ? 'header-style-row' : 'header-style-rowRever'}
            style={{
                margin: '15px 15px 0px 15px',
                padding: '0px 5px',
                background: '#fff',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'space-between',
            }}
        >
            <div className="Header_1">
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                    onClick={handleButtonClick}
                    style={{
                        fontSize: '16px',
                        width: 64,
                        height: 64,
                        color: 'black'
                    }}
                />
                <Button
                
                    type="text"
                    icon={isReversed ? <RightOutlined /> : <LeftOutlined />}
                    onClick={efectButton}
                    className={isReversed ? 'efectButtonOnRever' : 'efectButtonOffRever'}
                />
            </div>

            <div className="Header_2" style={{ cursor: 'pointer', marginRight: "10px" }}>
                <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
                    <div>
                        <AccountDrawer userData={userData}>
                            <span style={{ marginLeft: '15px', fontWeight: 600, color:'black' }}>
                                {userData?.name}
                            </span>
                        </AccountDrawer>
                    </div>
                </Dropdown>
            </div>

        </Header>
    );
};

export default HeaderComponent;
