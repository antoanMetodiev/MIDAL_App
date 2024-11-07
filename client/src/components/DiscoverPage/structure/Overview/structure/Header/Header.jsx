import style from "./Header.module.css";
import midalLogo from "../../../../resources/images/midal-logo.jpg";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import { CLIENT_ID, REDIRECT_URI, SCOPE } from "../../../../../GoogleAuth/spotifyClient_data";

import cookies from "js-cookie";

const Header = ({
    isRegistered,
    setIsRegisteredHandler,
    setShowSignFormHandler
}) => {
    const navigate = useNavigate();

    const loginWithGoogle = async () => {
        navigate('/songs-podcasts');

        // const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}&access_type=offline&prompt=consent`;
        // window.location.href = oauthUrl;
    };

    function showRegisterOrLoginForm(event) {
        debugger;
        if (event.target.textContent == 'Влизане/Регистрация') {
            setShowSignFormHandler(true);
        } else {
            setShowSignFormHandler(false);
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

                    {isRegistered && (
                        <li
                            className={style['songs-podcasts-li-item']}
                            onClick={loginWithGoogle}
                        >
                            Музика и Подкасти
                        </li>
                    )}

                    {!isRegistered ? (
                        <>
                            <li onClick={showRegisterOrLoginForm}>Влизане/Регистрация</li>
                        </>
                    ) : (
                        <li onClick={logOut}>Излизане</li>
                    )}

                    <li>За Създателя</li>
                </ul>
            </nav>

        </header>
    );
};

export default Header;