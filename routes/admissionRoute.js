const express = require("express");
const router = express.Router();
const identifyTenant = require("../middleware/IdentificationMiddleware");
const { protect } = require("../middleware/authMiddleware");
const {
  createAdmission,
  listAdmissions,
  getAdmissionById,
  updateAdmission,
  updateAdmissionStage,
  deleteAdmission,
} = require("../controllers/admissionController");

router.post("/", identifyTenant, protect, createAdmission);
router.get("/", identifyTenant, protect, listAdmissions);
router.get("/:id", identifyTenant, protect, getAdmissionById);
router.put("/:id", identifyTenant, protect, updateAdmission);
router.patch("/:id/stage", identifyTenant, protect, updateAdmissionStage);
router.delete("/:id", identifyTenant, protect, deleteAdmission);

module.exports = router;
