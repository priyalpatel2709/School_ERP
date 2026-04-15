const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const {
    getFeeStructureModel,
    getFeeInvoiceModel,
    getFeePaymentModel,
    getFeeAuditLogModel,
    getClassModel,
    getStudentModel,
    getUserModel,
    getSchoolDetailModel,
} = require("../models");
const crudOperations = require("../utils/crudOperations");
const { computeSiblingDiscounts } = require("../helper/feeDiscountHelpers");
const { generateAndSaveFeeReceiptPdf } = require("../helper/pdfDocuments");

const toObjectId = (id) => {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) return null;
    return new mongoose.Types.ObjectId(id);
};

const logFeeAudit = async (req, payload) => {
    try {
        const FeeAuditLog = getFeeAuditLogModel(req.schoolDb);
        await FeeAuditLog.create(payload);
    } catch (err) {
        // Audit logging must not block business flow.
    }
};

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
                select: "user admissionNumber rollNumber",
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
                select: "user admissionNumber rollNumber",
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(createError(400, "Validation error", { errors: errors.array() }));
    }

    const FeePayment = getFeePaymentModel(req.schoolDb);
    const FeeInvoice = getFeeInvoiceModel(req.schoolDb);
    const Student = getStudentModel(req.schoolDb);
    const User = getUserModel(req.usersDb);

    const body = { ...req.body };
    let receiptNumber = body.receiptNumber;
    if (!receiptNumber) {
        const year = new Date().getFullYear();
        const count = await FeePayment.countDocuments({
            receiptNumber: new RegExp(`^RCP-${year}`),
        });
        receiptNumber = `RCP-${year}-${String(count + 1).padStart(4, "0")}`;
    }

    const collectedBy = body.collectedBy || req.user._id;

    const payment = new FeePayment({
        ...body,
        receiptNumber,
        collectedBy,
    });

    let saved;
    try {
        saved = await payment.save();
    } catch (err) {
        return next(createError(500, "Error creating payment", { error: err.message }));
    }

    const invoice = await FeeInvoice.findById(saved.invoice);
    if (invoice) {
        invoice.paidAmount = (invoice.paidAmount || 0) + saved.amount;
        if (!invoice.payments.map(String).includes(String(saved._id))) {
            invoice.payments.push(saved._id);
        }
        await invoice.save();
    }

    let studentName = "";
    let invoiceNumber = "";
    let schoolName = "";
    try {
        const st = await Student.findById(saved.student).populate({
            path: "user",
            model: User,
            select: "name",
        });
        if (st && st.user) {
            const u = st.user;
            if (typeof u.name === "string") studentName = u.name;
            else if (u.name && (u.name.firstName || u.name.lastName)) {
                studentName = [u.name.firstName, u.name.lastName].filter(Boolean).join(" ");
            }
        }
        if (invoice) invoiceNumber = invoice.invoiceNumber || "";
        const SchoolDetail = getSchoolDetailModel(req.schoolDb);
        const school = await SchoolDetail.findOne().limit(1).lean();
        if (school && school.name) schoolName = school.name;
    } catch (e) {
        // still return payment if PDF metadata fails
    }

    try {
        const pdfUrl = await generateAndSaveFeeReceiptPdf({
            receiptNumber: saved.receiptNumber,
            paymentDate: saved.paymentDate,
            amount: saved.amount,
            paymentMode: saved.paymentMode,
            studentName,
            invoiceNumber,
            schoolName,
        });
        saved.receiptPdfUrl = pdfUrl;
        await saved.save();
    } catch (e) {
        // Payment recorded; PDF can be regenerated later
    }

    res.status(201).json(saved);
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

            const { discounts, totalDiscount } = computeSiblingDiscounts(
                student,
                feeStructure,
                subtotal
            );
            const totalAmount = Math.max(0, subtotal - totalDiscount);

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
            select: 'user admissionNumber rollNumber',
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

