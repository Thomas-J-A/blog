// Can be requested with optional query parameters
// req.query is an object filled with a property for each query parameter
// If there are no query params, it’s an empty object.
exports.readComments = async (req, res, next) => {
  try {
    let comments;

    if (req.query.post) {
      // Return comments for a single post
      comments = await req.models.Comment
        .find(req.query)
        .sort({ createdAt: -1 })
        .populate('author')
        .exec();
    } else {
      // Return all comments, only id of each post required in client
      comments = await req.models.Comment.find().select('post').exec();
    }

    return res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};

exports.createComment = async (req, res, next) => {
  try {
    // create, save, return 
    const comment = await new req.models.Comment({
       content: req.body.content,
       author: req.body.author,
       post: req.body.post,
    });

    await comment.save();

    return res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await req.models.Comment.findByIdAndRemove(id).exec();
    return res.status(200).json(comment);
  } catch (err) {
    next(err);
  }
};
