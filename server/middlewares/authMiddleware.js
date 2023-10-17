const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWTSECRET);
      req.user = await User.findById(decoded.id).select('password');
      next();
    } catch (error) {
      res.status(401).send('Not authorized, token failed');
    }
  } else {
    res.status(401).send('Not authorized, no token');
  }
});

module.exports = { protect };
