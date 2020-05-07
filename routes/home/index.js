const express=require('express');
const router=express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

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

// APP LOGIN
passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done)=>{
    User.findOne({email: email}).then(user=>{
        if(!user) return done(null, false, {message: 'No user found'});
        bcrypt.compare(password, user.password, (err, matched)=>{
            if(err) return err;
            if(matched){
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect password' });
            }

        });

    });

}));


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});



router.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/home/login',
        failureFlash: true
   })(req, res, next);
});

router.get('/logout', (req, res)=>{
    req.logOut();
    res.redirect('/home/login');

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
                    req.flash('success_message', 'You are now registered, please login')
                    console.log(newUser);
                    res.redirect('/home/login');
                });
            })
        });
    } else {

       req.flash('error_message', 'That email exist please login');
      console.log('error_message', 'That email exist please login');
        res.redirect('/home/login');

    }
});
}
});   






 module.exports=router;
