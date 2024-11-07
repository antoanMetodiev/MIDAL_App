
import axios from "axios";
import style from "./FriendsRequests.module.css";

const FriendsRequests = ({
    myUserData,
}) => {

    const sendResponseOnServer = async (operationString, personData) => {

        try {
            const response = await axios.post(`http://localhost:8080/${operationString}-friend-request`, {
                operationString, personData,
                myUserData: myUserData
            });


        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className={style['friends-requests-container']}>
            {myUserData && myUserData.friendsRequests ? (
                myUserData.friendsRequests.map(request => {
                    return (
                        <section
                            key={request.id}
                            className={style['one-request-container']}
                        >
                            <img src={request.imgURL} alt={request.imgURL} />
                            <h3>{request.name}</h3>
                            <div
                                onClick={(event) => {
                                    console.log(event.target.textContent === "Приеми" ? "accept" : "cancel");
                                    sendResponseOnServer(event.target.textContent === "Приеми" ? "accept" : "cancel", {
                                        id: request.id,  // - това е на човека, който ми е изпратил покана..
                                        name: request.name,
                                        imgURL: request.imgURL,
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