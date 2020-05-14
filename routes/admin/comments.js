const express=require('express');
const router=express.Router();
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const {userAuthenticated} = require('../../helpers/authentication');

router.all('/*',userAuthenticated,(req,res,next)=>{
    req.app.locals.layout='admin';
    next();
    });
router.get('/all-comments',(req,res)=>{
    Comment.find({}).sort({_id:-1})
    .populate('user')
        .then(comments=>{
        res.render('admin/comments/all-comments', {comments: comments});
    });
});




router.post('/all-comments', (req, res)=>{
    Post.findOne({_id: req.body.id}).then(post=>{
        const newComment = new Comment({
            user: req.user.id,
            body: req.body.body

        });
        post.comments.push(newComment);
        post.save().then(savedPost=>{
            newComment.save().then(savedComment=>{
                res.redirect(`/home/post-details/${post.id}`);
            })
        });
    });

});    


 module.exports=router;
