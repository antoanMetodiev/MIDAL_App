import style from "./UserDetails.module.css";

import Header from "./structure/Header/Header";
import Body from "./structure/Body/Body";
import { useEffect, useState } from "react";


const UserDetails = ({
    userDetailsData,
    handleVideoSelect,
    myUserData,
    setMyUserDataHandler,
    optionsContainerRef,
    setShowUserDetailsHandler,
}) => {
    const [showConcreteCategoryString, setShowConcreteCategoryString] = useState("Published_Playlists");

    useEffect(() => {
        optionsContainerRef.current.style.display = "none";
    });

    return (
        <article className={style['user-details-container']}>

            <Header
                userDetailsData={userDetailsData}
                setShowConcreteCategoryString={setShowConcreteCategoryString}
                optionsContainerRef={optionsContainerRef}
                setShowUserDetailsHandler={setShowUserDetailsHandler}
            />
            <Body
                handleVideoSelect={handleVideoSelect}
                userDetailsData={userDetailsData}
                showConcreteCategoryString={showConcreteCategoryString}
                myUserData={myUserData}
                setMyUserDataHandler={setMyUserDataHandler}
            />
        </article>
    );
}

export default UserDetails;