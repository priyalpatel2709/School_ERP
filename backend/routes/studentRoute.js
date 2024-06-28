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
} = require("../controllers/studentController");

router.post("/", identifyTenant, protect, createStudent);
router.get("/", identifyTenant, protect, getAllStudent);
router.get("/:id", identifyTenant, protect, getStudentById);
router.put("/:id", identifyTenant, protect, updateStudent);
router.delete("/", identifyTenant, protect, deleteAllStudent);
router.delete("/:id", identifyTenant, protect, deleteByStudentId);
module.exports = router;
