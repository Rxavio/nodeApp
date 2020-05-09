const mongoose=require('mongoose')
const URLSlugs = require('mongoose-url-slugs');

const Schema=mongoose.Schema;
const PostSchema = new Schema({
   user: {
    type: Schema.Types.ObjectId,
    ref:'users'
    },
    title:{
        type: String,
        required: true
    },
    status:{
        type: String,
        default: 'public'
    },
    allowComments:{
        type: Boolean,
        require: true
    },
    body:{
        type: String,
        require: true
    },
    file:{
        type: String,
    },
     date: {
        type: Date,
        default: Date.now()
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }]

});

module.exports = mongoose.model('posts', PostSchema);
