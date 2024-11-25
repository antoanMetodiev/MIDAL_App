import React, { useEffect, useRef, useState } from 'react';

import style from "./YouTubeAudioPlayer.module.css";

import onLeft from "../../resources/images/left.png"
import onRight from "../../resources/images/right.png"
import playVideo from "../../resources/images/play.png";
import pauseVideo from "../../resources/images/pause.png";
import midalLogo from "../../resources/images/midal-logo.jpg";

import gramophoneRecordImg from "../../resources/images/record-1.png";

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
	currentSongURL,
	under_black_shadow,
}) => {
	const [renderComponent, setRenderComponent] = useState(false);
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
					// cc_load_policy: 1, // Автоматично показване на субтитри
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

						setTimeout(() => {
							up_WallRef.current.style.display = "none";
							down_WallRef.current.style.display = "none";
						}, 5500);

						setMaxSeetTime(event.target.getDuration());
						setSongIsPlayingHandler(true);
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
		const onKeyDownHandler = (event) => {
			if (event.code === 'Space') {
				const activeEl = document.activeElement;
				const isInputFocused = activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA';

				// Ако фокусът е върху input или textarea, не предотвратяваме поведението
				if (!isInputFocused) {
					event.preventDefault(); // Предотвратяваме скролване или други действия със Spacebar

					if (!songIsPlaying && youtubePlayer.videoTitle && activeEl) {
						youtubePlayer.playVideo();
						setSongIsPlayingHandler(true);

						// Скриваме елементите след 1 секунда
						setTimeout(() => {
							if (down_WallRef.current && up_WallRef.current) {
								down_WallRef.current.style.display = "none";
								up_WallRef.current.style.display = "none";
							}
						}, 1000);
					} else {
						youtubePlayer.pauseVideo();
						setSongIsPlayingHandler(false);

						if (down_WallRef.current && up_WallRef.current) {
							up_WallRef.current.style.display = "block";
							down_WallRef.current.style.display = "block";
						}
					}
				}
			}
		};

		// Добавяме слушател за натискане на клавиши
		document.addEventListener("keydown", onKeyDownHandler);

		// Премахваме слушателя при демонтиране на компонента
		return () => {
			document.removeEventListener("keydown", onKeyDownHandler);
		};
	}, [youtubePlayer, songIsPlaying]);

	function switchSong(event) {
		let newVideoId = '';

		if (event.target.alt == 'right') {
			setSeekTime(0);
			for (let i = 0; i < videos.length; i++) {

				if (videos[i].id.videoId == videoId) {
					newVideoId = videos[i + 1].id.videoId;
					handleVideoSelect(newVideoId);
					setSongIsPlayingHandler(true);
				}
			};

		} else if (event.target.alt == 'left') {

			setSeekTime(0);
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
			}, 1300);
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

	const [inputProgressPercent, setInputProgressPercent] = useState(0);
	// setInputProgressPercent((youtubePlayer.getCurrentTime() / maxSeekTime) * 100);

	useEffect(() => {

		console.log(maxSeekTime);
		const intervalId = setInterval(() => {
			if (youtubePlayer) setMaxSeetTime(youtubePlayer.getDuration());

			if (youtubePlayer) {

				inputSongTimerRef.current.value = youtubePlayer.getCurrentTime();
				setSeekTime(youtubePlayer.getCurrentTime());
				console.log(inputSongTimerRef.current.value);
			}

			setRenderComponent((prev) => !prev);  // Променя стойността на renderComponent на всеки интервал
		}, 900);

		return () => clearInterval(intervalId);  // Почистване на интервала при размонтиране
	}, [youtubePlayer]);


	// Изчисляване на процент от максималното време


	const inputSongTimerRef = useRef(null);

	return (
		<>
			<span ref={under_black_shadow} className={style['under-black-shadow']}></span>


			<article>
				{/* Actual that is the Player: */}

				{/* <img className={style['gramophone-record-image']} src={gramophoneRecordImg} alt="gramophoneRecordImg" /> */}

				<div
					className={style['player-ref-wrapper']}
					ref={playerRefWrapper}
				>

					<div
						style=
						{{
							position: "absolute", zIndex: "3",
							width: "100%",
							height: "100%",
						}}
						className='my-video-mf-player'
						ref={playerRef}
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
							style={{
								'--volume-level': volume // Текущото ниво на звука
							}}
						/>
					</div>
					<div className={style['seek-container']}>
						{maxSeekTime > 0 && (
							<section className={style['song-time-wrapper-container']}>
								<h3
									style={{ color: "green" }}>
									{youtubePlayer && youtubePlayer.getCurrentTime ? `${Math.floor(youtubePlayer.getCurrentTime() / 60)}:${Math.floor(youtubePlayer.getCurrentTime() % 60).toString().padStart(2, '0')}` : '0:00'}
								</h3>

								<h3
									style={{ color: "green" }}
								>/{`${Math.floor(maxSeekTime / 60)}:${Math.floor(maxSeekTime % 60).toString().padStart(2, '0')}`}</h3>
							</section>

						)}

						{/* <Slider
							min={0}
							max={maxSeekTime}
							value={seekTime}
							onChange={handleSeekChange}
							trackStyle={{ backgroundColor: 'green', height: 5 }}
							handleStyle={{
								borderColor: 'green',
								height: 15,
								width: 15,
								marginTop: -5,
								backgroundColor: 'white',
							}}
							railStyle={{ backgroundColor: '#ccc', height: 5 }}
						/> */}


						<input
							ref={inputSongTimerRef}
							className={style['song-time-control']}
							type="range"
							id="seekTime"
							name="seekTime"
							min="0"
							max={maxSeekTime} // Задаване на максималната стойност
							value={seekTime}
							onChange={handleSeekChange}
							style={{
								'--seek-time': seekTime, // Текущото време
								'--max-seek-time': maxSeekTime // Максимално време
							}}
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
		</>
	);
};



function getRandomIndex(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default YouTubeAudioPlayer;