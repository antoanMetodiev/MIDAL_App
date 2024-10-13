const app = require('express')();

const SongModel = require('../models/SongModel');
const Video_Id_Model = require('../models/Video_Id_Model');

// ТОЗИ URL - ТЪРСИ ОТ API:
app.post('/create-songs', async (req, res) => {
    let data = req.body.songs;
    let songs = [];
    let newVideoIds = [];

    try {
        // Извличане на съществуващите videoId веднъж
        let existingVideoIds = await Video_Id_Model.find().distinct('id');

        // console.log(existingVideoIds);
        // console.log('----------------------------');

        for (let i = 0; i < data.length; i++) {
            const currentSong = data[i];
            const currentVideoId = currentSong.id.videoId;

            // Проверка в масива с videoId
            if (!existingVideoIds.includes(currentVideoId)) {

                newVideoIds.push({ id: currentVideoId });
                songs.push({
                    videoId: currentSong.id.videoId,
                    data: currentSong,
                    songName: currentSong.snippet.title
                });
            };
        };

        // console.log(songs);
        // console.log('----------------------------');
        // console.log(newVideoIds)

        await SongModel.insertMany(songs);  // Използваме await за асинхронната операция
        await Video_Id_Model.insertMany(newVideoIds);

        res.status(201).send('Songs created successfully');  // Изпращаме успех на клиента
    } catch (error) {
        console.error('Error creating songs in MongoDB:', error);
        res.status(500).send('Error creating songs in MongoDB');  // Изпращаме грешка и статус код 500
    }
});


// ТОЗИ URL - ТЪРСИ ОТ БАЗАТА ДАННИ:
app.post('/get-songs', async (req, res) => {
    const title = req.body.searchTerm;

    try {
        const results = await SongModel.find({
            songName: { $regex: title, $options: 'i' } // 'i' е за нечуствителност към главни и малки букви
        }).limit(60);

        res.status(200).json(results); 
    } catch (error) {
        console.error('Error finding songs:', error);
        res.status(500).send('Error finding songs');  // Връщаме грешка при неуспех
    }
});



module.exports = app;