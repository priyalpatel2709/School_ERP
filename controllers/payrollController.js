const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const {
  getPayrollRunModel,
  getTeacherModel,
  getUserModel,
} = require("../models");
const { generateAndSavePayslipPdf } = require("../helper/pdfDocuments");

const createPayrollRunDraft = asyncHandler(async (req, res, next) => {
  const { month, year, academicYear } = req.body;
  if (!month || !year || !academicYear) {
    return next(createError(400, "month, year, academicYear required"));
  }

  const Teacher = getTeacherModel(req.schoolDb);
  const PayrollRun = getPayrollRunModel(req.schoolDb);

  const teachers = await Teacher.find({ "employment.status": "Active" });
  const lines = teachers.map((t) => {
    const basic = t.salary?.basic || 0;
    const allowances = t.salary?.allowances || 0;
    const deductions = 0;
    const net = basic + allowances - deductions;
    return { teacher: t._id, basic, allowances, deductions, net };
  });

  const run = await PayrollRun.create({
    month,
    year,
    academicYear,
    status: "Draft",
    lines,
  });

  res.status(201).json(run);
});

const listPayrollRuns = asyncHandler(async (req, res) => {
  const PayrollRun = getPayrollRunModel(req.schoolDb);
  const rows = await PayrollRun.find({}).sort({ year: -1, month: -1 });
  res.json({ success: true, data: rows });
});

const getPayrollRunById = asyncHandler(async (req, res, next) => {
  const PayrollRun = getPayrollRunModel(req.schoolDb);
  const Teacher = getTeacherModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const row = await PayrollRun.findById(req.params.id).populate({
    path: "lines.teacher",
    model: Teacher,
    select: "user salary",
    populate: { path: "user", model: User, select: "name email" },
  });
  if (!row) return next(createError(404, "Not found"));
  res.json(row);
});

const finalizePayrollRun = asyncHandler(async (req, res, next) => {
  const PayrollRun = getPayrollRunModel(req.schoolDb);
  const Teacher = getTeacherModel(req.schoolDb);
  const User = getUserModel(req.usersDb);

  const run = await PayrollRun.findById(req.params.id);
  if (!run) return next(createError(404, "Not found"));
  if (run.status === "Finalized") {
    return next(createError(400, "Already finalized"));
  }

  for (const line of run.lines) {
    const teacher = await Teacher.findById(line.teacher).populate({
      path: "user",
      model: User,
      select: "name",
    });
    const name = teacher && teacher.user ? teacher.user.name : "Staff";
    const url = await generateAndSavePayslipPdf({
      employeeName: name,
      month: run.month,
      year: run.year,
      basic: line.basic,
      allowances: line.allowances,
      deductions: line.deductions,
      net: line.net,
      runId: String(run._id),
    });
    line.payslipPdfUrl = url;
  }

  run.status = "Finalized";
  run.finalizedAt = new Date();
  run.markModified("lines");
  await run.save();
  res.json({ success: true, data: run });
});

module.exports = {
  createPayrollRunDraft,
  listPayrollRuns,
  getPayrollRunById,
  finalizePayrollRun,
};
