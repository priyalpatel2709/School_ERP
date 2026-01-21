const mongoose = require("mongoose");

/**
 * Student Attendance Model
 * Tracks daily and subject-wise attendance for students
 */
const studentAttendanceSchema = mongoose.Schema(
    {
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

        date: {
            type: Date,
            required: true
        },

        academicYear: {
            type: String,
            required: true
        },

        // Attendance Mode
        attendanceMode: {
            type: String,
            enum: ["Daily", "Subject-Wise"],
            default: "Daily"
        },

        // For Daily Mode
        dailyStatus: {
            morning: {
                status: {
                    type: String,
                    enum: ["Present", "Absent", "Late", "Half-Day", "On Leave"],
                    default: "Present"
                },
                markedAt: { type: Date },
                markedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                }
            },
            evening: {
                status: {
                    type: String,
                    enum: ["Present", "Absent", "Left Early", "Half-Day"],
                    default: "Present"
                },
                markedAt: { type: Date },
                markedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                }
            }
        },

        // For Subject-Wise Mode (Higher Grades)
        subjectAttendance: [
            {
                subject: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Subject",
                    required: true
                },
                period: { type: Number }, // Period number (1-8)
                status: {
                    type: String,
                    enum: ["Present", "Absent", "Late"],
                    default: "Present"
                },
                markedAt: { type: Date },
                markedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                }
            }
        ],

        // Overall Status for the Day
        overallStatus: {
            type: String,
            enum: ["Present", "Absent", "Partial", "On Leave"],
            default: "Present"
        },

        // Leave Information
        leaveInfo: {
            isOnLeave: { type: Boolean, default: false },
            leaveType: {
                type: String,
                enum: ["Sick Leave", "Casual Leave", "Emergency", "Other"]
            },
            leaveApplication: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "LeaveApplication"
            },
            leaveReason: { type: String }
        },

        // Remarks
        remarks: { type: String },

        // Notification sent to parent
        parentNotified: {
            type: Boolean,
            default: false
        },
        notifiedAt: { type: Date },

        metaData: [
            {
                key: { type: String },
                value: mongoose.Schema.Types.Mixed
            }
        ]
    },
    { timestamps: true }
);

// Compound unique index - one record per student per day
studentAttendanceSchema.index({ student: 1, date: 1 }, { unique: true });
studentAttendanceSchema.index({ class: 1, date: 1 });
studentAttendanceSchema.index({ date: 1, overallStatus: 1 });

// Calculate overall status before saving
studentAttendanceSchema.pre("save", function (next) {
    if (this.attendanceMode === "Daily") {
        // Check daily status
        const morningAbsent = this.dailyStatus.morning.status === "Absent" ||
            this.dailyStatus.morning.status === "On Leave";
        const eveningAbsent = this.dailyStatus.evening.status === "Absent";

        if (this.leaveInfo.isOnLeave) {
            this.overallStatus = "On Leave";
        } else if (morningAbsent && eveningAbsent) {
            this.overallStatus = "Absent";
        } else if (morningAbsent || eveningAbsent) {
            this.overallStatus = "Partial";
        } else {
            this.overallStatus = "Present";
        }
    } else if (this.attendanceMode === "Subject-Wise") {
        // Check subject-wise attendance
        const totalPeriods = this.subjectAttendance.length;
        const presentPeriods = this.subjectAttendance.filter(
            s => s.status === "Present" || s.status === "Late"
        ).length;

        if (this.leaveInfo.isOnLeave) {
            this.overallStatus = "On Leave";
        } else if (presentPeriods === 0) {
            this.overallStatus = "Absent";
        } else if (presentPeriods < totalPeriods) {
            this.overallStatus = "Partial";
        } else {
            this.overallStatus = "Present";
        }
    }

    next();
});

const getStudentAttendanceModel = (connection) => {
    return connection.model("StudentAttendance", studentAttendanceSchema);
};

module.exports = getStudentAttendanceModel;
