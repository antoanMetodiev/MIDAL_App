const ActiveUserModel = require('../models/ActiveUserModel');
const app = require('express')();
const redis = require('redis');
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:5173", // Разрешаваме фронтенда
        methods: ["GET", "POST"],
        credentials: true, // Разрешава изпращане на cookies
    }
});

// Инициализация на Redis клиента
const redisClient = redis.createClient();

redisClient.on('connect', () => {
    console.log('Redis client connected');
});

redisClient.on('error', (err) => {
    console.error('Redis client error:', err);
});

// Свързване с Redis
(async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
})();

// Логика за публикация на песен
app.post('/publish-song', async (req, res) => {
    const publisher = redisClient.duplicate(); // Създаване на нов клиент
    await publisher.connect(); // Свържете клиента
    try {
        const { myId, songTitle, myName, imgURL } = req.body;

        console.log(myId);

        // Валидация на входящите данни
        if (!myId || !songTitle || !myName) {
            return res.status(400).json({ text: 'Недостатъчно данни' });
        }

        const subscribersCount = await publisher.publish(`user_${myName}-${myId}_channel`, JSON.stringify({ id: myId, message: songTitle, myName: myName, imgURL: imgURL }));
        console.log(`Публикуваното съобщение е получено от ${subscribersCount} абонати.`);
        console.log('Публикува песен успешно..');
        res.json({ text: 'Публикува песен успешно..' });
    } catch (error) {
        console.log('Не успя да споделиш, коя песен слушаш...');
        console.error('Error publishing song:', error);
        res.status(500).send('Error publishing song');
    }
});



// Логика за абониране за канали
app.post('/subscribe-for-songs', async (req, res) => {
    const friendsList = req.body.friendsList;
    const myId = req.body.myId;

    try {
        const subscriber = redisClient.duplicate(); // Създаване на нов клиент
        await subscriber.connect();

        let responsedData = await getActiveUsers();
        let activeUsers = [];

        responsedData.forEach(user => {
            activeUsers.push(user.id);
        });

        console.log(activeUsers);

        // Това мисля 4е е грешно, тук трябва да проверява дали е
        // има в колекцията active_users преди да декларира да следи този канал който не го има...
        for (const friend of friendsList) {
            if (!activeUsers.includes(friend.id)) {
                console.log(`Friend ${friend.name} is not active, skipping subscription.`);
                continue; // Пропускаме неактивните
            }

            console.log('SIIIIIIIIIIIIIIIIIIII');
            console.log(friend.name);

            const channel = `user_${friend.name}-${friend.id}_channel`;
            try {
                await subscriber.subscribe(channel, (message, channel) => {
                    console.log(`Received message from ${channel}:`, message);

                    // io.emit(`songUpdate-${myId}`, { channel, message });  // Изпращаме на всички свързани клиенти
                    io.emit(`songUpdate-${myId}`, { channel, message });  // Изпращаме на всички свързани клиенти
                    // res.json({ channel, message });
                });
                console.log('Успя да се абонира..');
            } catch (subscribeError) {
                console.error(`Failed to subscribe to ${channel}:`, subscribeError);
            };
        };

        res.json({ text: `Subscribed to channels of friends: ${friendsList.map(f => f.name).join(', ')}` });
    } catch (error) {
        console.error('Redis client error:', error);
        res.status(500).json({ error: 'Failed to subscribe for songs' });
    }
});

async function getActiveUsers() {
    const responsedActiveUsers = await ActiveUserModel.find();
    return responsedActiveUsers;
};


// Add-Remove Friends Logics:

const UserModel = require('../models/UserModel');


// Изпращаш покана:
app.post('/add-friend-request', async (req, res) => {
    // My Data:
    const { _id: myId, username: myUsername, imageURL: myImgURL } = req.body.myData;

    // Friend Data:
    const userId = req.body.id;
    const name = req.body.name;
    const hisImgURL = req.body.imgURL;

    const publisher = redisClient.duplicate(); // Създаване на нов клиент
    await publisher.connect(); // Свържете клиента
    try {

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

        // Изпращаме съобщение в Redis канал (например, канал за приятели)
        const subscribersCount = await publisher.publish(
            `${name}-${userId}-friend_channel-provider`,
            JSON.stringify({
                userRequester: { requesterId: myId, requesterNames: myUsername, requesterImgURL: myImgURL }
            })
        );
        console.log(subscribersCount);
        console.log("Ima li nqkoi deee!!!");


        await publisher.quit(); // Завършване на сесията след публикуването
        return res.json({ text: 'mr tobot' });
    } catch (err) {
        console.log("Error updating friends list: ", err);
        return res.status(500).json({ text: 'Грешка при изпращането на поканата.' });
    }
});


