const app = require('express')();

// Тук ще събирам контролери:
const authController = require('./controllers/authController');

// A тук midlewares:
app.use(authController);


module.exports = app;

