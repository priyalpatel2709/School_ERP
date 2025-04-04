const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransportRoute",
      required: true,
      index: true,
    },
    academicYear: {
      type: String,
      required: true,
      index: true,
    },
    pickupStopId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    dropStopId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended", "completed"],
      default: "active",
      index: true,
    },
    assignmentType: {
      type: String,
      enum: ["regular", "temporary", "special"],
      default: "regular",
      index: true,
    },
    effectiveFrom: {
      type: Date,
      default: Date.now,
      required: true,
    },
    effectiveTo: Date,
    direction: {
      type: String,
      enum: ["pickup", "dropoff", "both"],
      default: "both",
    },
    fee: {
      amount: {
        type: Number,
        min: 0,
      },
      frequency: {
        type: String,
        enum: ["monthly", "quarterly", "semi-annual", "annual"],
        default: "monthly",
      },
      discount: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      discountReason: String,
      effectiveAmount: {
        type: Number,
        min: 0,
      },
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "partial", "waived", "overdue"],
      default: "pending",
      index: true,
    },
    lastPaymentDate: Date,
    nextPaymentDue: Date,
    specialRequirements: String,
    authorizedPersons: [
      {
        name: String,
        relationship: String,
        contactNumber: String,
        idProof: String,
        photo: String,
      },
    ],
    medicalInfo: {
      conditions: [String],
      allergies: [String],
      medications: [String],
      emergencyInstructions: String,
    },
    assignedBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: String,
      date: {
        type: Date,
        default: Date.now,
      },
    },
    modificationHistory: [
      {
        modifiedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        date: {
          type: Date,
          default: Date.now,
        },
        changes: {
          field: String,
          oldValue: mongoose.Schema.Types.Mixed,
          newValue: mongoose.Schema.Types.Mixed,
        },
        reason: String,
      },
    ],
    attendance: {
      present: { type: Number, default: 0 },
      absent: { type: Number, default: 0 },
      late: { type: Number, default: 0 },
    },
    guardianConsent: {
      consentGiven: { type: Boolean, default: false },
      consentDate: Date,
      consentGivenBy: String,
      documentUrl: String,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransportVehicle",
      index: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SchoolDetail",
      required: true,
      index: true,
    },
    metaData: [
      {
        key: { type: String },
        value: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Compound indexes for more efficient querying
assignmentSchema.index({ studentId: 1, routeId: 1, academicYear: 1 });
assignmentSchema.index({ status: 1, schoolId: 1 });
assignmentSchema.index({ routeId: 1, status: 1 });
assignmentSchema.index({ paymentStatus: 1, nextPaymentDue: 1 });
assignmentSchema.index({ effectiveFrom: 1, effectiveTo: 1 });

// Virtuals for payment info
assignmentSchema.virtual("isPaymentDue").get(function () {
  if (!this.nextPaymentDue) return false;

  const today = new Date();
  return (
    this.nextPaymentDue <= today &&
    this.paymentStatus !== "paid" &&
    this.paymentStatus !== "waived"
  );
});

// Method to calculate next payment date
assignmentSchema.methods.calculateNextPaymentDate = function () {
  if (!this.fee || !this.fee.frequency || !this.lastPaymentDate) {
    return null;
  }

  const lastPayment = new Date(this.lastPaymentDate);
  let nextPayment;

  switch (this.fee.frequency) {
    case "monthly":
      nextPayment = new Date(lastPayment.setMonth(lastPayment.getMonth() + 1));
      break;
    case "quarterly":
      nextPayment = new Date(lastPayment.setMonth(lastPayment.getMonth() + 3));
      break;
    case "semi-annual":
      nextPayment = new Date(lastPayment.setMonth(lastPayment.getMonth() + 6));
      break;
    case "annual":
      nextPayment = new Date(
        lastPayment.setFullYear(lastPayment.getFullYear() + 1)
      );
      break;
    default:
      nextPayment = new Date(lastPayment.setMonth(lastPayment.getMonth() + 1));
  }

  return nextPayment;
};

// Pre-save hook to calculate effective amount
assignmentSchema.pre("save", function (next) {
  if (
    this.fee &&
    this.fee.amount &&
    (this.fee.discount || this.fee.discount === 0)
  ) {
    const discountAmount = (this.fee.amount * this.fee.discount) / 100;
    this.fee.effectiveAmount = this.fee.amount - discountAmount;
  }

  if (this.lastPaymentDate && !this.nextPaymentDue) {
    this.nextPaymentDue = this.calculateNextPaymentDate();
  }

  next();
});

const getTransportAssignmentModel = (connection) => {
  return connection.model("TransportAssignment", assignmentSchema);
};

module.exports = getTransportAssignmentModel;
