import { useNavigate,  } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

const SpotifyHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash;

        console.log(hash);

        if (hash) {
            // Извличаме токена от hash-а
            const tokenMatch = hash.match(/access_token=([^&]*)/);

            if (tokenMatch && tokenMatch[1]) {
                const token = tokenMatch[1];

                // 50 минути = 50/1440 от деня
                Cookies.set('spotify_token', token, { expires: 50 / 1440 });

                // Пренасочваме към друга страница
                navigate('/songs-podcasts');
            } else {
                console.error("Access token not found in the URL hash.");
            }
        } else {
            console.error("URL hash not found.");
        }

    }, []);
    
    return <h1>Loading...</h1>;
};

export default SpotifyHandler;
