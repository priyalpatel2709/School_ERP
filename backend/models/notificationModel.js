const mongoose = require("mongoose");

const Notification = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["info", "warning", "error", "success"],
      required: true,
    },
    recipients: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        time: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["unread", "read", "archived"],
          default: "unread",
        },
      },
    ],
    message: {
      type: String,
      required: true,
    },
    expireDate: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
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

const getNotification = (connection) => {
  return connection.model("Notification", Notification);
};

module.exports = getNotification;
