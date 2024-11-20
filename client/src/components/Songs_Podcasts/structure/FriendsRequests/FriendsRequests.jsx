
import axios from "axios";
import style from "./FriendsRequests.module.css";
import { useEffect } from "react";

const FriendsRequests = ({
    myUserData,
    setMyUserDataHandler,
    friendsRequestsContainerRef,
    prerender,
    setPrerenderHandler,
}) => {
    
    useEffect(() => {
        if (prerender) {
            friendsRequestsContainerRef.current.style.display = "flex";
            setPrerenderHandler(false);
        }

    }, [prerender]);


    const sendResponseOnServer = async (operationString, personData) => {
        
        debugger;
        try {
            const response = await axios.post(`http://localhost:8080/${operationString}-friend-request`, {
                myUserData: myUserData,
                personData: personData
            });
            console.log(response);

            localStorage.setItem("MIDAL_USER", JSON.stringify(response.data.myNewUserData));
            setMyUserDataHandler(response.data.myNewUserData);

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div 
            ref={friendsRequestsContainerRef}
            className={style['friends-requests-container']}
        >
            {myUserData && myUserData.friendsRequests ? (
                myUserData.friendsRequests.map(request => {
                    return (
                        <section
                            key={request.requesterId ? request.requesterId : request.id}
                            className={style['one-request-container']}
                        >
                            <img src={request.requesterImgURL ? request.requesterImgURL : request.imgURL} alt={request.requesterImgURL ? request.requesterImgURL : request.imgURL} />
                            <h3>{request.requesterNames ? request.requesterNames : request.name}</h3>
                            <div
                                onClick={(event) => {
                                    console.log(event.target.textContent === "Приеми" ? "accept" : "cancel");
                                    sendResponseOnServer(event.target.textContent === "Приеми" ? "accept" : "cancel", {
                                        id: request.id ? request.id : request.requesterId,
                                        name: request.name ? request.name : request.requesterNames,
                                        imgURL: request.imgURL ? request.imgURL : request.requesterImgURL
                                    });
                                }}
                                className={style['accept-cancel-wrapper']}
                            >
                                <h4>Приеми</h4>
                                <h4>Откажи</h4>
                            </div>
                        </section>
                    )
                })
            ) : (
                <h1>Няма покани за приятелство.</h1>
            )}
        </div>
    );
}

export default FriendsRequests;