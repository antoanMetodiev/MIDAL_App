import style from "./Songs_Podcasts.module.css";
import { useEffect, useRef, useState } from "react";

import YouTubeAudioPlayer from "./structure/YouTubeAudioPlayer/YouTubeAudioPlayer";
import YouTubeSearch from "./structure/YouTubeSearch/YouTubeSearch";
import UserSearch from "./structure/UserSearch/UserSearch";
import RequestSongOrPodcast from "./structure/RequestSongOrPodcast/RequestSongOrPodcast";
import UserDetails from "./structure/UserDetails/UserDetails";
import ListeningFriends from "./structure/ListeningFriends/ListeningFriends";
import FavouritePlaylists from "./structure/FavouritePlaylists/FavouritePlaylists";
import SongDetails from "./structure/YouTubeSearch/structure/SongDetails/SongDetails";
import FriendsRequests from "./structure/FriendsRequests/FriendsRequests";

import backImage from "./resources/images/monkey.jpg";
import siteLogo from "./resources/images/midal-logo.jpg";
import searchButton from "../Songs_Podcasts/resources/images/search-button.png";
import planetImg from "./resources/images/planet.png";

import updateAccessToken from "../GoogleAuth/utils/updateAccessToken";
import cookies from "js-cookie";
import axios from "axios";
import { json, useLocation, useNavigate } from "react-router-dom";


import io from 'socket.io-client';

const socket = io('http://localhost:8090'); // Свързване към Socket.io сървъра

