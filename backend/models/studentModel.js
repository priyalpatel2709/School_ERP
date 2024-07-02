const mongoose = require("mongoose");

const studentModel = mongoose.Schema({
  roleNumber: { type: Number, require: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
  calendar: { type: mongoose.Schema.Types.ObjectId, ref: "Calendar" }, // todo create calendar
  studentImage: {
    type: String,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const getStudentModel = (connection) => {
  return connection.model("Student", studentModel);
};

module.exports = getStudentModel;
