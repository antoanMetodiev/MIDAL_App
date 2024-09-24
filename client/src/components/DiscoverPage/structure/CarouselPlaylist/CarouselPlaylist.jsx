import style from "./CarouselPlaylist.module.css";
import Card from "./structure/Card/Card";


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";


import allCardsData from "../utils/allCardsData";

const CarouselPlaylist = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 700,
        slidesToShow: 3,
        slidesToScroll: 1,
    };

    return (
        <article className={style['carousel-Playlist-container']}>
            <div className={style['card-list']}>
                <Slider {...settings}>
                    {allCardsData.map(card => <Card key={card.text} data={card} />)}
                </Slider>
            </div>
        </article>
    );
};

export default CarouselPlaylist;