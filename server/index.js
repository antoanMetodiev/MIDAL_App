const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

// app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Позволява на Express да обработва JSON тела на заявките
app.use(cors({
    origin: [
        "http://localhost:5173", // Първи домейн
        "http://localhost:5174", // Втори домейн
        "http://localhost:5175", // Трети домейн
    ]
}));

// Свързвам се към база данни MongoDB:
const mongoURL = 'mongodb://localhost:27017/midal';
mongoose.connect(mongoURL)
        .then(() => {
            console.log('MongoDB is started!!!');
        })
        .catch((err) => {
            console.log(err);
        });

// Слушам когато някой се опита да направи заявка на този URL:
app.get('/api', (req, res) => {
    res.json({fruits: ["Orange", "Watermelon", "Melon"]});
});


const PORT = 8080;
app.listen(PORT, () => {
    console.log('Server is Listening on port 8080!!!');
});