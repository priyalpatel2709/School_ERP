const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const { getAdmissionApplicationModel } = require("../models");

const createAdmission = asyncHandler(async (req, res, next) => {
  const Admission = getAdmissionApplicationModel(req.schoolDb);
  const row = new Admission(req.body);
  await row.save();
  res.status(201).json(row);
});

const listAdmissions = asyncHandler(async (req, res) => {
  const Admission = getAdmissionApplicationModel(req.schoolDb);
  const { stage, academicYear } = req.query;
  const filter = {};
  if (stage) filter.stage = stage;
  if (academicYear) filter.academicYear = academicYear;
  const rows = await Admission.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: rows.length, data: rows });
});

const getAdmissionById = asyncHandler(async (req, res, next) => {
  const Admission = getAdmissionApplicationModel(req.schoolDb);
  const row = await Admission.findById(req.params.id);
  if (!row) return next(createError(404, "Not found"));
  res.json(row);
});

const updateAdmission = asyncHandler(async (req, res, next) => {
  const Admission = getAdmissionApplicationModel(req.schoolDb);
  const row = await Admission.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!row) return next(createError(404, "Not found"));
  res.json(row);
});

const updateAdmissionStage = asyncHandler(async (req, res, next) => {
  const Admission = getAdmissionApplicationModel(req.schoolDb);
  const { stage } = req.body;
  if (!stage) return next(createError(400, "stage required"));
  const row = await Admission.findByIdAndUpdate(
    req.params.id,
    { stage },
    { new: true },
  );
  if (!row) return next(createError(404, "Not found"));
  res.json(row);
});

const deleteAdmission = asyncHandler(async (req, res, next) => {
  const Admission = getAdmissionApplicationModel(req.schoolDb);
  const row = await Admission.findByIdAndDelete(req.params.id);
  if (!row) return next(createError(404, "Not found"));
  res.json({ success: true });
});

module.exports = {
  createAdmission,
  listAdmissions,
  getAdmissionById,
  updateAdmission,
  updateAdmissionStage,
  deleteAdmission,
};
