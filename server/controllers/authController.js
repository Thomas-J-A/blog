const jwt = require('jsonwebtoken');

// Creates a JWT token
const generateToken = (user) => {
  return jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
    expiresIn: 1000 * 60 * 15, // 15 minutes
    // algorithm: 'HS256',
  });
}

exports.register = async (req, res, next) => {
  try {
    const existingUser = await req.models.User.findOne({ email: req.body.email });

    if (existingUser !== null) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const user = new req.models.User({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
    });

    await user.save();

    const token = generateToken(user);

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 15, // 15 minutes
    });

    // Remove password field from user data before returning it
    const { password, ...rest } = user._doc;
    return res.status(201).json(rest);

  } catch (err) {
    // Pass any internal errors not explicitly handled
    // to express error-handling middleware
    next(err);
  }
};

exports.login = (req, res) => {
  res.status(200).send('logged in successfully')
};

exports.logout = (req, res) => {
  res.status(200).send('logged out successfully');
};
