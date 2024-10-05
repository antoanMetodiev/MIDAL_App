const app = require('express')();

const UserModel = require('../models/UserModel');

app.post("/search-user", async (req, res) => {

    const searchedUserUsername = req.body.username;
    const results = await UserModel.find({
        username: { $regex: searchedUserUsername, $options: 'i' }
    });

    return res.json(results);
});


module.exports = app; 