// REMOVE FRIEND PRIMARY ACTION:
app.post("/remove-friend", async (req, res) => {
    const { myData, personData } = req.body;
    const publisher = redisClient.duplicate();
    await publisher.connect();

    try {

        // 1. Изтриване от моя "friendsList":
        const myNewUserData = await UserModel.findByIdAndUpdate(
            myData._id,
            { $pull: { friendsList: { id: personData.personId } } },
            { new: true }
        );

        // 2. Изтриване от неговия "friendsList":
        const personNewUserData = await UserModel.findByIdAndUpdate(
            personData.personId,
            { $pull: { friendsList: { id: myData._id } } },
            { new: true }
        );

        // 3. Уведомявам потребителя (за да си обнови front-end-a real-time):

        await publisher.publish(`${personData.personName}-${personData.personId}-cancel-request-listener`
            , JSON.stringify({ personNewUserData: personNewUserData }));


        await publisher.quit();
        return res.json({ myNewUserData: myNewUserData });

    } catch (error) {
        console.log(error);
    }
});




// ACCEPT PRIMARY:
app.post('/accept-friend-request', async (req, res) => {
    const { personData, myUserData } = req.body;
    const publisher = redisClient.duplicate(); // Създаване на нов клиент
    await publisher.connect(); // Свържете клиента


    let myNewUserData;
    try {
        // 1. Изтриване на неговото изпращане на поканата, защото вече сме приятели:
        await UserModel.findByIdAndUpdate(
            personData.id,
            { $pull: { invitedFriends: { userId: myUserData._id } } }
        );

        // 2. Изтриване на заявката за приятелство от моя списък, защото след като сме приятели няма защо да седи там:
        await UserModel.findByIdAndUpdate(
            myUserData._id,
            { $pull: { friendsRequests: { id: personData.id } } }
        );

        // 3. Добавяне на мен в неговия лист с приятели:
        const personNewUserData = await UserModel.findByIdAndUpdate(
            personData.id,
            { $push: { friendsList: { id: myUserData._id, name: myUserData.username, imgURL: myUserData.imageURL } } },
            { new: true } // Това указва да върне новия (обновения) обект
        );

        // 4. Добавяне на потребителя в моя списък с приятели:
        myNewUserData = await UserModel.findByIdAndUpdate(
            myUserData._id,
            { $push: { friendsList: { id: personData.id, name: personData.name, imgURL: personData.imgURL } } },
            { new: true } // Това указва да върне новия (обновения) обект
        );

        // 5. Уведомявам дадения човек real-time за да знае да си обнови Frond-End-a:
        const subscriberCount = await publisher.publish(`${personData.name}-${personData.id}-accept-request-listener`,
            JSON.stringify({
                personNewUserData: personNewUserData,
            }));

        await publisher.quit(); // Завършвам дадената сесията след публикуването (за да не товаря)
    } catch (error) {
        console.log(error);
    }

    return res.json({ myNewUserData: myNewUserData });
});

// CANCEL PRIMARY (Blue friend request..):
app.post("/cancel-primary-friend-request", async (req, res) => {
    const { myData, personData } = req.body;
    const publisher = redisClient.duplicate();
    await publisher.connect();

    // 1.Изтриване от моята колекция "invitedFriends":
    const myNewUserData = await UserModel.findByIdAndUpdate(
        myData._id,
        { $pull: { invitedFriends: { userId: personData.personId } } },
        { new: true }
    );

    // 2. Изтриване от неговата колекция "friendsRequests":
    const personNewData = await UserModel.findByIdAndUpdate(
        personData.personId,
        { $pull: { friendsRequests: { id: myData._id } } },
        { new: true }
    );

    // 3. Информиране на съответния потребител (за да може да си обнови frond-end-a real-time):
    await publisher.publish(`${personData.personName}-${personData.personId}-cancel-request-listener`,
        JSON.stringify({ personNewUserData: personNewData }));

    // const myNewUserData = JSON.parse(message).personNewUserData;


    await publisher.quit(); // Завършвам дадената сесията след публикуването (за да не товаря)
    return res.json({ myNewUserData: myNewUserData });
});



