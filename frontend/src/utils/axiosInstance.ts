import axios from 'axios';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/utils/authOptions';

const ApiClient = () => {
    const axiosInstance = axios.create({
        baseURL: process.env.API_URL,
        timeout: 5000, // Timeout if necessary
    });

    axiosInstance.interceptors.request.use(async (request: any) => {
        const session = await getServerSession(authOptions);
        if (session) {
            request.headers.Authorization = `Bearer ${session?.access_token}`;
        }
        return request;
    });

    return axiosInstance;
};

export default ApiClient();
