const express = require("express");
const router = express.Router();
const identifyTenant = require("../middleware/IdentificationMiddleware");
const { protect, authorize } = require("../middleware/authMiddleware");
const permissions = require("../utils/permissions");
const {
    createLeaveApplication,
    getAllLeaveApplications,
    getLeaveApplicationById,
    updateLeaveApplication,
    deleteLeaveApplication,
} = require("../controllers/leaveController");

// Base routes
router.post("/", identifyTenant, protect, authorize(permissions.LEAVE_APPLICATION_APPLY), createLeaveApplication);
router.get("/", identifyTenant, protect, authorize(permissions.LEAVE_APPLICATION_APPLY, permissions.LEAVE_APPLICATION_APPROVE), getAllLeaveApplications);

// Parameterized routes (/:id)
router.get("/:id", identifyTenant, protect, authorize(permissions.LEAVE_APPLICATION_APPLY, permissions.LEAVE_APPLICATION_APPROVE), getLeaveApplicationById);
router.put("/:id", identifyTenant, protect, authorize(permissions.LEAVE_APPLICATION_APPLY, permissions.LEAVE_APPLICATION_APPROVE), updateLeaveApplication);
router.delete("/:id", identifyTenant, protect, authorize(permissions.LEAVE_APPLICATION_APPLY), deleteLeaveApplication); // Usually approval can't delete? Maybe cancel.

module.exports = router;
