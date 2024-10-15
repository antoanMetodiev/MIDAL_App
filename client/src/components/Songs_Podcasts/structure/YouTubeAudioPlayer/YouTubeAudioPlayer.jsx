import React, { useEffect, useRef, useState } from 'react';

import style from "./YouTubeAudioPlayer.module.css";

import onLeft from "../../resources/images/left.png"
import onRight from "../../resources/images/right.png"
import playVideo from "../../resources/images/play.png";
import pauseVideo from "../../resources/images/pause.png";

const YouTubeAudioPlayer = ({
	videoId,
	handleVideoSelect,
	videos,
	setIListenThisSongHandler,
}) => {
	const [songIsPlaying, setSongIsPlaying] = useState(false);
	const [youtubePlayer, setYoutubePlayer] = useState(null);
	const [volume, setVolume] = useState(50); // Начално ниво на звука - 50%
	const [seekTime, setSeekTime] = useState(''); // Време за търсене

	// References (not actual refs who i use...):
	const playerRef = useRef(null);
	let player;


	useEffect(() => {

		// Инициализиране на плейъра при зареждане на видеото
		const onYouTubeIframeAPIReady = () => {

			// TODO:
			// Да сложа грамофонна плоча някъде докато се зарежда...

			player = new window.YT.Player(playerRef.current, {
				height: '0',  // Скрити размери
				width: '0',
				videoId: videoId,
				playerVars: {
					autoplay: 1, // Автоматично възпроизвеждане
					// controls: 0, // Без контролите на YouTube
					// modestbranding: 1, // Намален брандинг
				},
				events: {
					onReady: (event) => {
						event.target.setVolume(volume);
						event.target.playVideo(); // Стартиране на видеото при готовност
						// event.target.setPlaybackQuality('small'); // Задаване на качеството на видеото

						// Получаване на информация за видеото
						const videoData = event.target.getVideoData();
						
						setIListenThisSongHandler(videoData); 
					},
					onStateChange: (event) => {
						if (event.data === window.YT.PlayerState.ENDED) {

							debugger;
							let newVideoId = '';
							const newSelectedVideo = videos[getRandomIndex(0, videos.length < 8 ? videos.length : 8)]
							newVideoId = newSelectedVideo.id.videoId;

							handleVideoSelect(newVideoId);
						};
					},
					onError: (error) => {
						console.error("Error playing video:", error);
					},
				},
			});

			// тук ше го сетна:
			setYoutubePlayer(player);
		};

		// Зареждане на Iframe API
		if (window.YT && window.YT.Player) {
			onYouTubeIframeAPIReady();
		} else {
			const script = document.createElement('script');
			script.src = "https://www.youtube.com/iframe_api";
			document.body.appendChild(script);
			window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
		}

		// // Изчистване на плейъра при премахване на компонента
		return () => {
			if (player) {
				player.destroy();
			}
		};

	}, [videoId]);


	function switchSong(event) {
		let newVideoId = '';

		if (event.target.alt == 'right') {
			for (let i = 0; i < videos.length; i++) {

				if (videos[i].id.videoId == videoId) {
					newVideoId = videos[i + 1].id.videoId;
					handleVideoSelect(newVideoId);
				}
			};

		} else if (event.target.alt == 'left') {

			for (let i = 0; i < videos.length; i++) {

				if (videos[i].id.videoId == videoId) {
					newVideoId = videos[i - 1].id.videoId;
					handleVideoSelect(newVideoId);
				}
			};

		} else if (event.target.alt == 'pause') {
			// debugger;
			youtubePlayer.pauseVideo();
			setSongIsPlaying(true);
		} else if (event.target.alt == 'play') {
			debugger;
			youtubePlayer.playVideo();
			setSongIsPlaying(false);
		}
	};


	// Функция за промяна на звука
	function handleVolumeChange(e, previousVoulume) {

		try {
			const newVolume1 = e.target.value;
			setVolume(newVolume1);  // Актуализиране на стойността на звука
			if (youtubePlayer) {
				youtubePlayer.setVolume(newVolume1); // Промяна на звука на плейъра
			}
		} catch (error) {
			const newVolume2 = previousVoulume;
			setVolume(newVolume2);  // Актуализиране на стойността на звука
			if (youtubePlayer) {
				youtubePlayer.setVolume(newVolume2); // Промяна на звука на плейъра
			}
		}
	};


	 // Функция за регулиране на времето
	 const handleSeekChange = (e) => {
        setSeekTime(e.target.value); // Запазване на стойността на времето
    };

    const seekToTime = () => {
        const timeInSeconds = parseInt(seekTime); // Преобразуване на времето в секунди
        if (!isNaN(timeInSeconds) && youtubePlayer) {
            youtubePlayer.seekTo(timeInSeconds, true); // Преместване на плейъра
        }
    };


	return (
		<article>
			{/* Actual thah is the Player: */}
			<div ref={playerRef}></div>

			<div className={style['player-container']}>


				<div className={style['volume-slider']}>
					<input
						type="range"
						id="volume"
						name="volume"
						min="0"
						max="100"
						value={volume}
						onChange={handleVolumeChange}
					/>
				</div>

				<div className={style['seek-container']}>
					<label htmlFor="seekTime">Seek to (seconds):</label>
					<input
						type="number"
						id="seekTime"
						name="seekTime"
						value={seekTime}
						onChange={handleSeekChange}
						placeholder="Enter time in seconds"
					/>
					<button onClick={seekToTime}>Seek</button> {/* Бутон за търсене */}
				</div>


				<div className={style['arrows-container']}>
					<img onClick={switchSong} className={style['onLeft']} src={onLeft} alt="left" />

					{songIsPlaying ?
						<img onClick={switchSong} className={style['play-video']} src={playVideo} alt="play" />
						:
						<img onClick={switchSong} className={style['pause-video']} src={pauseVideo} alt="pause" />
					}
					<img onClick={switchSong} className={style['onRight']} src={onRight} alt="right" />
				</div>
			</div>
		</article>
	);
};

function getRandomIndex(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default YouTubeAudioPlayer;