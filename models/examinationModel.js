const mongoose = require("mongoose");

/**
 * Examination Model
 * Defines exam terms, tests, and configurations
 */
const examinationSchema = mongoose.Schema(
    {
        examName: {
            type: String,
            required: true
        }, // e.g., "Mid-Term Exam", "Unit Test 1"

        examType: {
            type: String,
            enum: ["Term Exam", "Unit Test", "Monthly Test", "Final Exam", "Practice Test"],
            required: true
        },

        academicYear: {
            type: String,
            required: true
        },

        // Applicable Classes
        classes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Class",
                required: true
            }
        ],

        // Exam Schedule
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },

        // Subject-wise Details
        subjects: [
            {
                subject: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Subject",
                    required: true
                },
                examDate: { type: Date, required: true },
                startTime: { type: String }, // e.g., "09:00 AM"
                duration: { type: Number }, // in minutes
                maxMarks: { type: Number, required: true },
                passingMarks: { type: Number, required: true },
                weightage: { type: Number, default: 100 }, // Percentage weightage in final grade
                syllabus: { type: String },
                instructions: { type: String }
            }
        ],

        // Grading System Reference
        gradingSystem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GradingSystem"
        },

        // Status
        status: {
            type: String,
            enum: ["Scheduled", "Ongoing", "Completed", "Cancelled"],
            default: "Scheduled"
        },

        // Mark Entry
        markEntryStartDate: { type: Date },
        markEntryEndDate: { type: Date },
        markEntryStatus: {
            type: String,
            enum: ["Not Started", "In Progress", "Completed"],
            default: "Not Started"
        },

        // Result Publication
        resultPublished: {
            type: Boolean,
            default: false
        },
        resultPublishedDate: { type: Date },

        // Instructions and Notes
        generalInstructions: { type: String },
        internalNotes: { type: String },

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

// Indexes
examinationSchema.index({ academicYear: 1, examType: 1 });
examinationSchema.index({ startDate: 1, status: 1 });

const getExaminationModel = (connection) => {
    return connection.model("Examination", examinationSchema);
};

module.exports = getExaminationModel;
