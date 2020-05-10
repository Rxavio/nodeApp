const express=require('express');
const router=express.Router();
const User=require('../../models/User');
const bcrypt = require('bcryptjs');
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

router.get('/adduser',(req,res)=>{
    res.render('admin/adduser'); 
    });


router.post('/adduser', (req, res)=>{

let errors = [];
if(req.body.password !== req.body.password2) {
errors.push({message: "Password fields don't match"});
// console.log(errors);
}
 else {
User.findOne({email: req.body.email}).then(user=>{
    if(!user){
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });
        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(newUser.password, salt, (err, hash)=>{
                newUser.password = hash;
                newUser.save().then(savedUser=>{
                    req.flash('success_message', 'User Successfully Created')
                    res.redirect('/admin/all-users');
                });
            })
        });
    } else {

        req.flash('error_message', 'That email exist please try a new again');
            res.redirect('/admin/adduser');

    }
});
}
});   

    



    
 module.exports=router;
