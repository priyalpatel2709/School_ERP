const express = require("express");
const router = express.Router();
const {
  createRole,
  getAllRoles,
  getById,
  updateById,
  deleteAllId,
  deleteById,
} = require("../controllers/roleController");
const identifyTenant = require("../middleware/IdentificationMiddleware");
const { protect } = require("../middleware/authMiddleware");

// router.use(protect);

router.post("/", identifyTenant, protect, createRole);
router.get("/roles", identifyTenant, protect, getAllRoles);
router.get("/roles/:id", identifyTenant, protect, getById);
router.delete("/roles/:id", identifyTenant, protect, deleteById);
router.delete("/roles", identifyTenant, protect, deleteAllId);
router.put("/roles/:id", identifyTenant, protect, updateById);
module.exports = router;
