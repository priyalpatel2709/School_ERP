const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const {
    getExaminationModel,
    getExamResultModel,
    getClassModel,
    getSubjectModel,
    getGradingSystemModel,
    getStudentModel,
    getUserModel,
} = require("../models");
const crudOperations = require("../utils/crudOperations");
const { generateAndSaveReportCardPdf } = require("../helper/pdfDocuments");

// --- Examination Operations ---

const createExamination = asyncHandler(async (req, res, next) => {
    const Examination = getExaminationModel(req.schoolDb);
    const Class = getClassModel(req.schoolDb);
    const Subject = getSubjectModel(req.schoolDb);
    const GradingSystem = getGradingSystemModel(req.schoolDb);

    const examinationOperations = crudOperations({
        mainModel: Examination,
        populateModels: [
            { field: "classes", model: Class, select: "classNumber division" },
            { field: "subjects.subject", model: Subject, select: "name code" },
            { field: "gradingSystem", model: GradingSystem, select: "systemName" }
        ],
    });
    examinationOperations.create(req, res, next);
});

const getAllExaminations = asyncHandler(async (req, res, next) => {
    const Examination = getExaminationModel(req.schoolDb);
    const Class = getClassModel(req.schoolDb);
    const Subject = getSubjectModel(req.schoolDb);
    const GradingSystem = getGradingSystemModel(req.schoolDb);

    const examinationOperations = crudOperations({
        mainModel: Examination,
        populateModels: [
            { field: "classes", model: Class, select: "classNumber division" },
            { field: "subjects.subject", model: Subject, select: "name code" },
            { field: "gradingSystem", model: GradingSystem, select: "systemName" }
        ],
    });
    examinationOperations.getAll(req, res, next);
});

const getExaminationById = asyncHandler(async (req, res, next) => {
    const Examination = getExaminationModel(req.schoolDb);
    const Class = getClassModel(req.schoolDb);
    const Subject = getSubjectModel(req.schoolDb);
    const GradingSystem = getGradingSystemModel(req.schoolDb);

    const examinationOperations = crudOperations({
        mainModel: Examination,
        populateModels: [
            { field: "classes", model: Class, select: "classNumber division" },
            { field: "subjects.subject", model: Subject, select: "name code" },
            { field: "gradingSystem", model: GradingSystem, select: "systemName" }
        ],
    });
    examinationOperations.getById(req, res, next);
});

const updateExamination = asyncHandler(async (req, res, next) => {
    const Examination = getExaminationModel(req.schoolDb);
    const examinationOperations = crudOperations({
        mainModel: Examination,
    });
    examinationOperations.updateById(req, res, next);
});

const deleteExamination = asyncHandler(async (req, res, next) => {
    const Examination = getExaminationModel(req.schoolDb);
    const examinationOperations = crudOperations({
        mainModel: Examination,
    });
    examinationOperations.deleteById(req, res, next);
});

// --- Exam Result Operations ---

const createExamResult = asyncHandler(async (req, res, next) => {
    const ExamResult = getExamResultModel(req.schoolDb);
    const Examination = getExaminationModel(req.schoolDb);
    const Student = getStudentModel(req.schoolDb);
    const Class = getClassModel(req.schoolDb);
    const Subject = getSubjectModel(req.schoolDb);
    const User = getUserModel(req.usersDb);

    const examResultOperations = crudOperations({
        mainModel: ExamResult,
        populateModels: [
            { field: "examination", model: Examination, select: "examName examType" },
            {
                field: "student",
                model: Student,
                select: "user rollNumber admissionNumber",
                populateModels: [{ field: "user", model: User, select: "name" }]
            },
            { field: "class", model: Class, select: "classNumber division" },
            { field: "subjectMarks.subject", model: Subject, select: "name code" },
            { field: "subjectMarks.enteredBy", model: User, select: "name" },
        ],
    });
    examResultOperations.create(req, res, next);
});

