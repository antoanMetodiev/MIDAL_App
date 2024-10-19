import React, { useEffect, useRef, useState } from 'react';

import style from "./YouTubeAudioPlayer.module.css";

import onLeft from "../../resources/images/left.png"
import onRight from "../../resources/images/right.png"
import playVideo from "../../resources/images/play.png";
import pauseVideo from "../../resources/images/pause.png";
import Songs_Podcasts from '../../Songs_Podcasts';

const YouTubeAudioPlayer = ({
	videoId,
	handleVideoSelect,
	videos,
	setIListenThisSongHandler,
	songIsPlaying,
	setSongIsPlayingHandler,
}) => {

	// This is actual music player/youtube player:
	const [youtubePlayer, setYoutubePlayer] = useState(null);
	const [volume, setVolume] = useState(50); // Начално ниво на звука - 50%
	const [seekTime, setSeekTime] = useState(0); // Време за търсене
	const [maxSeekTime, setMaxSeetTime] = useState(0);
	const [currentTime, setCurrentTime] = useState(0); // Текущо време на песента

	console.log(maxSeekTime)


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
					controls: 0, // Без контролите на YouTube
					showinfo: 0, // Без информация
					rel: 0, // Без свързани видеа
					cc_load_policy: 1, // Автоматично показване на субтитри
				},
				events: {
					onReady: (event) => {
						debugger;
						event.target.setVolume(volume);
						event.target.playVideo(); // Стартиране на видеото при готовност
						// event.target.setPlaybackQuality('small'); // Задаване на качеството на видеото


						console.log(event.target);
						console.log(event.target.getDuration());

						// Обновяване на текущото време на всяка секунда
						// setInterval(() => {
						// 	setCurrentTime(event.target.getCurrentTime());
						// }, 1000);

						debugger;

						// Получаване на информация за видеото
						const videoData = event.target.getVideoData();

						setMaxSeetTime(event.target.getDuration());
						setSongIsPlaying(true);
						setIListenThisSongHandler(videoData);
					},
					onStateChange: (event) => {
						if (event.data === window.YT.PlayerState.ENDED) {

							// debugger;
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
					setSongIsPlayingHandler(true);
				}
			};

		} else if (event.target.alt == 'left') {

			for (let i = 0; i < videos.length; i++) {

				if (videos[i].id.videoId == videoId) {
					newVideoId = videos[i - 1].id.videoId;
					handleVideoSelect(newVideoId);
					setSongIsPlayingHandler(true);
				}
			};

		} else if (event.target.alt == 'pause') {
			// debugger;
			youtubePlayer.pauseVideo();
			setSongIsPlayingHandler(false);
		} else if (event.target.alt == 'play') {
			debugger;
			youtubePlayer.playVideo();
			setSongIsPlayingHandler(true);
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
		debugger;
		console.log(e.target.value);
		setSeekTime(e.target.value);
		seekToTime(e.target.value); // Запазване на стойността на времето
	};

	const seekToTime = () => {
		const timeInSeconds = parseInt(seekTime); // Преобразуване на времето в секунди
		if (!isNaN(timeInSeconds) && youtubePlayer) {
			youtubePlayer.seekTo(timeInSeconds, true); // Преместване на плейъра
		}
	};

	const songTimeControllInput = useRef(null);

	console.log(youtubePlayer);


	if (youtubePlayer && Object.keys(youtubePlayer).length > 1) {
		console.log(Object.keys(youtubePlayer));
		// console.log(youtubePlayer.getCurrentTime());
	}


	return (
		<article>
			{/* Actual thah is the Player: */}
			<div className='my-video-mf-player' ref={playerRef}></div>

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
					{maxSeekTime > 0 && (
						<h3
							style={{ color: "green" }}>
							{youtubePlayer ? `${Math.floor(youtubePlayer.getCurrentTime() / 60)}:${Math.floor(youtubePlayer.getCurrentTime() % 60).toString().padStart(2, '0')}` : '0:00'}
						</h3>
					)}
					<input
						ref={songTimeControllInput}
						className={style['song-time-control']}
						type="range"
						id="seekTime"
						name="seekTime"
						min="0"
						max={maxSeekTime} // Задаване на максималната стойност
						value={seekTime}
						onChange={handleSeekChange}
					/>
				</div>


				<div className={style['arrows-container']}>
					<img onClick={switchSong} className={style['onLeft']} src={onRight} alt="left" />

					{songIsPlaying ?
						<img onClick={switchSong} className={style['pause-video']} src={pauseVideo} alt="pause" />
						:
						<img onClick={switchSong} className={style['play-video']} src={playVideo} alt="play" />
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