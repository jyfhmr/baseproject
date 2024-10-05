'use client'
import { useState } from 'react';
import axios from 'axios';
import './style/buttonEcxel.css';
import { FileExcelFilled } from '@ant-design/icons';
import Swal from 'sweetalert2';


export default function ButtonImporExcel({ moduleName }: any) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    // Manejar el archivo seleccionado
    const handleFileChange = (event: any) => {
        setFile(event.target.files[0]);
    };

    // Manejar el envío del formulario
    const handleUpload = async (event: any) => {
        event.preventDefault();

        if (!file) {
            setMessage('Por favor selecciona un archivo');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        setMessage('');

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_URL_API + '/' + moduleName}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            Swal.fire({
                title: '¡Subida exitosa!',
                text: `Archivo subido exitosamente. Total de registros: ${response.data.total}`,
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
            setFile(null)
        } catch (error) {
            Swal.fire({
                title: '¡Error al subir el excel!',
                text: 'El archivo no se ha sido subido correctamente.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            setFile(null)
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleUpload}>
                {file! ? <button className='botton-ecxel' style={{ background: '#5cb85c', borderRadius: '5px', padding: '8px', color: 'white', border: 'none', fontWeight: '600' }} type="submit" disabled={uploading}>
                    <FileExcelFilled />{uploading ? 'Subiendo...' : 'Subir'}
                </button > : <div style={{ position: 'relative' }}>
                    <input style={{ opacity: '0', position: 'absolute', width: '100px' }} type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
                    <button className='botton-ecxel' style={{ background: '#5cb85c', borderRadius: '5px', padding: '8px', color: 'white', border: 'none', fontWeight: '600' }}><FileExcelFilled /> Cargar excel</button>
                </div>}
            </form>
        </div>
    );
}
