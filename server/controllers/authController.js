exports.register = (req, res) => {
  res.status(200).send('registered successfully');
};

exports.login = (req, res) => {
  res.status(200).send('logged in successfully')
};

exports.logout = (req, res) => {
  res.status(200).send('logged out successfully');
};
