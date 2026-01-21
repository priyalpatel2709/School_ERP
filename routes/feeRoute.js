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
    createFeeInvoice,
    getAllFeeInvoices,
    getFeeInvoiceById,
    updateFeeInvoice,
    deleteFeeInvoice,
    createFeePayment,
    getAllFeePayments,
    getFeePaymentById,
    updateFeePayment,
    deleteFeePayment,
} = require("../controllers/feeController");

// --- Fee Structure Routes ---
router.post("/structures", identifyTenant, protect, authorize(permissions.FEE_STRUCTURE_CREATE), createFeeStructure);
router.get("/structures", identifyTenant, protect, authorize(permissions.FEE_STRUCTURE_VIEW), getAllFeeStructures);
router.get("/structures/:id", identifyTenant, protect, authorize(permissions.FEE_STRUCTURE_VIEW), getFeeStructureById);
router.put("/structures/:id", identifyTenant, protect, authorize(permissions.FEE_STRUCTURE_UPDATE), updateFeeStructure);
router.delete("/structures/:id", identifyTenant, protect, authorize(permissions.FEE_STRUCTURE_DELETE), deleteFeeStructure);

// --- Fee Invoice Routes ---
router.post("/invoices", identifyTenant, protect, authorize(permissions.FEE_INVOICE_CREATE), createFeeInvoice);
router.get("/invoices", identifyTenant, protect, authorize(permissions.FEE_INVOICE_VIEW), getAllFeeInvoices);
router.get("/invoices/:id", identifyTenant, protect, authorize(permissions.FEE_INVOICE_VIEW), getFeeInvoiceById);
router.put("/invoices/:id", identifyTenant, protect, authorize(permissions.FEE_INVOICE_CREATE), updateFeeInvoice); // Usually updating invoice is admin/finance task
router.delete("/invoices/:id", identifyTenant, protect, authorize(permissions.FEE_INVOICE_CREATE), deleteFeeInvoice);

// --- Fee Payment Routes ---
router.post("/payments", identifyTenant, protect, authorize(permissions.FEE_PAYMENT_RECORD), createFeePayment);
router.get("/payments", identifyTenant, protect, authorize(permissions.FEE_PAYMENT_VIEW), getAllFeePayments);
router.get("/payments/:id", identifyTenant, protect, authorize(permissions.FEE_PAYMENT_VIEW), getFeePaymentById);
router.put("/payments/:id", identifyTenant, protect, authorize(permissions.FEE_PAYMENT_RECORD), updateFeePayment);
router.delete("/payments/:id", identifyTenant, protect, authorize(permissions.FEE_PAYMENT_RECORD), deleteFeePayment);

module.exports = router;
