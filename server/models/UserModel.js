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
    myPlaylists: {
        type: Object,
        default: {
            Харесани: {
                imgURL: "https://res.cloudinary.com/dxkloyfs1/image/upload/v1728853213/rusx9nxj3vuzb9yy5gt2.png",
                songs: [],
            },  // Дефолтна стойност за myPlaylists с ключ "Харесани" и празен масив
        },
    },
    myPublishedPlaylists: [{
        type: Object,
    }],
    myStories: [{
        type: Object,
    }],
});

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;