const express=require('express');
const router=express.Router();
const Post=require('../../models/Post');
const User=require('../../models/User');
const { isEmpty, uploadDir } = require('../../helpers/upload-helper');
const fs = require('fs');
const {userAuthenticated} = require('../../helpers/authentication');

router.all('/*',userAuthenticated,(req,res,next)=>{
    req.app.locals.layout='admin';
    next();
    });

router.get('/addpost',(req,res)=>{
    res.render('admin/posts/addpost'); 
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

res.redirect('/admin/posts/my-posts');

}).catch(error=>{
console.log('could not save post');
}); 

});

});

});

router.get('/all-posts',(req,res)=>{
    Post.find({}).sort({_id:-1}).then(posts=>{
        res.render('admin/posts/all-posts', {posts: posts});
    });
    });

router.get('/my-posts',(req,res)=>{
    Post.find({user: req.user.id}).sort({_id:-1}) 
    .then(posts=>{
        res.render('admin/posts/my-posts', {posts: posts});
    });
    });  
     
router.delete('/:id', (req, res)=>{

Post.deleteOne({_id: req.params.id}).then(postRemoved=>{
    req.flash('success_message', 'Post was successfully deleted');
    res.redirect('admin/posts/my-posts');
            });
        });


router.get('/editpost/:id', (req, res)=>{
    Post.findOne({_id: req.params.id})
        .then(post=>{ 
  res.render('admin/posts/editpost',{post: post});

  });
});
// POST UPDATING
router.put('/editpost/:id', (req, res)=>{
    Post.findOne({_id: req.params.id})
        .then(post=>{
            if(req.body.allowComments){
                allowComments = true;
            } else{
                allowComments = false;
            }
            post.user = req.user.id;
            post.title = req.body.title;
            post.status = req.body.status;
            post.allowComments = allowComments;
            post.body = req.body.body;
            if(!isEmpty(req.files)){
                let file = req.files.file;
                filename = Date.now() + '-' + file.name;
                post.file = filename;
                file.mv('./public/uploads/' + filename, (err)=>{
                    if(err) throw err;
                });
            }
         post.save().then(updatedPost=>{
          console.log('Post was successfully updated');
         res.redirect('/admin/posts/my-posts');
            });
        });
});
     

    






    

    
 module.exports=router;
