import React, { useEffect, useRef, useState } from 'react';

import style from "./YouTubeAudioPlayer.module.css";

import onLeft from "../../resources/images/left.png"
import onRight from "../../resources/images/right.png"
import playVideo from "../../resources/images/play.png";
import pauseVideo from "../../resources/images/pause.png";
import midalLogo from "../../resources/images/midal-logo.jpg";

const YouTubeAudioPlayer = ({
	videoId,
	handleVideoSelect,
	videos,
	setIListenThisSongHandler,
	songIsPlaying,
	setSongIsPlayingHandler,
	setCurrentListeningSongHandler,
	youtubePlayer,
	setYoutubePlayer,
	playerRef,
	playerRefWrapper,
	currentSongURL
}) => {
	const [volume, setVolume] = useState(50); // Начално ниво на звука - 50%
	const [seekTime, setSeekTime] = useState(0); // Време за търсене
	const [maxSeekTime, setMaxSeetTime] = useState(0);
	const [currentTime, setCurrentTime] = useState(0); // Текущо време на песента

	// References 
	// const playerRef = useRef(null);
	const up_WallRef = useRef(null);
	const down_WallRef = useRef(null);


	let player;
	useEffect(() => {

		if (playerRefWrapper.current) {
			playerRefWrapper.current.style.opacity = "0";
			playerRefWrapper.current.style.zIndex = "1";
		}

		up_WallRef.current.style.display = "block";
		// Инициализиране на плейъра при зареждане на видеото
		const onYouTubeIframeAPIReady = () => {

			// TODO:
			// Да сложа грамофонна плоча някъде докато се зарежда...

			player = new window.YT.Player(playerRef.current, {
				// height: '400px',
				// width: '700px',
				height: '350px',
				width: '620px',
				videoId: videoId,
				playerVars: {
					autoplay: 1, // Автоматично възпроизвеждане
					controls: 0, // Премахване на контролите
					rel: 0, // Без свързани видеа от други канали
					cc_load_policy: 1, // Автоматично показване на субтитри
					modestbranding: 1, // Намалява логото на YouTube
					iv_load_policy: 3, // Без анотации и интерактивни елементи
					fs: 0, // Без възможност за пълен екран
					disablekb: 1, // Без клавишни контроли
					playsinline: 1 // Пускане в "inline" режим на мобилни устройства
				},
				events: {
					onReady: (event) => {
						debugger;
						up_WallRef.current.style.display = "block";
						down_WallRef.current.style.display = "block";
						event.target.setVolume(volume);
						event.target.playVideo(); // Стартиране на видеото при готовност
						// event.target.setPlaybackQuality('small'); // Задаване на качеството на видеото

						for (let i = 0; i < videos.length; i++) {
							if (videos[i].id.videoId == videoId) {
								console.log(videos[i]);
								setCurrentListeningSongHandler(videos[i]);
							}
						}

						console.log(event.target.getVideoUrl());
						currentSongURL.current = event.target.getVideoUrl();

						console.log(event.target.getDuration());

						// Обновяване на текущото време на всяка секунда
						// setInterval(() => {
						// 	setCurrentTime(event.target.getCurrentTime());
						// }, 1000);

						debugger;

						// Получаване на информация за видеото
						const videoData = event.target.getVideoData();

						setTimeout(() => {
							up_WallRef.current.style.display = "none";
							down_WallRef.current.style.display = "none";
						}, 5000);

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

							// up_WallRef.current.style.display = "block";
							handleVideoSelect(newVideoId);
						};

						if (event.data === window.YT.PlayerState.PLAYING) {

							// Видеото започна да се възпроизвежда, субтитрите трябва да са заредени
							const availableTracks = event.target.getOption('captions', 'tracklist');

							console.log(event.target.getOption());
							console.log(availableTracks);

							if (availableTracks) {
								const preferredLanguages = ['en', 'bg']; // Английски, български и испански
								const track = availableTracks.find(t => preferredLanguages.includes(t.languageCode));

								if (track) {
									// Задаваме субтитрите на намерения език
									event.target.setOption('captions', 'track', {
										languageCode: track.languageCode,
										name: track.name
									});
								} else {
									console.log('Няма налични субтитри на английски, български или испански.');
								}
							} else {
								console.log('Субтитрите все още не са заредени.');
							}
						}

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

		// // // Изчистване на плейъра при премахване на компонента
		return () => {
			if (player) {
				player.destroy();
			}
		};

	}, [videoId]);



	useEffect(() => {
		document.addEventListener("keydown", onKeyDownHandler)
		
		function onKeyDownHandler(event) {
			if (event.code === 'Space') {
				event.preventDefault();
				if (!songIsPlaying && youtubePlayer.videoTitle) {

					youtubePlayer.playVideo();
					setSongIsPlayingHandler(true);
					setTimeout(() => {
						down_WallRef.current.style.display = "none";
						up_WallRef.current.style.display = "none";
					}, 1000);

				} else {
					youtubePlayer.pauseVideo();
					setSongIsPlayingHandler(false);
					up_WallRef.current.style.display = "block";
					down_WallRef.current.style.display = "block";
				}
			}
		}

		return () => {
			document.removeEventListener("keydown", onKeyDownHandler);
		}

	}, [youtubePlayer, songIsPlaying]);

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
			up_WallRef.current.style.display = "block";
			down_WallRef.current.style.display = "block";
		} else if (event.target.alt == 'play') {
			debugger;
			youtubePlayer.playVideo();
			setSongIsPlayingHandler(true);
			setTimeout(() => {
				down_WallRef.current.style.display = "none";
				up_WallRef.current.style.display = "none";
			}, 1000);
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

	const seekToTime = (time) => {
		const timeInSeconds = parseInt(time); // Преобразуване на времето в секунди
		if (!isNaN(timeInSeconds) && youtubePlayer) {
			youtubePlayer.seekTo(timeInSeconds, true); // Преместване на плейъра
		}
	};



	return (
		<article>
			{/* Actual that is the Player: */}

			<div
				className={style['player-ref-wrapper']}
				ref={playerRefWrapper}
			>

				<div
					style={{ position: "relative", left: "10em", zIndex: "20", borderRadius: "2em" }}
					className='my-video-mf-player' ref={playerRef}
				>
				</div>

				<div ref={up_WallRef} className={style['up-wall']}></div>
				<div ref={down_WallRef} className={style['down-wall']}></div>
				<div className={style['right-wall']}>
					{/* <img className={style['site-little-logo']} src={midalLogo} alt="midalLogo" /> */}
				</div>
				<div className={style['internal-sheel']}></div>
			</div>



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
					{/* {maxSeekTime > 0 && (
						<h3
							style={{ color: "green" }}>
							{youtubePlayer ? `${Math.floor(youtubePlayer.getCurrentTime() / 60)}:${Math.floor(youtubePlayer.getCurrentTime() % 60).toString().padStart(2, '0')}` : '0:00'}
						</h3>
					)} */}

					<input
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