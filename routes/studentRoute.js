const express = require("express");
const router = express.Router();
const identifyTenant = require("../middleware/IdentificationMiddleware");
const { protect } = require("../middleware/authMiddleware");
const {
  createStudent,
  getAllStudent,
  updateStudent,
  deleteAllStudent,
  deleteByStudentId,
  getStudentById,
  createStudentWithUser,
  linkSibling,
  createParentAccount,
  getTimeTableByStudentId,
  getStudentGuardianInfo,
  addOrUpdateGuardianInfo,
  getMyChildren,
} = require("../controllers/studentController");


// Base routes
router.post("/", identifyTenant, protect, createStudent);
router.get("/", identifyTenant, protect, getAllStudent);
router.delete("/", identifyTenant, protect, deleteAllStudent);

// Specific named routes MUST come before /:id routes
router.get("/my-time-table", identifyTenant, protect, getTimeTableByStudentId);
router.get("/my-children", identifyTenant, protect, getMyChildren);
router.post("/createStudentWithUser", identifyTenant, protect, createStudentWithUser);
router.post("/link-sibling", identifyTenant, protect, linkSibling);
router.post("/create-parent-account", identifyTenant, protect, createParentAccount);
router.post("/add-guardian-info", identifyTenant, protect, addOrUpdateGuardianInfo);

// Parameterized routes (/:id) MUST come after specific routes
router.get("/:id/guardian-info", identifyTenant, protect, getStudentGuardianInfo);
router.get("/:id", identifyTenant, protect, getStudentById);
router.put("/:id", identifyTenant, protect, updateStudent);
router.delete("/:id", identifyTenant, protect, deleteByStudentId);

module.exports = router;

