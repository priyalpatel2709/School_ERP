const mongoose = require("mongoose");

/**
 * Fee Payment Model
 * Records all fee payments (partial/full) with receipt generation
 */
const feePaymentSchema = mongoose.Schema(
    {
        receiptNumber: {
            type: String,
            required: true,
            unique: true
        }, // Auto-generated: RCP-2024-0001

        invoice: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FeeInvoice",
            required: true
        },

        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        // Payment Details
        paymentDate: {
            type: Date,
            required: true,
            default: Date.now
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        paymentMode: {
            type: String,
            enum: [
                "Cash",
                "Cheque",
                "Online Transfer",
                "UPI",
                "Credit Card",
                "Debit Card",
                "Net Banking",
                "Demand Draft"
            ],
            required: true
        },

        // Transaction Details (for online/cheque payments)
        transactionDetails: {
            transactionId: { type: String },
            chequeNumber: { type: String },
            chequeDate: { type: Date },
            bankName: { type: String },
            upiId: { type: String },
            cardLastFour: { type: String }
        },

        // Receipt PDF
        receiptPdfUrl: { type: String },

        // Payment Status
        status: {
            type: String,
            enum: ["Success", "Pending", "Failed", "Cancelled", "Refunded"],
            default: "Success"
        },

        // For cheque payments
        chequeStatus: {
            type: String,
            enum: ["Pending", "Cleared", "Bounced"],
            default: "Pending"
        },

        // Refund Information
        refundDetails: {
            refundDate: { type: Date },
            refundAmount: { type: Number },
            refundReason: { type: String },
            refundMode: { type: String },
            refundedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        },

        // Notes
        remarks: { type: String },
        internalNotes: { type: String },

        // Collected By
        collectedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Verification
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        verifiedAt: { type: Date },

        metaData: [
            {
                key: { type: String },
                value: mongoose.Schema.Types.Mixed
            }
        ]
    },
    { timestamps: true }
);

// Indexes
feePaymentSchema.index({ student: 1, paymentDate: -1 });
feePaymentSchema.index({ invoice: 1 });
// feePaymentSchema.index({ receiptNumber: 1 });
feePaymentSchema.index({ paymentDate: 1, status: 1 });

const getFeePaymentModel = (connection) => {
    return connection.model("FeePayment", feePaymentSchema);
};

module.exports = getFeePaymentModel;
