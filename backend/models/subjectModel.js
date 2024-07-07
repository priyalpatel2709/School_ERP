const mongoose = require("mongoose");

const subjectModel = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: { type: String },
    teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }],
    type: {
      type: String,
      enum: ["practical", "theory"],
      required: true,
      default: "theory",
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

const getSubjectModel = (connection) => {
  return connection.model("subject", subjectModel);
};

module.exports = getSubjectModel;
