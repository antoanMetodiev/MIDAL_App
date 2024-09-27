const bcrypt = require('bcrypt');
const cookie = require('cookie'); // Импортиране на cookie библиотеката
const jwt = require('jsonwebtoken'); // Добавете библиотека за JWT

const UserModel = require('../models/UserModel');
const SECRET = 'NA NIKOI NE MU PUKA KAKUV TI E SIKRETA';

async function registerUser(res, userData) {
    try {
        debugger;
        const hashedPasword = await bcrypt.hash(userData.password, 12);
        userData.password = hashedPasword;

        const userData = await UserModel.create(userData);

        // Запазваме в cookies:
        const jwtToken = jwt.sign({ id: userData._id }, SECRET, { expiresIn: '48h' });

        res.setHeader('Set-Cookie', cookie.serialize('userToken', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Само за HTTPS при продукция
            maxAge: 60 * 60 * 48, // 2 дни
            path: '/', // Път на cookies
        }));
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    registerUser,
}