// src/Auth.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AUTH_URL } from '../../configs/spotifyConfig';

const SpotifyAuth = () => {
    const navigate = useNavigate();

    function checkIfContainTokken() {
        Cookies.remove('spotify_token');
        const token = Cookies.get('spotify_token');

        console.log(token);
    
        if (token) {
            navigate('/songs-podcasts');
        } else {
            window.location.href = AUTH_URL;
        }
    };

    return (
        <div>
            {/* <h1>Добре дошли в Spotify App</h1> */}
            {/* <a href={AUTH_URL}>Влезте с Spotify</a> */}

            <li onClick={checkIfContainTokken}>Songs & Podcasts</li>
        </div>
    );
};

export default SpotifyAuth;