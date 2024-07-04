const express = require("express");
const router = express.Router();
const identifyTenant = require("../middleware/IdentificationMiddleware");
const { protect } = require("../middleware/authMiddleware");
const {
  createTeacher,
  getAllTeacher,
  getTeacherById,
  updateTeacherById,
  deleteAllTeacher,
  deleteTeacherById,
  createTeacherWithUser,
} = require("../controllers/teacherController");

router.post("/", identifyTenant, protect, createTeacher);
router.get("/", identifyTenant, protect, getAllTeacher);
router.get("/:id", identifyTenant, protect, getTeacherById);
router.put("/:id", identifyTenant, protect, updateTeacherById);
router.delete("/", identifyTenant, protect, deleteAllTeacher);
router.delete("/:id", identifyTenant, protect, deleteTeacherById);
router.post(
  "/createTeacherWithUser",
  identifyTenant,
  protect,
  createTeacherWithUser
);
module.exports = router;
