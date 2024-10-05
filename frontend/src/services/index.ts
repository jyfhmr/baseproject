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

export const getOne = async (module: string, id: number) => {
    try {
        const route = `/${module}/${id}`;
        const res = await ApiClient.get(route);
        return res.data;
    } catch (error) {
        console.log("error buscando el modulo",module)
        console.error;
    }
};

export const changeStatus = async (id: number, module: string) => {
    const route = `/${module}${id ? '/' + id : ''}/change_status`;
    await ApiClient.patch(route);

    revalidatePath(`/dashboard/${module}`);
    redirect(`/dashboard/${module}`);
};

export const changeExchangeRate = async (module: string) => {
    redirect(`/dashboard/${module}`);
};

export const getActiveList = async (module: string, query: string = '') => {
    const route = `/${module}/list${query}`;
    console.log(route);

    const res = await ApiClient.get(route);
    return res.data;
};

export const getUserProfile = async () => {
    const session = await getServerSession(authOptions);
    const route = `${process.env.API_URL}/profiles/${session.profileId}?app=1`;
    const res = await ApiClient.get(route);
    return res.data;
};

export const getAllData = async (module: string, optionalQuery?: string) => {
    if (optionalQuery) {
        const route = `${process.env.API_URL}/${module}?export=1`;
        const res = await ApiClient.get(route);
        return res.data;
    }

    //const session = await getServerSession(authOptions);
    try {
        const route = `${process.env.API_URL}/${module}`;
        const res = await ApiClient.get(route);
        return res.data;
    } catch (error:any) {
        console.log("error buscando el modulo",module)
        console.log(error.message, error.response.data.message)
    }
   
};

export const sendResetPass = async (id: string) => {
    if (!id) {
        throw new Error('No user ID provided');
    }
    console.log('User ID in service:', id);
    const route = `${process.env.API_URL}/mails/resetPassword`;
    console.log('Reset password route:', route);
    try {
        const res = await ApiClient.post(route, { userId: id });
        return res.data; // Asegúrate de devolver solo los datos necesarios
    } catch (error) {
        console.error('Error in sendResetPass service:', error);
        throw error;
    }
};

export const changePassword = async (id: number, password: string) => {
    if (!id && !password) {
        throw new Error('No user ID provided or password provided');
    }

    const route = `${process.env.API_URL}/config/users/updatePassword`;
    try {
        const res = await ApiClient.post(route, { userId: id, password: password });
        return res.data; // Asegúrate de devolver solo los datos necesarios
    } catch (error) {
        console.error('Error in sendResetPass service:', error);
        throw error;
    }
};

export const sendEmailToChangePasswordByEmail = async (email: string) => {
    if (!email) {
        throw new Error('No email was provided');
    }

    const route = `${process.env.API_URL}/mails/resetPasswordToEmail`;
    try {
        const res = await ApiClient.post(route, { email: email });
        return res.data; // Asegúrate de devolver solo los datos necesarios
    } catch (error) {
        console.error('Error in sendResetPassByEmail service:', error);
        throw error;
    }
};

export const getLastExchangeRates = async () => {
    //actual_rates
    const route = `${process.env.API_URL}/treasury/maintenance/exchange_rate/actual_rates`;
    try {
        const res = await ApiClient.get(route);
        //console.log("la respuesta al pedir rates",res.data)
        return res.data; // Asegúrate de devolver solo los datos necesarios
    } catch (error: any) {
        console.error('Error in sendResetPassByEmail service:', error?.data);
        throw error;
    }
};
