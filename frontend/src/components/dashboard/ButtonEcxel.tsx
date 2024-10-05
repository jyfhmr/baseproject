'use client';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import './style/buttonEcxel.css';

const ButtonEcxel = ({ moduleName, searchParams }: any) => {

    const exportToExcel = async () => {
        try {
            // Asegúrate de que searchParams sea una instancia de URLSearchParams
            const params = new URLSearchParams(searchParams);

            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_API + '/' + moduleName}/export?${params.toString()}`, {
                responseType: 'blob', // Importante para manejar el archivo como blob
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${moduleName}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error exporting to Excel:', error);
        }
    };

    return (
        <Button className='botton-ecxel' type="primary" onClick={exportToExcel} icon={<DownloadOutlined />} style={{ marginBottom: 16, background: '#5cb85c' }}>
            <b>Exportar a Excel</b>
        </Button>
    );
};

export default ButtonEcxel;

