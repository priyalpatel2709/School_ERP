const mongoose = require("mongoose");

const daySchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    isBreak: {
      type: Boolean,
      required: true,
      default: false,
    },
    classRoom: {
      type: String,
    },
    lectureNumber: { type: Number },
    metaData: [
      {
        key: {
          type: String,
        },
        value: {
          type: mongoose.Schema.Types.Mixed,
        },
      },
    ],
  },
  { _id: false }
);

const timeTableSchema = new mongoose.Schema(
  {
    week: {
      Monday: [daySchema],
      Tuesday: [daySchema],
      Wednesday: [daySchema],
      Thursday: [daySchema],
      Friday: [daySchema],
      Saturday: [daySchema],
      Sunday: [daySchema],
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

const getTimeTableModel = (connection) => {
  return connection.model("TimeTable", timeTableSchema);
};

module.exports = getTimeTableModel;
