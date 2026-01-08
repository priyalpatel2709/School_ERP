const mongoose = require("mongoose");

const schoolDetailModel = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
    phone: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    established: {
      type: Date,
      // required: true,
    },
    maxStudents: {
      type: Number,
    },
    maxStaff: {
      type: Number,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    schoolImage: {
      type: String,
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

const getSchoolDetailModel = (connection) => {
  return connection.model("SchoolDetail", schoolDetailModel);
};

module.exports = getSchoolDetailModel;
