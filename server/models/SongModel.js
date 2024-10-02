const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
    videoId: {
        type: String, 
        required: true,
        unique: true,
    },
    data: {
        type: Object,  
        required: true,
    },
    songName: {
        type: String,
        required: true,
    },
});

const SongModel = mongoose.model('songs', SongSchema);

module.exports = SongModel;