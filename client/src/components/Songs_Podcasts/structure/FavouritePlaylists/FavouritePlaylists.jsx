import style from "./FavouritePlaylists.module.css";

import siteLogo from "../../resources/images/midal-logo.jpg";

import showCurrentPlaylist from "../../resources/images/show-current-playlist.png";
import playSongsOnPlaylists from "../../resources/images/play-music-on-playlist.png";
import addNewPlaylistImg from "../../resources/images/add-playlist.png"
import chooseImage from "../../resources/images/choose-image.png";
import publishPlaylistImage from "../../resources/images/publish-playlist.png";

import likedSongsPlaylistImage from "../../resources/images/liked-songs-playlist.png"
import starImage from "../../resources/images/star.png";
import podcastImage from "../../resources/images/podcasts.png";
import boyImage from "../../resources/images/boy.png";
import girlImage from "../../resources/images/girl.png";


import { useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

import { playlistIcons } from "../../../../utils/playlist-icon";

const FavouritePlaylists = ({
    playlistTypes,
    handleVideoSelect,
    setCurrentListeningSongHandler,
    myUserData,
    setMyUserDataHandler
}) => {



    function showSongsFromPlaylistHandler(event) {
        const concretePlaylistContainer = event.target.parentElement;
        const allPlaylistsElement = event.target.parentElement.parentElement;
        const concreteSongsContainer = event.target.nextElementSibling;

        if (event.target.nextElementSibling.style.display == '' || event.target.nextElementSibling.style.display == 'none') {
            event.target.nextElementSibling.style.display = 'flex';
            concretePlaylistContainer.style.marginBottom = "13.5em";
            concretePlaylistContainer.style.position = "absolute";
            concretePlaylistContainer.style.top = "16.6em";
            // concretePlaylistContainer.style.left = "-1.2px";
            concretePlaylistContainer.style.zIndex = "76";
            concretePlaylistContainer.style.width = "100%";
            concretePlaylistContainer.style.backgroundColor = "#000";
            concreteSongsContainer.style.backgroundColor = "#000";
            // concretePlaylistContainer.style.top = "-13.5em"
            allPlaylistsElement.style.overflowY = "hidden";
        } else {
            event.target.nextElementSibling.style.display = 'none';
            concretePlaylistContainer.style.marginBottom = "0em";

            concretePlaylistContainer.style.position = "relative";
            concretePlaylistContainer.style.top = "0";
            concretePlaylistContainer.style.zIndex = "0";
            concretePlaylistContainer.style.backgroundColor = "rgba(128, 128, 128, 0.785)";
            allPlaylistsElement.style.overflowY = "auto";
            concretePlaylistContainer.style.left = "0";
        }
    }

    const sendToMusicPlayer = (event, playlistKey) => {
        let songForListen = playlistTypes[playlistKey].songs[Number(event.target.alt)];

        setCurrentListeningSongHandler(songForListen.data);
        handleVideoSelect(songForListen.videoId);
    };

    // References:
    const addPlaylistFormRef = useRef(null);
    const noName_and_imageRef = useRef(null);
    const choosenImageRef = useRef(null);
    const choosePlaylistContainerRef = useRef(null);
    const showCurrentPlaylistContainerRef = useRef(null);

    let showWantToAddPlaylistHandler = () => {
        noName_and_imageRef.current.style.display = "none";

        if (addPlaylistFormRef.current.style.display === "none" || addPlaylistFormRef.current.style.display === "") {
            addPlaylistFormRef.current.style.display = "flex";
            choosePlaylistContainerRef.current.style.display = "none";
            showCurrentPlaylistContainerRef.current.style.display = "none";
        } else {
            addPlaylistFormRef.current.style.display = "none";
        }
    };

    let wantToAddPlaylistHandler = async (event) => {
        event.preventDefault();
        const myId = JSON.parse(localStorage.getItem("MIDAL_USER"))._id;

        debugger;
        let playlistName = event.target.playlist_name.value;
        if (playlistName.length > 0) {
            
            playlistName = playlistName.split(".").join("");
        }

        
        if (playlistName.length > 0 && playlistName.length <= 18) {
            noName_and_imageRef.current.style.display = "none";
            event.target.reset();

          
            if (playlistTypes.Харесани && !Object.keys(playlistTypes).includes(playlistName)) {
                console.log("Можеш да го създадеш..");

                try {
                    const response = await axios.post("http://localhost:8080/create-playlist", {
                        playlistForCreate: { playlistName, playlistImage: choosenImageRef.current.alt, myId }
                    });

                    console.log(response.data.newUserData);
                    localStorage.setItem("MIDAL_USER", JSON.stringify(response.data.newUserData));
                    setMyUserDataHandler(response.data.newUserData);

                } catch (error) {
                    console.log(error);
                }

            } else {
                noName_and_imageRef.current.style.display = "block";
                noName_and_imageRef.current.textContent = "Сигурен ли си, че името е уникално.."
                console.log("НЕ можеш да го създадеш..");
            }

        } else {
            noName_and_imageRef.current.style.display = "block";
            noName_and_imageRef.current.textContent = "Моля, поставете име до 18 символа.."
        }
    }

    let switchIconHandler = (event) => {
        if (event.target.tagName === 'IMG') {
            choosenImageRef.current.src = event.target.src;
            choosenImageRef.current.alt = event.target.alt;
        }
    }


    const publishPlaylistHandler = async (playlistObject) => {
        const previousPublishedPlaylistsCount = myUserData.myPublishedPlaylists.length;

        // playlistName
        debugger;
        if (previousPublishedPlaylistsCount > 0) {
            const result = myUserData.myPublishedPlaylists
                .filter(publishedPlaylist => publishedPlaylist.playlistName == playlistObject.playlistName);

            if (result.length > 0) return;
        }

        try {
            const response = await axios.post("http://localhost:8080/publish-playlist", {
                myId: myUserData._id,
                playlistObject
            });

            if (response.data.newMyUserData.myPublishedPlaylists.length > previousPublishedPlaylistsCount) {
                localStorage.setItem("MIDAL_USER", JSON.stringify(response.data.newMyUserData));
                setMyUserDataHandler(response.data.newMyUserData);
            }
        } catch (error) {
            console.log();
        }
    };

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

                    <div className={style['playlist-h2-and-img-container']}>
                        <h2 className={style['playlists-title-h2']}>Плейлисти</h2>
                        <img
                            onClick={() => {
                                showWantToAddPlaylistHandler();
                            }}
                            src={addNewPlaylistImg}
                            alt="addNewPlaylistImg"
                        />
                        <img
                            onClick={() => {
                                debugger;
                                let displayValue = choosePlaylistContainerRef.current.style.display;
                                if (displayValue == "none" || displayValue == "") {
                                    choosePlaylistContainerRef.current.style.display = "flex";
                                    addPlaylistFormRef.current.style.display = "none";
                                    console.log(showCurrentPlaylistContainerRef.current);
                                    showCurrentPlaylistContainerRef.current.style.display = "none";
                                    // showCurrentPlaylistContainerRef.current.style.setProperty("display", "none", "important");

                                } else {
                                    choosePlaylistContainerRef.current.style.display = "none";
                                }
                            }}
                            className={style['publish-playlist-image']}
                            src={publishPlaylistImage}
                            alt="publishPlaylistImage"
                        />
                    </div>


                    <form
                        onSubmit={wantToAddPlaylistHandler}
                        ref={addPlaylistFormRef}
                        className={style['want-to-add-playlist-form']}
                    >
                        <label>Име и иконка..</label>

                        <input name="playlist_name" type="text" />
                        <section onClick={switchIconHandler} className={style['icons-container']}>
                            <img src={starImage} alt="starImage" />
                            <img src={likedSongsPlaylistImage} alt="likedSongsPlaylistImage" />
                            <img src={podcastImage} alt="podcastImage" />
                            <img src={boyImage} alt="boyImage" />
                            <img src={girlImage} alt="girlImage" />
                        </section>

                        <img ref={choosenImageRef} className={style['choosen-image']} src={starImage} alt="starImage" />

                        <button>Създай..</button>
                    </form>
                    <label ref={noName_and_imageRef} className={style['no-name-and-image']}>Моля, поставете име до 18 символа..</label>


                    {/* CHOOSE PLAYLIST FOR PUBLISH: */}
                    <div
                        ref={choosePlaylistContainerRef}
                        className={style['choose-playlist-container']}
                    >
                        <h4 className={style['publish-playlist-title']}>Публикувай плейлист:</h4>

                        {myUserData.myPlaylists &&
                            Object.keys(myUserData.myPlaylists).map(playlistKey => {
                                return (
                                    <div
                                        onClick={() => {
                                            debugger;
                                            let obj = myUserData.myPlaylists[playlistKey];
                                            obj.playlistName = playlistKey;
                                            publishPlaylistHandler(obj);
                                        }}
                                        className={style['publish-playlist']}
                                    >
                                        {/* <img src={playlistIcons[myUserData.myPlaylists[playlistKey].imgURL]} alt="playlist_IMAGE" /> */}
                                        <h5>♫ {playlistKey}</h5>
                                    </div>
                                )
                            })}

                    </div>

                    

                    <section className={style['all-playlists-container']}>

                        {playlistTypes && Object.keys(playlistTypes).length > 0 && (
                            Object.keys(playlistTypes).map((playlistKey) => {
                                return (
                                    <div className={style['liked-songs']}>
                                        <img src={playlistIcons[playlistTypes[playlistKey].imgURL]} alt={playlistIcons[playlistTypes[playlistKey].imgURL]} />
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



                                        <section
                                            ref={showCurrentPlaylistContainerRef}
                                            className={style['playlist-songs-container']}
                                        >

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
                                )
                            })
                        )}
                    </section>

                </section>
            </aside>
        </>
    );
};

export default FavouritePlaylists;