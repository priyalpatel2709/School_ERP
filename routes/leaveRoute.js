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
    approveLeaveApplication,
    rejectLeaveApplication,
    getPendingLeaveApplications,
    getStudentLeaveApplications,
    getStaffLeaveApplications,
} = require("../controllers/leaveController");

// Base routes
router.post("/", identifyTenant, protect, authorize(permissions.LEAVE_APPLICATION_APPLY), createLeaveApplication);
router.get("/", identifyTenant, protect, authorize(permissions.LEAVE_APPLICATION_APPLY, permissions.LEAVE_APPLICATION_APPROVE), getAllLeaveApplications);
router.get("/pending", identifyTenant, protect, authorize(permissions.LEAVE_APPLICATION_APPROVE), getPendingLeaveApplications);
router.get("/student/:studentId", identifyTenant, protect, authorize(permissions.LEAVE_APPLICATION_APPLY, permissions.LEAVE_APPLICATION_APPROVE), getStudentLeaveApplications);
router.get("/staff/:staffId", identifyTenant, protect, authorize(permissions.LEAVE_APPLICATION_APPLY, permissions.LEAVE_APPLICATION_APPROVE), getStaffLeaveApplications);

// Parameterized routes (/:id)
router.get("/:id", identifyTenant, protect, authorize(permissions.LEAVE_APPLICATION_APPLY, permissions.LEAVE_APPLICATION_APPROVE), getLeaveApplicationById);
router.put("/:id", identifyTenant, protect, authorize(permissions.LEAVE_APPLICATION_APPLY, permissions.LEAVE_APPLICATION_APPROVE), updateLeaveApplication);
router.put("/:id/approve", identifyTenant, protect, authorize(permissions.LEAVE_APPLICATION_APPROVE), approveLeaveApplication);
router.put("/:id/reject", identifyTenant, protect, authorize(permissions.LEAVE_APPLICATION_APPROVE), rejectLeaveApplication);
router.delete("/:id", identifyTenant, protect, authorize(permissions.LEAVE_APPLICATION_APPLY), deleteLeaveApplication);

module.exports = router;
