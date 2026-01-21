const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const {
    getLeaveApplicationModel,
    getStudentModel,
    getUserModel,
} = require("../models");
const crudOperations = require("../utils/crudOperations");

const createLeaveApplication = asyncHandler(async (req, res, next) => {
    const LeaveApplication = getLeaveApplicationModel(req.schoolDb);
    const leaveApplicationOperations = crudOperations({
        mainModel: LeaveApplication,
    });
    leaveApplicationOperations.create(req, res, next);
});

const getAllLeaveApplications = asyncHandler(async (req, res, next) => {
    const LeaveApplication = getLeaveApplicationModel(req.schoolDb);
    const Student = getStudentModel(req.schoolDb);
    const User = getUserModel(req.usersDb);

    const leaveApplicationOperations = crudOperations({
        mainModel: LeaveApplication,
        populateModels: [
            {
                field: "student",
                model: Student,
                select: "user roleNumber admissionNumber",
                populateModels: [{ field: "user", model: User, select: "name" }]
            },
            { field: "staff", model: User, select: "name roleName email" },
            { field: "appliedBy", model: User, select: "name" },
            { field: "reviewedBy", model: User, select: "name" }
        ],
    });
    leaveApplicationOperations.getAll(req, res, next);
});

const getLeaveApplicationById = asyncHandler(async (req, res, next) => {
    const LeaveApplication = getLeaveApplicationModel(req.schoolDb);
    const Student = getStudentModel(req.schoolDb);
    const User = getUserModel(req.usersDb);

    const leaveApplicationOperations = crudOperations({
        mainModel: LeaveApplication,
        populateModels: [
            {
                field: "student",
                model: Student,
                select: "user roleNumber admissionNumber",
                populateModels: [{ field: "user", model: User, select: "name" }]
            },
            { field: "staff", model: User, select: "name roleName email" },
            { field: "appliedBy", model: User, select: "name" },
            { field: "reviewedBy", model: User, select: "name" }
        ],
    });
    leaveApplicationOperations.getById(req, res, next);
});

const updateLeaveApplication = asyncHandler(async (req, res, next) => {
    const LeaveApplication = getLeaveApplicationModel(req.schoolDb);
    const leaveApplicationOperations = crudOperations({
        mainModel: LeaveApplication,
    });
    leaveApplicationOperations.updateById(req, res, next);
});

const deleteLeaveApplication = asyncHandler(async (req, res, next) => {
    const LeaveApplication = getLeaveApplicationModel(req.schoolDb);
    const leaveApplicationOperations = crudOperations({
        mainModel: LeaveApplication,
    });
    leaveApplicationOperations.deleteById(req, res, next);
});

module.exports = {
    createLeaveApplication,
    getAllLeaveApplications,
    getLeaveApplicationById,
    updateLeaveApplication,
    deleteLeaveApplication,
};
