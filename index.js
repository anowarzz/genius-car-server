const express = require('express');
const cors = require('cors');
const app = express();
const port =  process.env.PORT || 5000;
var colors = require('colors');

// middle wares
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send("Genius car server is racing")
})

app.listen(port, () => {
    console.log(`Genius Car Server running on ${port}`.brightYellow.bold.bgGreen);
})