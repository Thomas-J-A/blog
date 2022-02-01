module.exports = checkIsAdmin = (req, res, next) => {
  // req.user added by passport verify callback
  (req.user.role === 'admin') ? next() : res.status(401).json({ message: 'Unauthorized' });
};
