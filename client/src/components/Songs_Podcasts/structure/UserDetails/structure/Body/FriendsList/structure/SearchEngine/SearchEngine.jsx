import style from "./SearchEngine.module.css";

const SearchEngine = ({
    userDetailsData,
    setFilteredFriends
}) => {

    console.log(userDetailsData);

    function searchFriendsWithPattern(event) {
        debugger;
        const value = event.target.value;

        setFilteredFriends(userDetailsData.friendsList
            .filter(friend => friend.name.toLowerCase().includes(event.target.value.toLowerCase())));
    };

    return (
        <form className={style['search-engine-form']}>
            <input onChange={searchFriendsWithPattern} type="text" />
        </form>
    )
}

export default SearchEngine;