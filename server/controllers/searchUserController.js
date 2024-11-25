const app = require('express')();

const UserModel = require('../models/UserModel');

app.post("/search-user", async (req, res) => {

    const searchedUserUsername = req.body.username;
    const results = await UserModel.find({
        username: { $regex: searchedUserUsername, $options: 'i' }
    });

    return res.json(results);
});


app.post("/get-user-data", async (req, res) => {
    const { personId } = req.body;

    try {
        const personData = await UserModel.findById(personId);
        return res.json({ personData });

    } catch (error) {
        console.log(error);
        return res.json({});
    }
});


module.exports = app; 