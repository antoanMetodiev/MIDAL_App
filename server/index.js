const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
const routes = require('./routes');

app.use(cors({
    origin: [
        "http://localhost:5173", // Фронтенд адрес
        "http://localhost:8090",  // Адрес на Socket.io сървъра
        "http://localhost:8080",   // Други адреси (ако имаш нужда)
    ],
    credentials: true  // Разрешава изпращане на cookies
}));
app.use(express.json()); // Позволява на Express да обработва JSON тела на заявките
app.use(cookieParser());
app.use(routes);

app.get('/api', (req, res) => {
    res.json({ message: 'Service is running successfully!' });
});

const mongoURL = 'mongodb://localhost:27017/midal';
mongoose.connect(mongoURL)
    .then(() => {
        console.log('MongoDB is started!!!');
        const PORT = 8080;
        app.listen(PORT, () => {
            console.log('Server is Listening on port 8080!!!');
        });
    })
    .catch((err) => {
        console.log(err);
    });
