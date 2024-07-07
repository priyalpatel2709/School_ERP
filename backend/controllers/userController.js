const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const crudOperations = require("../utils/crudOperations");
const { getUserModel } = require("../models");

// Authenticate user and generate token
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const User = getUserModel(req.usersDb);

  // Find user by email
  const user = await User.findOne({ email });

  // Validate user credentials
  if (!user) {
    throw createError(401, "Invalid email or password");
  }

  // Return user info and generated token
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

const registerUser = asyncHandler(async (req, res, next) => {
  try {
    const { email, schoolID, ...user } = req.body;
    const User = getUserModel(req.usersDb);

    // Check if schoolID is provided
    if (!schoolID) {
      throw createError(400, "School ID must be provided");
    }

    // Check if user with the same email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw createError(400, "User already exists");
    }

    // Create new user
    const newUser = await User.create({
      email,
      schoolID,
      ...user,
    });

    // Return user info and generated token
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token: generateToken(newUser._id),
    });
  } catch (error) {
    console.log('File: userController.js', 'Line 59:', error.message);
    // Handle validation errors
    if (error.name === "ValidationError") {
      return next(createError(400, error.message));
    }
    // Handle other errors
    next(error);
  }
});

// CRUD operations for users with role population
const getAllUsers = asyncHandler(async (req, res, next) => {
  const User = getUserModel(req.usersDb);

  const roleOperations = crudOperations({
    mainModel: User,
  });
  roleOperations.getAll(req, res, next);
});

const getById = asyncHandler(async (req, res, next) => {
  const User = getUserModel(req.usersDb);

  const roleOperations = crudOperations({
    mainModel: User,
  });
  roleOperations.getById(req, res, next);
});

const deleteById = asyncHandler(async (req, res, next) => {
  const User = getUserModel(req.usersDb);
  const roleOperations = crudOperations({
    mainModel: User,
    populateModels: [],
  });
  roleOperations.deleteById(req, res, next);
});

const deleteAllId = asyncHandler(async (req, res, next) => {
  const User = getUserModel(req.usersDb);
  const roleOperations = crudOperations({
    mainModel: User,
    populateModels: [],
  });
  roleOperations.deleteAll(req, res, next);
});

const updateById = asyncHandler(async (req, res, next) => {
  const User = getUserModel(req.usersDb);
  const roleOperations = crudOperations({
    mainModel: User,
    populateModels: [],
  });
  roleOperations.updateById(req, res, next);
});

// Assign role to user
const assignRoleToUser = asyncHandler(async (req, res) => {
  const { userId, role } = req.body;
  const User = getUserModel(req.usersDb);

  // Find user by ID and assign role
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, "User not found");
  }

  const success = await user.assignRole(role);
  if (success) {
    res.json({ message: "Role assigned to user successfully" });
  } else {
    throw createError(400, "Failed to assign role");
  }
});

// Get users by school ID with role population
const getUsersBySchoolID = asyncHandler(async (req, res) => {
  const { schoolID } = req.user;
  const User = getUserModel(req.usersDb);

  // Find all users with the given schoolID
  const users = await User.find({ schoolID }).lean();

  // Populate each user with their role from the Role database
  const populatedUsers = await Promise.all(
    users.map(async (user) => {
      return { ...user };
    })
  );

  // Return populated users
  res.status(200).json(populatedUsers);
});

module.exports = {
  authUser,
  registerUser,
  getById,
  updateById,
  deleteAllId,
  deleteById,
  getById,
  getAllUsers,
  assignRoleToUser,
  getUsersBySchoolID,
};
