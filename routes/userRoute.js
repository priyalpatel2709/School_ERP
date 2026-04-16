const express = require("express");
const router = express.Router();
const {
  authUser,
  registerUser,
  getAllUsers,
  getById,
  deleteById,
  deleteAllId,
  updateById,
  assignRoleToUser,
  getUsersBySchoolID,
  getMySchools,
  switchActiveSchool,
  logoutUser,
  uploadProfileImage,
} = require("../controllers/userController");
const identifyTenant = require("../middleware/IdentificationMiddleware");
const usersDbOnly = require("../middleware/usersDbOnly");
const { protect } = require("../middleware/authMiddleware");
const {
  uploadProfileImageMiddleware,
} = require("../middleware/profileImageUpload");

const setUploadTargetSelf = (req, _res, next) => {
  req.uploadTargetUserId = req.user._id;
  next();
};

const setUploadTargetFromParam = (req, _res, next) => {
  req.uploadTargetUserId = req.params.id;
  next();
};

const canUploadProfileForUser = (req, res, next) => {
  const target = req.params.id;
  const self = String(req.user._id) === String(target);
  const admin = String(req.user.roleName || "").toLowerCase() === "admin";
  if (self || admin) {
    return next();
  }
  return res.status(403).json({
    message: "Not allowed to update this user's profile image",
  });
};

// Route: POST /api/users/login
// Description: Authenticate user and generate token
router.post("/login", identifyTenant, authUser);

// Route: POST /api/users/logout
// Description: Logout user and clear cookies
router.post("/logout", logoutUser);

// Route: POST /api/users/
// Description: Register a new user
router.post("/", identifyTenant, registerUser);

// Route: GET /api/users/users/school
// Description: Get all users by school ID
router.get("/users/school", identifyTenant, protect, getUsersBySchoolID);

// Assigned schools (multi-tenant admin picker)
router.get("/users/me/schools", usersDbOnly, protect, getMySchools);

// Set active school cookie + header context for subsequent requests
router.post("/users/me/active-school", usersDbOnly, protect, switchActiveSchool);

// Route: GET /api/users/users
// Description: Get all users
router.get("/users", identifyTenant, protect, getAllUsers);

// Profile image upload (multipart field name: image, max 5MB, jpeg/png/gif/webp)
router.post(
  "/users/profile-image",
  identifyTenant,
  protect,
  setUploadTargetSelf,
  uploadProfileImageMiddleware,
  uploadProfileImage,
);

router.post(
  "/users/:id/profile-image",
  identifyTenant,
  protect,
  canUploadProfileForUser,
  setUploadTargetFromParam,
  uploadProfileImageMiddleware,
  uploadProfileImage,
);

// Route: GET /api/users/users/:id
// Description: Get user by ID
router.get("/users/:id", identifyTenant, protect, getById);

// Route: DELETE /api/users/users/:id
// Description: Delete user by ID
router.delete("/users/:id", identifyTenant, protect, deleteById);

// Route: DELETE /api/users/users
// Description: Delete all users
router.delete("/users", identifyTenant, protect, deleteAllId);

// Route: PUT /api/users/users/:id
// Description: Update user by ID
router.put("/users/:id", identifyTenant, protect, updateById);

// Route: POST /api/users/users/role
// Description: Assign role to user
router.post("/users/role", identifyTenant, protect, assignRoleToUser);

module.exports = router;
