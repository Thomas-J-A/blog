exports.readPosts = (req, res) => {
  res.status(200).send('fetched all posts successfully');
};

exports.createPost = (req, res) => {
  res.status(200).send('created post successfully');
};

exports.readPost = (req, res) => {
  res.status(200).send('fetched post successfully');
};

exports.updatePost = (req, res) => {
  res.status(200).send('updated post successfully');
};

exports.deletePost = (req, res) => {
  res.status(200).send('deleted post successfully');
};
