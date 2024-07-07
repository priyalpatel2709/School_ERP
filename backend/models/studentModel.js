const mongoose = require("mongoose");

const studentModel = mongoose.Schema(
  {
    roleNumber: { type: Number, require: true },
    class: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
    calendar: [{ type: mongoose.Schema.Types.ObjectId, ref: "Calendar" }], // todo create calendar
    studentImage: {
      type: String,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    academicYear: { type: Date },
    admissionDate: { type: Date },
    admissionNumber: { type: Number },
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
    guardianInfo: [
      {
        name: { type: String },
        email: { type: String },
        relation: { type: String },
        phone: { type: String },
        photo: { type: String },
        occupation: { type: String },
        address: { type: String },
      },
    ],
    //todo other info
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
