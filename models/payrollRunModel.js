const mongoose = require("mongoose");

const payrollLineSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    basic: { type: Number, required: true, min: 0 },
    allowances: { type: Number, default: 0, min: 0 },
    deductions: { type: Number, default: 0, min: 0 },
    net: { type: Number, required: true, min: 0 },
    payslipPdfUrl: { type: String },
  },
  { _id: true }
);

const payrollRunSchema = new mongoose.Schema(
  {
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    academicYear: { type: String, required: true },
    status: {
      type: String,
      enum: ["Draft", "Finalized"],
      default: "Draft",
    },
    lines: [payrollLineSchema],
    finalizedAt: { type: Date },
    metaData: [
      {
        key: { type: String },
        value: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true }
);

const getPayrollRunModel = (connection) =>
  connection.model("PayrollRun", payrollRunSchema);

module.exports = getPayrollRunModel;
