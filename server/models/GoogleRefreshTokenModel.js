const mongoose = require('mongoose');

const GoogleRefreshTokenSchema = new mongoose.Schema({
    refreshToken: {
        type: String,
        required: true,
    },
});

const GoogleRefreshTokenModel = mongoose.model('Refresh-Token', GoogleRefreshTokenSchema);

module.exports = { GoogleRefreshTokenModel };