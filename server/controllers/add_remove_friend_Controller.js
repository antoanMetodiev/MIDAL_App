

const app = require('express')();

const UserModel = require('../models/UserModel');


app.post('/add-friend', async (req, res) => {
    const myId = req.body.myData._id;
    const userId = req.body.id;  // ID на потребителя, който прави заявката
    const name = req.body.name;  // Името на приятеля
    const imgURL = req.body.imgURL;

    try {
        // Добавяне на приятеля към friendsList
        const updatedUser = await UserModel.findByIdAndUpdate(
            myId,                          // ID на потребителя
            { $push: { friendsList: { id: userId, name: name, imgURL: imgURL } } }, // Добавяне на приятеля
            { new: true }                   // Връщане на актуализирания документ
        );

        if (updatedUser) {
            return res.json({ text: 'Приятелят беше добавен успешно!' });
        } else {
            return res.json({ text: 'Не успяхме да добавим приятеля.' });
        }
    } catch (err) {
        console.log("Error updating friends list: ", err);
        return res.status(500).json({ text: 'Грешка при добавяне на приятеля.' });
    }
});







module.exports = app;