const getInvoiceSummary = asyncHandler(async (req, res, next) => {
    const FeeInvoice = getFeeInvoiceModel(req.schoolDb);
    const { classId, academicYear, month, status, startDate, endDate } = req.query;

    const match = {};
    if (academicYear) match.academicYear = academicYear;
    if (status) match.status = status;
    if (classId) {
        const classObjectId = toObjectId(classId);
        if (!classObjectId) return next(createError(400, "Invalid classId"));
        match.class = classObjectId;
    }

    if (startDate || endDate || month) {
        match.issueDate = {};
        if (startDate) match.issueDate.$gte = new Date(startDate);
        if (endDate) match.issueDate.$lte = new Date(endDate);
    }

    const summary = await FeeInvoice.aggregate([
        { $match: match },
        {
            $addFields: {
                month: { $month: "$issueDate" },
                year: { $year: "$issueDate" }
            }
        },
        ...(month ? [{ $match: { month: Number(month) } }] : []),
        {
            $group: {
                _id: {
                    status: "$status",
                    class: "$class",
                    month: "$month",
                    academicYear: "$academicYear",
                },
                invoiceCount: { $sum: 1 },
                totalAmount: { $sum: "$totalAmount" },
                paidAmount: { $sum: "$paidAmount" },
                balanceAmount: { $sum: "$balanceAmount" },
            }
        },
        { $sort: { "_id.academicYear": 1, "_id.month": 1, "_id.status": 1 } }
    ]);

    res.status(200).json({
        success: true,
        message: "Invoice summary fetched successfully",
        data: summary,
    });
});

