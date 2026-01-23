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
    bulkMarkStudentAttendance,
    getMonthlyAttendanceReport,
    getClassAttendanceByDate,
    createStaffAttendance,
    getAllStaffAttendance,
    getStaffAttendanceById,
    updateStaffAttendance,
    deleteStaffAttendance,
    staffCheckIn,
    staffCheckOut,
    getStaffMonthlyReport,
    getAllStaffMonthlyReport,
} = require("../controllers/attendanceController");

// --- Student Attendance Routes ---
router.post("/student", identifyTenant, protect, authorize(permissions.ATTENDANCE_STUDENT_MARK), createStudentAttendance);
router.post("/student/bulk", identifyTenant, protect, authorize(permissions.ATTENDANCE_STUDENT_MARK), bulkMarkStudentAttendance);
router.get("/student", identifyTenant, protect, authorize(permissions.ATTENDANCE_STUDENT_VIEW), getAllStudentAttendance);
router.get("/student/:id", identifyTenant, protect, authorize(permissions.ATTENDANCE_STUDENT_VIEW), getStudentAttendanceById);
router.get("/student/:studentId/monthly", identifyTenant, protect, authorize(permissions.ATTENDANCE_STUDENT_VIEW), getMonthlyAttendanceReport);
router.get("/student/class/:classId/date/:date", identifyTenant, protect, authorize(permissions.ATTENDANCE_STUDENT_VIEW), getClassAttendanceByDate);
router.put("/student/:id", identifyTenant, protect, authorize(permissions.ATTENDANCE_STUDENT_MARK), updateStudentAttendance);
router.delete("/student/:id", identifyTenant, protect, authorize(permissions.ATTENDANCE_STUDENT_MARK), deleteStudentAttendance);

// --- Staff Attendance Routes ---
router.post("/staff", identifyTenant, protect, authorize(permissions.ATTENDANCE_STAFF_MARK), createStaffAttendance);
router.post("/staff/check-in", identifyTenant, protect, authorize(permissions.ATTENDANCE_STAFF_MARK), staffCheckIn);
router.post("/staff/check-out", identifyTenant, protect, authorize(permissions.ATTENDANCE_STAFF_MARK), staffCheckOut);
router.get("/staff", identifyTenant, protect, authorize(permissions.ATTENDANCE_STAFF_MARK), getAllStaffAttendance);
router.get("/staff/monthly-report", identifyTenant, protect, authorize(permissions.ATTENDANCE_STAFF_MARK), getAllStaffMonthlyReport);
router.get("/staff/:id", identifyTenant, protect, authorize(permissions.ATTENDANCE_STAFF_MARK), getStaffAttendanceById);
router.get("/staff/:staffId/monthly", identifyTenant, protect, authorize(permissions.ATTENDANCE_STAFF_MARK), getStaffMonthlyReport);
router.put("/staff/:id", identifyTenant, protect, authorize(permissions.ATTENDANCE_STAFF_MARK), updateStaffAttendance);
router.delete("/staff/:id", identifyTenant, protect, authorize(permissions.ATTENDANCE_STAFF_MARK), deleteStaffAttendance);

module.exports = router;
