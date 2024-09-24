import style from "./Header.module.css";
import midalLogo from "../../../../resources/images/midal-logo.jpg";

const Header = () => {


    return(
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
                    <li>For Us</li>
                    <li>Support</li>
                    <li><i className="fa-solid fa-user" /> Sing In</li>
                </ul>

                <button>Try For Free</button>
            </nav>

        </header>
    );
};

export default Header;