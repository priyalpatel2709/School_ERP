const express = require("express");
const router = express.Router();
const identifyTenant = require("../middleware/IdentificationMiddleware");
const { protect, authorize } = require("../middleware/authMiddleware");
const permissions = require("../utils/permissions");
const {
    createExamination,
    getAllExaminations,
    getExaminationById,
    updateExamination,
    deleteExamination,
    publishExamResults,
    getExaminationsByClass,
    createExamResult,
    getAllExamResults,
    getExamResultById,
    updateExamResult,
    deleteExamResult,
    calculateExamRanks,
    bulkMarkEntry,
    getExamResultsByClass,
    getStudentExamResults,
    verifyExamResult,
    getClassPerformanceAnalysis,
} = require("../controllers/examinationController");

// --- Examination Routes ---
router.post("/exams", identifyTenant, protect, authorize(permissions.EXAM_CREATE), createExamination);
router.get("/exams", identifyTenant, protect, authorize(permissions.EXAM_VIEW), getAllExaminations);
router.get("/exams/class/:classId", identifyTenant, protect, authorize(permissions.EXAM_VIEW), getExaminationsByClass);
router.get("/exams/:id", identifyTenant, protect, authorize(permissions.EXAM_VIEW), getExaminationById);
router.put("/exams/:id", identifyTenant, protect, authorize(permissions.EXAM_CREATE), updateExamination);
router.put("/exams/:id/publish", identifyTenant, protect, authorize(permissions.RESULT_PUBLISH), publishExamResults);
router.delete("/exams/:id", identifyTenant, protect, authorize(permissions.EXAM_CREATE), deleteExamination);

// --- Exam Result Routes ---
router.post("/results", identifyTenant, protect, authorize(permissions.MARKS_ENTER), createExamResult);
router.post("/results/bulk", identifyTenant, protect, authorize(permissions.MARKS_ENTER), bulkMarkEntry);
router.get("/results", identifyTenant, protect, authorize(permissions.EXAM_VIEW), getAllExamResults);
router.get("/results/exam/:examinationId/class/:classId", identifyTenant, protect, authorize(permissions.EXAM_VIEW), getExamResultsByClass);
router.get("/results/student/:studentId", identifyTenant, protect, authorize(permissions.EXAM_VIEW), getStudentExamResults);
router.get("/results/:id", identifyTenant, protect, authorize(permissions.EXAM_VIEW), getExamResultById);
router.put("/results/:id", identifyTenant, protect, authorize(permissions.MARKS_ENTER, permissions.MARKS_VERIFY, permissions.RESULT_PUBLISH, permissions.REPORT_CARD_GENERATE), updateExamResult);
router.put("/results/:id/verify", identifyTenant, protect, authorize(permissions.MARKS_VERIFY), verifyExamResult);
router.delete("/results/:id", identifyTenant, protect, authorize(permissions.EXAM_CREATE), deleteExamResult);

// --- Analysis & Rankings ---
router.post("/results/exam/:examinationId/class/:classId/calculate-ranks", identifyTenant, protect, authorize(permissions.RESULT_PUBLISH), calculateExamRanks);
router.get("/results/exam/:examinationId/class/:classId/performance", identifyTenant, protect, authorize(permissions.EXAM_VIEW), getClassPerformanceAnalysis);

module.exports = router;
