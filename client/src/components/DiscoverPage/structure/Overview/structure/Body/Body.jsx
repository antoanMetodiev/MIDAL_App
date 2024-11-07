import style from "./Body.module.css";
import playlistImage from "../../../../resources/images/playlist.png";

const Body = () => {

    return (
        <article className={style['wrapper']}>


            <aside className={style['aside-content-container']}>
                <h3 className={style['h3-motivation']}>Слушай любимата си музика и подкасти напълно <span className={style['without-advertisements']}>БЕЗ РЕКЛАМИ</span>.</h3>
                <p>Следи в <span className={style['without-advertisements']}>РЕАЛНО ВРЕМЕ</span> какво слушат приятелите ти и се присъедини към тях с най-добрия звук!</p>
                <button>Опитай безплатно.</button>
            </aside>

            <div className={style['image-container']}>
                <img src={playlistImage} alt="songs-image" />
            </div>

        </article>
    );
}

export default Body;