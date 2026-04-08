const mongoose = require("mongoose");

const libraryItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String },
    isbn: { type: String },
    category: { type: String },
    shelfLocation: { type: String },
    totalCopies: { type: Number, default: 1, min: 1 },
    availableCopies: { type: Number, default: 1, min: 0 },
    finePerDay: { type: Number, default: 5, min: 0 },
    status: {
      type: String,
      enum: ["Active", "Lost", "Withdrawn"],
      default: "Active",
    },
    reservations: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reservedAt: { type: Date, default: Date.now },
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

const getLibraryItemModel = (connection) =>
  connection.model("LibraryItem", libraryItemSchema);

module.exports = getLibraryItemModel;
