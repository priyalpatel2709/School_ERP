const mongoose = require("mongoose");

/**
 * Staff Attendance Model
 * Tracks check-in/check-out times for staff members
 */
const staffAttendanceSchema = mongoose.Schema(
    {
        staff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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

        // Check-in/Check-out
        checkIn: {
            time: { type: Date },
            location: { type: String }, // GPS coordinates or location name
            method: {
                type: String,
                enum: ["Manual", "Biometric", "Mobile App", "Web"],
                default: "Manual"
            },
            markedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        },

        checkOut: {
            time: { type: Date },
            location: { type: String },
            method: {
                type: String,
                enum: ["Manual", "Biometric", "Mobile App", "Web"],
                default: "Manual"
            },
            markedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        },

        // Working Hours
        totalHours: { type: Number }, // Auto-calculated
        expectedHours: { type: Number, default: 8 },

        // Status
        status: {
            type: String,
            enum: ["Present", "Absent", "Half-Day", "On Leave", "Late", "Early Leave"],
            default: "Present"
        },

        // Late/Early flags
        isLate: { type: Boolean, default: false },
        lateByMinutes: { type: Number, default: 0 },
        leftEarly: { type: Boolean, default: false },
        earlyByMinutes: { type: Number, default: 0 },

        // Leave Information
        leaveInfo: {
            isOnLeave: { type: Boolean, default: false },
            leaveType: {
                type: String,
                enum: ["Sick Leave", "Casual Leave", "Earned Leave", "Emergency", "Maternity", "Paternity", "Other"]
            },
            leaveApplication: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "LeaveApplication"
            }
        },

        // Remarks
        remarks: { type: String },
        internalNotes: { type: String },

        // Approval
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        approvedAt: { type: Date },

        metaData: [
            {
                key: { type: String },
                value: mongoose.Schema.Types.Mixed
            }
        ]
    },
    { timestamps: true }
);

// Compound unique index - one record per staff per day
staffAttendanceSchema.index({ staff: 1, date: 1 }, { unique: true });
staffAttendanceSchema.index({ date: 1, status: 1 });

// Calculate total hours before saving
staffAttendanceSchema.pre("save", function (next) {
    if (this.checkIn.time && this.checkOut.time) {
        const diffMs = this.checkOut.time - this.checkIn.time;
        this.totalHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100; // Round to 2 decimals

        // Determine if half-day based on hours worked
        if (this.totalHours < this.expectedHours / 2) {
            this.status = "Half-Day";
        }
    }

    if (this.leaveInfo.isOnLeave) {
        this.status = "On Leave";
    }

    next();
});

const getStaffAttendanceModel = (connection) => {
    return connection.model("StaffAttendance", staffAttendanceSchema);
};

module.exports = getStaffAttendanceModel;
