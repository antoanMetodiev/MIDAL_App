import style from "./UserAuth.module.css";
import Register from "./structure/Register/Register";
import Login from "./structure/Login/Login";
import { useRef, useState } from "react";

import movingImage from "./structure/images/concert.jpg";
import registerLoginBack from "./structure/images/Register_Login-back.webp";

const UserAuth = ({
    showRegister,
    showLogin,
    setShowLoginHandler,
    setShowRegisterHandler,
    setUserDataHandler,
    showSignForm,
    setShowSignFormHandler
}) => {
    

    function setHideBothHandler() {
        setShowLoginHandler(false);
        setShowRegisterHandler(false);
    };

    //References:
    let movingImageRef = useRef(null);
    let showRegisterOrLoginFormRef = useRef(null);


    // Animations Functions:
    let showLoginOrRegisterFormHandler = (event) => {
        debugger;
        if (event.target.textContent === "Влез в профила си..") {

            movingImageRef.current.style.left = "0%";
            movingImageRef.current.style.borderTopLeftRadius = "2em";
            movingImageRef.current.style.borderBottomLeftRadius = "2em";
            movingImageRef.current.style.borderTopRightRadius = "0em";
            movingImageRef.current.style.borderBottomRightRadius = "0em";
            showRegisterOrLoginFormRef.current.style.left = "25%";
            event.target.textContent = "Създай профил.."

        } else if (event.target.textContent === "Създай профил..") {


            movingImageRef.current.style.left = "47%";
            movingImageRef.current.style.borderTopRightRadius = "2em";
            movingImageRef.current.style.borderBottomRightRadius = "2em";
            movingImageRef.current.style.borderTopLeftRadius = "0em";
            movingImageRef.current.style.borderBottomLeftRadius = "0em";
            showRegisterOrLoginFormRef.current.style.left = "75%";
            event.target.textContent = "Влез в профила си.."
        }
    }

    // Hide Sign Form Function:
    let hideSignFormHandler = () => { setShowSignFormHandler(false) };


    return (
        <>
            {showSignForm && (
                <div className={style['register-login-container']}>
                    <h4 onClick={hideSignFormHandler} className={style['close-sign-form']}>Затвори</h4>
                    <span className={style['black-shadow']}></span>
                    <img className={style['register-login-back']} src={registerLoginBack} alt="registerLoginBack" />

                    <Register
                        setUserDataHandler={setUserDataHandler}
                        setHideBothHandler={setHideBothHandler}
                    />
                    <>
                        <h3
                            ref={showRegisterOrLoginFormRef}
                            onClick={showLoginOrRegisterFormHandler}
                            className={style['sign-in-your-profileH3']}
                        >
                            Влез в профила си..
                        </h3>

                        <span className={style['black-shadow-V2']}></span>
                        <img ref={movingImageRef} className={style['moving-image']} src={movingImage} alt="movingImage" />
                    </>
                    <Login
                        setUserDataHandler={setUserDataHandler}
                        setHideBothHandler={setHideBothHandler}
                    />
                </div>
            )}

            {/* {showRegister &&
                <Register
                    setUserDataHandler={setUserDataHandler}
                    setHideBothHandler={setHideBothHandler}
                />}
            {showLogin && <Login
                setUserDataHandler={setUserDataHandler}
                setHideBothHandler={setHideBothHandler}
            />} */}
        </>
    );
};


export default UserAuth;