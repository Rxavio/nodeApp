const express=require('express');
const mongoose=require('mongoose');
const {mongoDbUrl} = require('./config/db');
const path=require('path');
const exphbs  = require('express-handlebars');
const bodyParser=require('body-parser');
const dotenv=require('dotenv');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');




dotenv.config();
const app=express();
const port = process.env.PORT;

//db connection
mongoose.connect(mongoDbUrl,{useNewUrlParser:true, useFindAndModify: false, useCreateIndex: true}).then(db=>{
    console.log('mongo connected');

}).catch(error=>console.log('error'));


app.use(express.static(path.join(__dirname,'public')));


//set view engine
app.engine('handlebars', exphbs({defaultLayout: 'home'}));
app.set('view engine', 'handlebars');


//body parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.use(session({
    secret: 'xavier123nodeblog',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());


// Local Variables using Middleware
app.use((req, res, next)=>{
    res.locals.success_message = req.flash('success_message');
    next();
});







//load routes
const main=require('./routes/home/main');
const home=require('./routes/home/index');


//use routes
app.use('/', main);
app.use('/home', home);








app.listen(port, () => {
    console.log(`Server start on port ${port}`);
  });
  