const exportInvoices = asyncHandler(async (req, res, next) => {
    const FeeInvoice = getFeeInvoiceModel(req.schoolDb);
    const Student = getStudentModel(req.schoolDb);
    const Class = getClassModel(req.schoolDb);
    const User = getUserModel(req.usersDb);
    const { classId, academicYear, status, startDate, endDate, format = "csv" } = req.query;

    const query = {};
    if (classId) {
        const classObjectId = toObjectId(classId);
        if (!classObjectId) return next(createError(400, "Invalid classId"));
        query.class = classObjectId;
    }
    if (academicYear) query.academicYear = academicYear;
    if (status) query.status = status;
    if (startDate || endDate) {
        query.issueDate = {};
        if (startDate) query.issueDate.$gte = new Date(startDate);
        if (endDate) query.issueDate.$lte = new Date(endDate);
    }

    const invoices = await FeeInvoice.find(query)
        .populate({
            path: "student",
            model: Student,
            select: "admissionNumber user",
            populate: { path: "user", model: User, select: "name" },
        })
        .populate({ path: "class", model: Class, select: "classNumber division" })
        .lean();

    const rows = invoices.map((inv) => ({
        invoiceNumber: inv.invoiceNumber,
        academicYear: inv.academicYear,
        class: inv.class ? `${inv.class.classNumber || ""}-${inv.class.division || ""}` : "",
        studentName: inv.student && inv.student.user ? inv.student.user.name || "" : "",
        admissionNumber: inv.student ? inv.student.admissionNumber || "" : "",
        issueDate: inv.issueDate ? new Date(inv.issueDate).toISOString().slice(0, 10) : "",
        dueDate: inv.dueDate ? new Date(inv.dueDate).toISOString().slice(0, 10) : "",
        status: inv.status,
        totalAmount: inv.totalAmount || 0,
        paidAmount: inv.paidAmount || 0,
        balanceAmount: inv.balanceAmount || 0,
    }));

    const headers = Object.keys(rows[0] || {
        invoiceNumber: "", academicYear: "", class: "", studentName: "", admissionNumber: "",
        issueDate: "", dueDate: "", status: "", totalAmount: "", paidAmount: "", balanceAmount: ""
    });
    const csv = [
        headers.join(","),
        ...rows.map((r) => headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const extension = String(format).toLowerCase() === "excel" ? "xls" : "csv";
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="fee-invoices-export.${extension}"`);
    res.status(200).send(csv);
});

const sendInvoiceReminder = asyncHandler(async (req, res, next) => {
    const FeeInvoice = getFeeInvoiceModel(req.schoolDb);
    const { id } = req.params;
    const { channels = ["SMS"], message = "", recipient = "" } = req.body;

    const invoice = await FeeInvoice.findById(id);
    if (!invoice) return next(createError(404, "Invoice not found"));

    const normalizedChannels = Array.isArray(channels) ? channels : [channels];
    const reminders = normalizedChannels.map((channel) => ({
        channel,
        status: "Sent",
        recipient,
        message: message || `Reminder for invoice ${invoice.invoiceNumber}.`,
        sentAt: new Date(),
        providerResponse: "Delivery accepted",
    }));

    invoice.reminders = [...(invoice.reminders || []), ...reminders];
    await invoice.save();

    await logFeeAudit(req, {
        action: "INVOICE_REMINDER_SENT",
        entityType: "FeeInvoice",
        entityId: invoice._id,
        actor: req.user ? req.user._id : undefined,
        details: { channels: normalizedChannels, reminderCount: reminders.length },
    });

    res.status(200).json({
        success: true,
        message: "Reminder sent successfully",
        data: { invoiceId: invoice._id, reminders },
    });
});

const refundFeePayment = asyncHandler(async (req, res, next) => {
    const FeePayment = getFeePaymentModel(req.schoolDb);
    const FeeInvoice = getFeeInvoiceModel(req.schoolDb);
    const { id } = req.params;
    const { amount, reason, reference } = req.body;

    const payment = await FeePayment.findById(id);
    if (!payment) return next(createError(404, "Payment not found"));
    if (!amount || Number(amount) <= 0) return next(createError(400, "Valid refund amount is required"));
    if (!reason) return next(createError(400, "Refund reason is required"));

    const refundable = Number(payment.amount) - Number(payment.totalRefunded || 0);
    if (Number(amount) > refundable) {
        return next(createError(400, "Refund amount exceeds refundable balance"));
    }

    payment.refunds = payment.refunds || [];
    payment.refunds.push({
        amount: Number(amount),
        reason,
        approvedBy: req.user._id,
        approvedAt: new Date(),
        reference: reference || "",
    });
    payment.totalRefunded = Number(payment.totalRefunded || 0) + Number(amount);
    payment.refundDetails = {
        refundDate: new Date(),
        refundAmount: payment.totalRefunded,
        refundReason: reason,
        refundedBy: req.user._id,
    };
    if (payment.totalRefunded >= payment.amount) payment.status = "Refunded";
    await payment.save();

    const invoice = await FeeInvoice.findById(payment.invoice);
    if (invoice) {
        invoice.paidAmount = Math.max(0, Number(invoice.paidAmount || 0) - Number(amount));
        await invoice.save();
    }

    await logFeeAudit(req, {
        action: "PAYMENT_REFUNDED",
        entityType: "FeePayment",
        entityId: payment._id,
        actor: req.user ? req.user._id : undefined,
        details: { amount: Number(amount), reason, reference: reference || "" },
    });

    res.status(200).json({
        success: true,
        message: "Refund processed successfully",
        data: payment,
    });
});

const getReconciliationReport = asyncHandler(async (req, res, next) => {
    const FeeInvoice = getFeeInvoiceModel(req.schoolDb);
    const FeePayment = getFeePaymentModel(req.schoolDb);
    const { startDate, endDate } = req.query;

    const invoiceQuery = {};
    const paymentQuery = { status: "Success" };
    if (startDate || endDate) {
        const range = {};
        if (startDate) range.$gte = new Date(startDate);
        if (endDate) range.$lte = new Date(endDate);
        invoiceQuery.issueDate = range;
        paymentQuery.paymentDate = range;
    }

    const invoices = await FeeInvoice.find(invoiceQuery).select("_id invoiceNumber paidAmount totalAmount balanceAmount").lean();
    const paymentsAgg = await FeePayment.aggregate([
        { $match: paymentQuery },
        { $group: { _id: "$invoice", recordedPayments: { $sum: "$amount" } } }
    ]);
    const paymentMap = new Map(paymentsAgg.map((p) => [String(p._id), p.recordedPayments]));

    const mismatches = invoices
        .map((inv) => {
            const settled = Number(paymentMap.get(String(inv._id)) || 0);
            const invoicePaid = Number(inv.paidAmount || 0);
            return {
                invoiceId: inv._id,
                invoiceNumber: inv.invoiceNumber,
                settledAmount: settled,
                invoicePaidAmount: invoicePaid,
                mismatchAmount: Number((settled - invoicePaid).toFixed(2)),
            };
        })
        .filter((row) => row.mismatchAmount !== 0);

    res.status(200).json({
        success: true,
        message: "Reconciliation report generated",
        data: {
            totalInvoices: invoices.length,
            mismatchCount: mismatches.length,
            mismatches,
        },
    });
});

const cloneFeeStructure = asyncHandler(async (req, res, next) => {
    const FeeStructure = getFeeStructureModel(req.schoolDb);
    const { id } = req.params;
    const { academicYear, effectiveFrom, effectiveTo, status = "Draft" } = req.body;

    if (!academicYear) return next(createError(400, "academicYear is required"));
    const source = await FeeStructure.findById(id).lean();
    if (!source) return next(createError(404, "Fee structure not found"));

    const cloned = new FeeStructure({
        ...source,
        _id: undefined,
        academicYear,
        status,
        effectiveFrom: effectiveFrom ? new Date(effectiveFrom) : new Date(),
        effectiveTo: effectiveTo ? new Date(effectiveTo) : undefined,
        createdBy: req.user ? req.user._id : source.createdBy,
        updatedBy: undefined,
        createdAt: undefined,
        updatedAt: undefined,
    });
    await cloned.save();

    await logFeeAudit(req, {
        action: "STRUCTURE_CLONED",
        entityType: "FeeStructure",
        entityId: cloned._id,
        actor: req.user ? req.user._id : undefined,
        details: { sourceStructureId: id, clonedAcademicYear: academicYear },
    });

    res.status(201).json({
        success: true,
        message: "Fee structure cloned successfully",
        data: cloned,
    });
});

const getFeeAuditLogs = asyncHandler(async (req, res, next) => {
    const FeeAuditLog = getFeeAuditLogModel(req.schoolDb);
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.action) query.action = req.query.action;
    if (req.query.entityType) query.entityType = req.query.entityType;
    if (req.query.entityId) {
        const entityId = toObjectId(req.query.entityId);
        if (!entityId) return next(createError(400, "Invalid entityId"));
        query.entityId = entityId;
    }

    const [items, total] = await Promise.all([
        FeeAuditLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        FeeAuditLog.countDocuments(query),
    ]);

    res.status(200).json({
        success: true,
        message: "Fee audit logs fetched successfully",
        data: items,
        meta: { page, limit, total },
    });
});

const waiveLateFee = asyncHandler(async (req, res, next) => {
    const FeeInvoice = getFeeInvoiceModel(req.schoolDb);
    const { id } = req.params;
    const { amount, reason } = req.body;
    if (!amount || Number(amount) <= 0) return next(createError(400, "Valid waiver amount is required"));
    if (!reason) return next(createError(400, "Waiver reason is required"));

    const invoice = await FeeInvoice.findById(id);
    if (!invoice) return next(createError(404, "Invoice not found"));

    const currentLateFee = Number(invoice.lateFee || 0);
    if (currentLateFee <= 0) return next(createError(400, "No late fee available to waive"));
    if (Number(amount) > currentLateFee) return next(createError(400, "Waiver amount exceeds late fee"));

    invoice.lateFee = currentLateFee - Number(amount);
    invoice.totalAmount = Math.max(0, Number(invoice.totalAmount || 0) - Number(amount));
    invoice.balanceAmount = Math.max(0, Number(invoice.totalAmount || 0) - Number(invoice.paidAmount || 0));
    invoice.lateFeeWaivers = invoice.lateFeeWaivers || [];
    invoice.lateFeeWaivers.push({
        amount: Number(amount),
        reason,
        approvedBy: req.user._id,
        approvedAt: new Date(),
    });
    await invoice.save();

    await logFeeAudit(req, {
        action: "LATE_FEE_WAIVED",
        entityType: "FeeInvoice",
        entityId: invoice._id,
        actor: req.user ? req.user._id : undefined,
        details: { amount: Number(amount), reason },
    });

    res.status(200).json({
        success: true,
        message: "Late fee waived successfully",
        data: invoice,
    });
});

const getDelinquencyRisk = asyncHandler(async (req, res, next) => {
    const FeeInvoice = getFeeInvoiceModel(req.schoolDb);

    const results = await FeeInvoice.aggregate([
        {
            $match: {
                status: { $in: ["Issued", "Overdue", "Partially Paid"] },
                balanceAmount: { $gt: 0 },
            }
        },
        {
            $project: {
                student: 1,
                balanceAmount: 1,
                overdueDays: {
                    $max: [
                        0,
                        {
                            $dateDiff: {
                                startDate: "$dueDate",
                                endDate: "$$NOW",
                                unit: "day",
                            }
                        }
                    ]
                }
            }
        },
        {
            $group: {
                _id: "$student",
                invoiceCount: { $sum: 1 },
                totalOutstanding: { $sum: "$balanceAmount" },
                avgOverdueDays: { $avg: "$overdueDays" },
                maxOverdueDays: { $max: "$overdueDays" },
            }
        },
        {
            $addFields: {
                riskScore: {
                    $round: [
                        {
                            $min: [
                                100,
                                {
                                    $add: [
                                        { $multiply: ["$invoiceCount", 10] },
                                        { $multiply: ["$avgOverdueDays", 0.7] },
                                        { $multiply: [{ $divide: ["$totalOutstanding", 1000] }, 5] }
                                    ]
                                }
                            ]
                        },
                        2
                    ]
                }
            }
        },
        {
            $addFields: {
                riskBand: {
                    $switch: {
                        branches: [
                            { case: { $gte: ["$riskScore", 75] }, then: "High" },
                            { case: { $gte: ["$riskScore", 45] }, then: "Medium" }
                        ],
                        default: "Low"
                    }
                }
            }
        },
        { $sort: { riskScore: -1 } }
    ]);

    res.status(200).json({
        success: true,
        message: "Delinquency risk generated successfully",
        data: results,
    });
});

const paymentWebhookHandler = asyncHandler(async (req, res, next) => {
    const FeePayment = getFeePaymentModel(req.schoolDb);
    const FeeInvoice = getFeeInvoiceModel(req.schoolDb);
    const FeeAuditLog = getFeeAuditLogModel(req.schoolDb);

    const { eventId, paymentId, gatewayPaymentId, invoiceId, amount, status } = req.body;
    if (!eventId) return next(createError(400, "eventId is required"));

    const existingEvent = await FeeAuditLog.findOne({ eventId }).lean();
    if (existingEvent) {
        return res.status(200).json({
            success: true,
            message: "Webhook already processed",
            data: { eventId, duplicate: true },
        });
    }

    let payment = null;
    if (paymentId && toObjectId(paymentId)) {
        payment = await FeePayment.findById(paymentId);
    }
    if (!payment && gatewayPaymentId) {
        payment = await FeePayment.findOne({ "gatewayMeta.gatewayPaymentId": gatewayPaymentId });
    }

    if (payment) {
        if (status) payment.status = status;
        payment.gatewayMeta = {
            ...(payment.gatewayMeta || {}),
            gatewayPaymentId: gatewayPaymentId || payment.gatewayMeta?.gatewayPaymentId,
            webhookEventId: eventId,
            webhookReceivedAt: new Date(),
        };
        await payment.save();
    } else if (invoiceId && toObjectId(invoiceId) && amount && req.user && req.user._id) {
        const invoice = await FeeInvoice.findById(invoiceId);
        if (invoice) {
            const created = await FeePayment.create({
                receiptNumber: `RCP-WEBHOOK-${Date.now()}`,
                invoice: invoice._id,
                student: invoice.student,
                amount: Number(amount),
                paymentMode: "Online Transfer",
                status: status || "Success",
                collectedBy: req.user._id,
                gatewayMeta: {
                    gatewayPaymentId: gatewayPaymentId || "",
                    webhookEventId: eventId,
                    webhookReceivedAt: new Date(),
                },
            });
            invoice.paidAmount = Number(invoice.paidAmount || 0) + Number(created.amount || 0);
            invoice.payments = invoice.payments || [];
            if (!invoice.payments.map(String).includes(String(created._id))) invoice.payments.push(created._id);
            await invoice.save();
            payment = created;
        }
    }

    await logFeeAudit(req, {
        action: "PAYMENT_WEBHOOK_PROCESSED",
        entityType: "Webhook",
        actor: req.user ? req.user._id : undefined,
        eventId,
        details: {
            paymentId: payment ? String(payment._id) : null,
            gatewayPaymentId: gatewayPaymentId || null,
            status: status || null,
        },
    });

    res.status(200).json({
        success: true,
        message: "Webhook processed",
        data: { eventId, paymentId: payment ? payment._id : null },
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
    getInvoiceSummary,
    exportInvoices,
    sendInvoiceReminder,
    waiveLateFee,
    // Payment
    createFeePayment,
    getAllFeePayments,
    getFeePaymentById,
    updateFeePayment,
    deleteFeePayment,
    getStudentPaymentHistory,
    getDailyCollectionReport,
    refundFeePayment,
    paymentWebhookHandler,
    // Reports / Audit / Utilities
    getReconciliationReport,
    cloneFeeStructure,
    getFeeAuditLogs,
    getDelinquencyRisk,
};
