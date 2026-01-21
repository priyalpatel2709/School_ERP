const mongoose = require("mongoose");

const teacherModel = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
    calendar: { type: mongoose.Schema.Types.ObjectId, ref: "Calendar" }, // todo create calendar
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],

    // Phase 2: Qualification Details
    qualifications: [
      {
        degree: { type: String, required: true }, // e.g., "B.Ed", "M.Sc"
        university: { type: String, required: true },
        yearOfPassing: { type: Number, required: true },
        grade: { type: String }, // e.g. "A+", "First Class"
      },
    ],

    // Phase 2: Employment Details
    employment: {
      dateOfJoining: { type: Date },
      jobType: {
        type: String,
        enum: ["Permanent", "Contract", "Visiting"],
        default: "Permanent",
      },
      status: {
        type: String,
        enum: ["Active", "Resigned", "Suspended"],
        default: "Active",
      },
      resignationDate: { type: Date },
    },

    leaves: {
      annual: { type: Number, default: 0, min: 0 },
      sick: { type: Number, default: 0, min: 0 },
    },
    salary: {
      basic: { type: Number, required: true, min: 0 },
      allowances: { type: Number, default: 0, min: 0 },
    },
    metaData: [
      {
        key: { type: String },
        value: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true },
);

const getTeacherModel = (connection) => {
  return connection.model("Teacher", teacherModel);
};

module.exports = getTeacherModel;
