const cookie = require('cookie');
const cookieParser = require('cookie-parser');

const app = require('express')();
const { registerUser, loginUser } = require('../services/authService');


const SECRET = process.env.SECRET;

app.post('/register', async (req, res) => {

    try {
        const response = await registerUser(res, req.body);
        const user = response.userData;

        res.setHeader('Set-Cookie', cookie.serialize('userData', JSON.stringify(user), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Само за HTTPS при продукция
            maxAge: 60 * 60 * 48, // 2 дни
            path: '/', // Път на cookies
        }));

        

        res.json(response);
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

app.get('/is-have-session', (req, res) => {

    console.log(req.cookies);
    console.log(req.cookie);
    // console.log(cookie.parse(req.cookies));


    try {
        const userData = req.cookies.userData; // Получава cookie с името 'userData'

        console.log(req.cookies);
        console.log('----------------');

        if (userData) {
            // Преобразуваме JSON стринга обратно в обект
            const user = JSON.parse(userData);
            return res.json(user);
        }

        return res.json({}); // Връщаш празен обект, ако cookie-то не съществува
    } catch (error) {
        console.log(error); // Логване на грешката
        return res.status(500).json({ message: 'Internal server error' }); // Връщаш 500 статус код
    }
});

module.exports = app;