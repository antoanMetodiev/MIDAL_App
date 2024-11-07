import style from "./ListeningFriends.module.css";
import onlineImg from "../../resources/images/online.png";
import openFriendList from "../../resources/images/open-friend-list.png";
import { useState, useEffect } from "react";

const ListeningFriends = ({
    myFriendsListens,
}) => {
    const [showFriendContainer, setShowFriendContainer] = useState(false);

    console.log(myFriendsListens);


    function hideOrShowFriendListHandler(event) {
        if (event.target.alt === 'openFriendList') {
            setShowFriendContainer(true);
        } else if (event.target.textContent === 'Скрий..') {
            setShowFriendContainer(false);
        }
    }

    function hideOrShowFriendListHandler(event) {
        if (event.target.alt == 'openFriendList') {
            setShowFriendContainer(true);
        } else if (event.target.textContent == 'Скрий..') {
            setShowFriendContainer(false);
        };
    };

    return (
        <div className={style['listening-friends-wrapper']}>


            {showFriendContainer && (
                <article className={style['main-container']}>

                    {/* <div className={style['background']}>

                    </div> */}

                    {myFriendsListens && (
                        myFriendsListens.map(user => {
                            return (
                                <>
                                    <div className={style['friend-container']}>

                                        <p className={style['song-title']}>
                                            <h6>Слуша..</h6>
                                            {user.message}
                                        </p>
                                        <span className={style['connection-span']}></span>
                                        <img className={style['friend-img']} src={user.imgURL} alt="friend-img" />
                                        {/* <h4>{user.myName}</h4> */}

                                        <img className={style['online-image']} src={onlineImg} alt="online-image" />
                                        <h5 className={style['online-text']}>онлайн..</h5>
                                    </div>
                                    <div className={style['friend-container']}>

                                        <p className={style['song-title']}>
                                            <h6>Слуша..</h6>
                                            {user.message}
                                        </p>
                                        <span className={style['connection-span']}></span>
                                        <img className={style['friend-img']} src={user.imgURL} alt="friend-img" />
                                        {/* <h4>{user.myName}</h4> */}

                                        <img className={style['online-image']} src={onlineImg} alt="online-image" />
                                        <h5 className={style['online-text']}>онлайн..</h5>
                                    </div>
                                    <div className={style['friend-container']}>

                                        <p className={style['song-title']}>
                                            <h6>Слуша..</h6>
                                            {user.message}
                                        </p>
                                        <span className={style['connection-span']}></span>
                                        <img className={style['friend-img']} src={user.imgURL} alt="friend-img" />
                                        {/* <h4>{user.myName}</h4> */}

                                        <img className={style['online-image']} src={onlineImg} alt="online-image" />
                                        <h5 className={style['online-text']}>онлайн..</h5>
                                    </div>
                                    <div className={style['friend-container']}>

                                        <p className={style['song-title']}>
                                            <h6>Слуша..</h6>
                                            {user.message}
                                        </p>
                                        <span className={style['connection-span']}></span>
                                        <img className={style['friend-img']} src={user.imgURL} alt="friend-img" />
                                        {/* <h4>{user.myName}</h4> */}

                                        <img className={style['online-image']} src={onlineImg} alt="online-image" />
                                        <h5 className={style['online-text']}>онлайн..</h5>
                                    </div>
                                    <div className={style['friend-container']}>

                                        <p className={style['song-title']}>
                                            <h6>Слуша..</h6>
                                            {user.message}
                                        </p>
                                        <span className={style['connection-span']}></span>
                                        <img className={style['friend-img']} src={user.imgURL} alt="friend-img" />
                                        {/* <h4>{user.myName}</h4> */}

                                        <img className={style['online-image']} src={onlineImg} alt="online-image" />
                                        <h5 className={style['online-text']}>онлайн..</h5>
                                    </div>
                                    <div className={style['friend-container']}>

                                        <p className={style['song-title']}>
                                            <h6>Слуша..</h6>
                                            {user.message}
                                        </p>
                                        <span className={style['connection-span']}></span>
                                        <img className={style['friend-img']} src={user.imgURL} alt="friend-img" />
                                        {/* <h4>{user.myName}</h4> */}

                                        <img className={style['online-image']} src={onlineImg} alt="online-image" />
                                        <h5 className={style['online-text']}>онлайн..</h5>
                                    </div>
                                    <div className={style['friend-container']}>

                                        <p className={style['song-title']}>
                                            <h6>Слуша..</h6>
                                            {user.message}
                                        </p>
                                        <span className={style['connection-span']}></span>
                                        <img className={style['friend-img']} src={user.imgURL} alt="friend-img" />
                                        {/* <h4>{user.myName}</h4> */}

                                        <img className={style['online-image']} src={onlineImg} alt="online-image" />
                                        <h5 className={style['online-text']}>онлайн..</h5>
                                    </div>
                                    <div className={style['friend-container']}>

                                        <p className={style['song-title']}>
                                            <h6>Слуша..</h6>
                                            {user.message}
                                        </p>
                                        <span className={style['connection-span']}></span>
                                        <img className={style['friend-img']} src={user.imgURL} alt="friend-img" />
                                        {/* <h4>{user.myName}</h4> */}

                                        <img className={style['online-image']} src={onlineImg} alt="online-image" />
                                        <h5 className={style['online-text']}>онлайн..</h5>
                                    </div>
                                    <div className={style['friend-container']}>

                                        <p className={style['song-title']}>
                                            <h6>Слуша..</h6>
                                            {user.message}
                                        </p>
                                        <span className={style['connection-span']}></span>
                                        <img className={style['friend-img']} src={user.imgURL} alt="friend-img" />
                                        {/* <h4>{user.myName}</h4> */}

                                        <img className={style['online-image']} src={onlineImg} alt="online-image" />
                                        <h5 className={style['online-text']}>онлайн..</h5>
                                    </div>
                                    <div className={style['friend-container']}>

                                        <p className={style['song-title']}>
                                            <h6>Слуша..</h6>
                                            {user.message}
                                        </p>
                                        <span className={style['connection-span']}></span>
                                        <img className={style['friend-img']} src={user.imgURL} alt="friend-img" />
                                        {/* <h4>{user.myName}</h4> */}

                                        <img className={style['online-image']} src={onlineImg} alt="online-image" />
                                        <h5 className={style['online-text']}>онлайн..</h5>
                                    </div>
                                    <div className={style['friend-container']}>

                                        <p className={style['song-title']}>
                                            <h6>Слуша..</h6>
                                            {user.message}
                                        </p>
                                        <span className={style['connection-span']}></span>
                                        <img className={style['friend-img']} src={user.imgURL} alt="friend-img" />
                                        {/* <h4>{user.myName}</h4> */}

                                        <img className={style['online-image']} src={onlineImg} alt="online-image" />
                                        <h5 className={style['online-text']}>онлайн..</h5>
                                    </div>
                                    <div className={style['friend-container']}>

                                        <p className={style['song-title']}>
                                            <h6>Слуша..</h6>
                                            {user.message}
                                        </p>
                                        <span className={style['connection-span']}></span>
                                        <img className={style['friend-img']} src={user.imgURL} alt="friend-img" />
                                        {/* <h4>{user.myName}</h4> */}

                                        <img className={style['online-image']} src={onlineImg} alt="online-image" />
                                        <h5 className={style['online-text']}>онлайн..</h5>
                                    </div>

                                </>
                            )
                        })
                    )}
                </article>
            )}

            {!showFriendContainer && (
                <img
                    onClick={hideOrShowFriendListHandler}
                    className={style['openFriendList']}
                    src={openFriendList}
                    alt="openFriendList"
                />
            )}

            {showFriendContainer && (
                <h4 onClick={hideOrShowFriendListHandler} className={style['hide-friend-list']}>
                    Скрий..
                </h4>
            )}
        </div>
    );
};

export default ListeningFriends;
