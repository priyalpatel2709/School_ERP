const mongoose = require("mongoose");

const teacherModel = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
    calendar: { type: mongoose.Schema.Types.ObjectId, ref: "Calendar" }, // todo create calendar
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
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
  { timestamps: true }
);

const getStudentModel = (connection) => {
  return connection.model("Teacher", teacherModel);
};

module.exports = getStudentModel;
