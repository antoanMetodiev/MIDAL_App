import { useEffect, useRef, useState } from "react";
import style from "./SongDetails.module.css";

import backToSongsList from "../../../../resources/images/back-to-songs-list.png";

const SongDetails = ({
    currentListeningSong,
    youtubePlayer,
    setYoutubePlayer,
    setSongDetailsHandler,
    playerRef,
    playerRefWrapper,
    songsListRef,
    currentSongURL,
    under_black_shadow,
    searchEngine_optionsContainerWrapperRef,
}) => {
    const [subtitles, setSubtitles] = useState('');
    let videoId = currentSongURL.current.split('v=')[1];
    let random = `https://www.youtube.com/embed/${videoId}`;
    // const embedUrl = useRef(random);


    useEffect(() => {
        songsListRef.current.style.flexWrap = "nowrap";
    }, []);

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        // debugger;
        // if (youtubePlayer.getSize && youtubePlayer.getSize().width == 0) {
        //     youtubePlayer.setSize(620, 350);  // Промяна на размера на плеъра
        // }
        debugger;
        under_black_shadow.current.style.display = "block";
        searchEngine_optionsContainerWrapperRef.current.style.display = "none";
        if (playerRefWrapper.current) {
            playerRefWrapper.current.style.opacity = "1";
            playerRefWrapper.current.style.zIndex = "3 ";
        }


        if (currentListeningSong.snippet) {
            debugger;
            const random = currentListeningSong.snippet.title.split(" - ");
            const artist = random[0]?.trim(); // Вземаме името на артиста
            let title = random[1]?.trim(); // Вземаме заглавието на песента

            if (title) {
                // Премахваме всякакви допълнителни части в скоби (ако има)
                title = title.replace(/\(.*?\)/g, "").trim();

                // Изпращаме заявка към API-то за текста на песента
                getSubtitles(artist, title);
            } else {
                setSubtitles("");  // Ако не се намерят субтитри
            }
        }


    }, [youtubePlayer, currentListeningSong, playerRefWrapper]);  // Следим youtubePlayer и изпълняваме, когато се инициализира


    async function getSubtitles(artist, title) {
        try {
            const apiUrl = `https://api.lyrics.ovh/v1/${artist}/${title}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.lyrics) {
                setSubtitles(data.lyrics);  // Задаваме текста на песента
            } else {
                setSubtitles("");  // Ако не се намерят субтитри
            }
        } catch (error) {
            console.error("Error fetching lyrics:", error);
            setSubtitles("");
        }
    }


    function backToSongsListHandler() {
        under_black_shadow.current.style.display = "none";
        searchEngine_optionsContainerWrapperRef.current.style.display = "block";
        if (playerRefWrapper.current) {
            playerRefWrapper.current.style.opacity = "0";
            playerRefWrapper.current.style.zIndex = "0 ";
        }
        songsListRef.current.style.flexWrap = "wrap";
        document.body.style.overflow = 'auto';
        youtubePlayer.setSize(0, 0);
        setSongDetailsHandler(false);
    }




    return (
        <article className={style['song-details-container']}>
            <img onClick={backToSongsListHandler} className={style['back-to-songList']} src={backToSongsList} alt="backToSongsList" />
            <h2 className={style['video-title']}>{currentListeningSong.snippet.title}</h2>
            <h4 className={style['subtitles-text']}>{subtitles}</h4>
        </article>
    );
}

export default SongDetails; 