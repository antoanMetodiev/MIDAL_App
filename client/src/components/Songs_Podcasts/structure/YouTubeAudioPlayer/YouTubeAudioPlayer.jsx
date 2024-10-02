import React, { useEffect, useRef, useState } from 'react';

import style from "./YouTubeAudioPlayer.module.css";

import onLeft from "../../resources/images/left.png"
import onRight from "../../resources/images/right.png"
import playVideo from "../../resources/images/play.png";
import pauseVideo from "../../resources/images/pause.png";

const YouTubeAudioPlayer = ({
	videoId,
	handleVideoSelect,
	videos
}) => {
	const [songIsPlaying, setSongIsPlaying] = useState(false);
	// References:
	const playerRef = useRef(null);
	let player;

	useEffect(() => {

		// Инициализиране на плейъра при зареждане на видеото
		const onYouTubeIframeAPIReady = () => {
			player = new window.YT.Player(playerRef.current, {
				height: '0',  // Скрити размери
				width: '0',
				videoId: videoId,
				playerVars: {
					autoplay: 1, // Автоматично възпроизвеждане
					controls: 0, // Без контролите на YouTube
					showinfo: 0, // Без показване на информация
					modestbranding: 1, // Намален брандинг
				},
				events: {
					onReady: (event) => {
						event.target.playVideo(); // Стартиране на видеото при готовност
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

		// Изчистване на плейъра при премахване на компонента
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

		} 
		
		// else if (event.target.alt == 'pause') {
		// 	// debugger;
		// 	actualPlayerRef.current.stopVideo();
		// 	setSongIsPlaying(true);
		// } else if (event.target.alt == 'play') {
		// 	debugger;
		// 	actualPlayerRef.current.playVideo();
		// 	setSongIsPlaying(false);
		// }
	};


	return (
		<article>
			{/* Actual thah is the Player: */}
			<div ref={playerRef}></div>

			<div className={style['player-container']}>
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