const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const {
    getFeeStructureModel,
    getFeeInvoiceModel,
    getFeePaymentModel,
    getClassModel,
    getStudentModel,
    getUserModel,
} = require("../models");
const crudOperations = require("../utils/crudOperations");

// --- Fee Structure Operations ---

const createFeeStructure = asyncHandler(async (req, res, next) => {
    const FeeStructure = getFeeStructureModel(req.schoolDb);
    const Class = getClassModel(req.schoolDb);

    const feeStructureOperations = crudOperations({
        mainModel: FeeStructure,
        populateModels: [{ field: "class", model: Class, select: "classNumber division" }],
    });
    feeStructureOperations.create(req, res, next);
});

const getAllFeeStructures = asyncHandler(async (req, res, next) => {
    const FeeStructure = getFeeStructureModel(req.schoolDb);
    const Class = getClassModel(req.schoolDb);

    const feeStructureOperations = crudOperations({
        mainModel: FeeStructure,
        populateModels: [{ field: "class", model: Class, select: "classNumber division" }],
    });
    feeStructureOperations.getAll(req, res, next);
});

const getFeeStructureById = asyncHandler(async (req, res, next) => {
    const FeeStructure = getFeeStructureModel(req.schoolDb);
    const Class = getClassModel(req.schoolDb);

    const feeStructureOperations = crudOperations({
        mainModel: FeeStructure,
        populateModels: [{ field: "class", model: Class, select: "classNumber division" }],
    });
    feeStructureOperations.getById(req, res, next);
});

const updateFeeStructure = asyncHandler(async (req, res, next) => {
    const FeeStructure = getFeeStructureModel(req.schoolDb);
    const feeStructureOperations = crudOperations({
        mainModel: FeeStructure,
    });
    feeStructureOperations.updateById(req, res, next);
});

const deleteFeeStructure = asyncHandler(async (req, res, next) => {
    const FeeStructure = getFeeStructureModel(req.schoolDb);
    const feeStructureOperations = crudOperations({
        mainModel: FeeStructure,
    });
    feeStructureOperations.deleteById(req, res, next);
});

// --- Fee Invoice Operations ---

const createFeeInvoice = asyncHandler(async (req, res, next) => {
    const FeeInvoice = getFeeInvoiceModel(req.schoolDb);
    const Student = getStudentModel(req.schoolDb);
    const Class = getClassModel(req.schoolDb);
    const FeeStructure = getFeeStructureModel(req.schoolDb);

    const feeInvoiceOperations = crudOperations({
        mainModel: FeeInvoice,
        populateModels: [
            { field: "student", model: Student, select: "user" }, // Assuming student has user field
            { field: "class", model: Class, select: "classNumber division" },
            { field: "feeStructure", model: FeeStructure },
        ],
    });
    feeInvoiceOperations.create(req, res, next);
});

const getAllFeeInvoices = asyncHandler(async (req, res, next) => {
    const FeeInvoice = getFeeInvoiceModel(req.schoolDb);
    const Student = getStudentModel(req.schoolDb);
    const Class = getClassModel(req.schoolDb);
    const User = getUserModel(req.usersDb);

    const feeInvoiceOperations = crudOperations({
        mainModel: FeeInvoice,
        populateModels: [
            {
                field: "student",
                model: Student,
                select: "user admissionNumber roleNumber",
                populateModels: [{ field: "user", model: User, select: "name" }]
            },
            { field: "class", model: Class, select: "classNumber division" },
        ],
    });
    feeInvoiceOperations.getAll(req, res, next);
});

const getFeeInvoiceById = asyncHandler(async (req, res, next) => {
    const FeeInvoice = getFeeInvoiceModel(req.schoolDb);
    const Student = getStudentModel(req.schoolDb);
    const Class = getClassModel(req.schoolDb);
    const FeeStructure = getFeeStructureModel(req.schoolDb);
    const User = getUserModel(req.usersDb);
    const FeePayment = getFeePaymentModel(req.schoolDb);

    const feeInvoiceOperations = crudOperations({
        mainModel: FeeInvoice,
        populateModels: [
            {
                field: "student",
                model: Student,
                select: "user admissionNumber roleNumber",
                populateModels: [{ field: "user", model: User, select: "name" }]
            },
            { field: "class", model: Class, select: "classNumber division" },
            { field: "feeStructure", model: FeeStructure },
            { field: "payments", model: FeePayment },
        ],
    });
    feeInvoiceOperations.getById(req, res, next);
});

