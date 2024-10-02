const mongoose = require('mongoose');

const Video_Id_Schema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
});

const Video_Id_Model = mongoose.model('videos-id', Video_Id_Schema);

module.exports = Video_Id_Model;