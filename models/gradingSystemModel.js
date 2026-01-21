const mongoose = require("mongoose");

/**
 * Grading System Model
 * Configurable grading logic (90% = A+, 80% = A, etc.)
 */
const gradingSystemSchema = mongoose.Schema(
    {
        systemName: {
            type: String,
            required: true
        }, // e.g., "CBSE Grading", "ICSE Grading"

        academicYear: {
            type: String,
            required: true
        },

        // Applicable Classes
        classes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Class"
            }
        ],

        // Grading Scale
        gradingScale: [
            {
                grade: {
                    type: String,
                    required: true
                }, // A+, A, B+, B, C, D, E, F
                gradePoint: {
                    type: Number,
                    required: true
                }, // GPA value (e.g., 10, 9, 8)
                minPercentage: {
                    type: Number,
                    required: true,
                    min: 0,
                    max: 100
                },
                maxPercentage: {
                    type: Number,
                    required: true,
                    min: 0,
                    max: 100
                },
                description: { type: String }, // "Outstanding", "Excellent", etc.
                isPassing: {
                    type: Boolean,
                    default: true
                }
            }
        ],

        // Default Passing Percentage
        defaultPassingPercentage: {
            type: Number,
            default: 33
        },

        // Status
        isActive: {
            type: Boolean,
            default: true
        },

        createdBy: {
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

// Index
gradingSystemSchema.index({ academicYear: 1, isActive: 1 });

// Method to get grade for a percentage
gradingSystemSchema.methods.getGradeForPercentage = function (percentage) {
    const grade = this.gradingScale.find(
        g => percentage >= g.minPercentage && percentage <= g.maxPercentage
    );
    return grade || null;
};

const getGradingSystemModel = (connection) => {
    return connection.model("GradingSystem", gradingSystemSchema);
};

module.exports = getGradingSystemModel;
