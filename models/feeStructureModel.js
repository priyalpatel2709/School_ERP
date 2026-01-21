const mongoose = require("mongoose");

/**
 * Fee Structure Model
 * Defines fee heads (Tuition, Lab, Transport, etc.) per class
 * Supports different fee structures for different academic years
 */
const feeStructureSchema = mongoose.Schema(
    {
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true
        },
        academicYear: {
            type: String,
            required: true
        }, // e.g., "2023-2024"

        // Fee Heads Configuration
        feeHeads: [
            {
                headName: {
                    type: String,
                    required: true,
                    enum: [
                        "Tuition Fee",
                        "Lab Fee",
                        "Library Fee",
                        "Sports Fee",
                        "Transport Fee",
                        "Examination Fee",
                        "Development Fee",
                        "Computer Fee",
                        "Activity Fee",
                        "Other"
                    ]
                },
                amount: {
                    type: Number,
                    required: true,
                    min: 0
                },
                frequency: {
                    type: String,
                    enum: ["Monthly", "Quarterly", "Half-Yearly", "Yearly", "One-Time"],
                    default: "Monthly"
                },
                isMandatory: {
                    type: Boolean,
                    default: true
                },
                description: { type: String }
            }
        ],

        // Discount Rules
        discounts: [
            {
                discountName: { type: String, required: true },
                discountType: {
                    type: String,
                    enum: ["Percentage", "Fixed"],
                    default: "Percentage"
                },
                discountValue: { type: Number, required: true },
                applicableFor: {
                    type: String,
                    enum: ["Siblings", "Merit", "Staff Children", "Early Payment", "Custom"],
                    required: true
                },
                description: { type: String }
            }
        ],

        // Late Fee Configuration
        lateFeeConfig: {
            enabled: { type: Boolean, default: false },
            gracePeriodDays: { type: Number, default: 0 },
            lateFeeType: {
                type: String,
                enum: ["Percentage", "Fixed"],
                default: "Fixed"
            },
            lateFeeValue: { type: Number, default: 0 }
        },

        // Total Annual Fee (calculated)
        totalAnnualFee: { type: Number },

        status: {
            type: String,
            enum: ["Draft", "Active", "Archived"],
            default: "Draft"
        },

        effectiveFrom: { type: Date, required: true },
        effectiveTo: { type: Date },

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

// Compound index for class and academic year
feeStructureSchema.index({ class: 1, academicYear: 1 });

// Calculate total annual fee before saving
feeStructureSchema.pre("save", function (next) {
    if (this.feeHeads && this.feeHeads.length > 0) {
        this.totalAnnualFee = this.feeHeads.reduce((total, head) => {
            let headTotal = head.amount;

            // Calculate based on frequency
            switch (head.frequency) {
                case "Monthly":
                    headTotal *= 12;
                    break;
                case "Quarterly":
                    headTotal *= 4;
                    break;
                case "Half-Yearly":
                    headTotal *= 2;
                    break;
                case "Yearly":
                case "One-Time":
                    // Already annual
                    break;
            }

            return total + headTotal;
        }, 0);
    }
    next();
});

const getFeeStructureModel = (connection) => {
    return connection.model("FeeStructure", feeStructureSchema);
};

module.exports = getFeeStructureModel;
