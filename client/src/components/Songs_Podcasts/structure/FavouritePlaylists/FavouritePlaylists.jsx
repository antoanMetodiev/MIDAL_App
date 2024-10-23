import style from "./FavouritePlaylists.module.css";
import siteLogo from "../../resources/images/midal-logo.jpg";
import likedSongsPlaylistImage from "../../resources/images/liked-songs-playlist.png"
import showCurrentPlaylist from "../../resources/images/show-current-playlist.png";
import playSongsOnPlaylists from "../../resources/images/play-music-on-playlist.png";

import { useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const FavouritePlaylists = ({
    playlistTypes,
    handleVideoSelect,
    setCurrentListeningSongHandler,
}) => {

    function showSongsFromPlaylistHandler(event) {
        if (event.target.nextElementSibling.style.display == '' || event.target.nextElementSibling.style.display == 'none') {
            event.target.nextElementSibling.style.display = 'block';
        } else {
            event.target.nextElementSibling.style.display = 'none';
        }
    }

    const sendToMusicPlayer = (event, playlistKey) => {
        debugger;
        let songForListen = playlistTypes[playlistKey].songs[Number(event.target.alt)];

        setCurrentListeningSongHandler(songForListen.data);
        handleVideoSelect(songForListen.videoId);
        // console.log();
        // console.log(playlistKey);
    };

    console.log(playlistTypes);

    return (
        <>
            {/* Favorite Playlists: */}
            <aside className={style['fav-playlist-container']}>
                <div className={style['title-logo-container']}>
                    <span className={style['another-black-shadow']}></span>
                    <img
                        className={style['site-logo']}
                        src={siteLogo}
                        lt="siteLogo"
                    />
                    <h1>MIDAL</h1>
                </div>

                <section className={style['playlists-list']}>

                    <h2 className={style['playlists-title-h2']}>Плейлисти</h2>

                    {playlistTypes && Object.keys(playlistTypes).length > 0 && (
                        Object.keys(playlistTypes).map((playlistKey) => {
                            return (
                                <>
                                    <div className={style['liked-songs']}>
                                        <img src={playlistTypes[playlistKey].imgURL} alt="likedSongsImage" />
                                        <div>
                                            <h3>{playlistKey}</h3>
                                            <h4>{playlistTypes[playlistKey].songs.length} записа</h4>
                                        </div>
                                        <img
                                            onClick={showSongsFromPlaylistHandler}
                                            className={style['show-current-playlist']}
                                            src={showCurrentPlaylist}
                                            alt={playlistKey}
                                        />

                                    
                                        <section className={style['playlist-songs-container']}>

                                            {playlistTypes.Харесани && (
                                                playlistTypes[playlistKey].songs.map((songObject, index) => {
                                                    return (
                                                        <div className={style['song-container']}>
                                                            <img className={style['song-image']} src={songObject.data.snippet.thumbnails.medium.url} alt="song-image" />
                                                            <img onClick={(event) => {
                                                                sendToMusicPlayer(event, playlistKey);
                                                            }} className={style['play-song-image']} src={playSongsOnPlaylists} alt={index} />
                                                            <span className={style['song-title']}>{songObject.data.snippet.title}</span>
                                                        </div>
                                                    )
                                                })
                                            )}

                                        </section>
                                    </div>


                                </>
                            )
                        })
                    )}





                </section>
            </aside>
        </>
    );
};

export default FavouritePlaylists;