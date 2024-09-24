import Overview from "./structure/Overview/Overview";
import CarouselPlaylist from "./structure/CarouselPlaylist/CarouselPlaylist";
import SoundsInfo from "./structure/SoundsInfo/SoundsInfo";
import PaymentPlans from "./structure/PaymentPlans/PaymentPlans";

const DiscoverPage = () => {

    
    return (
        <article>
            <Overview />
            <CarouselPlaylist />
            <SoundsInfo />
            <PaymentPlans />
        </article>
    );
};

export default DiscoverPage;