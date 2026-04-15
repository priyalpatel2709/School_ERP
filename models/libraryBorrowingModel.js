const mongoose = require("mongoose");

const libraryBorrowingSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LibraryItem",
      required: true,
    },
    borrowerType: {
      type: String,
      enum: ["Student", "Staff"],
      required: true,
    },
    borrowerUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    checkedOutAt: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnedAt: { type: Date },
    renewalsCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["CheckedOut", "Returned", "Overdue", "Lost"],
      default: "CheckedOut",
    },
    feesAccrued: { type: Number, default: 0 },
    feesPaid: { type: Number, default: 0 },
    damageNotes: { type: String },
    remindersSent: [
      {
        at: { type: Date, default: Date.now },
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

libraryBorrowingSchema.index({ item: 1, status: 1 });
libraryBorrowingSchema.index({ borrowerUser: 1, status: 1 });

const getLibraryBorrowingModel = (connection) =>
  connection.model("LibraryBorrowing", libraryBorrowingSchema);

module.exports = getLibraryBorrowingModel;
