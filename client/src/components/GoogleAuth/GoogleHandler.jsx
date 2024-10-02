import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import cookies from "js-cookie";
import updateAccessToken from "./utils/updateAccessToken"

const GoogleHandler = () => {
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code"); // Извличаме `code` от URL-то

    useEffect(() => {
        const fetchTokens = async () => {
            try {
                // Изпращаме authorization code към сървъра
                const responce = await axios.post(`http://localhost:8080/save-tokens`, { code: authCode });
                let access_token = responce.data.access_token;

                cookies.set('access_token', access_token, { expires: 52 / (24 * 60) }); // Изтича след 52 минути

                setTimeout(() => {
                    updateAccessToken();
                }, 50 * 60 * 1000); // 50 минути в милисекунди

                navigate('/songs-podcasts');
            } catch (error) {
                console.error("Error getting tokens:", error);
            };
        };

        fetchTokens();

    }, [authCode, navigate]);

    return (
        <h2>Loading...</h2> // Показваме "Loading..." или друг индикатор
    );
};

export default GoogleHandler;