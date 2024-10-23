import style from "../../Songs_Podcasts.module.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import cookies from "js-cookie";

// const API_KEY = 'AIzaSyA1VMyCKstr7Kc13g_ZEmF9bp9GWIapJ_0';

import updateAccessToken from "../../../GoogleAuth/utils/updateAccessToken";
import addSongImage from "../../resources/images/add-song.png"
import fullScreen from "../../resources/images/full_screen.png";

import SongDetails from "./structure/SongDetails/SongDetails";

const YouTubeSearch = ({
    searchTerm,
    onVideoSelect,
    setVideosHandler,
    videos,
    addSongToPlaylist,
    playlistTypes,
    setSongIsPlayingHandler,
    currentListeningSong,
    youtubePlayer,
    setYoutubePlayer,
    setCurrentListeningSongHandler,
    playerRef,
    playerRefWrapper,
    songsListRef,
    currentSongURL,
}) => {
    const [showSongDetails, setShowSongDetails] = useState(false);

    // const [showOrHideOptions, setShowOrHideOptions] = useState(false);
    const baseURL = 'https://www.googleapis.com/youtube/v3/search';

    useEffect(() => {

        debugger;
        // Проверявам дали въобще има токен - ако няма го update-вам преди да го потърся няколко реда по надолу:


        if (!cookies.get('access_token') || cookies.get('access_token').length < 3) {
            updateAccessToken();
        }

        // const solve = async () => {
        //     const accessToken = cookies.get('access_token'); // Извличаме токена от cookies

        //     if (searchTerm && accessToken) {
        //         axios.get(baseURL, {
        //             params: {
        //                 part: 'snippet',
        //                 q: searchTerm,
        //                 type: 'video',
        //                 maxResults: 100
        //             },
        //             headers: {
        //                 Authorization: `Bearer ${accessToken}` // Използваме токена вместо API ключа
        //             }
        //         }).then(async (response) => {
        //             const data = response.data.items;

        //             // Правим POST заявка към сървъра
        //             await axios.post('http://localhost:8080/create-songs', { songs: data })
        //                 .then(() => {
        //                     console.log('Songs created successfully');
        //                 })
        //                 .catch(error => {
        //                     console.error('Error creating songs:', error);
        //                 });

        //             console.log(data);
        //             setVideosHandler(data);
        //         }).catch(error => {
        //             console.error('Error fetching data: ', error);
        //         });
        //     }
        // }

        // solve();



        // SEARCH FROM - MongoDB:

        const searchFromDatabase = async () => {

            try {
                if (searchTerm.length == 0) return;

                const allSongsWithPattern = await axios.post('http://localhost:8080/get-songs', { searchTerm: searchTerm });
                console.log(allSongsWithPattern.data);
                let songs = allSongsWithPattern.data;

                // Защото съм сложил ограниечение до 70 резултата:
                if (songs.length <= 70) {

                    let processedSongs = [];
                    for (let i = 0; i < songs.length; i++) {
                        processedSongs.push(songs[i].data);
                    };

                    setVideosHandler(processedSongs);
                };

            } catch (error) {
                console.log('Abe ti ne moo izpratihs edna zaqvka za pesnite');
            };
        };

        searchFromDatabase();

    }, [searchTerm]);


    const showOrHideOptionsHandler = (event) => {
        const optionsList = event.target.nextElementSibling;

        if (optionsList.style.display === "none" || optionsList.style.display === "") {
            optionsList.style.display = "block"; // Показва ul
        } else {
            optionsList.style.display = "none"; // Скрива ul
        }
    };


    function setSongDetailsHandler(value) {
        setShowSongDetails(value);
    }



    return (
        <article
            ref={songsListRef} 
            className={style['songs-list']}
        >
            {videos.length > 0 ? (
                videos.map((video, index) => (

                    <div
                        className={style['song-container']}
                        key={video.id.videoId}
                        onClick={() => {
                            setSongIsPlayingHandler(true);
                            onVideoSelect(video.id.videoId);

                            
                        }}
                    >
                        <img onClick={() => {
                            debugger;
                            setSongIsPlayingHandler(true);
                            onVideoSelect(video.id.videoId);

                            setSongDetailsHandler(true);

                            const newSong = videos.filter(el => el.id.videoId == video.id.videoId)[0];
                            setCurrentListeningSongHandler(newSong);

                        }} className={style['full-screen-image']} src={fullScreen} alt="fullScreen" />

                        <div className={style['song-image-wrapp-container']}>
                            <span className={style['song-black-shadow']}></span>
                            <img
                                className={style['song-image']}
                                src={video.snippet.thumbnails.high.url}
                                alt={video.snippet.title}
                            />
                        </div>
                        <h4 className={style['song-title']}>{video.snippet.title}</h4>

                        <img
                            onClick={showOrHideOptionsHandler}
                            className={style['add-song-image']}
                            src={addSongImage}
                            alt="addSongImage"
                        />

                        <ul
                            onMouseEnter={(event) => {
                                event.stopPropagation();  // Спиране на propagation при hover (ако е необходимо)
                            }}
                            className={style['add-song-options']}
                        >

                            {playlistTypes.Харесани &&
                                Object.keys(playlistTypes).map(type => {
                                    return (
                                        <li
                                            data-value={index}
                                            onClick={(event) => {
                                                addSongToPlaylist(videos[index], type);
                                            }}

                                        >Добави в "{type}"..</li>
                                    )
                                })}
                        </ul>

                    </div>

                ))
            ) : (
                <h1>No videos found</h1>
            )}



            {showSongDetails && (
                <SongDetails
                    currentListeningSong={currentListeningSong}
                    youtubePlayer={youtubePlayer}
                    setYoutubePlayer={setYoutubePlayer}
                    setSongDetailsHandler={setSongDetailsHandler}
                    playerRef={playerRef}
                    playerRefWrapper={playerRefWrapper}
                    songsListRef={songsListRef}
                    currentSongURL={currentSongURL}
                />
            )}


        </article>
    );
};

export default YouTubeSearch;