const getAllExamResults = asyncHandler(async (req, res, next) => {
    const ExamResult = getExamResultModel(req.schoolDb);
    const Examination = getExaminationModel(req.schoolDb);
    const Student = getStudentModel(req.schoolDb);
    const Class = getClassModel(req.schoolDb);
    const User = getUserModel(req.usersDb);

    const examResultOperations = crudOperations({
        mainModel: ExamResult,
        populateModels: [
            { field: "examination", model: Examination, select: "examName examType" },
            {
                field: "student",
                model: Student,
                select: "user rollNumber admissionNumber",
                populateModels: [{ field: "user", model: User, select: "name" }]
            },
            { field: "class", model: Class, select: "classNumber division" },
        ],
    });
    examResultOperations.getAll(req, res, next);
});

const getExamResultById = asyncHandler(async (req, res, next) => {
    const ExamResult = getExamResultModel(req.schoolDb);
    const Examination = getExaminationModel(req.schoolDb);
    const Student = getStudentModel(req.schoolDb);
    const Class = getClassModel(req.schoolDb);
    const Subject = getSubjectModel(req.schoolDb);
    const User = getUserModel(req.usersDb);

    const examResultOperations = crudOperations({
        mainModel: ExamResult,
        populateModels: [
            { field: "examination", model: Examination, select: "examName examType" },
            {
                field: "student",
                model: Student,
                select: "user rollNumber admissionNumber",
                populateModels: [{ field: "user", model: User, select: "name" }]
            },
            { field: "class", model: Class, select: "classNumber division" },
            { field: "subjectMarks.subject", model: Subject, select: "name code" },
            { field: "subjectMarks.enteredBy", model: User, select: "name" },
        ],
    });
    examResultOperations.getById(req, res, next);
});

const updateExamResult = asyncHandler(async (req, res, next) => {
    const ExamResult = getExamResultModel(req.schoolDb);
    const examResultOperations = crudOperations({
        mainModel: ExamResult,
    });
    examResultOperations.updateById(req, res, next);
});

const deleteExamResult = asyncHandler(async (req, res, next) => {
    const ExamResult = getExamResultModel(req.schoolDb);
    const examResultOperations = crudOperations({
        mainModel: ExamResult,
    });
    examResultOperations.deleteById(req, res, next);
});

// --- Additional Use Cases ---

// Publish examination results
const publishExamResults = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const Examination = getExaminationModel(req.schoolDb);

    const examination = await Examination.findById(id);

    if (!examination) {
        return next(createError(404, 'Examination not found'));
    }

    if (examination.markEntryStatus !== 'Completed') {
        return next(createError(400, 'Mark entry must be completed before publishing results'));
    }

    examination.resultPublished = true;
    examination.resultPublishedDate = new Date();

    await examination.save();

    res.status(200).json({
        success: true,
        message: 'Results published successfully',
        data: examination
    });
});

// Calculate and assign ranks for an examination
const calculateExamRanks = asyncHandler(async (req, res, next) => {
    const { examinationId, classId } = req.params;

    const ExamResult = getExamResultModel(req.schoolDb);

    // Get all results for the class, sorted by percentage
    const results = await ExamResult.find({
        examination: examinationId,
        class: classId,
        isPassed: true // Only rank students who passed
    }).sort({ overallPercentage: -1 });

    // Assign ranks (handle ties)
    let currentRank = 1;
    let previousPercentage = null;
    let studentsWithSamePercentage = 0;

    for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (previousPercentage === result.overallPercentage) {
            // Same percentage, same rank
            studentsWithSamePercentage++;
        } else {
            // Different percentage, new rank
            currentRank += studentsWithSamePercentage;
            studentsWithSamePercentage = 1;
        }

        result.classRank = currentRank;
        await result.save();

        previousPercentage = result.overallPercentage;
    }

    res.status(200).json({
        success: true,
        message: 'Ranks calculated successfully',
        data: results
    });
});

