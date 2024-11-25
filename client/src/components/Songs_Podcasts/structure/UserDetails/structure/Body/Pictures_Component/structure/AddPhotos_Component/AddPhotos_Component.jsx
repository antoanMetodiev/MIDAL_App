import style from "./AddPhotos_Component.module.css";

import ImageUpload from "../../../../../../../../UserAuth/structure/Register/structure/ImageUpload";
import { useState } from "react";

const AddPhotos_Component = ({
    addPhotos_Component_Ref,
    myUserData,
    setMyUserDataHandler,
}) => {
    const [imageUrl, setImageUrl] = useState("");

    function setImageUrlHandler(value) {
        setImageUrl(value);
    }


    return (
        <div
            ref={addPhotos_Component_Ref}
            className={style['add-photos-container']}
        >

            <ImageUpload
                imageUrl={imageUrl}
                setImageUrl={setImageUrlHandler}
                myUserData={myUserData}
                setMyUserDataHandler={setMyUserDataHandler}
            />
        </div>
    )
}

export default AddPhotos_Component;