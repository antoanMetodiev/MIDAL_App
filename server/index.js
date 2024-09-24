const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('LMAOOO!!!');
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log('Server is Listening on port 4000!!!');
});