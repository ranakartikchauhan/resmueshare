const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = express();
dotenv.config({path:'./config.env'});
require('./db/conn')
const User = require('./model/userSchema');

const PORT = process.env.PORT
const path = __dirname + '/views/';
app.get('/', function (req,res) {
    res.sendFile(path + "index.html");
  });

app.use(express.static(path));
app.use(express.json());
app.use(require('./router/auth'))    //link of rouet file

app.use(express.static('uploads'));





//app.get("/about",(req,res)=>{
//    res.send("Hello About");
//})

app.get("/contact",(req,res)=>{
    res.cookie("Test",'thapa');
    res.send("Hello contact");
})

app.get("/signin",(req,res)=>{
    res.send("Hello sign in world");
})

app.get("/signup",(req,res)=>{
    res.send("Hello Registration world");
})


app.listen(PORT,()=>{
    console.log(`App is running on ${PORT}`);
})