const mongoose = require("mongoose");

const studentModel = mongoose.Schema(
  {
    rollNumber: { type: Number, required: true },
    class: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
    calendar: [{ type: mongoose.Schema.Types.ObjectId, ref: "Calendar" }], // todo create calendar
    studentImage: {
      type: String,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // The Student's own login
    academicYear: { type: String }, // Changed to String to match Class Model (e.g. "2023-2024")
    admissionDate: { type: Date },
    admissionNumber: { type: Number, unique: true }, // Ensure unique admission number

    // Phase 1: Siblings for Fee Discounts
    siblings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],

    previousSchoolDetails: [
      {
        Detail: { type: String },
      },
    ],
    documentInfo: [
      {
        documentName: { type: String },
        documentLink: { type: String },
      },
    ],
    bankInfo: [
      {
        bankName: { type: String },
        bankAccountNumber: { type: String },
        IfscNumber: { type: String },
      },
    ],

    // Phase 1: Enterprise Parent Portal Support
    guardianInfo: [
      {
        relation: { type: String, enum: ["Father", "Mother", "Guardian"], required: true },
        name: { type: String, required: true },
        email: { type: String },
        phone: { type: String },
        occupation: { type: String },
        photo: { type: String },
        address: { type: String },
        // Link to a system User account for Parent Portal Login
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        isPrimaryContact: { type: Boolean, default: false }
      },
    ],

    metaData: [
      {
        key: { type: String },
        value: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true }
);

const getStudentModel = (connection) => {
  return connection.model("Student", studentModel);
};

module.exports = getStudentModel;
