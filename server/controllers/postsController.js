// Multer configuration
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `${ new Date().toISOString() }.${ ext }`);
  },
});

const upload = multer({
  storage,
  limits: {
    filesize: 1024 * 1024 * 2, // 2MB
  },
});

exports.readPosts = async (req, res, next) => {
  try {
    // .find() returns a Query instance, .exec() returns a true Promise instance,
    // and await expects a true Promise
    // Use sort method to ensure newest post appears first
    const posts = await req.models.Post
      .find()
      .sort({ createdAt: -1 })
      .exec();

    return res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

exports.createPost = [
  upload.single('image'),
  async (req, res, next) => {
    try {
      const post = new req.models.Post({
        title: req.body.title,
        content: req.body.content,
        imageURL: req.file.path,
        isPublished: req.body.isPublished,
        // TODO: postedOn:
      });
  
      await post.save();
  
      return res.status(201).json(post);
    } catch (err) {
      next(err);
    }
  },
];


exports.readPost = async (req, res, next) => {
  try {
    const { id } = req.params;
  
    const post = await req.models.Post.findById(id).exec();

    return res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

exports.updatePost = [
  upload.single('image'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const updateOps = {
        title: req.body.title,
        content: req.body.content,
        imageURL: req.file.path,
        isPublished: req.body.isPublished,
      };
      
      const post = await req.models.Post.findByIdAndUpdate(id, updateOps, { new: true }).exec();
      
      return res.status(200).json(post);
    } catch (err) {
      next(err);
    }
  },
];

exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await req.models.Post.findByIdAndRemove(id).exec();

    return res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};
