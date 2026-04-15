const mongoose = require("mongoose");

/**
 * Exam Result Model
 * Stores marks entered by teachers for each student
 */
const examResultSchema = mongoose.Schema(
    {
        examination: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Examination",
            required: true
        },

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

        // Subject-wise Marks
        subjectMarks: [
            {
                subject: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Subject",
                    required: true
                },
                marksObtained: {
                    type: Number,
                    required: true,
                    min: 0
                },
                maxMarks: {
                    type: Number,
                    required: true
                },
                passingMarks: {
                    type: Number,
                    required: true
                },
                isPassed: {
                    type: Boolean,
                    default: true
                },
                grade: { type: String }, // A+, A, B+, etc.
                gradePoint: { type: Number }, // GPA
                percentage: { type: Number },

                // Teacher who entered marks
                enteredBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
                enteredAt: {
                    type: Date,
                    default: Date.now
                },

                // Verification
                verifiedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                verifiedAt: { type: Date },

                remarks: { type: String }
            }
        ],

        // Overall Performance
        totalMarksObtained: { type: Number },
        totalMaxMarks: { type: Number },
        overallPercentage: { type: Number },
        overallGrade: { type: String },
        overallGradePoint: { type: Number },

        // Result Status
        isPassed: {
            type: Boolean,
            default: true
        },

        // Rank
        classRank: { type: Number },

        // Attendance during exam
        attendancePercentage: { type: Number },

        // Teacher's Remarks
        classTeacherRemarks: { type: String },
        principalRemarks: { type: String },

        // Report Card
        reportCardGenerated: {
            type: Boolean,
            default: false
        },
        reportCardUrl: { type: String },
        reportCardGeneratedAt: { type: Date },

        // Status
        status: {
            type: String,
            enum: ["Draft", "Submitted", "Verified", "Published"],
            default: "Draft"
        },

        metaData: [
            {
                key: { type: String },
                value: mongoose.Schema.Types.Mixed
            }
        ],

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
);

// Compound unique index - one result per student per exam
examResultSchema.index({ examination: 1, student: 1 }, { unique: true });
examResultSchema.index({ class: 1, examination: 1 });
examResultSchema.index({ student: 1, academicYear: 1 });

// Calculate overall performance before saving
examResultSchema.pre("save", function (next) {
    if (this.subjectMarks && this.subjectMarks.length > 0) {
        // Calculate totals
        this.totalMarksObtained = this.subjectMarks.reduce((sum, subject) => {
            return sum + subject.marksObtained;
        }, 0);

        this.totalMaxMarks = this.subjectMarks.reduce((sum, subject) => {
            return sum + subject.maxMarks;
        }, 0);

        // Calculate percentage
        if (this.totalMaxMarks > 0) {
            this.overallPercentage = Math.round((this.totalMarksObtained / this.totalMaxMarks) * 100 * 100) / 100;
        }

        // Check if passed (all subjects must be passed)
        this.isPassed = this.subjectMarks.every(subject => subject.isPassed);

        // Calculate individual subject percentages and pass status
        this.subjectMarks.forEach(subject => {
            subject.percentage = Math.round((subject.marksObtained / subject.maxMarks) * 100 * 100) / 100;
            subject.isPassed = subject.marksObtained >= subject.passingMarks;
        });
    }

    next();
});

const getExamResultModel = (connection) => {
    return connection.model("ExamResult", examResultSchema);
};

module.exports = getExamResultModel;
