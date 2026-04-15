const express = require("express");
const router = express.Router();
const identifyTenant = require("../middleware/IdentificationMiddleware");
const { protect, authorize } = require("../middleware/authMiddleware");
const permissions = require("../utils/permissions");
const {
    createFeeStructure,
    getAllFeeStructures,
    getFeeStructureById,
    updateFeeStructure,
    deleteFeeStructure,
    getFeeStructureByClass,
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
    createFeePayment,
    getAllFeePayments,
    getFeePaymentById,
    updateFeePayment,
    deleteFeePayment,
    getStudentPaymentHistory,
    getDailyCollectionReport,
    refundFeePayment,
    getReconciliationReport,
    cloneFeeStructure,
    getFeeAuditLogs,
    getDelinquencyRisk,
    paymentWebhookHandler,
} = require("../controllers/feeController");

// --- Fee Structure Routes ---
router.post("/structures", identifyTenant, protect, createFeeStructure);
router.get("/structures", identifyTenant, protect, getAllFeeStructures);
router.post("/structures/:id/clone", identifyTenant, protect, authorize(permissions.FEE_STRUCTURE_CREATE), cloneFeeStructure);
router.get("/structures/:id", identifyTenant, protect, authorize(permissions.FEE_STRUCTURE_VIEW), getFeeStructureById);
router.get("/structures/class/:classId", identifyTenant, protect, authorize(permissions.FEE_STRUCTURE_VIEW), getFeeStructureByClass);
router.put("/structures/:id", identifyTenant, protect, authorize(permissions.FEE_STRUCTURE_UPDATE), updateFeeStructure);
router.delete("/structures/:id", identifyTenant, protect, authorize(permissions.FEE_STRUCTURE_DELETE), deleteFeeStructure);

// --- Fee Invoice Routes ---
router.post("/invoices", identifyTenant, protect, authorize(permissions.FEE_INVOICE_CREATE), createFeeInvoice);
router.post("/invoices/bulk-generate", identifyTenant, protect, authorize(permissions.FEE_INVOICE_CREATE), generateBulkInvoices);
router.get("/invoices/summary", identifyTenant, protect, authorize(permissions.FEE_INVOICE_VIEW), getInvoiceSummary);
router.get("/invoices/export", identifyTenant, protect, authorize(permissions.FEE_INVOICE_VIEW), exportInvoices);
router.get("/invoices", identifyTenant, protect, authorize(permissions.FEE_INVOICE_VIEW), getAllFeeInvoices);
router.get("/invoices/overdue", identifyTenant, protect, authorize(permissions.FEE_INVOICE_VIEW), getOverdueInvoices);
router.get("/invoices/student/:studentId", identifyTenant, protect, authorize(permissions.FEE_INVOICE_VIEW), getStudentInvoices);
router.post("/invoices/:id/reminder", identifyTenant, protect, authorize(permissions.FEE_INVOICE_CREATE), sendInvoiceReminder);
router.post("/invoices/:id/waive-late-fee", identifyTenant, protect, authorize(permissions.FEE_INVOICE_CREATE), waiveLateFee);
router.get("/invoices/:id", identifyTenant, protect, authorize(permissions.FEE_INVOICE_VIEW), getFeeInvoiceById);
router.put("/invoices/:id", identifyTenant, protect, authorize(permissions.FEE_INVOICE_CREATE), updateFeeInvoice);
router.delete("/invoices/:id", identifyTenant, protect, authorize(permissions.FEE_INVOICE_CREATE), deleteFeeInvoice);

// --- Fee Payment Routes ---
router.post("/payments", identifyTenant, protect, authorize(permissions.FEE_PAYMENT_RECORD), createFeePayment);
router.post("/payments/webhook", identifyTenant, paymentWebhookHandler);
router.get("/payments", identifyTenant, protect, authorize(permissions.FEE_PAYMENT_VIEW), getAllFeePayments);
router.get("/payments/student/:studentId", identifyTenant, protect, authorize(permissions.FEE_PAYMENT_VIEW), getStudentPaymentHistory);
router.get("/payments/reports/daily", identifyTenant, protect, authorize(permissions.FEE_PAYMENT_VIEW), getDailyCollectionReport);
router.get("/payments/:id", identifyTenant, protect, authorize(permissions.FEE_PAYMENT_VIEW), getFeePaymentById);
router.post("/payments/:id/refund", identifyTenant, protect, authorize(permissions.FEE_PAYMENT_RECORD), refundFeePayment);
router.put("/payments/:id", identifyTenant, protect, authorize(permissions.FEE_PAYMENT_RECORD), updateFeePayment);
router.delete("/payments/:id", identifyTenant, protect, authorize(permissions.FEE_PAYMENT_RECORD), deleteFeePayment);

// --- Reconciliation / Risk / Audit ---
router.get("/reconciliation", identifyTenant, protect, authorize(permissions.FEE_PAYMENT_VIEW), getReconciliationReport);
router.get("/audit-logs", identifyTenant, protect, authorize(permissions.FEE_PAYMENT_VIEW), getFeeAuditLogs);
router.get("/delinquency-risk", identifyTenant, protect, authorize(permissions.FEE_INVOICE_VIEW), getDelinquencyRisk);

module.exports = router;
