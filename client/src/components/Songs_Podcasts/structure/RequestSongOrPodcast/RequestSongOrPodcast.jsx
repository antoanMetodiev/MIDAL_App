
import { useEffect, useState } from "react";
import style from "./RequestSongOrPodcast.module.css"
import axios from "axios";
import cookies from "js-cookie";
import searchButton from "../../resources/images/search-button.png";

const baseURL = 'https://www.googleapis.com/youtube/v3/search';

const RequestSongOrPodcast = ({
    searchTerm,
}) => {
    const [receivedSongs, setReceivedSongs] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {

        const searchOnDatabase = async () => {
            let responseFromDatabase = await axios.post('http://localhost:8080/get-songs', { searchTerm: searchTerm });

            if (responseFromDatabase.data.length == 0) {
                const accessToken = cookies.get('access_token'); // Извличаме токена от cookies

                if (searchTerm && accessToken) {
                    axios.get(baseURL, {
                        params: {
                            part: 'snippet',
                            q: searchTerm,
                            type: 'video',
                            maxResults: 100
                        },
                        headers: {
                            Authorization: `Bearer ${accessToken}` // Използваме токена вместо API ключа
                        }
                    }).then(async (response) => {
                        const data = response.data.items;

                        // Правим POST заявка към сървъра
                        await axios.post('http://localhost:8080/create-songs', { songs: data })
                            .then(() => {
                                console.log('Songs created successfully');
                                setMessage('АКО СТЕ ВЪВЕЛИ ТОЧНОТО ИМЕ НА ПЕСЕНТА ИЛИ ПОДКАСТА, КОЙТО ТЪРСИТЕ - ВЕЧЕ ТРЯБВА ДА Е ДОБАВЕНО И ДА МОЖЕ ДА ГО ДОСТЪПИТЕ В КАТАЛОГ: Музика & Подкасти');
                            })
                            .catch(error => {
                                console.error('Error creating songs:', error);
                            });

                        console.log(data);
                        setReceivedSongs(data);
                    }).catch(error => {
                        console.error('Error fetching data: ', error);
                    });
                }

                console.log('Тези ги нямаше..');
            } else {
                setMessage('ТОВА КОЕТО ТЪРСИТЕ ВЕЧЕ СЪЩЕСТВУВА В БАЗАТА ДАННИ НА MIDAL !');
            }

            console.log(responseFromDatabase.data)
            setReceivedSongs(responseFromDatabase.data);
        };


        if (searchTerm && searchTerm.length > 1) {
            searchOnDatabase();
        }

    }, [searchTerm]);


    return (
        <div className={style['request-newSong-or-podcast']}>


            {message.length > 0 ? (
                <h3 className={style['annoyment-title']}>{message}</h3>
            ) : (
                <h3 className={style['annoyment-title']}>МОЛЯ, НАПИШЕТЕ ПЕСЕНТА/ПОДКАСТЪТ, КОЙТО ТЪРСИТЕ, КАТО ИЗПИСВАТЕ ПРАВИЛНО ИМЕТО ЗА ДА МОЖЕМ ДА Я ОТКРИЕМ И ДА ВИ КАЖЕМ КОГА МОЖЕТЕ ДА ПОЛУЧИТЕ ИСКАНОТО ОТ ВАС.. ПОЗДРАВИ, <span>MIDAL</span>..</h3>
            )}


        </div>
    );
};

export default RequestSongOrPodcast;