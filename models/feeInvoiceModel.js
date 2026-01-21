const mongoose = require("mongoose");

/**
 * Fee Invoice Model
 * Auto-generated invoices for students based on fee structure
 * Tracks payment status and generates receipts
 */
const feeInvoiceSchema = mongoose.Schema(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true
        }, // Auto-generated: INV-2024-0001

        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true
        },

        academicYear: {
            type: String,
            required: true
        },

        feeStructure: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FeeStructure",
            required: true
        },

        // Invoice Period
        invoicePeriod: {
            type: String,
            enum: ["Monthly", "Quarterly", "Half-Yearly", "Yearly"],
            required: true
        },

        periodMonth: { type: Number, min: 1, max: 12 }, // For monthly invoices
        periodQuarter: { type: Number, min: 1, max: 4 }, // For quarterly invoices

        // Fee Details
        feeItems: [
            {
                headName: { type: String, required: true },
                amount: { type: Number, required: true },
                frequency: { type: String },
                description: { type: String }
            }
        ],

        // Amounts
        subtotal: { type: Number, required: true },

        discounts: [
            {
                discountName: { type: String, required: true },
                discountType: { type: String, enum: ["Percentage", "Fixed"] },
                discountValue: { type: Number },
                discountAmount: { type: Number, required: true },
                reason: { type: String }
            }
        ],

        totalDiscount: { type: Number, default: 0 },

        lateFee: { type: Number, default: 0 },

        totalAmount: { type: Number, required: true }, // subtotal - discount + lateFee

        paidAmount: { type: Number, default: 0 },

        balanceAmount: { type: Number, required: true },

        // Status
        status: {
            type: String,
            enum: ["Draft", "Issued", "Partially Paid", "Paid", "Overdue", "Cancelled"],
            default: "Draft"
        },

        // Dates
        issueDate: { type: Date, required: true },
        dueDate: { type: Date, required: true },
        paidDate: { type: Date },

        // Payment References
        payments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "FeePayment"
            }
        ],

        // Notes and Remarks
        notes: { type: String },
        internalNotes: { type: String }, // Not visible to parents

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        metaData: [
            {
                key: { type: String },
                value: mongoose.Schema.Types.Mixed
            }
        ]
    },
    { timestamps: true }
);

// Indexes for efficient queries
feeInvoiceSchema.index({ student: 1, academicYear: 1 });
feeInvoiceSchema.index({ status: 1, dueDate: 1 });
feeInvoiceSchema.index({ invoiceNumber: 1 });

// Calculate balance before saving
feeInvoiceSchema.pre("save", function (next) {
    this.balanceAmount = this.totalAmount - this.paidAmount;

    // Update status based on payment
    if (this.paidAmount === 0) {
        if (this.status !== "Draft" && this.status !== "Cancelled") {
            if (new Date() > this.dueDate) {
                this.status = "Overdue";
            } else {
                this.status = "Issued";
            }
        }
    } else if (this.paidAmount >= this.totalAmount) {
        this.status = "Paid";
        if (!this.paidDate) {
            this.paidDate = new Date();
        }
    } else {
        this.status = "Partially Paid";
    }

    next();
});

const getFeeInvoiceModel = (connection) => {
    return connection.model("FeeInvoice", feeInvoiceSchema);
};

module.exports = getFeeInvoiceModel;
