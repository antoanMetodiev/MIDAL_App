require('dotenv').config();
const bcrypt = require('bcrypt');
const cookie = require('cookie'); // Импортиране на cookie библиотеката
const jwt = require('jsonwebtoken'); // Добавете библиотека за JWT

const UserModel = require('../models/UserModel');

const SECRET = 'NA NIKOI NE MU PUKA KAKUV TI E SIKRETA';

async function registerUser(res, { user }) {



    try {
        // debugger;
        const hashedPassword = await bcrypt.hash(user.password, 12);
        user.password = hashedPassword;

        const userData = await UserModel.create(user);

        res.setHeader('Set-Cookie', userData, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Само за HTTPS при продукция
            maxAge: 60 * 60 * 48, // 2 дни
            path: '/', // Път на cookies
        });

        return userData;

    } catch (error) {
        console.log(error);
    }
};


async function loginUser(data) {
    const usernameText = data.username;
    const passwordText = data.password;

    // Намерете потребителя по потребителско име
    const responseData = await UserModel.findOne({ username: usernameText });

    if (!responseData) {
        // Ако го няма - връщам че го няма
        return { error: 'User not found' };
    }

    // Проверка на паролата
    const isEquals = await bcrypt.compare(passwordText, responseData.password);

    // Ако паролата съвпада, връщаме данните на потребителя
    if (isEquals) {
        return responseData;
    }

    // Ако паролата е грешна, връщаме грешка
    return { error: 'Incorrect password' };
};



module.exports = {
    registerUser,
    loginUser,
}