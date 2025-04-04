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
  searchTeacher,
  getTimeTableByTeacherId,
  getTeacherByUserId,
} = require("../controllers/teacherController");

router.post("/", identifyTenant, protect, createTeacher);
router.get("/", identifyTenant, protect, getAllTeacher);
router.get("/search", identifyTenant, protect, searchTeacher);
router.get("/:id", identifyTenant, protect, getTeacherById);
router.get(
  "/getTimeTableByTeacherId/:teacherId",
  identifyTenant,
  protect,
  getTimeTableByTeacherId
);
router.put("/:id", identifyTenant, protect, updateTeacherById);
router.delete("/", identifyTenant, protect, deleteAllTeacher);
router.delete("/:id", identifyTenant, protect, deleteTeacherById);
router.post(
  "/createTeacherWithUser",
  identifyTenant,
  protect,
  createTeacherWithUser
);

router.get("/byUser/:id", identifyTenant, protect, getTeacherByUserId);
module.exports = router;
