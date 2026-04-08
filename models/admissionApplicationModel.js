const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema(
  {
    academicYear: { type: String, required: true },
    applicantName: { type: String, required: true },
    dateOfBirth: { type: Date },
    gradeApplying: { type: String, required: true },
    parentName: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    stage: {
      type: String,
      enum: [
        "Enquiry",
        "EntranceTest",
        "Interview",
        "MeritList",
        "Offered",
        "Enrolled",
        "Rejected",
      ],
      default: "Enquiry",
    },
    testScore: { type: Number },
    interviewNotes: { type: String },
    meritRank: { type: Number },
    enrolledStudent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    metaData: [
      {
        key: { type: String },
        value: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true }
);

const getAdmissionApplicationModel = (connection) =>
  connection.model("AdmissionApplication", admissionSchema);

module.exports = getAdmissionApplicationModel;
