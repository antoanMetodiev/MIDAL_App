import style from "./Music_Player.module.css"
import { useEffect, useState } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';

const Music_Player = () => {
    const [spotifyToken, setSpotifyToken] = useState('');


    useEffect(() => {
        const getToken = () => {
            setSpotifyToken(Cookies.get('spotify_token'));
        };

        getToken();
    }, []);

    return (
        <div className={style['music-player-container']}>
            {spotifyToken  &&
                <SpotifyPlayer
                    token={spotifyToken}
                    uris={['spotify:artist:6HQYnRM4OzToCYPpVBInuU']}
                />
            }
        </div>


    );
};

export default Music_Player;