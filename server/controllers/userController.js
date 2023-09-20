const asyncHandler = require('express-async-handler');
const generateToken = require('../config/generateToken');
const User = require('../models/userModel');

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter All the Fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed To Create User");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  console.log(keyword);

  const users = await Promise.all([
    User.find(keyword).lean().exec(),
    User.find({ _id: { $ne: req.user._id } }, '_id').lean().exec(),
  ]);

  const filteredUsers = users[0].filter(user => {
    return !users[1].some(excludeUser => excludeUser._id.equals(user._id));
  });

  res.send(filteredUsers);
});


module.exports = { registerUser, authUser , allUsers };
