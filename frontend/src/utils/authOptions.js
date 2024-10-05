import axios from 'axios';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const route = `${process.env.API_URL}/auth/login`;
                const options = {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };
                try {
                    const res = await axios.post(route, credentials, options);

                    return res.data; // Devuelve el usuario en caso de éxito
                } catch (error) {
                    console.log(error);
                    //console.log('aSAs',error)
                    throw new Error(
                        error.response.data.message ||
                            error.message ||
                            'An unexpected error occurred',
                    );
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async session({ session, token }) {
            session.access_token = token.access_token;
            session.user = token.user;
            return session;
        },
        async jwt({ token, user, account }) {
            if (account) {
                token.access_token = user.access_token;
                token.user = user;
            }
            return token;
        },
    },
};

export default authOptions;