// Bulk mark entry for multiple students
const bulkMarkEntry = asyncHandler(async (req, res, next) => {
    const { examinationId, classId, subjectId, marks } = req.body;

    const ExamResult = getExamResultModel(req.schoolDb);
    const Examination = getExaminationModel(req.schoolDb);

    const examination = await Examination.findById(examinationId);

    if (!examination) {
        return next(createError(404, 'Examination not found'));
    }

    const results = [];

    for (const markEntry of marks) {
        let result = await ExamResult.findOne({
            examination: examinationId,
            student: markEntry.studentId,
            class: classId
        });

        if (!result) {
            result = new ExamResult({
                examination: examinationId,
                student: markEntry.studentId,
                class: classId,
                academicYear: examination.academicYear,
                subjectMarks: [],
                createdBy: req.user._id
            });
        }

        // Find subject in subjectMarks or add new
        const subjectIndex = result.subjectMarks.findIndex(
            sm => sm.subject.toString() === subjectId
        );

        const subjectConfig = examination.subjects.find(
            s => s.subject.toString() === subjectId
        );

        const marksObtained = markEntry.marks;
        const maxMarks = subjectConfig.maxMarks;
        const passingMarks = subjectConfig.passingMarks;
        const percentage = (marksObtained / maxMarks) * 100;

        const subjectMark = {
            subject: subjectId,
            marksObtained,
            maxMarks,
            passingMarks,
            isPassed: marksObtained >= passingMarks,
            percentage: percentage.toFixed(2),
            enteredBy: req.user._id,
            enteredAt: new Date()
        };

        if (subjectIndex >= 0) {
            result.subjectMarks[subjectIndex] = subjectMark;
        } else {
            result.subjectMarks.push(subjectMark);
        }

        await result.save();
        results.push(result);
    }

    res.status(200).json({
        success: true,
        message: `Marks entered for ${results.length} students`,
        data: results
    });
});

// Get exam results for a specific class
const getExamResultsByClass = asyncHandler(async (req, res, next) => {
    const { examinationId, classId } = req.params;

    const ExamResult = getExamResultModel(req.schoolDb);
    const Student = getStudentModel(req.schoolDb);
    const User = getUserModel(req.usersDb);

    const results = await ExamResult.find({
        examination: examinationId,
        class: classId
    })
        .populate({
            path: 'student',
            model: Student,
            select: 'user rollNumber admissionNumber',
            populate: { path: 'user', model: User, select: 'name' }
        })
        .sort({ classRank: 1 });

    res.status(200).json({
        success: true,
        count: results.length,
        data: results
    });
});

// Get all exam results for a student
const getStudentExamResults = asyncHandler(async (req, res, next) => {
    const { studentId } = req.params;

    const ExamResult = getExamResultModel(req.schoolDb);
    const Examination = getExaminationModel(req.schoolDb);

    const results = await ExamResult.find({ student: studentId })
        .populate('examination', 'examName examType')
        .populate('class', 'classNumber division')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: results.length,
        data: results
    });
});

// Verify exam result
const verifyExamResult = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const ExamResult = getExamResultModel(req.schoolDb);

    const result = await ExamResult.findById(id);

    if (!result) {
        return next(createError(404, 'Exam result not found'));
    }

    result.status = 'Verified';
    result.subjectMarks.forEach(sm => {
        sm.verifiedBy = req.user._id;
        sm.verifiedAt = new Date();
    });

    await result.save();

    res.status(200).json({
        success: true,
        message: 'Result verified successfully',
        data: result
    });
});

// Get examinations by class
const getExaminationsByClass = asyncHandler(async (req, res, next) => {
    const { classId } = req.params;

    const Examination = getExaminationModel(req.schoolDb);

    const examinations = await Examination.find({ classes: classId })
        .populate('classes', 'classNumber division')
        .populate('gradingSystem', 'systemName')
        .sort({ startDate: -1 });

    res.status(200).json({
        success: true,
        count: examinations.length,
        data: examinations
    });
});

