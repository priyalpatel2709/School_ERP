const jwt = require("jsonwebtoken");
const getUserModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  // Check for token in Authorization header first, then in cookies
  let token = '';

  if (req.cookies) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ error: "Not authorized, No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const User = getUserModel(req.usersDb);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Not authorized, token invalid" });
  }
});

const authorize = (...requiredPermissions) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authorized" });
    }

    // Admin/SuperAdmins typically have full access
    if (req.user.roleName === "Admin" || req.user.roleName === "SuperAdmin") {
      return next();
    }

    // Check if user has ANY of the required permissions in their access list
    if (req.user.access && requiredPermissions.some(perm => req.user.access.includes(perm))) {
      return next();
    }

    return res.status(403).json({
      error: "Forbidden. You do not have permission to perform this action."
    });
  });
};

module.exports = { protect, authorize };
