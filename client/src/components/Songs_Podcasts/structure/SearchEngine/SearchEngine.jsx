import { useState } from "react";
import style from "./SearchEngine.module.css";
import axios from "axios";

const SearchEngine = () => {
    const [results, setResults] = useState([]);

    async function checkForSong(event) {
        event.preventDefault();
        const songName = event.target.song_name.value;

        const token = Cookies.get('token');
        const response = await axios.get(`https://api.spotify.com/v1/search`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: songName,
                type: 'track'
            }
        });

        console.log(response.data.tracks.items);
        setResults(response.data.tracks.items);
    };

    return (
        <div>
            <form
                className={style['form-container']}
                onSubmit={checkForSong}>
                <input name="song_name" type="text" />
                <button>Search</button>
            </form>
        </div>
    );
};

export default SearchEngine;