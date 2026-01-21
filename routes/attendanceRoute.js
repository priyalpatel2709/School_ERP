const express = require("express");
const router = express.Router();
const identifyTenant = require("../middleware/IdentificationMiddleware");
const { protect, authorize } = require("../middleware/authMiddleware");
const permissions = require("../utils/permissions");
const {
    createStudentAttendance,
    getAllStudentAttendance,
    getStudentAttendanceById,
    updateStudentAttendance,
    deleteStudentAttendance,
    createStaffAttendance,
    getAllStaffAttendance,
    getStaffAttendanceById,
    updateStaffAttendance,
    deleteStaffAttendance,
} = require("../controllers/attendanceController");

// --- Student Attendance Routes ---
router.post("/student", identifyTenant, protect, authorize(permissions.ATTENDANCE_STUDENT_MARK), createStudentAttendance);
router.get("/student", identifyTenant, protect, authorize(permissions.ATTENDANCE_STUDENT_VIEW), getAllStudentAttendance);
router.get("/student/:id", identifyTenant, protect, authorize(permissions.ATTENDANCE_STUDENT_VIEW), getStudentAttendanceById);
router.put("/student/:id", identifyTenant, protect, authorize(permissions.ATTENDANCE_STUDENT_MARK), updateStudentAttendance);
router.delete("/student/:id", identifyTenant, protect, authorize(permissions.ATTENDANCE_STUDENT_MARK), deleteStudentAttendance);

// --- Staff Attendance Routes ---
router.post("/staff", identifyTenant, protect, authorize(permissions.ATTENDANCE_STAFF_MARK), createStaffAttendance); // HR/Admin marks or modifies? Or use self-checkin which might differ. Controller logic probably handles self vs admin.
router.get("/staff", identifyTenant, protect, authorize(permissions.ATTENDANCE_STAFF_MARK), getAllStaffAttendance);
router.get("/staff/:id", identifyTenant, protect, authorize(permissions.ATTENDANCE_STAFF_MARK), getStaffAttendanceById);
router.put("/staff/:id", identifyTenant, protect, authorize(permissions.ATTENDANCE_STAFF_MARK), updateStaffAttendance);
router.delete("/staff/:id", identifyTenant, protect, authorize(permissions.ATTENDANCE_STAFF_MARK), deleteStaffAttendance);

module.exports = router;
