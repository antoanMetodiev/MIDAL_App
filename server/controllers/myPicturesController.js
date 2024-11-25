const app = require("express")();
const UserModel = require("../../server/models/UserModel");

app.post("/add-myPicture", async (req, res) => {
    const { myId, pictureObject } = req.body;

    try {
        const myNewUserData = await UserModel.findByIdAndUpdate(
            myId,
            { $push: { myPictures: pictureObject } },
            { new: true }
        );

        return res.json({ myNewUserData });
    } catch (error) {
        console.log(error);
        return res.json({});
    }
});

module.exports = app;