const app = require('express')();

// Тук ще събирам контролери:
const googleAuthController = require('./controllers/googleAuthController');
const songController = require('../server/controllers/songController');
const authController = require('./controllers/authController');
const searchUserController = require('./controllers/searchUserController');
const listeningFriendsController = require('./controllers/listeningFriendsController');
const myPicturesController = require("./controllers/myPicturesController");

// A тук midlewares:
app.use(googleAuthController);
app.use(songController);
app.use(authController);
app.use(searchUserController);
app.use(listeningFriendsController);
app.use(myPicturesController);

module.exports = app;

