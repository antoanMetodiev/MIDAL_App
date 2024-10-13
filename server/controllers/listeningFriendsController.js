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

server.listen(8090, () => {
    console.log('Socket Server is run on port 8090...');
});

module.exports = app;