const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
const routes = require('./routes');

app.use(cors({
    origin: [
        "http://localhost:5173", // Първи домейн
        "http://localhost:5174", // Втори домейн
        "http://localhost:5175", // Трети домейн
    ]
}));
app.use(express.json()); // Позволява на Express да обработва JSON тела на заявките
app.use(cookieParser());
app.use(routes);


app.get('/api', (req, res) => {
    res.send('Service is started...');
});


const mongoURL = 'mongodb://localhost:27017/midal';
mongoose.connect(mongoURL)
    .then(() => {
        console.log('MongoDB is started!!!');
    })
    .catch((err) => {
        console.log(err);
    });

const PORT = 8080;
app.listen(PORT, () => {
    console.log('Server is Listening on port 8080!!!');
});