app.post("/friends-requests-channel-provider", async (req, res) => {
    const { myNames, myId } = req.body;

    console.log("За провайдера..");
    console.log(myNames);
    console.log(myId);

    const subscriber = redisClient.duplicate(); // Създаване на нов клиент
    await subscriber.connect(); // Свържете клиента

    const friendRequestChannel = `${myNames}-${myId}-friend_channel-provider`;
    try {
        // Абонираме се за канала
        await subscriber.subscribe(friendRequestChannel, (message) => {

            // Обработваме съобщението от канала
            console.log("Получено съобщение:", message);
            const friendRequest = JSON.parse(message); // Превръщаме JSON съобщението в обект

            // Изпращаме съобщението чрез Socket.io
            io.emit(`friend_request_${myId}`, message);
        });
        console.log(`Subscribed to channel: ${friendRequestChannel}`);
        res.json({ text: 'Successfully subscribed to friend requests channel.' });
    } catch (error) {
        console.error('Failed to subscribe to channel:', error);
        res.status(500).json({ error: 'Failed to subscribe to channel' });
    }
});










// Тук е: 1. Отказва ми се поканата, която съм изпратил (route) 
app.post('/cancel-friend-request', async (req, res) => {
    const { myUserData, personData } = req.body;
    const publisher = redisClient.duplicate(); // Създаване на нов клиент
    await publisher.connect(); // Свържете клиента

    const myId = myUserData._id;
    const personId = personData.id;
    const personNames = personData.name;


    // 1. Изтривам от моята колекция friendsRequests неговата покана:
    const myNewUserData = await UserModel.findOneAndUpdate(
        { _id: myId },
        { $pull: { friendsRequests: { id: personId } } },
        { new: true } // Това указва да върне новия (обновения) обект
    );

    // 2. Изтривам от негова колекция invitedFriends моя запис:
    const personNewUserData = await UserModel.findOneAndUpdate(
        { _id: personId },
        { $pull: { invitedFriends: { userId: myId } } },
        { new: true } // Това указва да върне новия (обновения) обект
    );

    // 3. Уведомявам дадения човек real-time за да знае да си обнови Frond-End-a:
    const subscriberCount = await publisher.publish(`${personNames}-${personId}-cancel-request-listener`,
        JSON.stringify({
            personNewUserData: personNewUserData,
        }));


    await publisher.quit(); // Завършвам дадената сесията след публикуването (за да не товаря)
    return res.json({ myNewUserData });
});


// Тук са: СЛУШАТЕЛИ (routes) 
app.post("/accept-request-listener", async (req, res) => {
    const { myId, myName } = req.body;
    const subscriber = redisClient.duplicate(); // Създаване на нов клиент
    await subscriber.connect(); // Свържете клиента

    if (myId && myName) {

        try {
            await subscriber.subscribe(`${myName}-${myId}-accept-request-listener`, (message) => {
                console.log("Някой ПРИЕ твоя покана и вече сте приятели!");
                io.emit(`accept-request-listener_${myId}`, message);
            });

        } catch (error) {
            console.log("Не успях да се абонирам за моя канал в Redis за следене на отменяне от покана за искане на приятелство!");
            console.log(error);
        }
    }

    return res.json({});
});



app.post("/cancel-request-listener", async (req, res) => {
    const { myId, myName } = req.body;
    const subscriber = redisClient.duplicate(); // Създаване на нов клиент
    await subscriber.connect(); // Свържете клиента

    if (myId && myName) {

        try {
            await subscriber.subscribe(`${myName}-${myId}-cancel-request-listener`, (message) => {
                console.log("Някой си отмени поканата за приятество!");
                io.emit(`cancel-request-listener_${myId}`, message);
            });

            return res.json({ text: "uspq" });
        } catch (error) {
            console.log("Не успях да се абонирам за моя канал в Redis за следене на отменяне от покана за искане на приятелство!");
            console.log(error);
        }
    }

    return res.json({});
});





// Тук е: Check-ър за нови покани (НЕ Е real-time!)  (използвам го само в началото, когато потребителя влезе в Songs_Podcasts)
app.post("/check-for-new-friend-requests", async (req, res) => {
    const { myId } = req.body;

    try {
        const myNewData = await UserModel.findById(myId);
        return res.json({ myNewData });

    } catch (error) {
        console.log(error);
        return res.json({ robot: "GLUPAVO DETE." });
    }
})


server.listen(8090, () => {
    console.log('Socket Server is run on port 8090...');
});

module.exports = app;