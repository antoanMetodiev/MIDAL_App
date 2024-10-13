import PocketBase from 'pocketbase';
import { useEffect } from 'react';

const pb = new PocketBase('http://127.0.0.1:8090');

// Логване като администратор
const PocketBaseLogin = () => {

    async function login() {
        const email = 'antoan.0418@gmail.com';
        const password = 'boksnem1059';

        try {
            const authData = await pb.admins.authWithPassword(email, password);
            console.log('Logged in as admin:', authData.token);

            return authData.token;  // Връща токена
        } catch (error) {
            console.error('Error logging in:', error);
            return null;
        }
    }

    useEffect(() => {
        login()
    }, []);

    return (
        <div>

        </div>
    );
};

export default PocketBaseLogin;