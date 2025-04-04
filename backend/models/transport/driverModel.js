const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    licenseDetails: {
      number: {
        type: String,
        required: true,
        index: true,
      },
      class: {
        type: String,
        required: true,
      },
      issueDate: Date,
      expiryDate: {
        type: Date,
        required: true,
        index: true,
      },
      issuedBy: String,
      restrictions: [String],
      verified: {
        type: Boolean,
        default: false,
      },
    },
    experience: {
      yearsTotal: Number,
      yearsSchoolTransport: Number,
      previousEmployers: [
        {
          name: String,
          position: String,
          duration: String,
          contactPerson: String,
          contactNumber: String,
        },
      ],
    },
    contactInfo: {
      primary: {
        type: String,
        required: true,
      },
      alternate: String,
      emergencyContact: {
        name: String,
        relation: String,
        number: String,
      },
      address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
      },
    },
    status: {
      type: String,
      enum: ["active", "on-leave", "inactive", "terminated"],
      default: "active",
      index: true,
    },
    documents: [
      {
        type: {
          type: String,
          required: true,
          enum: [
            "identity",
            "address",
            "medical",
            "background",
            "training",
            "other",
          ],
        },
        title: String,
        number: String,
        issuedDate: Date,
        expiryDate: Date,
        documentUrl: String,
        verified: { type: Boolean, default: false },
        notes: String,
      },
    ],
    medicalInfo: {
      lastCheckupDate: Date,
      nextCheckupDate: Date,
      bloodGroup: String,
      allergies: [String],
      medicalConditions: [String],
      fitnessCertificate: {
        number: String,
        issuedDate: Date,
        expiryDate: Date,
        issuedBy: String,
        documentUrl: String,
      },
    },
    trainingCertifications: [
      {
        name: String,
        issuingAuthority: String,
        issuedDate: Date,
        expiryDate: Date,
        certificateUrl: String,
      },
    ],
    backgroundVerification: {
      verified: { type: Boolean, default: false },
      verificationDate: Date,
      agency: String,
      referenceNumber: String,
      reportUrl: String,
      notes: String,
    },
    drivingHistory: {
      accidentCount: { type: Number, default: 0 },
      violationCount: { type: Number, default: 0 },
      lastIncident: Date,
      notes: String,
    },
    assignedVehicles: [
      {
        vehicleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "TransportVehicle",
        },
        primary: { type: Boolean, default: false },
        assignmentDate: { type: Date, default: Date.now },
      },
    ],
    preferredRoutes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TransportRoute",
      },
    ],
    workSchedule: {
      regularHours: {
        start: String,
        end: String,
      },
      workingDays: [
        {
          type: String,
          enum: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ],
        },
      ],
      shiftPattern: String,
    },
    performanceMetrics: {
      safetyRating: { type: Number, min: 0, max: 5 },
      punctualityRating: { type: Number, min: 0, max: 5 },
      behaviorRating: { type: Number, min: 0, max: 5 },
      lastReviewDate: Date,
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

// Indexing for common queries
driverSchema.index({ status: 1, schoolId: 1 });
driverSchema.index({ "licenseDetails.expiryDate": 1 });
driverSchema.index({ "documents.expiryDate": 1 }, { sparse: true });

// Method to check if license or documents are expiring soon
driverSchema.methods.getExpiringDocuments = function (daysThreshold = 30) {
  const today = new Date();
  const threshold = new Date();
  threshold.setDate(today.getDate() + daysThreshold);

  const expiringDocs = [];

  // Check license
  if (
    this.licenseDetails.expiryDate &&
    this.licenseDetails.expiryDate <= threshold &&
    this.licenseDetails.expiryDate >= today
  ) {
    expiringDocs.push({
      type: "license",
      number: this.licenseDetails.number,
      expiryDate: this.licenseDetails.expiryDate,
    });
  }

  // Check other documents
  if (this.documents && this.documents.length > 0) {
    this.documents.forEach((doc) => {
      if (
        doc.expiryDate &&
        doc.expiryDate <= threshold &&
        doc.expiryDate >= today
      ) {
        expiringDocs.push({
          type: doc.type,
          title: doc.title,
          expiryDate: doc.expiryDate,
        });
      }
    });
  }

  return expiringDocs;
};

// Method to check driver availability
driverSchema.methods.isAvailable = function () {
  return this.status === "active";
};

const getTransportDriverModel = (connection) => {
  return connection.model("TransportDriver", driverSchema);
};

module.exports = getTransportDriverModel;
