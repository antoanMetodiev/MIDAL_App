const app = require('express')();

// Тук ще събирам контролери:
const googleAuthController = require('./controllers/googleAuthController');
const songController = require('../server/controllers/songController');
const authController = require('./controllers/authController');
const searchUserController = require('./controllers/searchUserController');
const add_remove_friend_Controller = require('./controllers/add_remove_friend_Controller');
const listeningFriendsController = require('./controllers/listeningFriendsController');

// A тук midlewares:
app.use(googleAuthController);
app.use(songController);
app.use(authController);
app.use(searchUserController);
app.use(add_remove_friend_Controller);
app.use(listeningFriendsController);

module.exports = app;

