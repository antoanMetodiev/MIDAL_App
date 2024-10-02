import axios from "axios";
import cookies from "js-cookie";

async function updateAccessToken() {
    try {
        const responce = await axios.get('http://localhost:8080/update-token');
        const newAccessToken = responce.data.newAccessToken;

        cookies.set('access_token', newAccessToken, { expires: 52 / (24 * 60) }); // Изтича след 52 минути

        console.log('Sega se Update-na: ' + new Date().toLocaleTimeString());

        setTimeout(() => {
            updateAccessToken();
        }, 50 * 60 * 1000); // 50 минути в милисекунди

        return newAccessToken;
    } catch (error) {
        console.log('Gurmi ti pri refresha na token-a!!!');
    };
};

export default updateAccessToken;