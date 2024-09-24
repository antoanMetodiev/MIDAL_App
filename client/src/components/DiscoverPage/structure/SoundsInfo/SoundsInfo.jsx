import style from "./SoundsInfo.module.css";
import backImage from "../../resources/images/monkey.png";

import soundsInfoData from "../utils/contentSection";
import Card from "./structure/Card/Card";

const SoundsInfo = () => {


    return (
        <article className={style['sounds-info-container']}>
            <span className={style['black-shadow']} />
            <img
                className={style['backImage']}
                src={backImage}
                alt="backImage"
            />

            <h2 className={style['sounds-info-container_title']}>Powerful Sound For Any Purpose.</h2>

            <div className={style['content']}>
                {soundsInfoData.map(soundInfo => <Card key={soundInfo.text} data={soundInfo} />)}
            </div>
        </article>
    );
};

export default SoundsInfo;