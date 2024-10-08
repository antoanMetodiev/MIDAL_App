const mongoose = require('mongoose');

const ActiveUserSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    imgURL: {
        type: String,
        required: true,
    }
});

const ActiveUserModel = mongoose.model('active_users', ActiveUserSchema);

module.exports = ActiveUserModel;