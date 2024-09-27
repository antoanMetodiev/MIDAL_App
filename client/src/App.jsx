import './App.css';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


import DiscoverPage from './components/DiscoverPage/DiscoverPage';
import SpotifyAuth from './components/SpotifyAuth/SpotifyAuth';
import Songs_Podcasts from './components/Songs_Podcasts/Songs_Podcasts';
import SpotifyHandler from './components/SpotifyAuth/SpotifyHandler';
import UserAuth from './components/UserAuth/UserAuth';

function App() {


	return (
		<>
			<SpotifyAuth />

			<UserAuth />

			<Routes>
				<Route path="/" element={<DiscoverPage />}/>
				<Route path="/songs-and-podcasts" element={<SpotifyHandler />}/>
				<Route path="/songs-podcasts" element={<Songs_Podcasts />}/>
			</Routes>
		</>
	)
}

export default App;
