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
} = require("../controllers/userController");
const identifyTenant = require("../middleware/IdentificationMiddleware");
const { protect } = require("../middleware/authMiddleware");

// Route: POST /api/users/login
// Description: Authenticate user and generate token
router.post("/login", identifyTenant, authUser);

// Route: POST /api/users/
// Description: Register a new user
router.post("/", identifyTenant, registerUser);

// Route: GET /api/users/users/school
// Description: Get all users by school ID
router.get("/users/school", identifyTenant, protect, getUsersBySchoolID);

// Route: GET /api/users/users
// Description: Get all users
router.get("/users", identifyTenant, protect, getAllUsers);

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
