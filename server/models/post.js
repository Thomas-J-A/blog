const mongoose = require('mongoose');
const Comment = require('./comment');

// Regular fs methods don't return Promises yet, 
// so use fs.promises - aliased as fs - with async/await
const { promises: fs } = require('fs');

const Schema = mongoose.Schema;

const postSchema = Schema({
  title: String,
  content: String,
  imageURL: String,
  isPublished: Boolean,
  // postedOn: Date,
}, { timestamps: true });

// Anytime you want to delete a post, you'll want to delete all associated comments too!
// 'findByIdAndRemove' middleware doesn't exist, but that method triggers the 'findOneAndRemove' middleware
// In Query middleware, 'this' refers to the Query object
postSchema.pre('findOneAndRemove', async function(next) {
  try {
    await Comment.deleteMany({ post: this._conditions._id });
  
    next();
  } catch (err) {
    next(err);
  }
});

// Delete the image associated with the post from the file system
postSchema.post('findOneAndRemove', async function(post, next) {
  try {
    // This code ultimately ends up running in app.js
    // because of imports, hence the URL begins from that pwd
    await fs.unlink(`./${ post.imageURL }`);

    next();
  } catch (err) {
    next(err);
  }
});

postSchema.pre('findOneAndUpdate', async function(next) {
  try {
    // Query for current post.imageURL value so
    // that it can be removed from file system
    const docToUpdate = await this.model.findById(this._conditions._id).exec();
    await fs.unlink(`./${ docToUpdate.imageURL }`);

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Post', postSchema);
