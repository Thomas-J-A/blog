exports.createComment = (req, res) => {
  res.status(200).send('created comment successfully');
};

exports.deleteComment = (req, res) => {
  res.status(200).send('removed comment successfully');
};
