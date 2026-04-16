const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const crudOperations = require("../utils/crudOperations");
const { getUserModel, getNotificationModel } = require("../models");
const createError = require("http-errors");
const { publicUrlFromDiskFilename } = require("../middleware/profileImageUpload");
const {
  listSchoolConnectionKeys,
  tenantConnectionKey,
  userHasSchoolAccess,
  tenantStoredAliases,
} = require("../utils/schoolAccess");

const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

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

  // if (!password || !(await user.matchPassword(password))) {
  //   throw createError(401, "Invalid email or password");
  // }

  const token = generateToken(user._id);

  const schoolKeys = listSchoolConnectionKeys(user);
  if (!schoolKeys.length) {
    throw createError(400, "User has no school access configured");
  }

  const requiresSchoolSelection = schoolKeys.length > 1;

  res.cookie("token", token, authCookieOptions);
  if (!requiresSchoolSelection) {
    res.cookie("X-School-Id", schoolKeys[0], authCookieOptions);
  } else {
    res.clearCookie("X-School-Id");
  }

  // Return user info and generated token
  res.json({
    success: true,
    message: "Login successful",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
      schoolID: user.schoolID || schoolKeys[0],
      schoolIDs: schoolKeys,
      requiresSchoolSelection,
      roleName: user.roleName,
    },
  });
});

const registerUser = asyncHandler(async (req, res, next) => {
  try {
    const { email, schoolID, schoolIDs, ...user } = req.body;
    const User = getUserModel(req.usersDb);

    const rawSchoolList = [];
    if (schoolID) rawSchoolList.push(schoolID);
    if (Array.isArray(schoolIDs)) rawSchoolList.push(...schoolIDs);

    const resolvedKeys = [
      ...new Set(
        rawSchoolList.map((id) => tenantConnectionKey(id)).filter(Boolean)
      ),
    ];

    if (!resolvedKeys.length) {
      throw createError(400, "schoolID or non-empty schoolIDs must be provided");
    }

    const primarySchoolStored =
      schoolID != null && String(schoolID).trim() !== ""
        ? schoolID
        : `school_${resolvedKeys[0]}`;

    // Check if user with the same email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw createError(400, "User already exists");
    }

    // Create new user
    const newUser = await User.create({
      email,
      schoolID: primarySchoolStored,
      schoolIDs:
        resolvedKeys.length > 1
          ? resolvedKeys.map((k) => `school_${k}`)
          : undefined,
      ...user,
    });

    const token = generateToken(newUser._id);

    const schoolKeys = listSchoolConnectionKeys(newUser);
    const requiresSchoolSelection = schoolKeys.length > 1;

    res.cookie("token", token, authCookieOptions);
    if (!requiresSchoolSelection) {
      res.cookie("X-School-Id", schoolKeys[0], authCookieOptions);
    }

    // Return user info and generated token
    res.status(201).json({
      success: true,
      message: "User registered",
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token,
        schoolID: newUser.schoolID,
        schoolIDs: schoolKeys,
        requiresSchoolSelection,
        roleName: newUser.roleName,
      },
    });
  } catch (error) {
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
  const Notification = getNotificationModel(req.schoolDb);

  const roleOperations = crudOperations({
    mainModel: User,
    populateModels: [
      {
        field: "notifications",
        model: Notification,
      },
    ],
  });
  roleOperations.getAll(req, res, next);
});

const getById = asyncHandler(async (req, res, next) => {
  const User = getUserModel(req.usersDb);
  const Notification = getNotificationModel(req.schoolDb);

  const roleOperations = crudOperations({
    mainModel: User,
    populateModels: [
      {
        field: "notifications",
        model: Notification,
      },
    ],
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
  const tenant = req.tenantId;
  if (!tenant || tenant === "Users") {
    throw createError(400, "School context is required (X-School-Id header)");
  }

  const aliases = tenantStoredAliases(tenant);
  const User = getUserModel(req.usersDb);

  const users = await User.find({
    $or: [{ schoolID: { $in: aliases } }, { schoolIDs: { $in: aliases } }],
  })
    .select("-password")
    .lean();

  res.status(200).json({
    success: true,
    message: "Users for school fetched",
    data: users,
    meta: { total: users.length },
  });
});

const getMySchools = asyncHandler(async (req, res) => {
  const keys = listSchoolConnectionKeys(req.user);
  res.json({
    success: true,
    message: "Assigned schools",
    data: keys.map((schoolId) => ({ schoolId })),
    meta: {
      count: keys.length,
      requiresSchoolSelection: keys.length > 1,
    },
  });
});

const switchActiveSchool = asyncHandler(async (req, res, next) => {
  const { schoolId } = req.body;
  if (!schoolId) {
    return next(createError(400, "schoolId is required in body"));
  }
  if (!userHasSchoolAccess(req.user, schoolId)) {
    return next(createError(403, "You do not have access to this school"));
  }
  const key = tenantConnectionKey(schoolId);
  res.cookie("X-School-Id", key, authCookieOptions);
  res.json({
    success: true,
    message: "Active school updated",
    data: { activeSchoolId: key },
  });
});

// Logout user and clear cookies
const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.clearCookie('X-School-Id');
  res.json({ message: "Logged out successfully" });
});

const uploadProfileImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(createError(400, 'No image uploaded. Use form field "image".'));
  }
  const User = getUserModel(req.usersDb);
  const userId = req.uploadTargetUserId || req.user._id;
  const url = publicUrlFromDiskFilename(req.file.filename);
  const user = await User.findByIdAndUpdate(
    userId,
    { userImage: url },
    { new: true }
  ).select("-password");

  if (!user) {
    return next(createError(404, "User not found"));
  }

  res.status(200).json({
    success: true,
    userImage: url,
    user,
  });
});

module.exports = {
  authUser,
  registerUser,
  getById,
  updateById,
  deleteAllId,
  deleteById,
  getAllUsers,
  assignRoleToUser,
  getUsersBySchoolID,
  getMySchools,
  switchActiveSchool,
  logoutUser,
  uploadProfileImage,
};
