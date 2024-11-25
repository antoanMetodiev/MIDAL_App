import style from "./Body.module.css";
import { useState } from "react";

import Published_Playlists from "./Published_Playlists/Published_Playlists";
import Pictures_Component from "./Pictures_Component/Pictures_Component";
import FriendsList from "./FriendsList/FriendsList";


const Body = ({
    userDetailsData,
    handleVideoSelect,
    showConcreteCategoryString,
    myUserData,
    setMyUserDataHandler,
}) => {


    console.log(userDetailsData);

    return (
        <article className={style['user-details-body']}>

            {showConcreteCategoryString == "Published_Playlists" ? (
                <Published_Playlists
                    handleVideoSelect={handleVideoSelect}
                    userDetailsData={userDetailsData}
                />
            ) : showConcreteCategoryString == "Pictures_Component" ? (
                <Pictures_Component
                    setMyUserDataHandler={setMyUserDataHandler}
                    myUserData={myUserData}
                    userDetailsData={userDetailsData}
                />
            ) : (
                <FriendsList userDetailsData={userDetailsData} />
            )}

        </article>
    )
}

export default Body;