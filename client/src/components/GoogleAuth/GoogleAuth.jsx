import { useEffect } from 'react';
import { CLIENT_ID } from "./spotifyClient_data";

const GoogleAuth = ({ onSuccess }) => {
    const handleCredentialResponse = (response) => {
        if (response.error) {
            console.error("Error retrieving token:", response.error);
            return;
        }
        console.log('Encoded JWT ID token: ' + response.credential);
        // Обработи токена
        onSuccess(response.credential);
    };

    const initGoogleAuth = () => {
        window.google.accounts.id.initialize({
            client_id: CLIENT_ID,
            callback: handleCredentialResponse
        });
        
        // console.log(window.google.accounts.id);

        window.google.accounts.id.prompt(); // Извиква входа
    };

    useEffect(() => {
        initGoogleAuth();
    }, []);

    return null; // Няма нужда от UI елемент
};

export default GoogleAuth;