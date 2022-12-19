const mongoose = require('mongoose');
const DB = process.env.DB;
//MongoDB COnnection 
//for connectdatabase
mongoose.connect(DB,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log("connection succesfully"))
.catch((err)=>console.log(err));
