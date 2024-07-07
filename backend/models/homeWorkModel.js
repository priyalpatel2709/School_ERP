const mongoose = require("mongoose");

const homeworkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: false },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    submissions: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        submittedAt: { type: Date },
        fileUrl: { type: String }, // URL to the submitted homework file
        grade: { type: String }, // Grade for the submission
        feedback: { type: String }, // Teacher's feedback
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
