const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = Schema({
  content: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
  },
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
