
import { useRef } from "react";
import style from "./Header.module.css";

import backToUsersList from "../../../../resources/images/back-to-songs-list.png";

const Header = ({
    userDetailsData,
    setShowConcreteCategoryString,
    optionsContainerRef,
    setShowUserDetailsHandler,
}) => {

    // References:
    const publishPlaylistCategoryH5Ref = useRef(null);
    const picturesCaterogyH5Ref = useRef(null);
    const friendsCategoryH5Ref = useRef(null);

    // Functions:
    let switchCategoryHandler = (event) => {
        if (event.target.textContent == "Публични плейлисти") {
            setShowConcreteCategoryString("Published_Playlists");

            publishPlaylistCategoryH5Ref.current.style.borderBottom = "0.3px solid #EEEEEE";
            picturesCaterogyH5Ref.current.style.borderBottom = "unset";
            friendsCategoryH5Ref.current.style.borderBottom = "unset";

        } else if (event.target.textContent == "Снимки") {
            setShowConcreteCategoryString("Pictures_Component");

            picturesCaterogyH5Ref.current.style.borderBottom = "0.3px solid #EEEEEE";
            publishPlaylistCategoryH5Ref.current.style.borderBottom = "unset";
            friendsCategoryH5Ref.current.style.borderBottom = "unset";

        } else if (event.target.textContent == "Приятели") {
            setShowConcreteCategoryString("FriendsList");

            friendsCategoryH5Ref.current.style.borderBottom = "0.3px solid #EEEEEE";
            publishPlaylistCategoryH5Ref.current.style.borderBottom = "unset";
            picturesCaterogyH5Ref.current.style.borderBottom = "unset";
        };
    };


    return (
        <div className={style['user-details-header']}>

            <img
                onClick={() => {
                    setShowUserDetailsHandler(false);
                    optionsContainerRef.current.style.display = "flex";
                }}
                className={style['back-to-usersList-img']}
                src={backToUsersList}
                alt="backToUsersList"
            />

            <div className={style['img-name-wrapper-container']}>
                <img
                    className={style['profile-image']}
                    src={userDetailsData.imageURL}
                    alt="SNIMKA"
                />
                <h4 className={style['profile-text']}>Профил</h4>
                <h2 className={style['name']}>
                    {userDetailsData.username}
                </h2>
            </div>

            <section className={style['friends_playlists-count-wrapper-container']}>
                <h5>{userDetailsData.myPublishedPlaylists.length} публични плейлистa</h5>
                •
                <h5>{userDetailsData.friendsList.length} приятели</h5>
            </section>

            <div
                onClick={switchCategoryHandler}
                className={style['options-container']}
            >
                <h5
                    ref={publishPlaylistCategoryH5Ref}
                    className={style['publish-playlist-category-h5']}
                >
                    Публични плейлисти
                </h5>
                <h5 ref={picturesCaterogyH5Ref}>Снимки</h5>
                <h5 ref={friendsCategoryH5Ref}>Приятели</h5>
                {/* <h5>Информация</h5> */}
            </div>

        </div>
    )
};

export default Header;