const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const UserSchema = new Schema({
    
  username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'posts'
    }],

}, {usePushEach: true});

module.exports = mongoose.model('users', UserSchema);
