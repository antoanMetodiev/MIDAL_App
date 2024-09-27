import style from "./Songs_Podcasts.module.css";

import SearchEngine from "./structure/SearchEngine/SearchEngine";
import Music_Player from "./structure/Music_Player/Music_Player";
import SpotifyPlayer from 'react-spotify-web-playback';

const Songs_Podcasts = () => {

    

    return (
       <article className={style['main-container']}>

            <SearchEngine />
            <Music_Player />

       </article>
    );
}

export default Songs_Podcasts;