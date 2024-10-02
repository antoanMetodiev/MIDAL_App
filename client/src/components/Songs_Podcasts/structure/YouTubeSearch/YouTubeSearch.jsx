import style from "../../Songs_Podcasts.module.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import cookies from "js-cookie";

// const API_KEY = 'AIzaSyA1VMyCKstr7Kc13g_ZEmF9bp9GWIapJ_0';

import updateAccessToken from "../../../GoogleAuth/utils/updateAccessToken";

const YouTubeSearch = ({
    searchTerm,
    onVideoSelect,
    setVideosHandler,
    videos,
}) => {
    const baseURL = 'https://www.googleapis.com/youtube/v3/search';

    useEffect(() => {

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

                // Защото съм сложил ограниечение до 60 резултата:
                if (songs.length <= 60) {

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



    // ТОВА Е С API_KEY:
    //------------------
    // useEffect(() => {
    //     if (searchTerm) {
    //         axios.get(baseURL, {
    //             params: {
    //                 part: 'snippet',
    //                 q: searchTerm,
    //                 key: API_KEY, // Използвай API ключа тук
    //                 type: 'video',
    //                 maxResults: 5
    //             }
    //         })
    //             .then(response => {
    //                 console.log(response.data);
    //                 setVideosHandler(response.data.items);
    //             })
    //             .catch(error => {
    //                 console.error('Error fetching data: ', error);
    //             });
    //     }

    // }, [searchTerm]);


    return (
        <article className={style['songs-list']}>
            {videos.length > 0 ? (
                videos.map((video) => (
                    <div
                        className={style['song-container']}
                        key={video.id.videoId}
                        onClick={() => onVideoSelect(video.id.videoId)}
                    >
                        <img
                            className={style['song-image']}
                            src={video.snippet.thumbnails.high.url}
                            alt={video.snippet.title}
                        />
                        <h4 className={style['song-title']}>{video.snippet.title}</h4>
                    </div>
                ))
            ) : (
                <p>No videos found</p>
            )}
        </article>
    );
};

export default YouTubeSearch;