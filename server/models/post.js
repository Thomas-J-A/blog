const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = Schema({
  title: String,
  content: String,
  isPublished: Boolean,
  postedOn: Date,
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
