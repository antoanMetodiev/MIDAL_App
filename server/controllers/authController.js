const app = require('express')();
const { registerUser} = require('../services/authService');

app.post('/register', async (req, res) => {

    await registerUser(res, req.body);
    res.json(req.body);
});

module.exports = app;