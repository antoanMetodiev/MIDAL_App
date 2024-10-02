const app = require('express')();

// Тук ще събирам контролери:
const googleAuthController = require('./controllers/googleAuthController');
const songController = require('../server/controllers/songController');
const authController = require('./controllers/authController');

// A тук midlewares:
app.use(googleAuthController);
app.use(songController);
app.use(authController);

module.exports = app;

