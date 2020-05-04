const express=require('express');
const mongoose=require('mongoose');
const {mongoDbUrl} = require('./config/db');

const app=express();

//db connection
mongoose.connect(mongoDbUrl,{useNewUrlParser:true, useFindAndModify: false, useCreateIndex: true}).then(db=>{
    console.log('mongo connected');

}).catch(error=>console.log('error'));






app.listen(4500,()=>{
    console.log('listening on port 4500');
});