import axios from "axios";
import { useEffect, useState } from "react";

import style from "./UserSearch.module.css"

const UserSearch = ({
    searchTerm,
}) => {
    const [receivedUsers, setReceivedUsers] = useState([]);

    useEffect(() => {

        const solve = async () => {
            let searchedUsers = await axios.post("http://localhost:8080/search-user", { username: searchTerm });
            console.log(searchedUsers.data);

            setReceivedUsers(searchedUsers.data);
        };

        if (searchTerm.length > 0) {
            solve();
        };

    }, [searchTerm]);


    return (
        <div className={style['received-users-container']}>
            

            <div className={style['user-container']}>
                <img 
                    className={style['user-image']}
                    src="https://stylecaster.com/wp-content/uploads/2024/02/Maria-Bachelor.jpg" 
                    alt="mace"
                 />
                <h3>Sandra</h3>
                <h6>Профил</h6>
            </div>



            <div className={style['user-container']}>
                <img 
                    className={style['user-image']}
                    src="https://stylecaster.com/wp-content/uploads/2024/02/Maria-Bachelor.jpg" 
                    alt="mace"
                 />
                <h3>Sandra</h3>
                <h6>Профил</h6>
            </div>
            <div className={style['user-container']}>
                <img 
                    className={style['user-image']}
                    src="https://stylecaster.com/wp-content/uploads/2024/02/Maria-Bachelor.jpg" 
                    alt="mace"
                 />
                <h3>Sandra</h3>
                <h6>Профил</h6>
            </div>
            <div className={style['user-container']}>
                <img 
                    className={style['user-image']}
                    src="https://stylecaster.com/wp-content/uploads/2024/02/Maria-Bachelor.jpg" 
                    alt="mace"
                 />
                <h3>Sandra</h3>
                <h6>Профил</h6>
            </div>
            <div className={style['user-container']}>
                <img 
                    className={style['user-image']}
                    src="https://stylecaster.com/wp-content/uploads/2024/02/Maria-Bachelor.jpg" 
                    alt="mace"
                 />
                <h3>Sandra</h3>
                <h6>Профил</h6>
            </div>
            <div className={style['user-container']}>
                <img 
                    className={style['user-image']}
                    src="https://stylecaster.com/wp-content/uploads/2024/02/Maria-Bachelor.jpg" 
                    alt="mace"
                 />
                <h3>Sandra</h3>
                <h6>Профил</h6>
            </div>
            <div className={style['user-container']}>
                <img 
                    className={style['user-image']}
                    src="https://stylecaster.com/wp-content/uploads/2024/02/Maria-Bachelor.jpg" 
                    alt="mace"
                 />
                <h3>Sandra</h3>
                <h6>Профил</h6>
            </div>
            <div className={style['user-container']}>
                <img 
                    className={style['user-image']}
                    src="https://stylecaster.com/wp-content/uploads/2024/02/Maria-Bachelor.jpg" 
                    alt="mace"
                 />
                <h3>Sandra</h3>
                <h6>Профил</h6>
            </div>
            <div className={style['user-container']}>
                <img 
                    className={style['user-image']}
                    src="https://stylecaster.com/wp-content/uploads/2024/02/Maria-Bachelor.jpg" 
                    alt="mace"
                 />
                <h3>Sandra</h3>
                <h6>Профил</h6>
            </div>
            <div className={style['user-container']}>
                <img 
                    className={style['user-image']}
                    src="https://stylecaster.com/wp-content/uploads/2024/02/Maria-Bachelor.jpg" 
                    alt="mace"
                 />
                <h3>Sandra</h3>
                <h6>Профил</h6>
            </div>
            <div className={style['user-container']}>
                <img 
                    className={style['user-image']}
                    src="https://stylecaster.com/wp-content/uploads/2024/02/Maria-Bachelor.jpg" 
                    alt="mace"
                 />
                <h3>Sandra</h3>
                <h6>Профил</h6>
            </div>
            <div className={style['user-container']}>
                <img 
                    className={style['user-image']}
                    src="https://stylecaster.com/wp-content/uploads/2024/02/Maria-Bachelor.jpg" 
                    alt="mace"
                 />
                <h3>Sandra</h3>
                <h6>Профил</h6>
            </div>
            <div className={style['user-container']}>
                <img 
                    className={style['user-image']}
                    src="https://stylecaster.com/wp-content/uploads/2024/02/Maria-Bachelor.jpg" 
                    alt="mace"
                 />
                <h3>Sandra</h3>
                <h6>Профил</h6>
            </div>
            <div className={style['user-container']}>
                <img 
                    className={style['user-image']}
                    src="https://stylecaster.com/wp-content/uploads/2024/02/Maria-Bachelor.jpg" 
                    alt="mace"
                 />
                <h3>Sandra</h3>
                <h6>Профил</h6>
            </div>

            

        </div>
    )
}

export default UserSearch;