import Overview from "./structure/Overview/Overview";
import CarouselPlaylist from "./structure/CarouselPlaylist/CarouselPlaylist";
import SoundsInfo from "./structure/SoundsInfo/SoundsInfo";
import PaymentPlans from "./structure/PaymentPlans/PaymentPlans";

const DiscoverPage = ({
    setShowRegisterHandler,
    setShowLoginHandler,
    isRegistered,
    setIsRegisteredHandler,
}) => {

    
    return (
        <article>
            <Overview 
                isRegistered={isRegistered}
                setIsRegisteredHandler={setIsRegisteredHandler}
                setShowRegisterHandler={setShowRegisterHandler} 
                setShowLoginHandler={setShowLoginHandler} 
            />
            <CarouselPlaylist />
            <SoundsInfo />
            <PaymentPlans />
        </article>
    );
};

export default DiscoverPage;