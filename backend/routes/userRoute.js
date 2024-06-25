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
  assigneRoleToUser
} = require("../controllers/userController");
const identifyTenant = require("../middleware/IdentificationMiddleware");
const { protect } = require("../middleware/authMiddleware");

//login user
router.post("/login", identifyTenant, authUser);
router.post("/", identifyTenant, registerUser);

//get user
router.get("/users", identifyTenant, protect, getAllUsers);
router.get("/users/:id", identifyTenant, protect, getById);
router.delete("/users/:id", identifyTenant, protect, deleteById);
router.delete("/users", identifyTenant, protect, deleteAllId);
router.put("/users/:id", identifyTenant, protect, updateById);
router.post("/assigne", identifyTenant, protect, assigneRoleToUser);

module.exports = router;
