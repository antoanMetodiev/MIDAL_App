import axios from 'axios';
import React, { useState } from 'react';

const ImageUpload = ({
    imageUrl,
    setImageUrl,
}) => {
    const [file, setFile] = useState(null);

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

        try {
            // Изпращаме файла към сървъра чрез axios
            const response = await axios.post('http://localhost:8080/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Server response:', response.data);

            console.log(response.data.imageUrl);
            setImageUrl(response.data.imageUrl); // Запазваме линка към каченото изображение
        } catch (error) {
            console.error('Error uploading the image:', error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleSubmit}>Upload</button>
        </div>
    );
};

export default ImageUpload;