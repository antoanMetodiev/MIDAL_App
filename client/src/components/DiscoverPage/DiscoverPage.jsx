import Overview from "./structure/Overview/Overview";
import CarouselPlaylist from "./structure/CarouselPlaylist/CarouselPlaylist";
import SoundsInfo from "./structure/SoundsInfo/SoundsInfo";

const DiscoverPage = ({
    isRegistered,
    setShowSignFormHandler,
    setIsRegisteredHandler,
}) => {

    
    return (
        <article>
            <Overview 
                setShowSignFormHandler={setShowSignFormHandler}
                isRegistered={isRegistered}
                setIsRegisteredHandler={setIsRegisteredHandler}
            />
            <CarouselPlaylist />
            <SoundsInfo />
        </article>
    );
};

export default DiscoverPage;