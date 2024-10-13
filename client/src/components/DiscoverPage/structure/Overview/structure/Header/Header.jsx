import style from "./Header.module.css";
import midalLogo from "../../../../resources/images/midal-logo.jpg";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import { CLIENT_ID, REDIRECT_URI, SCOPE } from "../../../../../GoogleAuth/spotifyClient_data";

import cookies from "js-cookie";

const Header = ({
    setShowRegisterHandler,
    setShowLoginHandler,
    isRegistered,
    setIsRegisteredHandler,
}) => {
    const navigate = useNavigate();

    const loginWithGoogle = async () => {
        navigate('/songs-podcasts');

        // const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}&access_type=offline&prompt=consent`;
        // window.location.href = oauthUrl;
    };

    function showRegisterOrLoginForm(event) {
        if (event.target.textContent == 'Sing In') {
            setShowLoginHandler(true);
            setShowRegisterHandler(false);
        } else {
            setShowRegisterHandler(true);
            setShowLoginHandler(false);
        };
    };

    const logOut = () => {
        localStorage.removeItem("MIDAL_USER")
        setIsRegisteredHandler(false);
    };


    return (
        <header className={style['header-container']}>

            <div className={style['title-logo-container']}>
                <img
                    className={style['midal-logo']}
                    src={midalLogo}
                    alt="midal-log"
                />
                <h1>MIDAL</h1>
            </div>

            <nav className={style['overview-navigation']}>
                <ul>

                    <li
                        className={style['songs-podcasts-li-item']}
                        onClick={loginWithGoogle}
                    >Songs & Podcasts</li>
                    <li>For The Creator</li>


                    {!isRegistered ? (
                        <>
                            <li onClick={showRegisterOrLoginForm}>Sing In</li>
                            <li onClick={showRegisterOrLoginForm}>Sing Up</li>
                        </>
                    ) : (
                        <li onClick={logOut}>Log Out</li>
                    )}


                </ul>
            </nav>

        </header>
    );
};

export default Header;