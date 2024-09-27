
import style from "./UserAuth.module.css";
import Register from "./structure/Register/Register";

const UserAuth = () => {


    return (
        <article className={style['register-login-wrapper']}>
            <Register />
        </article>
    );
};


export default UserAuth;