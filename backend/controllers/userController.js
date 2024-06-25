const asyncHandler = require("express-async-handler");
const getUserModel = require("../models/userModel");
const generateToken = require("../config/generateToken");
const crudOperations = require("../utils/crudOperations");

// Authenticate user and get token
const authUser = asyncHandler(async (req, res) => {
  const User = getUserModel(req.db);
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const User = getUserModel(req.db);

  const { name, email, password, loginID, schoolID, isActive } = req.body;

  // Check if schoolID is provided
  if (!schoolID) {
    res.status(400).json({ message: "School ID must be provided" });
    return;
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  try {
    const user = await User.create({
      name,
      email,
      password,
      loginID,
      schoolID,
      isActive,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log("File: userController.js", "Line 59:", error);
    res
      .status(400)
      .json({ message: "Invalid user data", error: error.message });
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  const User = getUserModel(req.db);
  const users = await User.find().populate("role");
  res.json(users);
});

const getById = asyncHandler(async (req, res, next) => {
  const User = getUserModel(req.db);
  const roleOperations = crudOperations(User);
  roleOperations.getById(req, res, next);
});

const deleteById = asyncHandler(async (req, res, next) => {
  const User = getUserModel(req.db);
  const roleOperations = crudOperations(User);
  roleOperations.deleteById(req, res, next);
});

const deleteAllId = asyncHandler(async (req, res, next) => {
  const User = getUserModel(req.db);
  const roleOperations = crudOperations(User);
  roleOperations.deleteAll(req, res, next);
});

const updateById = asyncHandler(async (req, res, next) => {
  const User = getUserModel(req.db);
  const roleOperations = crudOperations(User);
  roleOperations.updateById(req, res, next);
});

const assigneRoleToUser = asyncHandler(async (req, res) => {
  const User = getUserModel(req.db);
  const user = await User.findById('6664beb1a23db7aeacd53ea6');
  const roleId = "6664bd96b026adbe8cdc922c";
  const success = await user.assignRole(roleId);
  if (success) {
    res.json('done')
  } else {
    res.json('not done')
  }
});

module.exports = {
  authUser,
  registerUser,
  getAllUsers,
  getById,
  deleteById,
  deleteAllId,
  updateById,
  assigneRoleToUser
};
