import { useState } from "react";
import style from "./FriendsList.module.css";

import SearchEngine from "./structure/SearchEngine/SearchEngine";

const FriendsList = ({
    userDetailsData
}) => {
    const [filteredFriends, setFilteredFriends] = useState([]);





    return (
        <article className={style['friends-list-container-wrapper']}>
            <SearchEngine
                userDetailsData={userDetailsData}
                setFilteredFriends={setFilteredFriends}
            />

            <h3 className={style['friends-h3-title']}>Приятели</h3>

            <section className={style['friends-list-container']}>

                {filteredFriends.length > 0 ?
                    filteredFriends.map(friend => {
                        return (
                            <div className={style['friend-container']}>
                                <img
                                    className={style['friend-img']}
                                    src={friend.imgURL}
                                    alt="friend.imgURL"
                                />
                                <h5 className={style['friend-name']}>{friend.name}</h5>
                            </div>
                        )
                    }
                    ) : (
                        <>
                            {userDetailsData.friendsList.length > 0 && userDetailsData.friendsList.map(friend => {
                                return (
                                    <>
                                        <div className={style['friend-container']}>
                                            <img
                                                className={style['friend-img']}
                                                src={friend.imgURL}
                                                alt="friend.imgURL"
                                            />
                                            <h5 className={style['friend-name']}>{friend.name}</h5>
                                        </div>
                                    </>
                                )
                            })}
                        </>
                    )}

            </section>
        </article>
    );
}

export default FriendsList;