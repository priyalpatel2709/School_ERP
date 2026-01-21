const express = require("express");
const router = express.Router();
const identifyTenant = require("../middleware/IdentificationMiddleware");
const { protect, authorize } = require("../middleware/authMiddleware");
const permissions = require("../utils/permissions");
const {
    createGradingSystem,
    getAllGradingSystems,
    getGradingSystemById,
    updateGradingSystem,
    deleteGradingSystem,
} = require("../controllers/gradingController");

router.post("/", identifyTenant, protect, authorize(permissions.EXAM_CREATE), createGradingSystem);
router.get("/", identifyTenant, protect, authorize(permissions.EXAM_VIEW), getAllGradingSystems);
router.get("/:id", identifyTenant, protect, authorize(permissions.EXAM_VIEW), getGradingSystemById);
router.put("/:id", identifyTenant, protect, authorize(permissions.EXAM_CREATE), updateGradingSystem);
router.delete("/:id", identifyTenant, protect, authorize(permissions.EXAM_CREATE), deleteGradingSystem);

module.exports = router;
