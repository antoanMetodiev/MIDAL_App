import style from "./Login.module.css";

import axios from "axios";

const Login = ({
    setUserDataHandler,
}) => {


    const loginUser = async (event) => {
        event.preventDefault();

        try {
            const data = {
                username: event.target.username.value,
                password: event.target.password.value,
            };

            const userData = await axios.post('http://localhost:8080/login', { user: data });

            console.log(userData.data)
            setUserDataHandler(userData.data);


        } catch (err) {
            console.log('Edna zaqvka da ne mojesh da napravish v "/login"');
        }
    };


    return (
        <article className={style['login-wrapper']}>
            <form
                onSubmit={loginUser}
                className={style['login-form']}
            >
                <div className={style['username-wrapper']}>
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" id="username" />
                </div>

                <div className={style['password-wrapper']}>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" />
                </div>

                <button>Login</button>
            </form>
        </article>
    );
};

export default Login;