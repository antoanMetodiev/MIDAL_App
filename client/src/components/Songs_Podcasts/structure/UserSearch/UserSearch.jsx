import axios from "axios";
import { useEffect, useRef, useState } from "react";

import style from "./UserSearch.module.css"

const UserSearch = ({
    searchTerm,
}) => {
    const [receivedUsers, setReceivedUsers] = useState([]);

    // Получен FriendList и МОЯТ FriendList..
    const [myFriendsList, setMyFriendsList] = useState([]);
    const nameRef = useRef(null);


    useEffect(() => {
        const friendsList = JSON.parse(localStorage.getItem('MIDAL_USER')).friendsList;

        debugger;
        console.log(friendsList)

        const currentUsers = [];
        for (let i = 0; i < friendsList.length; i++) {
            currentUsers.push(friendsList[i].name + "-" + friendsList[i].id);
        }

        setMyFriendsList(currentUsers);
    }, []);

    useEffect(() => {
        const solve = async () => {
            let searchedUsers = await axios.post("http://localhost:8080/search-user", { username: searchTerm });
            const usersData = searchedUsers.data;

            // const responsedUsers = [];
            // for (let i = 0; i < searchedUsers.data.length; i++) {
            //     responsedUsers.push(usersData[i].username + "-" + usersData[i]._id);
            // }

            setReceivedUsers(searchedUsers.data);
        };

        if (searchTerm.length > 0) {
            solve();
        };

    }, [searchTerm]);


    const addFriend = async (id, name, imgURL) => {
        const myData = JSON.parse(localStorage.getItem('MIDAL_USER'));

        debugger;
        try {
            const message = await axios.post('http://localhost:8080/add-friend', {
                id: id, name: name, imgURL: imgURL, myData: myData
            });



            if (message.data.text === "Поканата е изпратена!") {
                // Добавяне и в localceStorage за да не се налага да рефрешвам:
                const newFriend = { id: id, name: name, imgURL: imgURL };
                myData.friendsList.push(newFriend);
                localStorage.setItem('MIDAL_USER', JSON.stringify(myData));

                const newObject = myFriendsList.slice();
                newObject.push(newFriend);
                setMyFriendsList(newObject);
                console.log(newObject);
            }
        } catch (error) {
            console.log(error);
        }
    };


    console.log(myFriendsList);

    const addedFriendOptions = () => {


    };

    console.log(myFriendsList);

    return (
        <div className={style['received-users-container']}>

            {receivedUsers.length > 0 && (
                receivedUsers.map(user => (
                    <div className={style['user-container']} key={user._id}>
                        <img
                            className={style['user-image']}
                            src={user.imageURL}
                            alt="User Avatar"
                        />
                        <h3 ref={nameRef}>{user.username}</h3>
                        <h6>Профил</h6>

                        {myFriendsList.includes(`${user.username}-${user._id}`) ? (
                            <h4
                                className={style['add-friend']}
                                onClick={() => {
                                    addedFriendOptions(user.id);
                                }}
                            >Приятели</h4>
                        ) : (

                            <h4
                                onClick={() => {
                                    addFriend(user._id, user.username, user.imageURL);
                                }}
                                className={style['add-friend']}
                            >Добави Приятел</h4>
                        )}


                    </div>
                ))
            )}
        </div>
    )
}

export default UserSearch;