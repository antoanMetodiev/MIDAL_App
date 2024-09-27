import style from "./Register.module.css";

import axios from "axios";

const Register = () => {

    async function registerUser(event) {
        event.preventDefault();

        const userData = {
            username: event.target.username.value,
            email: event.target.email.value,
            password: event.target.password.value,
        };

        event.target.reset();

        // debugger;
        const response = await axios.post('http://localhost:8080/register', userData);
        console.log(response.data);
    };



    return (
        <form
            onSubmit={registerUser}
            className={style['register-form']}
        >
            <div className={style['username-wrapper']}>
                <label htmlFor="username">Username</label>
                <input type="text" name="username"  id="username"/>
            </div>

            <div className={style['email-wrapper']}>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" />
            </div>

            <div className={style['password-wrapper']}>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" />
            </div>

            <button>Register</button>
        </form>
    );
};

export default Register;