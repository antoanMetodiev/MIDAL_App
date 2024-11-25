import style from "./Published_Playlists.module.css";

import playSongImage from "../../../../../resources/images/play-music-on-playlist.png";
import openPlaylistSongs from "../../../../../resources/images/open-playlist-songs.png";
import { useState } from "react";

const Published_Playlists = ({
    userDetailsData,
    handleVideoSelect,
}) => {
    const [choosenPlaylst, setChoosenPlaylist] = useState({
        notPlaylist: "notPlaylist",
    });

    // Functions:
    let setChoosenPlaylistHandler = (newChoosenPlaylist) => { setChoosenPlaylist(newChoosenPlaylist); }


    return (
        <div className={style['published-playlists-container']}>

            {userDetailsData.myPublishedPlaylists.length > 0 ?
                userDetailsData.myPublishedPlaylists.map(playlist => {
                    return (
                        <>
                            <h3 className={style['playlists-h3-main-titile']}>Плейлисти</h3>

                            <div
                                onClick={() => {
                                    setChoosenPlaylistHandler({
                                        playlistTitle: playlist.playlistName,
                                        songs: playlist.songs,
                                    });
                                }}
                                className={style['playlist-container']}
                            >
                                <img src={playlist.songs[playlist.songs.length - 1].data.snippet.thumbnails.high.url} alt="songImage" />
                                <div className={style['playlist-texts-container']}>
                                    <h3 className={style['playlist-name']}>{playlist.playlistName.substring(0, 9)}..</h3>
                                    <span>•</span>
                                    <h3 className={style['playlist-string']}>{playlist.songs.length} записа</h3>
                                    <span>•</span>
                                    <img
                                        onClick={() => {
                                            setChoosenPlaylistHandler({
                                                playlistTitle: playlist.playlistName,
                                                songs: playlist.songs,
                                            });
                                        }}
                                        className={style['choosePlaylist-image']}
                                        src={openPlaylistSongs}
                                        alt="playSongImage"
                                    />
                                </div>
                            </div>

                        </>
                    )
                }) : (
                    <h2>Няма публикувани плейлисти</h2>
                )}



            {!choosenPlaylst.notPlaylist ? (
                <>
                    <h3 className={style['songs_podcasts-h3-title']}>Песни/Подкасти</h3>
                    <section className={style['concrete-playlist-songsList']}>
                        {choosenPlaylst.songs.length > 0 ? choosenPlaylst.songs.map((song, index) => {
                            return (
                                <div className={style['song-container']}>
                                    <img
                                        onClick={() => {
                                            const videoId = song.videoId;
                                            handleVideoSelect(videoId);
                                        }}
                                        className={style['playSong-image']}
                                        src={playSongImage}
                                        alt="playSongImage"
                                    />
                                    <span>{index + 1}.</span>
                                    <img
                                        className={style['song-image']}
                                        src={song.data.snippet.thumbnails.high.url}
                                        alt="songImage"
                                    />
                                    <h5 className={style['song-title']}>{song.songName.substring(0, 48)}...</h5>
                                    <h5 className={style['publish-time']}>{song.data.snippet.publishTime.split("T")[0]}</h5>
                                </div>
                            )
                        }) : (
                            <h3>Няма налични записи.</h3>
                        )}
                    </section>
                </>
            ) : (
                <h3 className={style['please-choosePlaylist-title']}>Моля, изберете плейлист.</h3>
            )}




        </div>
    );
}

export default Published_Playlists;