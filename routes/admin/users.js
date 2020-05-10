const express=require('express');
const router=express.Router();
const User=require('../../models/User');
const {userAuthenticated} = require('../../helpers/authentication');

router.all('/*',userAuthenticated,(req,res,next)=>{
    req.app.locals.layout='admin';
    next();
    });


router.get('/all-users',(req,res)=>{
    User.find({}).sort({_id:-1}).then(users=>{
        res.render('admin/all-users', {users: users});
    });
    });


    
 module.exports=router;
