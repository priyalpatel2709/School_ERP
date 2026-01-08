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
router.get("/", identifyTenant, protect, getAllRoles);
router.get("/:id", identifyTenant, protect, getById);
router.delete("/:id", identifyTenant, protect, deleteById);
router.delete("/", identifyTenant, protect, deleteAllId);
router.put("/:id", identifyTenant, protect, updateById);
module.exports = router;
