import style from "./Overview.module.css";
import backVideo from "../../resources/videos/audio-grid.mp4";

import Header from "./structure/Header/Header";

const Overview = () => {


    return (
        <div className={style['overview-container']}>
            <span className={style['black-shadow']} />
            <video
                className={style['backVideo']}
                autoPlay
                loop
                muted
                src={backVideo}
            />

            {/* Here starting the structure: */}
            <Header />


        </div>
    );
}


export default Overview;