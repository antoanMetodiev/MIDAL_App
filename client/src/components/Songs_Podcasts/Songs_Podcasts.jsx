import style from "./Songs_Podcasts.module.css";
import { useEffect, useState } from "react";

import YouTubeAudioPlayer from "./structure/YouTubeAudioPlayer/YouTubeAudioPlayer";
import YouTubeSearch from "./structure/YouTubeSearch/YouTubeSearch";
import backImage from "./resources/images/monkey.png";
import siteLogo from "./resources/images/midal-logo.jpg";

import updateAccessToken from "../GoogleAuth/utils/updateAccessToken";
import cookies from "js-cookie";

const Songs_Podcasts = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const accessToken = cookies.get('access_token');
        if (accessToken.length < 3) {
            updateAccessToken();
        };

    }, []);

    function setVideosHandler(newVideos) {
        setVideos([...newVideos]);
    };

    const handleSearch = (e) => {
        // debugger;
        e.preventDefault();
        setSearchTerm(e.target.search_engine.value);
    };

    const handleVideoSelect = (videoId) => {
        setSelectedVideoId(videoId);
    };

    return (
        <article className={style['songs-podcasts-container']}>

            <span className={style['black-shadow']}></span>
            <img
                className={style['back-image']}
                src={backImage}
                alt="backImage-monkey"
            />

            <article className={style['content-and-searchEngine-container']}>
                <form onSubmit={handleSearch}>
                    <input
                        className={style['search-engine']}
                        type="text"
                        placeholder="Listen.."
                        name="search_engine"
                    />
                </form>

                <YouTubeSearch
                    videos={videos}
                    setVideosHandler={setVideosHandler}
                    searchTerm={searchTerm}
                    onVideoSelect={handleVideoSelect}
                />

                {selectedVideoId &&
                    <YouTubeAudioPlayer
                        videos={videos}
                        videoId={selectedVideoId}
                        handleVideoSelect={handleVideoSelect}
                    />
                }
            </article>

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

            </aside>

        </article>
    );
}

export default Songs_Podcasts;