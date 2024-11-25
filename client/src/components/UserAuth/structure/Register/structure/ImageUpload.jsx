import axios from 'axios';
import React, { useRef, useState } from 'react';
import style from "./ImageUpload.module.css";

import staticImage from "../../../../../components/Songs_Podcasts/resources/images/static-profile-image.jpg"

const ImageUpload = ({
    imageUrl,
    setImageUrl,
    myUserData,
    setMyUserDataHandler,
}) => {
    const [file, setFile] = useState(null);


    // References:
    const messageTextRef = useRef(null);
    const writeSomethingTextAreaRef = useRef(null);


    // Functions:
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            console.log('No file selected');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        debugger;
        try {
            // Изпращаме файла към сървъра чрез axios
            messageTextRef.current.textContent = "Качва се... ⏳"
            const response = await axios.post('http://localhost:8080/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const myPictureObjResponse = await axios.post("http://localhost:8080/add-myPicture", {
                myId: myUserData._id,
                pictureObject: {
                    imgURL: response.data.imageUrl,
                    text: writeSomethingTextAreaRef.current.value
                },
            });
            console.log(myPictureObjResponse.data.myNewUserData);

            localStorage.setItem("MIDAL_USER", JSON.stringify(myPictureObjResponse.data.myNewUserData));
            setMyUserDataHandler(myPictureObjResponse.data.myNewUserData);


            messageTextRef.current.textContent = "Успешно качване. ✔️"
            setImageUrl(response.data.imageUrl); // Запазваме линка към каченото изображение
        } catch (error) {
            console.error('Error uploading the image:', error);
        }
    };


    function changeImageHandler(event) {
        debugger;

        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                messageTextRef.current.textContent = "Избрахте снимка...";
                setImageUrl(e.target.result); // Задаваме URL на изображението
            };
            reader.readAsDataURL(file); // Четем файла като Data URL
        }
    }


    return (
        <article>
            <div className={style['image-upload-container-wrapper']}>
                <label htmlFor="file-input">
                    Изберете снимка.. 💾
                </label>
                <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    className={style['uploadImage-input']}
                    onChange={(event) => {
                        changeImageHandler(event);
                        handleFileChange(event);
                    }}
                />


                {/* <textarea
                    ref={writeSomethingTextAreaRef}
                    placeholder="Напишете нещо..."
                    className={style['write-something-textArea']}
                    id="write-something"
                >
                </textarea> */}

                <button
                    className={style['upload-image-button']}
                    onClick={handleSubmit}
                >
                    Качване.. 🌐
                </button>

                <h5
                    className={style['messageText-h5']}
                    ref={messageTextRef}
                >

                </h5>
            </div>

            <img
                className={style['image-for-upload']}
                src={imageUrl && imageUrl.length > 0 ? imageUrl : staticImage}
                alt="image"
            />
        </article>
    );
};

export default ImageUpload;