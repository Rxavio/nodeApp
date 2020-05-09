const express=require('express');
const router=express.Router();
const Post=require('../../models/Post');

router.all('/*',(req,res,next)=>{
    req.app.locals.layout='admin';
    next();
    });

router.get('/addpost',(req,res)=>{
    res.render('admin/addpost'); 
    });


    

    
 module.exports=router;