const updateFeeInvoice = asyncHandler(async (req, res, next) => {
    const FeeInvoice = getFeeInvoiceModel(req.schoolDb);

    // Note: Updating invoice might require recalculating totals which is handled in pre-save hook of the model
    // but updateById uses findByIdAndUpdate which bypasses hooks unless configured? 
    // crudOperations usually uses findByIdAndUpdate. 
    // If hooks need to run, we might need custom update logic. 
    // For now, sticking to standard crudOperations as per instruction to use current code format.

    const feeInvoiceOperations = crudOperations({
        mainModel: FeeInvoice,
    });
    feeInvoiceOperations.updateById(req, res, next);
});

const deleteFeeInvoice = asyncHandler(async (req, res, next) => {
    const FeeInvoice = getFeeInvoiceModel(req.schoolDb);
    const feeInvoiceOperations = crudOperations({
        mainModel: FeeInvoice,
    });
    feeInvoiceOperations.deleteById(req, res, next);
});

// --- Fee Payment Operations ---

const createFeePayment = asyncHandler(async (req, res, next) => {
    const FeePayment = getFeePaymentModel(req.schoolDb);
    const feePaymentOperations = crudOperations({
        mainModel: FeePayment,
    });

    // Custom logic could be added here to update the Invoice status after payment creation
    // For now, using standard create
    feePaymentOperations.create(req, res, next);
});

const getAllFeePayments = asyncHandler(async (req, res, next) => {
    const FeePayment = getFeePaymentModel(req.schoolDb);
    const Student = getStudentModel(req.schoolDb);
    const User = getUserModel(req.usersDb);
    const FeeInvoice = getFeeInvoiceModel(req.schoolDb);

    const feePaymentOperations = crudOperations({
        mainModel: FeePayment,
        populateModels: [
            {
                field: "student",
                model: Student,
                select: "user admissionNumber",
                populateModels: [{ field: "user", model: User, select: "name" }]
            },
            { field: "invoice", model: FeeInvoice, select: "invoiceNumber" },
            { field: "collectedBy", model: User, select: "name" }
        ],
    });
    feePaymentOperations.getAll(req, res, next);
});

const getFeePaymentById = asyncHandler(async (req, res, next) => {
    const FeePayment = getFeePaymentModel(req.schoolDb);
    const Student = getStudentModel(req.schoolDb);
    const User = getUserModel(req.usersDb);
    const FeeInvoice = getFeeInvoiceModel(req.schoolDb);

    const feePaymentOperations = crudOperations({
        mainModel: FeePayment,
        populateModels: [
            {
                field: "student",
                model: Student,
                select: "user admissionNumber",
                populateModels: [{ field: "user", model: User, select: "name" }]
            },
            { field: "invoice", model: FeeInvoice },
            { field: "collectedBy", model: User, select: "name" }
        ],
    });
    feePaymentOperations.getById(req, res, next);
});

const updateFeePayment = asyncHandler(async (req, res, next) => {
    const FeePayment = getFeePaymentModel(req.schoolDb);
    const feePaymentOperations = crudOperations({
        mainModel: FeePayment,
    });
    feePaymentOperations.updateById(req, res, next);
});

const deleteFeePayment = asyncHandler(async (req, res, next) => {
    const FeePayment = getFeePaymentModel(req.schoolDb);
    const feePaymentOperations = crudOperations({
        mainModel: FeePayment,
    });
    feePaymentOperations.deleteById(req, res, next);
});

module.exports = {
    // Structure
    createFeeStructure,
    getAllFeeStructures,
    getFeeStructureById,
    updateFeeStructure,
    deleteFeeStructure,
    // Invoice
    createFeeInvoice,
    getAllFeeInvoices,
    getFeeInvoiceById,
    updateFeeInvoice,
    deleteFeeInvoice,
    // Payment
    createFeePayment,
    getAllFeePayments,
    getFeePaymentById,
    updateFeePayment,
    deleteFeePayment,
};