// Get class performance analysis
const getClassPerformanceAnalysis = asyncHandler(async (req, res, next) => {
    const { examinationId, classId } = req.params;

    const ExamResult = getExamResultModel(req.schoolDb);

    const results = await ExamResult.find({
        examination: examinationId,
        class: classId
    });

    const totalStudents = results.length;
    const passedStudents = results.filter(r => r.isPassed).length;
    const failedStudents = totalStudents - passedStudents;
    const passPercentage = totalStudents > 0 ? ((passedStudents / totalStudents) * 100).toFixed(2) : 0;

    const avgPercentage = totalStudents > 0
        ? (results.reduce((sum, r) => sum + r.overallPercentage, 0) / totalStudents).toFixed(2)
        : 0;

    const highestPercentage = results.length > 0
        ? Math.max(...results.map(r => r.overallPercentage))
        : 0;

    const lowestPercentage = results.length > 0
        ? Math.min(...results.map(r => r.overallPercentage))
        : 0;

    res.status(200).json({
        success: true,
        analysis: {
            totalStudents,
            passedStudents,
            failedStudents,
            passPercentage,
            avgPercentage,
            highestPercentage,
            lowestPercentage
        },
        data: results
    });
});

const generateReportCardPdf = asyncHandler(async (req, res, next) => {
    const ExamResult = getExamResultModel(req.schoolDb);
    const Examination = getExaminationModel(req.schoolDb);
    const Student = getStudentModel(req.schoolDb);
    const Subject = getSubjectModel(req.schoolDb);
    const User = getUserModel(req.usersDb);

    const result = await ExamResult.findById(req.params.id)
        .populate({ path: "examination", model: Examination, select: "examName" })
        .populate({
            path: "student",
            model: Student,
            populate: { path: "user", model: User, select: "name" },
        })
        .populate("class", "classNumber division academicYear")
        .populate("subjectMarks.subject", "name code");

    if (!result) {
        return next(createError(404, "Exam result not found"));
    }
    if (!["Verified", "Published"].includes(result.status)) {
        return next(createError(400, "Result must be verified or published"));
    }

    let studentName = "";
    if (result.student && result.student.user) {
        const u = result.student.user;
        if (typeof u.name === "string") studentName = u.name;
        else if (u.name && (u.name.firstName || u.name.lastName)) {
            studentName = [u.name.firstName, u.name.lastName].filter(Boolean).join(" ");
        }
    }
    const classLabel = result.class
        ? `${result.class.classNumber}-${result.class.division}`
        : "";
    const subjectRows = (result.subjectMarks || []).map((sm) => ({
        name: sm.subject && sm.subject.name ? sm.subject.name : "Subject",
        obtained: sm.marksObtained,
        max: sm.maxMarks,
        percentage: sm.percentage,
        grade: sm.grade,
    }));
    const remarks = [result.classTeacherRemarks, result.principalRemarks]
        .filter(Boolean)
        .join(" ");

    const url = await generateAndSaveReportCardPdf({
        studentName,
        classLabel,
        examName: result.examination ? result.examination.examName : "",
        academicYear: result.academicYear,
        overallPercentage: result.overallPercentage,
        overallGrade: result.overallGrade,
        classRank: result.classRank,
        subjectRows,
        remarks,
    });

    result.reportCardGenerated = true;
    result.reportCardUrl = url;
    result.reportCardGeneratedAt = new Date();
    await result.save();

    res.status(200).json({ success: true, data: result });
});

module.exports = {
    // Examination
    createExamination,
    getAllExaminations,
    getExaminationById,
    updateExamination,
    deleteExamination,
    publishExamResults,
    getExaminationsByClass,
    // Exam Result
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
    generateReportCardPdf,
};
