'use strict';
require('dotenv').config()
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const colorHandler = require('./modules/color');
// const addHandler = require("./modules/addHandler")
const server = express()
server.use(cors());
server.use(express.json())

const PORT = process.env.PORT;
// const PORT =3001

// proof of life 
// server.get('/', (req, res) => {
//     res.status(200).send('home route ')
// })
 
// getting-started.js
const mongoose = require('mongoose');
mongoose.connect('mongodb://laith:12345@cluster0-shard-00-00.dpr6g.mongodb.net:27017,cluster0-shard-00-01.dpr6g.mongodb.net:27017,cluster0-shard-00-02.dpr6g.mongodb.net:27017/training?ssl=true&replicaSet=atlas-376ccf-shard-0&authSource=admin&retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const ColoroSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const OwnerSchema = mongoose.Schema({
    email: String,
    color: [ColoroSchema]
})
// const myColorModel = mongoose.model('colorize', ColoroSchema);


/// profile data
const myOwnerModel = mongoose.model('owner', OwnerSchema);



// const silence = new Color({ name: 'Silence2' });
// console.log(silence.name); // 'Silence'

function seedOwnerCollection() {
    const laith = new myOwnerModel({
        email: 'laithhayajneh98@gmail.com',
        color: [
            {
                name: 'test1',
                number: 'tes2'
            },
            {
                name:"test3",
                number:"3333"
            }
            
        ]
    })
    laith.save();
}
// seedOwnerCollection();





function  emailHundler (req,res){
    // console.log(myOwnerModel)
    const email =req.query.email;
    console.log('this email',email)
    myOwnerModel.find({email:email},(error,items)=>{
        if (error) {
            res.status(500).send('not found');
            
        }else{
            console.log('itemms',items[0])
            res.status(200).send(items[0].color)
        }
    })
}



//http://localhost:3001/color

server.post('/api-data', addBookResponse)
 

function addBookResponse (req,res){
    console.log('booooo',req.body)

    let {colorTitle,colorDesc}=req.body;

    let emailAddress=req.query.email;

    console.log('this email address from addBook',emailAddress);

    myOwnerModel.find({email:emailAddress},(error,items)=>{
        if (error) {
            res.status(500).send('not found')
            
        }else{
            console.log('beffore adding ',items)
            items[0].color.push({
                name:colorTitle,
                number:colorDesc
            })
            console.log('after adding',items[0])
            items[0].save();
            res.send(items[0].color)
        }
    })
}




/// deleting 
// localhost:3001/1?email=

server.delete('/:id',deleteHandler)


function deleteHandler(req,res){
    console.log('query from the delete ',req.query);
    let colorId =req.params.id;

    let emailaddress =req.query.email;
    console.log('this email from delete',emailaddress);

    myOwnerModel.find({email:emailaddress},(error,items)=>{
        if (error) {
            res.status(500).send('cant find user');
            
        }else{
            let newColorArray=items[0].color.filter(idx=>{
                return idx._id.toString() !==colorId
            })
            items[0].color=newColorArray;
            items[0].save();
            res.status(200).send(items[0].color);
        }
    })
}


// updating 
// localhost:3001/1?email=
server.put('/:id',updateHandler)

function updateHandler(req,res){
    let id =req.params.id;
// let emailAddress=req.query.email
    let {email,colorTitle,colorDesc}=req.body;
console.log('beffore the update',email)
    myOwnerModel.findOne({email:email},(error,items)=>{
        if (error) {
            res.status(500).send('not found');
            
        }else{
            items.color.map(color=>{
                if (color._id.toString() === id) {
                    color.name=colorTitle;
                    color.number=colorDesc;
                    return color
                    
                }else{
                    return color
                }
            })
            items.save();
            console.log("you are updating")
            res.status(200).send(items.color)

        }
    })
}



// http://localhost:3001/?email=

server.get('/',emailHundler)




//http://localhost:3001/color
server.get('/color', colorHandler)




server.get('*', (req, res) => {
    res.status(500).send("NOT FOUND ")
})

server.listen(PORT, () => {
    console.log(`listening ${PORT}`)
})

