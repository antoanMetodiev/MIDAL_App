const cookie = require('cookie');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const app = require('express')();
const { registerUser, loginUser } = require('../services/authService');
const UserModel = require('../models/UserModel');
const ActiveUserModel = require('../models/ActiveUserModel');

// const SECRET = process.env.SECRET;

app.post('/register', async (req, res) => {

    try {
        const response = await registerUser(res, req.body);
        const user = response;

        console.log(user);
        return res.json(user);

    } catch (error) {
        console.log(error);
    }
});

app.post('/login', async (req, res) => {


    try {
        const data = req.body.user;
        const user = await loginUser(data);

        // res.cookie('userData', JSON.stringify(user), { // Важно: Преобразувай обекта в JSON стринг
        //     httpOnly: true, // Достъпно само за сървъра
        //     maxAge: 1000 * 60 * 60 * 48, // 48 часа (в милисекунди)
        //     path: '/', // Пътят на cookie-то
        // });


        res.setHeader('Set-Cookie', cookie.serialize('userData', JSON.stringify(user), {
            httpOnly: true,
            maxAge: 60 * 60 * 48, // 2 дни
            path: '/', // Път на cookies
        }));

        console.log();

        return res.json(user);

    } catch (error) {
        console.log(error);
    }
});

cloudinary.config({
    cloud_name: "dxkloyfs1",
    api_key: "451468329116552",
    api_secret: "-Fmw73rE0GaQdmV6JWM83Z0rdfE",
});

// Настройка на Multer за обработка на файловете
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Рут за качване на изображение в Cloudinary
app.post('/upload', upload.single('image'), (req, res) => {
    const file = req.file;

    // Проверка дали файлът е наличен
    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Качване на файла в Cloudinary
    cloudinary.uploader.upload_stream((error, result) => {
        if (error) {
            return res.status(500).json({ error: 'Error uploading image' });
        }

        // Връщаме URL-то към качената снимка
        res.json({ imageUrl: result.secure_url });
    }).end(file.buffer);
});

app.post('/is-valid-token', async (req, res) => {

    const userId = req.body._id;
    try {

        const userData = await UserModel.findById(userId);

        if (userData) {
            // Преобразуваме JSON стринга обратно в обект
            return res.json(userData);
        }

        res.end();
    } catch (error) {
        console.log(error); // Логване на грешката
        return res.status(500).json({ message: 'Internal server error' }); // Връщаш 500 статус код
    }
});

app.post('/set-user-isActive', async (req, res) => {
    const data = req.body.dataForActiveRequest;
    const userId = data.id; // Предполагаме, че ID-то на потребителя е в това поле

    try {
        // Първо проверяваме дали вече има активен потребител със същото ID
        const existingUser = await ActiveUserModel.findOne({ id: userId });

        if (existingUser) {
            // Ако потребителят вече съществува, връщаме съобщение, че той е вече активен
            return res.status(400).json({});
        }

        // Ако потребителят не съществува, създаваме нов запис
        const response = await ActiveUserModel.create(data);

        if (response) {
            return res.status(200).json({ text: 'Ве4е е активен потребител..!!' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Грешка при създаването на активен потребител.' });
    }
});


app.post('/remove-active-user', async (req, res) => {
    const myId = req.body.id;

    console.log('-------');
    console.log(myId);

    try {
        const response = await ActiveUserModel.findOneAndDelete({ id: myId });

        if (response) {
            console.log('Потребителят вече не е активен.');
            return res.status(200).json({ text: 'Потребителят вече не е активен.' });
        } else {
            console.log('Потребителят вече не е активен.');
            return res.status(404).json({ text: 'Потребителят не беше намерен.' });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Грешка при премахването на активен потребител.' });
    }
});

// 

module.exports = app;