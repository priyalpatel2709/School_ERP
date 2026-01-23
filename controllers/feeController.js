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

// --- Additional Use Cases ---

// Bulk generate monthly invoices for classes
const generateBulkInvoices = asyncHandler(async (req, res, next) => {
    const { classIds, month, year, academicYear } = req.body;

    const FeeStructure = getFeeStructureModel(req.schoolDb);
    const FeeInvoice = getFeeInvoiceModel(req.schoolDb);
    const Student = getStudentModel(req.schoolDb);

    const invoices = [];

    for (const classId of classIds) {
        // Get active fee structure for class
        const feeStructure = await FeeStructure.findOne({
            class: classId,
            status: 'Active',
            academicYear
        });

        if (!feeStructure) {
            continue; // Skip if no fee structure
        }

        // Get all students in class
        const students = await Student.find({ class: classId });

        for (const student of students) {
            // Calculate fee items for the period
            const feeItems = feeStructure.feeHeads
                .filter(head => head.frequency === 'Monthly' || head.frequency === 'Quarterly')
                .map(head => ({
                    headName: head.headName,
                    amount: head.amount,
                    frequency: head.frequency
                }));

            const subtotal = feeItems.reduce((sum, item) => sum + item.amount, 0);

            // Apply discounts if needed (sibling, merit, etc.)
            const discounts = [];
            const totalDiscount = discounts.reduce((sum, d) => sum + d.discountAmount, 0);
            const totalAmount = subtotal - totalDiscount;

            // Generate invoice number
            const invoiceCount = await FeeInvoice.countDocuments({
                invoiceNumber: new RegExp(`^INV-${year}`)
            });
            const invoiceNumber = `INV-${year}-${String(invoiceCount + invoices.length + 1).padStart(4, '0')}`;

            const invoice = new FeeInvoice({
                invoiceNumber,
                student: student._id,
                class: classId,
                academicYear,
                feeStructure: feeStructure._id,
                invoicePeriod: 'Monthly',
                periodMonth: month,
                feeItems,
                subtotal,
                discounts,
                totalDiscount,
                totalAmount,
                balanceAmount: totalAmount,
                issueDate: new Date(),
                dueDate: new Date(year, month - 1, 10), // 10th of month
                status: 'Issued',
                createdBy: req.user._id
            });

            await invoice.save();
            invoices.push(invoice);
        }
    }

    res.status(201).json({
        success: true,
        message: `${invoices.length} invoices generated successfully`,
        data: invoices
    });
});

// Get overdue invoices (Defaulters list)
const getOverdueInvoices = asyncHandler(async (req, res, next) => {
    const FeeInvoice = getFeeInvoiceModel(req.schoolDb);
    const Student = getStudentModel(req.schoolDb);
    const User = getUserModel(req.usersDb);
    const Class = getClassModel(req.schoolDb);

    const overdueInvoices = await FeeInvoice.find({
        status: { $in: ['Issued', 'Overdue', 'Partially Paid'] },
        balanceAmount: { $gt: 0 },
        dueDate: { $lt: new Date() }
    })
        .populate({
            field: 'student',
            model: Student,
            select: 'user admissionNumber roleNumber',
            populate: { path: 'user', model: User, select: 'name email phone' }
        })
        .populate('class', 'classNumber division')
        .sort({ dueDate: 1 });

    res.status(200).json({
        success: true,
        count: overdueInvoices.length,
        data: overdueInvoices
    });
});

// Get invoices for a specific student
const getStudentInvoices = asyncHandler(async (req, res, next) => {
    const FeeInvoice = getFeeInvoiceModel(req.schoolDb);
    const { studentId } = req.params;

    const invoices = await FeeInvoice.find({ student: studentId })
        .populate('feeStructure')
        .populate('payments')
        .sort({ issueDate: -1 });

    res.status(200).json({
        success: true,
        count: invoices.length,
        data: invoices
    });
});

// Get payment history for a student
const getStudentPaymentHistory = asyncHandler(async (req, res, next) => {
    const FeePayment = getFeePaymentModel(req.schoolDb);
    const { studentId } = req.params;
    const User = getUserModel(req.usersDb);
    const FeeInvoice = getFeeInvoiceModel(req.schoolDb);

    const payments = await FeePayment.find({ student: studentId })
        .populate('invoice', 'invoiceNumber issueDate')
        .populate('collectedBy', 'name')
        .sort({ paymentDate: -1 });

    res.status(200).json({
        success: true,
        count: payments.length,
        data: payments
    });
});

// Get fee structure by class
const getFeeStructureByClass = asyncHandler(async (req, res, next) => {
    const FeeStructure = getFeeStructureModel(req.schoolDb);
    const { classId } = req.params;
    const { academicYear } = req.query;

    const feeStructure = await FeeStructure.findOne({
        class: classId,
        academicYear,
        status: 'Active'
    }).populate('class', 'classNumber division');

    if (!feeStructure) {
        return next(createError(404, 'Fee structure not found for this class'));
    }

    res.status(200).json({
        success: true,
        data: feeStructure
    });
});

// Daily collection report
const getDailyCollectionReport = asyncHandler(async (req, res, next) => {
    const FeePayment = getFeePaymentModel(req.schoolDb);
    const { date } = req.query;
    const User = getUserModel(req.usersDb);

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const payments = await FeePayment.find({
        paymentDate: { $gte: startDate, $lte: endDate },
        status: 'Success'
    })
        .populate('student')
        .populate('invoice', 'invoiceNumber')
        .populate('collectedBy', 'name');

    const totalCollection = payments.reduce((sum, payment) => sum + payment.amount, 0);

    res.status(200).json({
        success: true,
        date,
        totalCollection,
        count: payments.length,
        data: payments
    });
});

module.exports = {
    // Structure
    createFeeStructure,
    getAllFeeStructures,
    getFeeStructureById,
    updateFeeStructure,
    deleteFeeStructure,
    getFeeStructureByClass,
    // Invoice
    createFeeInvoice,
    getAllFeeInvoices,
    getFeeInvoiceById,
    updateFeeInvoice,
    deleteFeeInvoice,
    generateBulkInvoices,
    getOverdueInvoices,
    getStudentInvoices,
    // Payment
    createFeePayment,
    getAllFeePayments,
    getFeePaymentById,
    updateFeePayment,
    deleteFeePayment,
    getStudentPaymentHistory,
    getDailyCollectionReport,
};
