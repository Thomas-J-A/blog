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
