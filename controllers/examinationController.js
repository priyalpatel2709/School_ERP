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
                select: "user roleNumber admissionNumber",
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
                select: "user roleNumber admissionNumber",
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
                select: "user roleNumber admissionNumber",
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

module.exports = {
    // Examination
    createExamination,
    getAllExaminations,
    getExaminationById,
    updateExamination,
    deleteExamination,
    // Exam Result
    createExamResult,
    getAllExamResults,
    getExamResultById,
    updateExamResult,
    deleteExamResult,
};
