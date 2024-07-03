const express = require("express");
const router = express.Router();
const identifyTenant = require("../middleware/IdentificationMiddleware");
const { protect } = require("../middleware/authMiddleware");
const {
  createTeacher,
  getAllTeacher,
} = require("../controllers/teacherController");

router.post("/", identifyTenant, protect, createTeacher);
router.get("/", identifyTenant, protect, getAllTeacher);
// router.get("/:id", identifyTenant, protect, getStudentById);
// router.put("/:id", identifyTenant, protect, updateStudent);
// router.delete("/", identifyTenant, protect, deleteAllStudent);
// router.delete("/:id", identifyTenant, protect, deleteByStudentId);
module.exports = router;
