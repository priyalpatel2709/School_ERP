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
  getTimeTableByStudentId
} = require("../controllers/studentController");

router.post("/", identifyTenant, protect, createStudent);
router.get("/", identifyTenant, protect, getAllStudent);
router.get("/my-time-table", identifyTenant, protect, getTimeTableByStudentId);
router.get("/:id", identifyTenant, protect, getStudentById);
router.put("/:id", identifyTenant, protect, updateStudent);
router.delete("/", identifyTenant, protect, deleteAllStudent);
router.delete("/:id", identifyTenant, protect, deleteByStudentId);
router.post(
  "/createStudentWithUser",
  identifyTenant,
  protect,
  createStudentWithUser
);
// Phase 1: New Routes
router.post("/link-sibling", identifyTenant, protect, linkSibling);
router.post("/create-parent-account", identifyTenant, protect, createParentAccount);

module.exports = router;
