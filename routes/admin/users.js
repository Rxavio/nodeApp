const express=require('express');
const router=express.Router();
const User=require('../../models/User');
const bcrypt = require('bcryptjs');
const { isEmpty, uploadDir } = require('../../helpers/upload-helper');
const fs = require('fs');
const {userAuthenticated} = require('../../helpers/authentication');

router.all('/*',userAuthenticated,(req,res,next)=>{
    req.app.locals.layout='admin';
    next();
    });


router.get('/all-users',(req,res)=>{
    User.find({}).sort({_id:-1}).then(users=>{
        res.render('admin/users/all-users', {users: users});
    });
    });

router.get('/adduser',(req,res)=>{
    res.render('admin/users/adduser'); 
    });


router.post('/adduser', (req, res)=>{
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
}
 else {
User.findOne({email: req.body.email}).then(user=>{
    if(!user){
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            file: filename
        });
        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(newUser.password, salt, (err, hash)=>{
                newUser.password = hash;
                newUser.save().then(savedUser=>{
                    req.flash('success_message', 'User Successfully Created')
                    res.redirect('/admin/users/all-users');
                });
            })
        });
    } else {

        req.flash('error_message', 'That email exist please try a new again');
            res.redirect('admin/users/adduser');

    }
});
}
});  
     
router.delete('/:id', (req, res)=>{
    let filename = '/profile/default.jpg';
    User.findOne({_id: req.params.id})
    .populate('posts')
    .then(user =>{
        if(!filename=='default.jpg'){
        fs.unlink(uploadDir + user.file, (err)=>{
            if(!user.posts.length < 1){
                user.posts.forEach(post=>{
                  post.remove();
               });
            }
            user.remove().then(userRemoved=>{
                req.flash('success_message', 'User was successfully deleted');
                res.redirect('/admin/users/all-users');
            });
        });
    }
    else{
            if(!user.posts.length < 1){
                user.posts.forEach(post=>{
                  post.remove();
               });
            }
            user.remove().then(userRemoved=>{
                req.flash('success_message', 'User was successfully deleted');
                res.redirect('/admin/users/all-users');
            });
       

    }

});

});

 router.get('/profile',(req,res)=>{
  User.findOne({_id: req.user.id})
    .then(user=>{ 
  res.render('admin/users/profile',{user: user});

  });
});


// USER UPDATING
router.put('/profile/:id', (req, res)=>{
    User.findOne({_id: req.user.id})
        .then(user=>{
            user.user = req.user.id;
            user.firstname = req.body.firstname;
            user.lastname = req.body.lastname;
            user.username = req.body.username;
            user.email = req.body.email;
           
            // if(!isEmpty(req.files)){
            //     let file = req.files.file;
            //     filename = Date.now() + '-' + file.name;
            //     user.file = filename;
            //     file.mv('./public/uploads/' + filename, (err)=>{
            //         if(err) throw err;
            //     });
            // }
         user.save().then(updateduser=>{
          console.log('Account was successfully updated');
         res.redirect('/admin/users/profile');
            });
        });
});

    



    
 module.exports=router;
