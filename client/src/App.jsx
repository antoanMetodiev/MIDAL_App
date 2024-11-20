import './App.css';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import cookies from "js-cookie";
import axios from "axios";

import DiscoverPage from './components/DiscoverPage/DiscoverPage';
import GoogleHandler from './components/GoogleAuth/GoogleHandler';
import Songs_Podcasts from './components/Songs_Podcasts/Songs_Podcasts';
import UserAuth from './components/UserAuth/UserAuth';


function App() {
	const navigate = useNavigate();
	const [showSignForm, setShowSignForm] = useState(false);
	const [userData, setUserData] = useState({});
	const [isRegistered, setIsRegistered] = useState(false);

	useEffect(() => {

		const checkSession = async () => {
			const userData = JSON.parse(localStorage.getItem("MIDAL_USER"));

			if (userData._id) {
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
			} else {
				navigate("/");
			}
		};

		checkSession();

	}, []);


	// На нивото на App-a - правя заявка за да се абонирам за канал в Redis,
	// който ще ми казва дали някой ми е изпратил покана в реално време..
	useEffect(() => {

		if (userData._id) {
			try {
				const subscribeForRequestProvider = async () => {
					const response = await axios.post("http://localhost:8080/friends-requests-channel-provider", {
						myNames: userData.username,
						myId: userData._id,
					});
					console.log(response.data);
					

				}

				subscribeForRequestProvider();
			} catch (error) {
				console.log(error);
			}
		}

	}, [userData]);


	// Functions:
	const setShowSignFormHandler = (value) => {
		setShowSignForm(value);
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
			<UserAuth
				setUserDataHandler={setUserDataHandler}
				showSignForm={showSignForm}
				setShowSignFormHandler={setShowSignFormHandler}
			/>

			<Routes>
				<Route path="/" element={
					<DiscoverPage
						isRegistered={isRegistered}
						setIsRegisteredHandler={setIsRegisteredHandler}
						setShowSignFormHandler={setShowSignFormHandler}
					/>}
				/>
				<Route path="/songs-and-podcasts" element={<GoogleHandler />} />
				<Route path="/songs-podcasts" element={<Songs_Podcasts />} />
			</Routes>
		</>
	)
}

export default App;
