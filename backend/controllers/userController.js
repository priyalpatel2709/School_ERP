const asyncHandler = require("express-async-handler");
const getUserModel = require("../models/userModel");
const generateToken = require("../config/generateToken");
const connectToDatabase = require("../config/db");

const authUser = asyncHandler(async (req, res) => {
  const User = getUserModel(req.db);
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: user._id,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const User = getUserModel(req.db);
  const { name, email, password, role, loginID } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    loginID,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: user._id,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

module.exports = { authUser, registerUser };
