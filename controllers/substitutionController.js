const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const { getSubstitutionModel } = require("../models");

const createSubstitution = asyncHandler(async (req, res, next) => {
  const Substitution = getSubstitutionModel(req.schoolDb);
  const sub = new Substitution(req.body);
  await sub.save();
  res.status(201).json(sub);
});

const listSubstitutions = asyncHandler(async (req, res) => {
  const Substitution = getSubstitutionModel(req.schoolDb);
  const { academicYear, from, to, classId } = req.query;
  const q = {};
  if (academicYear) q.academicYear = academicYear;
  if (classId) q.class = classId;
  if (from || to) {
    q.date = {};
    if (from) q.date.$gte = new Date(from);
    if (to) q.date.$lte = new Date(to);
  }
  const rows = await Substitution.find(q)
    .populate("class", "classNumber division")
    .populate("subject", "name code")
    .populate({
      path: "absentTeacher",
      select: "user",
      populate: { path: "user", select: "name" },
    })
    .populate({
      path: "substituteTeacher",
      select: "user",
      populate: { path: "user", select: "name" },
    })
    .sort({ date: 1 });
  res.json({ success: true, count: rows.length, data: rows });
});

const getSubstitutionById = asyncHandler(async (req, res, next) => {
  const Substitution = getSubstitutionModel(req.schoolDb);
  const row = await Substitution.findById(req.params.id);
  if (!row) return next(createError(404, "Not found"));
  res.json(row);
});

const updateSubstitution = asyncHandler(async (req, res, next) => {
  const Substitution = getSubstitutionModel(req.schoolDb);
  const row = await Substitution.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!row) return next(createError(404, "Not found"));
  res.json(row);
});

const deleteSubstitution = asyncHandler(async (req, res, next) => {
  const Substitution = getSubstitutionModel(req.schoolDb);
  const row = await Substitution.findByIdAndDelete(req.params.id);
  if (!row) return next(createError(404, "Not found"));
  res.json({ success: true });
});

module.exports = {
  createSubstitution,
  listSubstitutions,
  getSubstitutionById,
  updateSubstitution,
  deleteSubstitution,
};
