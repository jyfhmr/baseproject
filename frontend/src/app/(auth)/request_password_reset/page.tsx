"use client"
import React, { useState, useEffect } from 'react'
import "./reset_password.css"
import { Button, Form, FormProps, Input, message } from 'antd'
import Link from 'next/link'
import Image from 'next/image';
import { sendEmailToChangePasswordByEmail} from '@/services'
import { toast } from 'react-toastify'
import { useRouter} from 'next/navigation';
import { AxiosError } from 'axios'


export default function ResetPassword() {

  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  type FieldType = {
    email: string;
  };

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
   // console.log('Success:', values);
   
    try{

        const response = await sendEmailToChangePasswordByEmail(values.email)
        console.log("RESPUESTA AL INTENTAR CAMBIAR CONTRASEÑA",response)
     

        if(response.statusCode == 404){
            toast.error(`El correo proporcionado no se encuentra registrado en nuestro sistema`)
            return
        }

        toast.success(`Hemos enviado un correo a la dirección proporcionada para actualizar su contraseña`)
  
        setTimeout(()=>{
           router.push("/login")
        },2000)
    
    }catch (error: unknown) {
        toast.error(`Ocurrió un error inesperado, por favor inténtalo más tarde`);
        console.error("EL ERROR:::::::",error);
    }
   
  };

  function isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError).isAxiosError !== undefined;
  }

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
        id="ResetPassword_1"
      >

        <div id='reset_password_cont'>
          <Image
            src="/assets/logo.png"
            alt="products Marketplace"
            placeholder="blur"
            blurDataURL={"a"}
            width={250}
            height={250}
            id="reset_password_image"
          />
        </div>

        <div className='resetPassword_cont'>
          <div id='ResetPassword_1_1'>Solicita cambiar tu contraseña</div>
        </div>

        <div className='resetPassword_cont'>
          <div>
           Ingresa tu correo electrónico
          </div>
          <Form.Item<FieldType>
            name="email"
            rules={[{ required: true, message: 'Ingresa un correo válido', type: "email"}]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className='resetPassword_cont ResetPassword_button_cont'>
          {contextHolder}
          <Button type="primary" style={{ backgroundColor: "rgb(104, 15, 130)" }} className='linkInResetPassword' htmlType="submit">
            Enviar correo
          </Button>
          <Link href="/login" className='linkInResetPassword'>
            <Button type="dashed" className='ResetPassword_buttons' >
              Volver
            </Button>
          </Link>
        </div>
      </Form>
    </>
  )
}
