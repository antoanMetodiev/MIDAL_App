import style from "./UserAuth.module.css";
import Register from "./structure/Register/Register";
import Login from "./structure/Login/Login";
import { useState } from "react";

const UserAuth = ({
    showRegister,
    showLogin,
    setShowLoginHandler,
    setShowRegisterHandler,
    setUserDataHandler,
}) => {
    const [hideBoth, setHideBoth] = useState(false);

    function setHideBothHandler() {
        setShowLoginHandler(false);
        setShowRegisterHandler(false);
    };

    return (
        <>
            {showRegister &&
                <Register
                    setUserDataHandler={setUserDataHandler}
                    setHideBothHandler={setHideBothHandler}
                />}
            {showLogin && <Login
                setUserDataHandler={setUserDataHandler}
                setHideBothHandler={setHideBothHandler}
            />}
        </>
    );
};


export default UserAuth;