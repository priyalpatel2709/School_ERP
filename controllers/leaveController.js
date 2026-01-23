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

// --- Additional Use Cases ---

// Approve leave application
const approveLeaveApplication = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { reviewComments } = req.body;

    const LeaveApplication = getLeaveApplicationModel(req.schoolDb);

    const application = await LeaveApplication.findById(id);

    if (!application) {
        return next(createError(404, 'Leave application not found'));
    }

    if (application.status !== 'Pending') {
        return next(createError(400, 'Leave application has already been reviewed'));
    }

    application.status = 'Approved';
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();
    application.reviewComments = reviewComments;
    application.notificationSent = false; // Ready for notification

    await application.save();

    res.status(200).json({
        success: true,
        message: 'Leave application approved successfully',
        data: application
    });
});

// Reject leave application
const rejectLeaveApplication = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { reviewComments } = req.body;

    const LeaveApplication = getLeaveApplicationModel(req.schoolDb);

    const application = await LeaveApplication.findById(id);

    if (!application) {
        return next(createError(404, 'Leave application not found'));
    }

    if (application.status !== 'Pending') {
        return next(createError(400, 'Leave application has already been reviewed'));
    }

    application.status = 'Rejected';
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();
    application.reviewComments = reviewComments || 'No reason provided';
    application.notificationSent = false; // Ready for notification

    await application.save();

    res.status(200).json({
        success: true,
        message: 'Leave application rejected',
        data: application
    });
});

// Get pending leave applications
const getPendingLeaveApplications = asyncHandler(async (req, res, next) => {
    const LeaveApplication = getLeaveApplicationModel(req.schoolDb);
    const Student = getStudentModel(req.schoolDb);
    const User = getUserModel(req.usersDb);

    const applications = await LeaveApplication.find({ status: 'Pending' })
        .populate({
            path: 'student',
            model: Student,
            select: 'user roleNumber admissionNumber',
            populate: { path: 'user', model: User, select: 'name' }
        })
        .populate('staff', 'name email roleName')
        .populate('appliedBy', 'name')
        .sort({ appliedAt: -1 });

    res.status(200).json({
        success: true,
        count: applications.length,
        data: applications
    });
});

// Get leave applications for a specific student
const getStudentLeaveApplications = asyncHandler(async (req, res, next) => {
    const { studentId } = req.params;
    const LeaveApplication = getLeaveApplicationModel(req.schoolDb);

    const applications = await LeaveApplication.find({ student: studentId })
        .populate('appliedBy', 'name')
        .populate('reviewedBy', 'name')
        .sort({ appliedAt: -1 });

    res.status(200).json({
        success: true,
        count: applications.length,
        data: applications
    });
});

// Get leave applications for a specific staff member
const getStaffLeaveApplications = asyncHandler(async (req, res, next) => {
    const { staffId } = req.params;
    const LeaveApplication = getLeaveApplicationModel(req.schoolDb);

    const applications = await LeaveApplication.find({ staff: staffId })
        .populate('appliedBy', 'name')
        .populate('reviewedBy', 'name')
        .sort({ appliedAt: -1 });

    res.status(200).json({
        success: true,
        count: applications.length,
        data: applications
    });
});

module.exports = {
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
};
