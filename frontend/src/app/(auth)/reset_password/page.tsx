"use client"
import React, { useState, useEffect } from 'react'
import "./reset_password.css"
import { Button, Form, FormProps, Input, message } from 'antd'
import Link from 'next/link'
import Image from 'next/image';
import { getOne, changePassword } from '@/services'
import { toast } from 'react-toastify'
import { useRouter} from 'next/navigation';


export default function ResetPassword() {

  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [user, setUser]= useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    const idParam = params.get('id');
    setToken(tokenParam);

    if (idParam) {
      const userIdNumber = parseInt(idParam, 10);
      if (!isNaN(userIdNumber)) {
        setUserId(userIdNumber)  
      }
    }
  }, []);

  useEffect(()=>{

   if(userId){
        comprobar()
   }


  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userId])

 async function comprobar(){

    if(userId){
        
        const user = await fetchUser(userId);
        setUser(user)
        console.log(token)
        console.log(user)

        const tokenExpirationDate = new Date(user.resetTokenExpiration);
        const currentDate = new Date();
    
        //TODO:  //validar si el token expiró
        if(!(user.resetToken == token) || tokenExpirationDate < currentDate){
           
            toast.error(`Este token ya no es válido, te redireccionaremos al login`)
            setTimeout(()=>{
                router.push("/login")
             },2000)
        }

    }
  }

  async function fetchUser(userId: number) {
    try {
      const user = await getOne('config/users', userId);
      // console.log('User:', user);
      return user
    } catch (error) {
      toast.error(`Ocurrió un error validando el usuario, por favor inténtalo más tarde.`)
      console.error('Error fetching user:', error);
    }
  }

  async function sendNewPassword(userId: number, password: string){
    try {
        const res = await changePassword(userId,password);
        return res
      } catch (error) {
        toast.error(`Ocurrió un error enviando la nueva contraseña, por favor inténtalo más tarde.`)
       // console.error('Error sending new password', error);
      }
  }



  const [messageApi, contextHolder] = message.useMessage();

  type FieldType = {
    password: string;
  };

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
  

    try{

        const response = await sendNewPassword(user.id,values.password)
        console.log("RESPUESTA AL INTENTAR CAMBIAR CONTRASEÑA",response)
        toast.success(`¡Contraseña cambiada con éxito!, te redireccionaremos al login`)
  
        setTimeout(()=>{
           router.push("/login")
        },2000)
    
    }catch(error){
        toast.error(`Ocurrió un error al actualizar la contraseña, inténtalo más tarde`)
        throw error
    }
   
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
          <div id='ResetPassword_1_1'>Reinicia tu contraseña</div>
        </div>

        <div className='resetPassword_cont'>
          <div>
            Ingrese tu contraseña nueva
          </div>
          <Form.Item<FieldType>
            name="password"
            rules={[{ required: true, message: 'Ingresa tu nueva contraseña'}]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className='resetPassword_cont ResetPassword_button_cont'>
          {contextHolder}
          <Button type="primary" style={{ backgroundColor: "rgb(104, 15, 130)" }} className='linkInResetPassword' htmlType="submit">
            Cambiar
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
