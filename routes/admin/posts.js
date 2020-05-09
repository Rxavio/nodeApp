const express=require('express');
const router=express.Router();
const Post=require('../../models/Post');
const User=require('../../models/User');
const { isEmpty, uploadDir } = require('../../helpers/upload-helper');
const fs = require('fs');

router.all('/*',(req,res,next)=>{
    req.app.locals.layout='admin';
    next();
    });

router.get('/addpost',(req,res)=>{
    res.render('admin/addpost'); 
    });
 

router.post('/addpost',(req,res)=>{
    let filename = '';
     if(!isEmpty(req.files)){

        let file = req.files.file;
        filename = Date.now() + '-' + file.name;

        file.mv('./public/uploads/' + filename, (err)=>{

            if(err) throw err;

        });

    }

let allowComments = true;
if(req.body.allowComments){

allowComments = true;

} else{

allowComments = false;

}

User.findOne({_id: req.user.id}).then(user=>{
const newPost = new Post({
user: req.user.id,
title: req.body.title,
status: req.body.status,
allowComments: allowComments,
body: req.body.body,
file: filename
    });
    user.posts.push(newPost);
    user.save().then(savedUser=>{
        newPost.save().then(savedPost=>{

req.flash('success_message', 'Post was successfully saved');

res.redirect('/admin/all-posts');

}).catch(error=>{
console.log('could not save post');
}); 

});

});

});

router.get('/all-posts',(req,res)=>{
    Post.find({}).sort({_id:-1}).then(posts=>{
        res.render('admin/all-posts', {posts: posts});
    });
    });



    

    
 module.exports=router;
