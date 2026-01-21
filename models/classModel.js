const mongoose = require("mongoose");

const classModel = new mongoose.Schema(
  {
    classNumber: { type: String, required: true }, // e.g., "10"
    division: { type: String, required: true }, // e.g., "A"
    academicYear: { type: String }, // e.g., "2023-2024"

    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
    timeTable: { type: mongoose.Schema.Types.ObjectId, ref: "TimeTable" },

    // Capacity Management
    maxStudents: { type: Number, default: 40 },

    metaData: [
      {
        key: { type: String },
        value: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true },
);

// Ensure unique class per academic year (e.g., 10-A-2024 must be unique)
classModel.index(
  { classNumber: 1, division: 1, academicYear: 1 },
  { unique: true },
);

const getClassModel = (connection) => {
  return connection.model("Class", classModel);
};

module.exports = getClassModel;
