const mongoose = require("mongoose");

const substitutionSchema = new mongoose.Schema(
  {
    academicYear: { type: String, required: true },
    date: { type: Date, required: true },
    dayName: { type: String, required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    periodIndex: { type: Number, default: 0 },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    absentTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    substituteTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    leaveApplication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeaveApplication",
    },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

const getSubstitutionModel = (connection) =>
  connection.model("Substitution", substitutionSchema);

module.exports = getSubstitutionModel;
