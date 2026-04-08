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
  assignSubjects,
  setQualifiedSubjects,
  getTeacherByUserId,
} = require("../controllers/teacherController");

router.post("/", identifyTenant, protect, createTeacher);
router.get("/", identifyTenant, protect, getAllTeacher);
router.get("/search", identifyTenant, protect, searchTeacher);
router.post("/assign-subjects", identifyTenant, protect, assignSubjects);
router.post("/qualified-subjects", identifyTenant, protect, setQualifiedSubjects);
router.get(
  "/getTimeTableByTeacherId/:teacherId",
  identifyTenant,
  protect,
  getTimeTableByTeacherId,
);
router.post(
  "/createTeacherWithUser",
  identifyTenant,
  protect,
  createTeacherWithUser,
);
router.get("/byUser/:id", identifyTenant, protect, getTeacherByUserId);
router.get("/:id", identifyTenant, protect, getTeacherById);
router.put("/:id", identifyTenant, protect, updateTeacherById);
router.delete("/", identifyTenant, protect, deleteAllTeacher);
router.delete("/:id", identifyTenant, protect, deleteTeacherById);

module.exports = router;
