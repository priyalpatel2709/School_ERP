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

router.use(protect);

router.post("/", identifyTenant, createRole);
router.get("/roles", identifyTenant, getAllRoles);
router.get("/roles/:id", identifyTenant, getById);
router.delete("/roles/:id", identifyTenant, deleteById);
router.delete("/roles", identifyTenant, deleteAllId);
router.put("/roles/:id", identifyTenant, updateById);
module.exports = router;
