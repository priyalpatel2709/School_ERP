const mongoose = require("mongoose");

/**
 * Leave Application Model
 * Handles leave applications for both students and staff
 * Workflow: Applied -> Approved/Rejected
 */
const leaveApplicationSchema = mongoose.Schema(
    {
        applicantType: {
            type: String,
            enum: ["Student", "Staff"],
            required: true
        },

        // Reference to Student or Staff
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student"
        },
        staff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        // Leave Details
        leaveType: {
            type: String,
            enum: [
                "Sick Leave",
                "Casual Leave",
                "Earned Leave",
                "Emergency",
                "Maternity",
                "Paternity",
                "Medical Leave",
                "Other"
            ],
            required: true
        },

        fromDate: {
            type: Date,
            required: true
        },
        toDate: {
            type: Date,
            required: true
        },

        totalDays: {
            type: Number,
          
        },

        reason: {
            type: String,
            required: true
        },

        // Supporting Documents
        attachments: [
            {
                fileName: { type: String },
                fileUrl: { type: String },
                fileType: { type: String }
            }
        ],

        // Workflow Status
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected", "Cancelled"],
            default: "Pending"
        },

        // Applied By (Parent for student, self for staff)
        appliedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        appliedAt: {
            type: Date,
            default: Date.now
        },

        // Approval Workflow
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        reviewedAt: { type: Date },
        reviewComments: { type: String },

        // Notification
        notificationSent: {
            type: Boolean,
            default: false
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
leaveApplicationSchema.index({ student: 1, fromDate: 1 });
leaveApplicationSchema.index({ staff: 1, fromDate: 1 });
leaveApplicationSchema.index({ status: 1, appliedAt: -1 });

// Calculate total days before saving
leaveApplicationSchema.pre("save", function (next) {
    if (this.fromDate && this.toDate) {
        const diffTime = Math.abs(this.toDate - this.fromDate);
        this.totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both dates
    }
    next();
});

const getLeaveApplicationModel = (connection) => {
    return connection.model("LeaveApplication", leaveApplicationSchema);
};

module.exports = getLeaveApplicationModel;
