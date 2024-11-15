"use client"
import { verify } from '@/services';
import { Button, Card } from 'antd';
import { toast } from 'react-toastify';

const page = async () => {

    const handleFetchClick = async () => {
        try {
            const response = await verify(); // URL de ejemplo
          
            toast.success('Petición exitosa: ' + response.message);
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
