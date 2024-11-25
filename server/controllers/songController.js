const app = require('express')();

const SongModel = require('../models/SongModel');
const Video_Id_Model = require('../models/Video_Id_Model');
const UserModel = require("../models/UserModel");

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


app.post("/publish-playlist", async (req, res) => {
    const { myId, playlistObject } = req.body;

    try {
        const newMyUserData = await UserModel.findByIdAndUpdate(
            myId,
            { $push: { myPublishedPlaylists: playlistObject } },
            { new: true }
        );

        return res.json({ newMyUserData });
    } catch (error) {
        console.log(error);
        return res.json({});
    }
});



app.post('/add-song-to-one-playlist', async (req, res) => {
    const { song, playlistName, myId } = req.body;

    try {
        // Използваме $push за добавяне на новата песен в масива с песни на съответния плейлист
        const newObject = await UserModel.findByIdAndUpdate(
            myId,
            {
                $push: { [`myPlaylists.${playlistName}.songs`]: song }
            },
            { new: true }  // Връща актуализирания документ
        );

        return res.json({ obj: newObject });

    } catch (error) {
        console.log('Възникна грешка при добавянето на песента.');
        res.status(500).send({ message: 'Възникна грешка при добавянето на песента.' });
    }
});


app.post("/create-playlist", async (req, res) => {

    try {
        const { playlistForCreate } = req.body;
        const playlistName = playlistForCreate.playlistName; // Името на новия плейлист
        const playlistImage = playlistForCreate.playlistImage; // URL на изображението
        const myId = playlistForCreate.myId;

        // Създайте структурата на новия плейлист
        const newPlaylist = {
            imgURL: playlistImage,
            songs: [], // Празен масив за песни, добавете логика, ако има такива
        };

        // Актуализиране на потребителя с новия плейлист като ново свойство в `myPlaylists`
        const newUserData = await UserModel.findByIdAndUpdate(
            myId,
            { $set: { [`myPlaylists.${playlistName}`]: newPlaylist } },
            { new: true }
        );

        return res.json({ newUserData: newUserData });
    } catch (error) {
        console.error("Грешка при създаване на плейлист:", error);
        return res.status(500).json({ message: "Грешка при създаване на плейлист." });
    }
});

module.exports = app;