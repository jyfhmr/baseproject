/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_URL_IMAGE: process.env.URL_IMAGE,
        NEXT_PUBLIC_URL_API: process.env.API_URL,
        NEXT_PUBLIC_URL_FRONTEND: process.env.URL_FRONTEND,
        NEXT_PUBLIC_URL_APISERVER: process.env.BACKEND_SEVER
    },
};


export default nextConfig;
