const express = require('express');
const cors = require('cors');
const app = express();
let colors = require('colors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port =  process.env.PORT || 5000;


// middle wares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.v1rp4a3.mongodb.net/?retryWrites=true&w=majority`;

 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



function verifyJWT(req, res, next) {
const authHeader = req.headers.authorization;
if(!authHeader){
 return res.status(401).send({message: 'Unauthorized access'})
}
const token = authHeader.split(' ')[1];
jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
  if(err){
    return res.status(403).send({message: 'Forbidden access'})
  }
  req.decoded = decoded;
  next();
})
}



async function run () {

try{
  const serviceCollection = client.db('geniusCar').collection('services')
  const orderCollection = client.db('geniusCar').collection('orders')



  // JWT token
   app.post('/jwt', (req, res) => {
    const user = req.body
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
    res.send({token})
    
   })




  // service api - loading all service from db
  app.get('/services', async (req, res) => {
    const query = {}; 
    const cursor = serviceCollection.find(query);
    const services = await cursor.toArray();
    res.send(services)
  })

  // specific services by id - loading one service only 
  app.get('/services/:id', async (req, res) => {
    const id = req.params.id;
    const query = {_id: ObjectId(id)}
    const service = await serviceCollection.findOne(query)
    res.send(service)
  })

// create Orders api - sending order to db
app.post('/orders', verifyJWT, async (req , res) => {
  const order = req.body;
  const result = await orderCollection.insertOne(order)
  res.send(result)
})


// getting users orders from db
app.get('/orders', verifyJWT, async(req, res) => {
  const decoded = req.decoded;
  console.log(decoded, 'inside order api');
  if(decoded.email !== req.query.email){
    return res.send(403).send({message: 'Unauthorized Access'})
  }
  
  let query = {};
  if(req.query.email){
    query = {
      email: req.query.email
    }
  }
   const cursor = orderCollection.find(query);
   const orders = await cursor.toArray();
   res.send(orders)
});


// patch
app.patch('/orders/:id', verifyJWT, async(req, res) => {
  const id = req.params.id;
  const status = req.body.status;
  const query = {_id: ObjectId(id)}
  const updatedDoc = {
    $set: {
      status: status
    }
  }
  const result = await orderCollection.updateOne(query, updatedDoc);
  res.send(result)

})



// deleting one order
app.delete('/orders/:id', verifyJWT, async (req, res) => {
  const id = req.params.id
  const query = {_id:ObjectId(id)}
  const result = await orderCollection.deleteOne(query)
  res.send(result);

})

}
finally{

}

}

run().catch(err => console.error(err))



app.get('/', (req, res) => {
    res.send("Genius car server is racing")
})

app.listen(port, () => {
    console.log(`Genius Car Server running on ${port}`.brightYellow.bold.bgGreen);
})