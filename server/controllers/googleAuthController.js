const app = require('express')();
const axios = require('axios');
const querystring = require('querystring');

const { GoogleRefreshTokenModel } = require('../models/GoogleRefreshTokenModel');
const { CLIENT_ID, REDIRECT_URI, CLIENT_SECRET } = require("../configs/spotifyConfig");

app.post('/save-tokens', async (req, res) => {
    const authCode = req.body.code; // Извличаме кода от заявката

    if (!authCode) {
        return res.status(400).json({ error: "Missing authorization code" });
    }

    try {
        const response = await axios.post("https://oauth2.googleapis.com/token", null, {
            params: {
                code: authCode,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                redirect_uri: REDIRECT_URI,
                grant_type: "authorization_code",
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        const { access_token, refresh_token, expires_in } = response.data;

        // Запазвам access_token:
        // res.cookie('access_token', access_token, {
        //     httpOnly: true,
        //     maxAge: 3000 * 1000, // Изтича след 50 минути
        // });

        // Запазвам refresh_token:
        await GoogleRefreshTokenModel.create({ refreshToken: refresh_token });

        // Върни токените на клиента
        return res.json({
            access_token,
        });

        // return res.end();

    } catch (error) {
        console.error("Tapak gurmi ti v survura!!!", error.response.data);
        return res.status(500).json({ error: "Tapak gurmi ti v survura!!!" });
    }
});

app.get('/update-token', async (req, res) => {

    const refreshTokenDoc = await GoogleRefreshTokenModel.findOne();
    const refreshToken = refreshTokenDoc.refreshToken;


    try {
        const response = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            refresh_token: refreshToken,
            grant_type: 'refresh_token'
        });

        const newAccessToken = response.data.access_token;
        return res.json({ newAccessToken: newAccessToken });

    } catch (error) {
        console.error('Ima problem sus zaqwkite pri refresh na tokena!:', error.response.data);
    }
});

module.exports = app;