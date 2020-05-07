const express=require('express');
const router=express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

router.all('/*',(req,res,next)=>{
    req.app.locals.layout='home';
    next();
    });


router.get('/',(req,res)=>{
    res.render('home/'); 
    });

router.get('/register',(req,res)=>{
    res.render('home/register'); 
    });


router.get('/login',(req,res)=>{
    res.render('home/login'); 
    });

router.post('/register', (req, res)=>{

let errors = [];
if(req.body.password !== req.body.password2) {

errors.push({message: "Password fields don't match"});

}
if(errors.length > 0){

res.render('home/register', {
    errors: errors,
    userame: req.body.username,
    email: req.body.email,

})

} else {
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
                  
                    console.log(newUser);
                    res.redirect('/home/login');
                });
            })
        });
    } else {


      console.log('error_message', 'That email exist please login');
        res.redirect('/home/login');

    }
});
}
});   






 module.exports=router;
