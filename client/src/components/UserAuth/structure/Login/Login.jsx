import style from "./Login.module.css";

import axios from "axios";

const Login = ({
    setUserDataHandler,
    setHideBothHandler,
}) => {


    const loginUser = async (event) => {
        event.preventDefault();

        debugger;
        try {
            const data = {
                username: event.target.username.value,
                password: event.target.password.value,
            };

            let userData = await axios.post('http://localhost:8080/login', { user: data });
            userData = userData.data;

            if (userData.username) {
                setUserDataHandler(userData);
                localStorage.setItem('MIDAL_USER', JSON.stringify(userData));
            }

        } catch (err) {
            console.log('Edna zaqvka da ne mojesh da napravish v "/login"');
        }
    };

    const activateSetHideBothHandler = () => {
        setHideBothHandler();
    };

    return (
        <article  className={style['login-wrapper']}>

            {/* <h4 onClick={activateSetHideBothHandler}>Hide..</h4> */}

            <form
                onSubmit={loginUser}
                className={style['login-form']}
            >
                <div className={style['username-wrapper']}>
                    <label htmlFor="username">Потребителско име</label>
                    <input type="text" name="username" id="username" />
                </div>

                <div className={style['password-wrapper']}>
                    <label htmlFor="password">Парола</label>
                    <input type="password" name="password" id="password" />
                </div>

                <button>Влизане</button>
            </form>
        </article>
    );
};

export default Login;