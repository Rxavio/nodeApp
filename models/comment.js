const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const CommentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    body:{
        type: String,
        required: true
    },
    approveComment:{
        type: Boolean,
        default:true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    posts: {
        type: Schema.Types.ObjectId,
        ref: 'posts'
    },
});
module.exports = mongoose.model('comments', CommentSchema);
