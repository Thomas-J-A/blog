const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Creates a JWT token
const generateToken = (user) => {
  return jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
    expiresIn: 60 * 15, // 15 minutes
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
    // to express error-handling middleware (network, db errors)
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await req.models.User.findOne({ email: req.body.email });
    if (user === null) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = generateToken(user);

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 15, // 15 minutes
    });

    // Remove password field from user data before returning it
    const { password, ...rest } = user._doc;
    return res.status(200).json(rest);
  } catch (err) {
    // Pass any internal errors not explicitly handled
    // to express error-handling middleware (network, db errors)
    next(err);
  }
};

exports.logout = (req, res) => {
  // res.clearCookie('jwt', {
  //   httpOnly: true,
  // });

  res.cookie('jwt', '', {
    maxAge: 1,
    httpOnly: true,
  });

  res.status(200).json({ success: true });
};
