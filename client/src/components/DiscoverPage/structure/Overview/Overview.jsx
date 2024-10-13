import style from "./Overview.module.css";
import backVideo from "../../resources/videos/audio-grid.mp4";

import Header from "./structure/Header/Header";
import Body from "./structure/Body/Body";

const Overview = ({
    setShowRegisterHandler,
    setShowLoginHandler,
    isRegistered,
    setIsRegisteredHandler
}) => {


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
            <Header 
                isRegistered={isRegistered}
                setIsRegisteredHandler={setIsRegisteredHandler}
                setShowRegisterHandler={setShowRegisterHandler} 
                setShowLoginHandler={setShowLoginHandler} />
            <Body />


        </div>
    );
}


export default Overview;