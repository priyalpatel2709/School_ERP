const mongoose = require("mongoose");

const homeworkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: false }, // Optional, but recommended for Latency checks
    status: {
      type: String,
      enum: ["Draft", "Published", "Archived"],
      default: "Draft",
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subject", // Matches model name in subjectModel.js
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    attachments: [{ type: String }], // Teacher's files (Question papers, etc.)
    submissions: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        submittedAt: { type: Date },
        attachments: [{ type: String }], // Student's submitted files
        grade: { type: String },
        feedback: { type: String },
        isLate: { type: Boolean, default: false },
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

const getHomeworkModel = (connection) => {
  return connection.model("Homework", homeworkSchema);
};

module.exports = getHomeworkModel;
