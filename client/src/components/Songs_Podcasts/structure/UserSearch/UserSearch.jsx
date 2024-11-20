import axios from "axios";
import { useEffect, useRef, useState } from "react";

import style from "./UserSearch.module.css"

const UserSearch = ({
    searchTerm,
    myUserData,
    setMyUserDataHandler,
    friendsRequestsContainerRef,
    showMoreOptionsHandler,
}) => {
    const [receivedUsers, setReceivedUsers] = useState([]);

    // Получен FriendList и МОЯТ FriendList..
    const [myFriendsList, setMyFriendsList] = useState([]);
    const [invitedFriends, setInvitedFriends] = useState([]);
    const nameRef = useRef(null);


    useEffect(() => {
        if (myUserData._id) {
            const invPersonList = myUserData.invitedFriends;

            const currentUsers = [];
            for (let i = 0; i < invPersonList.length; i++) {
                currentUsers.push(invPersonList[i].name + "-" + (invPersonList[i].userId ? invPersonList[i].userId : invPersonList[i].id));
            }

            setInvitedFriends(currentUsers);
        }

    }, [myUserData]);

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




    // Invite, Close PERSON/FRIEND Functions:

    let invitePerson = async (id, name, imgURL) => {
        const myData = JSON.parse(localStorage.getItem('MIDAL_USER'));

        debugger;
        try {
            const message = await axios.post('http://localhost:8080/add-friend-request', {
                id: id, name: name, imgURL: imgURL, myData: myUserData
            });

            // Добавяне и в localceStorage за да не се налага да рефрешвам:
            const newFriend = { id: id, name: name, imgURL: imgURL };

            const checkIfIsContaining = myData.invitedFriends
                .filter(inviteRequest => inviteRequest.id == newFriend.id);

            if (checkIfIsContaining.length == 0) {
                myData.invitedFriends.push(newFriend);
                localStorage.setItem('MIDAL_USER', JSON.stringify(myData));

                let invitedFriendString = `${name}-${id}`;
                let newInvitedFriendsList = invitedFriends.slice();
                newInvitedFriendsList.push(invitedFriendString)
                setInvitedFriends(newInvitedFriendsList);

                setMyUserDataHandler(myData);
            }

        } catch (error) {
            console.log(error);
        }
    };

    let cancelInvitationRequest = async (personId, name, imgURL) => {

        debugger;
        try {
            const response = await axios.post("http://localhost:8080/cancel-primary-friend-request", {
                myData: myUserData,
                personData: {
                    personId: personId,
                    personName: name,
                    personImgURL: imgURL
                }
            });

            console.log(response.data.myNewUserData);

            localStorage.setItem("MIDAL_USER", JSON.stringify(response.data.myNewUserData));
            setMyUserDataHandler(response.data.myNewUserData);

        } catch (error) {
            console.log(error);
        }
    };


    async function removeFriend(personData) {

        try {
            const response = await axios.post("http://localhost:8080/remove-friend", {
                personData: personData,
                myData: myUserData,
            });

            console.log(response.data.myNewUserData);

            localStorage.setItem("MIDAL_USER", JSON.stringify(response.data.myNewUserData));
            setMyUserDataHandler(response.data.myNewUserData);

        } catch (error) {
            console.log(error);
        };
    };



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

                        {myUserData.friendsList &&
                            myUserData.friendsList
                                .filter(friend => friend.id == user._id).length > 0
                            ? (
                                <>
                                    <h4
                                        onClick={(event) => {
                                            let blockOrRemoveWrapperContainer = event.target.nextElementSibling;

                                            if (blockOrRemoveWrapperContainer.style.display == "none" || blockOrRemoveWrapperContainer.style.display == "") {
                                                blockOrRemoveWrapperContainer.style.display = "block";
                                            } else {
                                                blockOrRemoveWrapperContainer.style.display = "none";
                                            }

                                        }}
                                        className={style['add-friend']}
                                    >
                                        Приятели :
                                    </h4>

                                    <div className={style['block-remove-person-wrapper']}>
                                        <h4 onClick={() => {
                                            removeFriend({
                                                personId: user._id,
                                                personName: user.username,
                                            });
                                        }}>
                                            Премахване от приятели
                                        </h4>
                                        <h4>Блокиране</h4>
                                    </div>

                                </>
                            ) : myUserData.friendsRequests
                                .filter(request => (request.requesterId ? request.requesterId : request.id) == user._id).length > 0 ? (
                                <h4
                                    onClick={() => {
                                        debugger;
                                        showMoreOptionsHandler(true);

                                        console.log(friendsRequestsContainerRef.current);
                                        if (friendsRequestsContainerRef.current) {

                                            friendsRequestsContainerRef.current.style.display = "flex";
                                        }
                                    }}
                                    className={style['add-friend']}
                                >
                                    Ви изпрати покана..
                                </h4>
                            ) : (
                                <>
                                    {!invitedFriends.includes(`${user.username}-${user._id}`) ? (
                                        <h4
                                            onClick={() => {
                                                invitePerson(user._id, user.username, user.imageURL);
                                            }}
                                            className={style['add-friend']}
                                        >
                                            Добави Приятел
                                        </h4>
                                    ) : (
                                        <>
                                            <h4
                                                className={style['add-friend']}
                                                onClick={() => {

                                                    cancelInvitationRequest(user._id, user.username, user.imageURL);
                                                }}
                                            >
                                                Отмяна на поканата..
                                            </h4>
                                        </>
                                    )}
                                </>
                            )}


                    </div>
                ))
            )}
        </div>
    )
}


export default UserSearch;