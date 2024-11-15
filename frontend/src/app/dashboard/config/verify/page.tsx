"use client"
import { verify } from '@/services';
import { Button, Card } from 'antd';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const page = async () => {

    const handleFetchClick = async () => {
        toast.success('Iniciando proceso . . .: ');
        try {
            const response = await verify(); // URL de ejemplo
          
            console.log("la respuesta",response)
            if(response.length > 0){
                Swal.fire({
                    title: "Existen nuevas sentencias",
                    text: "Se te enviarán si entran en tus preferencias",
                    icon: "success"
                  });
               
            }else{
                Swal.fire({
                    title: "No hay nuevas sentencias",
                    text: "Es una lástima",
                    icon: "warning"
                  });
            }

           
        } catch (error:any) {
            toast.error('Error al realizar la petición: ' + error.message);
        }
    };

    return (
        <>
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: "10px"
                }}
            >
                <Card title="Verificar sentencias" bordered={true} style={{width: "60%"}}>
                    <Button type="primary" style={{width: "100%", backgroundColor: "#cf286a"}} onClick={handleFetchClick}>Ejecutar</Button>
                </Card>
                <Card title="Explicación" bordered={true} style={{width: "60%"}}>
                    <p>A fines de demostración la función encargada de verificar la existencia de sentencias nuevas puede ejecutarse desde aquí</p>
                </Card>
            </div>
        </>
    );
};

export default page;
