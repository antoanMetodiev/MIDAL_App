import style from "./Card.module.css";

const Card = ({
    data
}) => {

    return (
        <div className={style['card']}>
            <img 
                className={style['carousel-image']}
                src={data.image}
                alt="carousel-image"
             />

           <section className={style['card-content']}>
                 <h2>{data.title}</h2>
                 <p>{data.text}</p>
           </section>
        </div>
    );
};

export default Card;