// require files
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

// express middleware cors
const app = express()
app.use(cors())
app.use(bodyParser.json())

//database admin info

const uri = process.env.DB_PATH;

let client = new MongoClient(uri, { useNewUrlParser: true });

// const user = ['x', 'y', 'z'];


//read data from server/database

app.get('/products', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        // perform actions on the collection object

        collection.find().toArray((err, documents) => {
            // console.log("succesfully inserted", result);
            if (err) {
                console.log(err);
                res.status(500).send({ message: err });
            }
            else {
                res.send(documents);
            }
        })
        client.close();
    });
});

//get dyamic data from database based on id 

app.get('/products/:key', (req, res) => {
    const key = req.params.key;

    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        // perform actions on the collection object

        collection.find({key}).toArray((err, documents) => {
            // console.log("succesfully inserted", result);
            if (err) {
                console.log(err);
                res.status(500).send({ message: err });
            }
            else {
                res.send(documents[0]);
            }
        })
        client.close();
    });


    // const name = user[userId];
    // res.send({ userId, name });
})


app.post('/getProductsByKey', (req, res) => {
    const key = req.params.key;
    const productKeys = req.body;
    console.log(productKeys);

    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        // perform actions on the collection object

        collection.find({ key: {$in:productKeys} }).toArray((err, documents) => {
            // console.log("succesfully inserted", result);
            if (err) {
                console.log(err);
                res.status(500).send({ message: err });
            }
            else {
                res.send(documents);
            }
        })
        client.close();
    });
})

//post data to server

app.post('/addProduct', (req, res) => {
    //save to database 
    const product = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true });
   console.log(product);

    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        // perform actions on the collection object

        collection.insert(product, (err, result) => {
            // console.log("succesfully inserted", result);
            if(err){
                console.log(err);
                res.status(500).send({message:err});
            }
            else{
                res.send(result.ops[0]);
            }
        })
        client.close();
    });
})

//add to cart

app.post('/placeOrder', (req, res) => {
    const orderDetails = req.body;
    orderDetails.orderTime = new Date();
    console.log(orderDetails);
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("orders");
        // perform actions on the collection object

        collection.insertOne(orderDetails, (err, result) => {
            // console.log("succesfully inserted", result);
            if (err) {
                console.log(err);
                res.status(500).send({ message: err });
            }
            else {
                res.send(result.ops[0]);
            }
        })
        client.close();
    });
})

const port = process.env.PORT || 4200;
app.listen(port, () => console.log("Listening to the port 4200"))