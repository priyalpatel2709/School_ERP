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
    createExamResult,
    getAllExamResults,
    getExamResultById,
    updateExamResult,
    deleteExamResult,
} = require("../controllers/examinationController");

// --- Examination Routes ---
router.post("/exams", identifyTenant, protect, authorize(permissions.EXAM_CREATE), createExamination);
router.get("/exams", identifyTenant, protect, authorize(permissions.EXAM_VIEW), getAllExaminations);
router.get("/exams/:id", identifyTenant, protect, authorize(permissions.EXAM_VIEW), getExaminationById);
router.put("/exams/:id", identifyTenant, protect, authorize(permissions.EXAM_CREATE), updateExamination);
router.delete("/exams/:id", identifyTenant, protect, authorize(permissions.EXAM_CREATE), deleteExamination);

// --- Exam Result Routes ---
router.post("/results", identifyTenant, protect, authorize(permissions.MARKS_ENTER), createExamResult);
router.get("/results", identifyTenant, protect, authorize(permissions.EXAM_VIEW), getAllExamResults); // Viewable by those who can view exams
router.get("/results/:id", identifyTenant, protect, authorize(permissions.EXAM_VIEW), getExamResultById);
router.put("/results/:id", identifyTenant, protect, authorize(permissions.MARKS_ENTER, permissions.MARKS_VERIFY, permissions.RESULT_PUBLISH, permissions.REPORT_CARD_GENERATE), updateExamResult);
router.delete("/results/:id", identifyTenant, protect, authorize(permissions.EXAM_CREATE), deleteExamResult); // Usually Restricted

module.exports = router;
