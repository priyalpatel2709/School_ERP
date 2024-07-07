const mongoose = require("mongoose");

const classModel = new mongoose.Schema(
  {
    classNumber: { type: String, required: true },
    division: { type: String, required: true },
    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
    metaData: [
      {
        key: { type: String },
        value: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true } 
);

// Define any instance methods or statics here if needed

const getClassModel = (connection) => {
  return connection.model("Class", classModel);
};

module.exports = getClassModel;
