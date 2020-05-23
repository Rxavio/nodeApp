const express=require('express');
const router=express.Router();
const User = require('../../models/User');
const Post  = require('../../models/Post');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { isEmpty } = require('../../helpers/upload-helper');


router.all('/*',(req,res,next)=>{
    req.app.locals.layout='home';
    next();
    });
router.get('/', (req, res)=>{
    const perPage = 6;
    const page = req.query.page || 1;
    Post.find({}).sort({_id:-1}) 
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .then(posts =>{
        Post.count().then(postCount=>{
                res.render('home/', {
                    posts: posts,
                    current: parseInt(page),
                    pages: Math.ceil(postCount / perPage)
                });
            });
        });
    });


router.get('/post-details/:id',(req,res)=>{
    Post.findOne({_id:req.params.id})
    .populate({path: 'comments', populate: {path: 'user', model: 'users'}})
    .populate('user')
    .then(post=>{ 
        res.render('home/post-details', {post: post});
    
    }); 
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
        if(!user) return done(null, false, {message: 'User does not Exist'});
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
        successRedirect: '/admin',
        failureRedirect: '/home/login',
        failureFlash: true
   })(req, res, next);
});

router.get('/logout', (req, res)=>{
    req.logOut();
    res.redirect('/home/login');

});


router.post('/register', (req, res)=>{
    let filename = '/profile/default.jpg';
    if(!isEmpty(req.files)){
       let file = req.files.file;
       filename = Date.now() + '-' + file.name;
       file.mv('./public/uploads/' + filename, (err)=>{
           if(err) throw err;
       });
   }

let errors = [];
if(req.body.password !== req.body.password2) {

errors.push({message: "Password fields don't match"});
console.log(errors);

}
if(errors.length > 0){

res.render('home/register', {
    errors: errors,
    username: req.body.username,
    email: req.body.email,

})

} else {
User.findOne({email: req.body.email}).then(user=>{
    if(!user){
        const newUser = new User({
          username: req.body.username,
           email: req.body.email,
           password: req.body.password,
           userRole: req.body.userRole,
           file: filename
        });
        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(newUser.password, salt, (err, hash)=>{
                newUser.password = hash;
                newUser.save().then(savedUser=>{
                    req.flash('success_message', 'Account successfully created, please login')
                    res.redirect('/home/login');
                });
            })
        });
    } else {

       req.flash('error_message', 'That email exist please login');
           res.redirect('/home/login');

    }
});
}
});   






 module.exports=router;
