const express = require("express");
const router = express.Router();
const {
  createClass,
  getAllClass,
  getById,
  deleteById,
  deleteAllId,
  updateById,
} = require("../controllers/classController");
const identifyTenant = require("../middleware/IdentificationMiddleware");
const { protect } = require("../middleware/authMiddleware");

// router.use(protect);

router.post("/", identifyTenant, protect, createClass);
router.get("/", identifyTenant, protect, getAllClass);
router.get("/:id", identifyTenant, protect, getById);
router.delete("/:id", identifyTenant, protect, deleteById);
router.delete("/", identifyTenant, protect, deleteAllId);
router.put("/:id", identifyTenant, protect, updateById);
module.exports = router;
