const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({
    origin: "http://localhost:5173",
}));


// Слушам когато някой се опита да направи заявка на този URL:
app.get('/api', (req, res) => {
    res.json({fruits: ["Orange", "Watermelon", "Melon"]});
});



const PORT = 8080;
app.listen(PORT, () => {
    console.log('Server is Listening on port 8080!!!');
});