const express = require("express");
const router = express.Router();
const {
  createSubject,
  getAllSubject,
  getSubjectById,
  updateSubject,
  deleteAllSubject,
  deleteSubjectById,
} = require("../controllers/subjectController");
const identifyTenant = require("../middleware/IdentificationMiddleware");
const { protect } = require("../middleware/authMiddleware");

router.post("/", identifyTenant, protect, createSubject);
router.get("/", identifyTenant, protect, getAllSubject);
router.get("/:id", identifyTenant, protect, getSubjectById);
router.put("/:id", identifyTenant, protect, updateSubject);
router.delete("/:id", identifyTenant, protect, deleteSubjectById);
router.delete("/", identifyTenant, protect, deleteAllSubject);

module.exports = router;
