exports.readPosts = async (req, res, next) => {
  try {
    // .find() returns a Query instance, .exec() returns a true Promise instance,
    // and await expects a true Promise
    const posts = await req.models.Post.find().exec();

    return res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const post = new req.models.Post({
      title: req.body.title,
      content: req.body.content,
      isPublished: req.body.isPublished,
      // TODO: postedOn:
    });

    await post.save();

    return res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

exports.readPost = async (req, res, next) => {
  try {
    const { id } = req.params;
  
    const post = await req.models.Post.findById(id).exec();

    return res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updateOps = {
      title: req.body.title,
      content: req.body.content,
      isPublished: req.body.isPublished,
    };

    const post = await req.models.Post.findByIdAndUpdate(id, updateOps, { new: true }).exec();

    return res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await req.models.Post.findByIdAndRemove(id).exec();

    return res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};
