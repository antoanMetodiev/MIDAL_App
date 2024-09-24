import style from "./Body.module.css";
import playlistImage from "../../../../resources/images/playlist.png";

const Body = () => {

    return (
        <article className={style['wrapper']}>

            <aside className={style['aside-content-container']}>
                <h2>Find Yourself. Listen Deep. Feel Alive</h2>
                <p>Listen to your favorite songs and podcasts with best-in-class sound.</p>
                <button>Try it for free.</button>
            </aside>

            <div className={style['image-container']}>
                <img src={playlistImage} alt="songs-image" />
            </div>

        </article>
    );
}

export default Body;