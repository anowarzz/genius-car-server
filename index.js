const express = require('express');
const cors = require('cors');
const app = express();
const port =  process.env.PORT || 5000;
var colors = require('colors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();


// middle wares
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.v1rp4a3.mongodb.net/?retryWrites=true&w=majority`;


 

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});











app.get('/', (req, res) => {
    res.send("Genius car server is racing")
})

app.listen(port, () => {
    console.log(`Genius Car Server running on ${port}`.brightYellow.bold.bgGreen);
})