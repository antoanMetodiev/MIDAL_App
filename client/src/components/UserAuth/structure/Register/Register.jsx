import style from "./Register.module.css";

import backImage from "../images/promo.jfif";
import ImageUpload from "./structure/ImageUpload";

import axios from "axios";
import cookies from "js-cookie";
import { useState } from "react";

const Register = ({
    setHideBothHandler,
    setUserDataHandler,
}) => {
    const [showImageUpload, setShowImageUpload] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    async function registerUser(event) {
        event.preventDefault();

        let userData = {
            username: event.target.username.value,
            email: event.target.email.value,
            password: event.target.password.value,
        };

        // Поставям imageURL и тайна дума (само ако user-a си ги е въвел - те не са задължителни..)
        if (imageUrl.length > 0) userData.imageURL = imageUrl;
        if (event.target.secret_world.value.length > 0) {
            userData.secret_world = event.target.secret_world.value;
        }

        event.target.reset();

        try {
            const response = await axios.post('http://localhost:8080/register', { user: userData });
            userData = response.data;

            console.log(userData);
            localStorage.setItem("MIDAL_USER", JSON.stringify(userData));
            setUserDataHandler(userData);
        } catch (error) {
            console.log(error);
        }
    };


    const activateSetHideBothHandler = () => {
        setHideBothHandler();
    };

    const showImageUploadHandler = () => {
        setShowImageUpload(true);
    };

    return (
        <article className={style['register-wrapper']}>

            <img
                className={style['back-image']}
                src={backImage}
                alt="backImage"
            />

            <h4 className={style['hide-register']} onClick={activateSetHideBothHandler}>Hide..</h4>

            <form
                onSubmit={registerUser}
                className={style['register-form']}
            >
                <div className={style['username-wrapper']}>
                    <label htmlFor="username">Пълно Име</label>
                    <input type="text" name="username" id="username" />
                </div>

                <div className={style['email-wrapper']}>
                    <label htmlFor="email">Имейл</label>
                    <input type="email" name="email" id="email" />
                </div>

                <div className={style['password-wrapper']}>
                    <label htmlFor="password">Парола</label>
                    <input type="password" name="password" id="password" />
                </div>

                <div className={style['password-wrapper']}>
                    <label htmlFor="profile-image">Профилна Снимка</label>
                    <ImageUpload imageUrl={imageUrl} setImageUrl={setImageUrl} />
                </div>

                <div className={style['password-wrapper']}>
                    <label htmlFor="secret-world">Тайна Дума</label>
                    <input type="text" name="secret_world" id="secret-world" />
                </div>

                <button>Регистрация</button>
            </form>
        </article>
    );
};

export default Register;