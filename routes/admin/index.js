const express=require('express');
const router=express.Router();
const Post = require('../../models/Post');
const User = require('../../models/User');
const Comment = require('../../models/Comment');
const {userAuthenticated} = require('../../helpers/authentication');

router.all('/*',userAuthenticated,(req,res,next)=>{
    req.app.locals.layout='admin';
    next();
    });
router.get('/',(req,res)=>{
    const promises = [
        Post.count().exec(),
        User.count().exec(),
        Comment.count().exec()
    ];
    Promise.all(promises).then(([postCount,userCount,commentCount])=>{
        res.render('admin', {postCount: postCount,userCount: userCount,commentCount: commentCount});
    });

});


 module.exports=router;
