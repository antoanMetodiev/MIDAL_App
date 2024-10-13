const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');

async function registerUser(res, { user }) {

    try {
        const hashedPassword = await bcrypt.hash(user.password, 12);
        user.password = hashedPassword;

        const userData = await UserModel.create(user);
        return userData;

    } catch (error) {
        console.log(error);
    }
};


async function loginUser(data) {
    const usernameText = data.username;
    const passwordText = data.password;

    // Намерете потребителя по потребителско име
    const responseData = await UserModel.findOne({ username: usernameText });

    if (!responseData) {
        // Ако го няма - връщам че го няма
        return { error: 'User not found' };
    }

    // Проверка на паролата
    const isEquals = await bcrypt.compare(passwordText, responseData.password);

    // Ако паролата съвпада, връщаме данните на потребителя
    if (isEquals) {
        return responseData;
    }

    // Ако паролата е грешна, връщаме грешка
    return { error: 'Incorrect password' };
};



module.exports = {
    registerUser,
    loginUser,
}