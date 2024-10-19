import './App.css';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import cookies from "js-cookie";
import axios from "axios";

import DiscoverPage from './components/DiscoverPage/DiscoverPage';
import GoogleHandler from './components/GoogleAuth/GoogleHandler';
import Songs_Podcasts from './components/Songs_Podcasts/Songs_Podcasts';
import UserAuth from './components/UserAuth/UserAuth';
import PocketBaseLogin from './components/PocketBase/PocketBaseLogin';

function App() {
	const [showLogin, setShowLogin] = useState(false);
	const [showRegister, setShowRegister] = useState(false);
	const [userData, setUserData] = useState({});
	const [isRegistered, setIsRegistered] = useState(false);

	useEffect(() => {

		const checkSession = async () => {
			const userData = JSON.parse(localStorage.getItem("MIDAL_USER"));

			if (userData) {
				try {
					const response = await axios.post('http://localhost:8080/is-valid-token', { _id: userData._id });
					const responsedUser = response.data;

					if (responsedUser) {
						setIsRegistered(true);
						setUserData(responsedUser);
					}

				} catch (error) {
					console.log(error);
				};
			}
		};

		checkSession();

	}, []);



	const setShowLoginHandler = (value) => {
		setShowLogin(value);
	};

	const setShowRegisterHandler = (value) => {
		setShowRegister(value);
	};

	const setUserDataHandler = (value) => {
		setIsRegistered(true);
		setUserData(value);
	};

	function setIsRegisteredHandler(value) {
		setIsRegistered(value);
	};


	return (
		<>
			{/* <PocketBaseLogin /> */}

			<UserAuth
				setUserDataHandler={setUserDataHandler}
				showRegister={showRegister}
				showLogin={showLogin}
				setShowLoginHandler={setShowLoginHandler}
				setShowRegisterHandler={setShowRegisterHandler}
			/>

			<Routes>
				<Route path="/" element={<DiscoverPage
					isRegistered={isRegistered}
					setIsRegisteredHandler={setIsRegisteredHandler}
					setShowRegisterHandler={setShowRegisterHandler}
					setShowLoginHandler={setShowLoginHandler} />}
				/>
				<Route path="/songs-and-podcasts" element={<GoogleHandler />} />
				<Route path="/songs-podcasts" element={<Songs_Podcasts />} />
			</Routes>
		</>
	)
}

export default App;
