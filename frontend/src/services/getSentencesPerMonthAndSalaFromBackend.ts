'use server';

import { getQuery } from '@/helpers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import authOptions from '@/utils/authOptions';
import ApiClient from '@/utils/axiosInstance';

export const getData = async (module: string, searchParams: any) => {
    searchParams.rows = searchParams?.rows || 5;
    searchParams.order = searchParams?.order || 'DESC';

    try {
        const route = `/${module}${getQuery(searchParams)}`;
        const res = await ApiClient.get(route);
        return res.data;
    } catch (error: any) {
        console.log("error buscando el modulo",module)
        return new Error('Error consiguiendo los datos');
    }
};

export const createOrUpdate = async (
    module: string,
    formData: any | FormData,
    id: number | null = null,
    purchase?: string,
) => {
    const route = `/${module}${id ? '/' + id : ''}`;
console.log(route);
    let response;
    try {
        const headers =
            formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
        response = !id
            ? await ApiClient.post(route, formData, { headers })
            : await ApiClient.patch(route, formData, { headers });
        console.log('Response from backend:', response); // Agregar esta línea para ver la respuesta del backend
    } catch (error: any) {
        // console.log('ERROR DE INTENTAR HACER POST O PATCH EN services', error.response.data);

        if (error.response.data && error.response.data.statusCode) {
            return error.response.data;
        }

        if (error)
            if (typeof error.response.data.message === 'string') {
                return error.response.data.message;
            } else {
                return error.response.data.message.join(', ');
            }
    }

    if (purchase) {
        revalidatePath(`/dashboard/${module}`);
        redirect(`/dashboard/${purchase}/form`);
    } else {
        revalidatePath(`/dashboard/${module}`);
        redirect(`/dashboard/${module}`);
    }
};


export const getSentencesPerMonthAndSalaFromBackend = async (sala: string, month: string)=>{


    try {

        console.log("tryinig...")
        
        const route = `${process.env.API_URL}/sentences/getFromSpecificSalaAndMonth?sala=${sala}&month=${month}`;
        const res = await ApiClient.get(route);

        console.log("la respuesta",res.data)

        return res.data;

    } catch (error:any) {
        
        console.log("error fetching the sentences",error.data)

        return error.data

    }



}