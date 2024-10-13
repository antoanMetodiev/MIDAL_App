const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    imageURL: {
        type: String,
    },
    secret_world: {
        type: String,
    },

    
    friendsList: [{
        type: Object,
    }],
    friendsRequests: [{
        type: Object,
    }],
    blockedUsers: [{
        type: Object,
    }],
    closeFriends: [{
        type: Object,
    }],
    myPublishedPlaylists: [{
        type: Object,
    }],
    myStories: [{
        type: Object,
    }],
});

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;