"use client"
import { Button, Form, FormProps, Input, message } from 'antd';
import React, { useState } from 'react'
import "./create_new_password.css"
import Image from 'next/image';

export default function CreateNewPassword() {

    const [messageApi, contextHolder] = message.useMessage();

    function sendTokenForNewPassword(email: string) {
        console.log("setting new password to", email)
        messageApi.open({
            type: 'success',
            content: 'Cambiando contraseña',
        });
    }


    type FieldType = {
        password1: string;
        password2: string;
    };

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);


        if (values["password1"] != values["password2"]) {
            messageApi.open({
                type: 'error',
                content: 'Las contraseñas no coinciden',
            });
            return
        }

        sendTokenForNewPassword(values["password1"])

    };


    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    return (
        <>
            <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                className='create_new_password_form'
            >

                <div className='create_new_password_logoForResponsive'>
                    <Image
                        src="/assets/logo.png"
                        alt="products Marketplace"
                        placeholder="blur"
                        blurDataURL={"a"}
                        width={250}
                        height={250}
                    />

                </div>


                {contextHolder}

                <div className="create_new_password_divs">
                    <div className='create_new_password_title'>Cambiar contraseña</div>
                </div>



                <div className='create_new_password_divs'>
                    <div>Escribe tu nueva contraseña</div>
                    <Form.Item<FieldType>
                        name="password1"
                        rules={[{ required: true, message: '¡Ingresa la nueva contraseña!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                </div>

                <div className='create_new_password_divs'>
                    <div>Repite la contraseña</div>
                    <Form.Item<FieldType>
                        name="password2"
                        rules={[{ required: true, message: '¡Repite la nueva contraseña!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                </div>


                <Form.Item >
                    <Button type="primary" htmlType="submit" className='create_new_password_button'>
                        Cambiar contraseña
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}
