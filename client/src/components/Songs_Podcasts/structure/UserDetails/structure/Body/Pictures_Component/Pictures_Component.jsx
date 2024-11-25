import { useRef } from "react";
import style from "./Pictures_Component.module.css";

import AddPhotos_Component from "./structure/AddPhotos_Component/AddPhotos_Component";

const Pictures_Component = ({
    myUserData,
    userDetailsData,
    setMyUserDataHandler,
}) => {

    // References: 
    const addPhotos_Component_Ref = useRef(null);


    function showAddPhotos_Comp_Handler(event) {
        if (event.target.textContent == "Качете снимка...") {
            addPhotos_Component_Ref.current.style.display = "block";
            event.target.textContent = "Скрии.."
        } else {
            addPhotos_Component_Ref.current.style.display = "none";
            event.target.textContent = "Качете снимка..."
        }
    }


    return (
        <article className={style['pictures-container-wrapper']}>
            <button
                onClick={showAddPhotos_Comp_Handler}
                className={style['upload-image-button-shower']}
            >
                Качете снимка...
            </button>

            {myUserData._id == userDetailsData._id && (

                <AddPhotos_Component
                    addPhotos_Component_Ref={addPhotos_Component_Ref}
                    myUserData={myUserData}
                    setMyUserDataHandler={setMyUserDataHandler}
                />
            )}

            {/* Pictures: */}

            <article className={style['pictures-container']}>
                <h3 className={style['pictures-h3-title']}>Снимки</h3>

                <section className={style['pictures-container-section']}>
                    {myUserData.myPictures.length > 0 ? myUserData.myPictures.map(pictureObj => {
                        return (
                            <>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.imgURL}
                                        alt="pictureObj.imgURL"
                                    />

                                    <h5>{pictureObj.text ? "" + pictureObj.text : ""}</h5>
                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.imgURL}
                                        alt="pictureObj.imgURL"
                                    />

                                    <h5>{pictureObj.text ? "" + pictureObj.text : ""}</h5>
                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.imgURL}
                                        alt="pictureObj.imgURL"
                                    />

                                    <h5>{pictureObj.text ? "" + pictureObj.text : ""}</h5>
                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.imgURL}
                                        alt="pictureObj.imgURL"
                                    />

                                    <h5>{pictureObj.text ? "" + pictureObj.text : ""}</h5>
                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.imgURL}
                                        alt="pictureObj.imgURL"
                                    />

                                    <h5>{pictureObj.text ? "" + pictureObj.text : ""}</h5>
                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.imgURL}
                                        alt="pictureObj.imgURL"
                                    />

                                    <h5>{pictureObj.text ? "" + pictureObj.text : ""}</h5>
                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.imgURL}
                                        alt="pictureObj.imgURL"
                                    />

                                    <h5>{pictureObj.text ? "" + pictureObj.text : ""}</h5>
                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.imgURL}
                                        alt="pictureObj.imgURL"
                                    />

                                    <h5>{pictureObj.text ? "" + pictureObj.text : ""}</h5>
                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.imgURL}
                                        alt="pictureObj.imgURL"
                                    />

                                    <h5>{pictureObj.text ? "" + pictureObj.text : ""}</h5>
                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.imgURL}
                                        alt="pictureObj.imgURL"
                                    />

                                    <h5>{pictureObj.text ? "" + pictureObj.text : ""}</h5>
                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.imgURL}
                                        alt="pictureObj.imgURL"
                                    />

                                    <h5>{pictureObj.text ? "" + pictureObj.text : ""}</h5>
                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.imgURL}
                                        alt="pictureObj.imgURL"
                                    />

                                    <h5>{pictureObj.text ? "" + pictureObj.text : ""}</h5>
                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.imgURL}
                                        alt="pictureObj.imgURL"
                                    />

                                    <h5>{pictureObj.text ? "" + pictureObj.text : ""}</h5>
                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.imgURL}
                                        alt="pictureObj.imgURL"
                                    />

                                    <h5>{pictureObj.text ? "" + pictureObj.text : ""}</h5>
                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.imgURL}
                                        alt="pictureObj.imgURL"
                                    />

                                    <h5>{pictureObj.text ? "" + pictureObj.text : ""}</h5>
                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.imgURL}
                                        alt="pictureObj.imgURL"
                                    />

                                    <h5>{pictureObj.text ? "" + pictureObj.text : ""}</h5>
                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.imgURL}
                                        alt="pictureObj.imgURL"
                                    />

                                    <h5>{pictureObj.text ? "" + pictureObj.text : ""}</h5>
                                </div>
                                <div className={style['picture-container-wrapper']}>
                                    <img
                                        className={style['my-picture-img']}
                                        src={pictureObj.imgURL}
                                        alt="pictureObj.imgURL"
                                    />

                                    <h5>{pictureObj.text ? "" + pictureObj.text : ""}</h5>
                                </div>
                            </>
                        )
                    }) : (
                        <h3 className={style['dontHave-images-H3']}>Няма публикувани снимки</h3>
                    )}
                </section>



            </article>



        </article>
    );
};

export default Pictures_Component;