const Songs_Podcasts = () => {
    // States:
    const location = useLocation();
    const under_black_shadow = useRef(null);
    const [myUserData, setMyUserData] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [searchLocation, setSearchLocation] = useState("Музика & Подкасти");
    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const [videos, setVideos] = useState([]);
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [songIsPlaying, setSongIsPlaying] = useState(false);
    const [youtubePlayer, setYoutubePlayer] = useState(null);
    const [currentListeningSong, setCurrentListeningSong] = useState({});
    const [iListenThisSong, setIListenThisSong] = useState({});
    const [myFriendsListens, setMyFriendsListens] = useState([]);

    // PLAYLIST TYPES:
    const [playlistTypes, setPlaylistTypes] = useState({});

    const [showSongDetails, setShowSongDetails] = useState(false);
    function setSongDetailsHandler(value) {
        setShowSongDetails(value);
    }

    // References:
    const playerRefWrapper = useRef(null);
    const playerRef = useRef(null);
    const songsListRef = useRef(null);
    const currentSongURL = useRef("");
    const songsAndPodcastsH3 = useRef(null);
    const userProfilesH3 = useRef(null);
    const searchEngineRef = useRef(null);
    const requestNewSongH3 = useRef(null);
    const userDetailsH3 = useRef(null);

    // Functions:
    function setCurrentListeningSongHandler(newListeningSong) {
        setCurrentListeningSong(newListeningSong);
    }

    function setSongIsPlayingHandler(value) {
        setSongIsPlaying(value);
    };

    function setMyUserDataHandler(newUserData) {
        setMyUserData(newUserData);
    }


    useEffect(() => {
        if (myUserData.myPlaylists) {
            console.log(myUserData.myPlaylists);
            setPlaylistTypes(myUserData.myPlaylists);
        }

    }, [myUserData]);


    function addSongToPlaylist(songObject, playlistName) {
        let videoId = songObject.id.videoId;
        let data = songObject;
        let songName = songObject.snippet.title;
        let songObjectForSave = { videoId, data, songName };

        debugger;
        console.log(playlistTypes);
        if (playlistTypes[playlistName]) {

            let isContains = false;
            for (const currentSong of playlistTypes[playlistName].songs) {
                if (currentSong.songName == songName && currentSong.videoId == videoId) {
                    isContains = true;
                    console.log('Песента ве4е я имаш добавена');
                }
            }

            const addSongForConcretePlaylist = async () => {
                const response = await axios.post('http://localhost:8080/add-song-to-one-playlist', { song: songObjectForSave, playlistName: playlistName, myId: myUserData._id });
                if (response.data.obj) {
                    let newUserObject = { ...myUserData };
                    debugger;
                    newUserObject.myPlaylists[playlistName].songs.push(songObjectForSave);
                    localStorage.setItem("MIDAL_USER", JSON.stringify(newUserObject));
                    setMyUserData(newUserObject);
                }
            };

            if (!isContains) {
                console.log('Нямаш такава песен - сега я добавям...');
                addSongForConcretePlaylist();
            }
        }

        console.log(songObjectForSave);
        console.log(playlistName);
    };



    useEffect(() => {
        // Слушане за съобщения от сървъра
        const myId = JSON.parse(localStorage.getItem('MIDAL_USER'))._id;

        socket.on(`songUpdate-${myId}`, (data) => {
            console.log('Полу4ена Песен:', data);

            const receivedSong = JSON.parse(data.message);

            let flagText = 'Not contained.';
            let savedIndex = -1;
            for (let i = 0; i < myFriendsListens.length; i++) {

                if (myFriendsListens[i].id == receivedSong.id) {
                    flagText = 'The friend is contained already.' // озна4ава 4е само трябва да update-нем какво слуша сега.. , а не преди..
                    savedIndex = i;
                    break;
                }
            }

            if (flagText == 'The friend is contained already.') {

                let newMyFriendsListens = myFriendsListens.slice();
                newMyFriendsListens[savedIndex] = receivedSong;
                setMyFriendsListens(newMyFriendsListens);
            } else if ('Not contained.') {
                setMyFriendsListens([...myFriendsListens, receivedSong]);
            }


            // setMyFriendsListens(prevListens => {
            //     if (prevListens.find(song => song.id === receivedSong.id)) {
            //         return prevListens; // Вече съществува, не го добавяме отново
            //     }
            //     return [...prevListens, receivedSong];
            // });

            // Тук можеш да направиш нещо с полученото съобщение, например да го покажеш на потребителя
        });

        return () => {
            socket.off(`songUpdate-${myId}`); // Премахване на слушателя при unmount
        };

    }, [myFriendsListens]);


    function setIListenThisSongHandler(receivedSong) {
        let videoDataOriginal = receivedSong;

        async function publishSongOperation() {
            debugger;
            const lastListenedSongForMe = JSON.parse(localStorage.getItem('LAST_LISTENED_SONG'));
            const myId = myUserData._id ? myUserData._id : lastListenedSongForMe.myId;
            const img = JSON.parse(localStorage.getItem('MIDAL_USER')).imageURL;
            let songTitle = videoDataOriginal && (videoDataOriginal.title && videoDataOriginal.title.length > 1) ? videoDataOriginal.title : lastListenedSongForMe.songTitle; // Името на песента

            debugger;
            if (videoDataOriginal && (videoDataOriginal.title && videoDataOriginal.title.length > 1) && lastListenedSongForMe && videoDataOriginal.title != lastListenedSongForMe.songTitle) {
                songTitle = videoDataOriginal.title;
                localStorage.setItem("LAST_LISTENED_SONG", JSON.stringify({ myId: myId, songTitle: songTitle, myName: myUserData.username, imgURL: img }));
            }

            // JSON.parse(localStorage.getItem('LAST_LISTENED_SONG'));

            receivedSong = null;
            if (songTitle.length > 1) {
                // Изпращане сървъра и след това на Redis (заяване че слушам сега тази песен):
                try {

                    const responseMessage = await axios.post('http://localhost:8080/publish-song', { myId: myId, songTitle: songTitle, myName: myUserData.username, imgURL: img });
                    console.log(responseMessage.data);
                    debugger;
                    const obj = JSON.parse(responseMessage.config.data);

                    let objForSet = {};

                    if (lastListenedSongForMe && lastListenedSongForMe.songTitle) {
                        objForSet = lastListenedSongForMe;
                    } else {
                        objForSet = obj;
                    }

                    // if (!lastListenedSongForMe) {
                    //     objForSet = obj;
                    // } else {
                    //     objForSet = lastListenedSongForMe;
                    // }


                    localStorage.setItem("LAST_LISTENED_SONG", JSON.stringify(objForSet));
                    console.log('Направих заявяване в канала каква песен слушам..');


                    // setTimeout(() => {
                    //     debugger;
                    //     videoDataOriginal = {};
                    //     publishSongOperation();
                    // }, 30000);

                } catch (error) {
                    if (error.response) {
                        // Сървърът върна отговор с грешка
                        console.log('Грешка от сървъра:', error.response.data);
                    } else if (error.request) {
                        // Заявката беше изпратена, но не беше получен отговор
                        console.log('Няма отговор от сървъра:', error.request);
                    } else {
                        // Нещо се обърка при настройката на заявката
                        console.log('Грешка при настройката на заявката:', error.message);
                    }
                }


            }


            // Тук правя заяване на всеки 7 секунди каква песен слушам за може приятел, който се е присъединил след като съм си пуснал песента да знае 4е я слушам в момента..
        }

        publishSongOperation();
    };

    useEffect(() => {

        const solve = async () => {
            const obj = JSON.parse(localStorage.getItem('MIDAL_USER'));
            const myId = obj._id;
            const friendsList = obj.friendsList;

            try {
                const response = await axios.post('http://localhost:8080/subscribe-for-songs', { friendsList: friendsList, myId: myId });
                console.log(response.data);
            } catch (error) {
                console.log('Imash greshka oshte na frond-enda, kogato izprashtash zaqwka za subscribe!!');
            }

            setMyUserData(obj);

            // ТОВА НЕ Е СВЪРЗАНО СЪС Subscribe!
            debugger;
            const accessToken = cookies.get('access_token');
            if (!accessToken) {
                updateAccessToken();
            };
        }

        solve();

    }, []);

    useEffect(() => {


        if (location.pathname == '/songs-podcasts') {
            const data = JSON.parse(localStorage.getItem('MIDAL_USER'));

            const setUserIsActive = async () => {
                const dataForActiveRequest = {
                    id: data._id,
                    name: data.username,
                    imgURL: data.imageURL ? data.imageURL : 'NOTH HAVE A IMAGE!',
                };

                console.log('---------------------');
                console.log(dataForActiveRequest);

                try {
                    await axios.post('http://localhost:8080/set-user-isActive', { dataForActiveRequest: dataForActiveRequest });
                } catch (error) {
                    console.log('НЕ УСПЯХМЕ ДА НАПРАВИМ User-a АКТИВЕН...');
                }
            };

            setUserIsActive();
        }

    }, [location.pathname]);


    useEffect(() => {
        const removeUser = async () => {
            const myId = JSON.parse(localStorage.getItem('MIDAL_USER'))._id;

            try {
                await axios.post('http://localhost:8080/remove-active-user', { id: myId });
                console.log('Songs and Podcasts се деактивираа..');
            } catch (error) {
                console.error('Failed to remove active user:', error);
            }
        };

        // Слушател за излизане от приложението (затваряне на таб, браузър и т.н.)
        const handleUnload = (e) => {
            removeUser();
            // Възможно е да покажем предупредителен диалог (опционално)
            e.preventDefault();
            e.returnValue = ''; // Стандартна практика за показване на диалог в някои браузъри
        };

        window.addEventListener('beforeunload', handleUnload);

        return () => {
            removeUser(); // Извиква се при unmount на компонента
            window.removeEventListener('beforeunload', handleUnload); // Премахване на слушателя при unmount
        };
    }, []);
    useEffect(() => {
        const removeUser = async () => {
            const myId = JSON.parse(localStorage.getItem('MIDAL_USER'))._id;

            try {
                await axios.post('http://localhost:8080/remove-active-user', { id: myId });
                console.log('Songs and Podcasts се деактивираа..');
            } catch (error) {
                console.error('Failed to remove active user:', error);
            }
        };

        removeUser(); // Извикваме функцията при unmount

    }, [location.pathname]);


    function setVideosHandler(newVideos) {
        setVideos([...newVideos]);
    };

    const handleSearch = (e) => {
        // debugger;

        if (e) {
            e.preventDefault();
            setSearchTerm(e.target.search_engine.value);
        } else {
            setSearchTerm(searchEngineRef.current.value);
        }
    };

    const handleVideoSelect = (videoId) => {
        setSelectedVideoId(videoId);
    };

    const changeSearch = (event) => {

        debugger;
        if (event.target.textContent == 'Музика & Подкасти') {
            userProfilesH3.current.style.backgroundColor = 'unset';
            requestNewSongH3.current.style.backgroundColor = 'unset';
            userDetailsH3.current.style.backgroundColor = 'unset';

            songsAndPodcastsH3.current.style.backgroundColor = '#fefefe56';
            searchEngineRef.current.placeholder = 'Слушай..';
            setSearchLocation(event.target.textContent);

        } else if (event.target.textContent == 'Профили') {
            songsAndPodcastsH3.current.style.backgroundColor = 'unset';
            requestNewSongH3.current.style.backgroundColor = 'unset';
            userDetailsH3.current.style.backgroundColor = 'unset';

            userProfilesH3.current.style.backgroundColor = '#fefefe56';
            searchEngineRef.current.placeholder = 'Търси Потребител..';
            setSearchLocation(event.target.textContent);
        } else if (event.target.textContent == 'Заяви Песен/Подкаст') {

            songsAndPodcastsH3.current.style.backgroundColor = 'unset';
            userProfilesH3.current.style.backgroundColor = 'unset';
            userDetailsH3.current.style.backgroundColor = 'unset';
            requestNewSongH3.current.style.backgroundColor = '#fefefe56';
            searchEngineRef.current.placeholder = 'Заяви Песен/Подкаст..';
            setSearchLocation(event.target.textContent);
        } else if (event.target.textContent == 'Акаунт') {

            songsAndPodcastsH3.current.style.backgroundColor = 'unset';
            userProfilesH3.current.style.backgroundColor = 'unset';
            requestNewSongH3.current.style.backgroundColor = 'unset';
            userDetailsH3.current.style.backgroundColor = '#fefefe56';
            setSearchLocation('...');
        }
    };


    const showMoreOptionsHandler = (event) => {
        if (!showMoreOptions) {
            setShowMoreOptions(true);
        } else {
            setShowMoreOptions(false);
        };
    };

    const searchEngine_optionsContainerWrapperRef = useRef(null);

    return (
        <article className={style['songs-podcasts-container']}>
            <span className={style['black-shadow']}></span>
            <img
                className={style['back-image']}
                src={backImage}
                alt="backImage-monkey"
            />

            <article className={style['content-and-searchEngine-container']}>


                <div ref={searchEngine_optionsContainerWrapperRef}>
                    <section className={style['options-container']}>
                        <h3 ref={songsAndPodcastsH3} onClick={changeSearch}>Музика & Подкасти</h3>
                        <h3 ref={userProfilesH3} onClick={changeSearch}>Профили</h3>
                        <h3 ref={userDetailsH3} onClick={changeSearch}>Акаунт</h3>
                        <h3 ref={requestNewSongH3} onClick={changeSearch}>Заяви Песен/Подкаст</h3>
                        <img onClick={showMoreOptionsHandler} className={style['more-options-img']} src={planetImg} alt="show" />
                    </section>

                    <span className={style['white-border-radius-wrapper-container']}></span>
                    <form
                        className={style['search-form']}
                        onSubmit={handleSearch}
                    >
                        <input
                            ref={searchEngineRef}
                            className={style['search-engine']}
                            type="text"
                            placeholder="Слушай.."
                            name="search_engine"
                        />

                        <img
                            className={style['search-button']}
                            src={searchButton}
                            onClick={() => {
                                handleSearch();
                            }}
                            alt="searchButton"
                        />
                    </form>
                </div>


                {showMoreOptions && (
                    <>
                        <div>
                            mao
                        </div>

                        <section
                            onClick={(event) => {
                                debugger;
                                if (event.target.textContent === "Покани за приятелство") {

                                    const friendsRequestsEl = event.currentTarget.nextElementSibling;
                                    friendsRequestsEl.style.display = "flex";

                                } else if (event.target.textContent === "Блокирани потребители") {
                                    console.log(event.currentTarget.previousElementSibling.textContent);
                                }
                            }}
                            className={style['more-options-container']}
                        >
                            <h4>Покани за приятелство</h4>
                            <h4>Блокирани потребители</h4>
                        </section>

                        <FriendsRequests myUserData={myUserData} />
                    </>
                )}


                <ListeningFriends myFriendsListens={myFriendsListens} />



                {searchLocation == "Музика & Подкасти" ? (
                    <YouTubeSearch
                        videos={videos}
                        setVideosHandler={setVideosHandler}
                        searchTerm={searchTerm}
                        onVideoSelect={handleVideoSelect}
                        addSongToPlaylist={addSongToPlaylist}
                        playlistTypes={playlistTypes}
                        setSongIsPlayingHandler={setSongIsPlayingHandler}
                        currentListeningSong={currentListeningSong}
                        setCurrentListeningSongHandler={setCurrentListeningSongHandler}
                        youtubePlayer={youtubePlayer}
                        setYoutubePlayer={setYoutubePlayer}
                        playerRef={playerRef}
                        playerRefWrapper={playerRefWrapper}
                        songsListRef={songsListRef}
                        currentSongURL={currentSongURL}
                        setSongDetailsHandler={setSongDetailsHandler}
                    />
                ) : searchLocation == "Профили" ? (
                    <UserSearch searchTerm={searchTerm} />
                ) : searchLocation == "Заяви Песен/Подкаст" ? (
                    <RequestSongOrPodcast searchTerm={searchTerm} />
                ) : (
                    <UserDetails />
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
                        under_black_shadow={under_black_shadow}
                        searchEngine_optionsContainerWrapperRef={searchEngine_optionsContainerWrapperRef}
                    />
                )}

                <YouTubeAudioPlayer
                    videos={videos}
                    videoId={selectedVideoId}
                    handleVideoSelect={handleVideoSelect}
                    setIListenThisSongHandler={setIListenThisSongHandler}
                    songIsPlaying={songIsPlaying}
                    setSongIsPlayingHandler={setSongIsPlayingHandler}
                    setCurrentListeningSongHandler={setCurrentListeningSongHandler}
                    youtubePlayer={youtubePlayer}
                    setYoutubePlayer={setYoutubePlayer}
                    playerRef={playerRef}
                    playerRefWrapper={playerRefWrapper}
                    currentSongURL={currentSongURL}
                    under_black_shadow={under_black_shadow}
                />

            </article>


            <FavouritePlaylists
                playlistTypes={playlistTypes}
                handleVideoSelect={handleVideoSelect}
                setCurrentListeningSongHandler={setCurrentListeningSongHandler}
                myUserData={myUserData}
                setMyUserDataHandler={setMyUserDataHandler}
            />

        </article>
    );
}

export default Songs_Podcasts;