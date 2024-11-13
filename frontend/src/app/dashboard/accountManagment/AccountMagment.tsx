import React, { useEffect, useState, useCallback } from 'react';
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    IdcardOutlined,
    TeamOutlined,
    ProfileOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Drawer, List, Space, message } from 'antd';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { sendResetPass } from '@/services';

const AccountDrawer: React.FC<{ children: any; userData: any }> = ({ children, userData }) => {
    const [open, setOpen] = useState(false);
    const [profileData, setProfileData] = useState([]) as any;
    const router = useRouter();

    const showDrawer: any = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (userData) {
            setProfileData([
                {
                    title: 'Nombre Completo',
                    description: userData.fullName,
                    icon: <UserOutlined />,
                },
                {
                    title: 'Nombre de Usuario',
                    description: userData.name,
                    icon: <ProfileOutlined />,
                },
                { title: 'Email', description: userData.email, icon: <MailOutlined /> },
                {
                    title: 'Número de Teléfono',
                    description: userData.phoneNumber,
                    icon: <PhoneOutlined />,
                },
                { title: 'DNI', description: userData.dni, icon: <IdcardOutlined /> },
                { title: 'Rol', description: userData.profile?.name, icon: <TeamOutlined /> },
            ]);
        }
    }, [userData]);

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push('/login');
    };

    const handleChangePass = useCallback(async () => {
        if (!userData || !userData.id) {
            message.error('User ID is not available');
            return;
        }

        console.log('User ID: ', userData.id);

        try {
            await sendResetPass(userData.id);
            message.success('¡Correo para cambio de contraseña enviado con éxito!');
        } catch (error) {
            console.error('Error in handleChangePass:', error);
            message.error('Ocurrió un error al enviar el correo, inténtalo más tarde');
        }
    }, [userData]);

    return (
        <>
            <div onClick={showDrawer} style={{ cursor: 'pointer',display:'flex', flexDirection: 'row',alignItems: 'center' }}>
                <Avatar size={45} icon={<UserOutlined />}></Avatar>
                {children}
            </div>

            <Drawer
                title="Información de Perfil"
                width={720}
                onClose={onClose}
                open={open}
                style={{ paddingBottom: 80 }}
                extra={
                    <Space>
                        <Button onClick={handleSignOut}>Cerrar Sesión</Button>
                        <Button type="primary" onClick={handleChangePass} style={{backgroundColor: "#cf286a"}}>
                            Cambiar Contraseña
                        </Button>
                    </Space>
                }
            >
                <List
                    itemLayout="horizontal"
                    dataSource={profileData}
                    renderItem={(item: any) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar icon={item.icon} />}
                                title={item.title}
                                description={item.description}
                            />
                        </List.Item>
                    )}
                />
            </Drawer>
        </>
    );
};

export default AccountDrawer;
