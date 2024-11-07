

const app = require('express')();

const UserModel = require('../models/UserModel');

app.post('/add-friend', async (req, res) => {
    // My Data:
    const { _id: myId, username: myUsername, imageURL: myImgURL } = req.body.myData;

    console.log("```````````````````````````````````````````````````````````````````````");
    console.log(myId);
    console.log(myUsername);
    console.log(myImgURL);

    // Friend Data:
    const userId = req.body.id;
    const name = req.body.name;
    const hisImgURL = req.body.imgURL;

    try {
        // Добавяне на приятеля към friendsList
        // const updatedUser = await UserModel.findByIdAndUpdate(
        //     myId,                          // ID на потребителя
        //     { $push: { friendsList: { id: userId, name: name, imgURL: imgURL } } }, // Добавяне на приятеля
        //     { new: true }                   // Връщане на актуализирания документ
        // );



        // Тук изпращам покана в неговата колекция, която съдържа всички покани за приятелство:
        const sendRequestOnHisCollection = await UserModel.findByIdAndUpdate(
            userId,
            { $push: { friendsRequests: { id: myId, name: myUsername, imgURL: myImgURL } } }
        );


        // Тук създавам запис в моята колекция с хора на които съм изпратил покана:
        const addToInvitedFriends = await UserModel.findByIdAndUpdate(
            myId,
            { $push: { invitedFriends: { userId, name, hisImgURL } } }
        );

        if (false) {
            return res.json({ text: 'Поканата е изпратена!' });
        } else {
            return res.json({ text: 'Не успяхме да изпратим поканата!' });
        }
    } catch (err) {
        console.log("Error updating friends list: ", err);
        return res.status(500).json({ text: 'Грешка при изпращането на поканата.' });
    }
});


app.post('/accept-friend-request', async (req, res) => {
    const { personData, myUserData } = req.body;
    console.log(personData);
    console.log(myUserData);

    // const sendRequestOnHisCollection = await UserModel.findByIdAndUpdate(
    //     userId,
    //     { $push: { friendsRequests: { id: myId, name: myUsername, imgURL: myImgURL } } }
    // );

    try {
        // 1. Добавяне на потребителя в моя списък с приятели:
        await UserModel.findByIdAndUpdate(
            myUserData._id,
            { $push: { friendsList: { id: personData.id, name: personData.name, imgURL: personData.imgURL } } }
        );

        // 2. Изтриване на заявката за приятелство от моя списък, защото след като сме приятели няма защо да седи там:
        await UserModel.findByIdAndUpdate(
            myUserData._id,
            { $pull: { friendsRequests: { id: personData.id } } }
        );

        // 3. Добавяне на мен в неговия лист с приятели:
        await UserModel.findByIdAndUpdate(
            personData.id,
            { $push: { friendsList: { id: myUserData._id, name: myUserData.username, imgURL: myUserData.imageURL } } }
        );

        // 4. Изтриване на неговото изпращане на поканата, защото вече сме приятели:
        await UserModel.findByIdAndUpdate(
            personData.id,
            { $pull: { invitedFriends: { userId: myUserData._id } } }
        );


    } catch (error) {
        console.log(error);
    }

    return res.json({ text: "mr robot" });
});



app.post('/cancel-friend-request', async (req, res) => {
    const { operationString, personData } = req.body;



    return res.json({ text: "kurec" });
});




module.exports = app;


