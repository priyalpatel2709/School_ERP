const express = require("express");
const router = express.Router();
const identifyTenant = require("../middleware/IdentificationMiddleware");
const { protect } = require("../middleware/authMiddleware");
const {
  createSubstitution,
  listSubstitutions,
  getSubstitutionById,
  updateSubstitution,
  deleteSubstitution,
} = require("../controllers/substitutionController");

router.post("/", identifyTenant, protect, createSubstitution);
router.get("/", identifyTenant, protect, listSubstitutions);
router.get("/:id", identifyTenant, protect, getSubstitutionById);
router.put("/:id", identifyTenant, protect, updateSubstitution);
router.delete("/:id", identifyTenant, protect, deleteSubstitution);

module.exports = router;
