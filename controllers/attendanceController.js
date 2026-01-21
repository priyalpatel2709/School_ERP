const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const {
    getStudentAttendanceModel,
    getStaffAttendanceModel,
    getStudentModel,
    getClassModel,
    getUserModel,
    getSubjectModel,
    getLeaveApplicationModel
} = require("../models");
const crudOperations = require("../utils/crudOperations");

// --- Student Attendance Operations ---

const createStudentAttendance = asyncHandler(async (req, res, next) => {
    const StudentAttendance = getStudentAttendanceModel(req.schoolDb);
    const Student = getStudentModel(req.schoolDb);
    const Class = getClassModel(req.schoolDb);

    const studentAttendanceOperations = crudOperations({
        mainModel: StudentAttendance,
        populateModels: [
            { field: "student", model: Student, select: "user roleNumber admissionNumber" },
            { field: "class", model: Class, select: "classNumber division" }
        ],
    });
    studentAttendanceOperations.create(req, res, next);
});

const getAllStudentAttendance = asyncHandler(async (req, res, next) => {
    const StudentAttendance = getStudentAttendanceModel(req.schoolDb);
    const Student = getStudentModel(req.schoolDb);
    const Class = getClassModel(req.schoolDb);
    const User = getUserModel(req.usersDb);

    const studentAttendanceOperations = crudOperations({
        mainModel: StudentAttendance,
        populateModels: [
            {
                field: "student",
                model: Student,
                select: "user roleNumber admissionNumber",
                populateModels: [{ field: "user", model: User, select: "name" }]
            },
            { field: "class", model: Class, select: "classNumber division" }
        ],
    });
    studentAttendanceOperations.getAll(req, res, next);
});

const getStudentAttendanceById = asyncHandler(async (req, res, next) => {
    const StudentAttendance = getStudentAttendanceModel(req.schoolDb);
    const Student = getStudentModel(req.schoolDb);
    const Class = getClassModel(req.schoolDb);
    const User = getUserModel(req.usersDb);
    const Subject = getSubjectModel(req.schoolDb);
    const LeaveApplication = getLeaveApplicationModel(req.schoolDb);

    const studentAttendanceOperations = crudOperations({
        mainModel: StudentAttendance,
        populateModels: [
            {
                field: "student",
                model: Student,
                select: "user roleNumber admissionNumber",
                populateModels: [{ field: "user", model: User, select: "name" }]
            },
            { field: "class", model: Class, select: "classNumber division" },
            { field: "subjectAttendance.subject", model: Subject, select: "name code" },
            { field: "leaveInfo.leaveApplication", model: LeaveApplication }
        ],
    });
    studentAttendanceOperations.getById(req, res, next);
});

const updateStudentAttendance = asyncHandler(async (req, res, next) => {
    const StudentAttendance = getStudentAttendanceModel(req.schoolDb);
    const studentAttendanceOperations = crudOperations({
        mainModel: StudentAttendance,
    });
    studentAttendanceOperations.updateById(req, res, next);
});

const deleteStudentAttendance = asyncHandler(async (req, res, next) => {
    const StudentAttendance = getStudentAttendanceModel(req.schoolDb);
    const studentAttendanceOperations = crudOperations({
        mainModel: StudentAttendance,
    });
    studentAttendanceOperations.deleteById(req, res, next);
});

// --- Staff Attendance Operations ---

const createStaffAttendance = asyncHandler(async (req, res, next) => {
    const StaffAttendance = getStaffAttendanceModel(req.schoolDb);
    const User = getUserModel(req.usersDb);

    const staffAttendanceOperations = crudOperations({
        mainModel: StaffAttendance,
        populateModels: [
            { field: "staff", model: User, select: "name email" }
        ],
    });
    staffAttendanceOperations.create(req, res, next);
});

const getAllStaffAttendance = asyncHandler(async (req, res, next) => {
    const StaffAttendance = getStaffAttendanceModel(req.schoolDb);
    const User = getUserModel(req.usersDb);

    const staffAttendanceOperations = crudOperations({
        mainModel: StaffAttendance,
        populateModels: [
            { field: "staff", model: User, select: "name email roleName" }
        ],
    });
    staffAttendanceOperations.getAll(req, res, next);
});

const getStaffAttendanceById = asyncHandler(async (req, res, next) => {
    const StaffAttendance = getStaffAttendanceModel(req.schoolDb);
    const User = getUserModel(req.usersDb);
    const LeaveApplication = getLeaveApplicationModel(req.schoolDb);

    const staffAttendanceOperations = crudOperations({
        mainModel: StaffAttendance,
        populateModels: [
            { field: "staff", model: User, select: "name email roleName" },
            { field: "leaveInfo.leaveApplication", model: LeaveApplication }
        ],
    });
    staffAttendanceOperations.getById(req, res, next);
});

const updateStaffAttendance = asyncHandler(async (req, res, next) => {
    const StaffAttendance = getStaffAttendanceModel(req.schoolDb);
    const staffAttendanceOperations = crudOperations({
        mainModel: StaffAttendance,
    });
    staffAttendanceOperations.updateById(req, res, next);
});

const deleteStaffAttendance = asyncHandler(async (req, res, next) => {
    const StaffAttendance = getStaffAttendanceModel(req.schoolDb);
    const staffAttendanceOperations = crudOperations({
        mainModel: StaffAttendance,
    });
    staffAttendanceOperations.deleteById(req, res, next);
});

module.exports = {
    // Student Attendance
    createStudentAttendance,
    getAllStudentAttendance,
    getStudentAttendanceById,
    updateStudentAttendance,
    deleteStudentAttendance,
    // Staff Attendance
    createStaffAttendance,
    getAllStaffAttendance,
    getStaffAttendanceById,
    updateStaffAttendance,
    deleteStaffAttendance,
};
