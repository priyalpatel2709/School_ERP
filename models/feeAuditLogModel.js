const mongoose = require("mongoose");

const feeAuditLogSchema = mongoose.Schema(
    {
        action: {
            type: String,
            required: true,
            enum: [
                "STRUCTURE_CLONED",
                "INVOICE_REMINDER_SENT",
                "LATE_FEE_WAIVED",
                "PAYMENT_REFUNDED",
                "PAYMENT_WEBHOOK_PROCESSED",
                "PAYMENT_WEBHOOK_DUPLICATE",
            ],
            immutable: true,
        },
        entityType: {
            type: String,
            required: true,
            enum: ["FeeStructure", "FeeInvoice", "FeePayment", "Webhook"],
            immutable: true,
        },
        entityId: {
            type: mongoose.Schema.Types.ObjectId,
            immutable: true,
        },
        actor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            immutable: true,
        },
        details: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
            immutable: true,
        },
        eventId: {
            type: String,
            immutable: true,
        },
    },
    { timestamps: true }
);

feeAuditLogSchema.index({ createdAt: -1 });
feeAuditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
feeAuditLogSchema.index({ eventId: 1 }, { unique: true, sparse: true });

const getFeeAuditLogModel = (connection) => {
    return connection.model("FeeAuditLog", feeAuditLogSchema);
};

module.exports = getFeeAuditLogModel;
