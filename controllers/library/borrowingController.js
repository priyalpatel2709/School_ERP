const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const {
  getLibraryBorrowingModel,
  getLibraryItemModel,
} = require("../../models");

const getAllBorrowingRecords = asyncHandler(async (req, res) => {
  const Borrow = getLibraryBorrowingModel(req.schoolDb);
  const Item = getLibraryItemModel(req.schoolDb);
  const rows = await Borrow.find({})
    .populate({ path: "item", model: Item })
    .sort({ checkedOutAt: -1 });
  res.json({ success: true, data: rows });
});

const createBorrowingRecord = asyncHandler(async (req, res, next) => {
  const Borrow = getLibraryBorrowingModel(req.schoolDb);
  const row = new Borrow(req.body);
  await row.save();
  res.status(201).json(row);
});

const getBorrowingRecord = asyncHandler(async (req, res, next) => {
  const Borrow = getLibraryBorrowingModel(req.schoolDb);
  const Item = getLibraryItemModel(req.schoolDb);
  const row = await Borrow.findById(req.params.id).populate({
    path: "item",
    model: Item,
  });
  if (!row) return next(createError(404, "Not found"));
  res.json(row);
});

const returnItem = asyncHandler(async (req, res, next) => {
  const Borrow = getLibraryBorrowingModel(req.schoolDb);
  const Item = getLibraryItemModel(req.schoolDb);
  const b = await Borrow.findById(req.params.id);
  if (!b) return next(createError(404, "Borrowing not found"));
  b.returnedAt = new Date();
  b.status = "Returned";
  await b.save();
  const item = await Item.findById(b.item);
  if (item) {
    item.availableCopies = Math.min(item.totalCopies, item.availableCopies + 1);
    await item.save();
  }
  res.json(b);
});

const renewLoan = asyncHandler(async (req, res, next) => {
  const Borrow = getLibraryBorrowingModel(req.schoolDb);
  const b = await Borrow.findById(req.params.id);
  if (!b || b.status !== "CheckedOut") {
    return next(createError(400, "Invalid borrowing"));
  }
  const extra = Number(req.body.extraDays || 7);
  b.dueDate = new Date(b.dueDate);
  b.dueDate.setDate(b.dueDate.getDate() + extra);
  b.renewalsCount = (b.renewalsCount || 0) + 1;
  await b.save();
  res.json(b);
});

const recordDamage = asyncHandler(async (req, res, next) => {
  const Borrow = getLibraryBorrowingModel(req.schoolDb);
  const b = await Borrow.findById(req.params.id);
  if (!b) return next(createError(404, "Not found"));
  b.damageNotes = req.body.notes || b.damageNotes;
  await b.save();
  res.json(b);
});

const registerPayment = asyncHandler(async (req, res, next) => {
  const Borrow = getLibraryBorrowingModel(req.schoolDb);
  const b = await Borrow.findById(req.params.id);
  if (!b) return next(createError(404, "Not found"));
  const amt = Number(req.body.amount || 0);
  b.feesPaid = (b.feesPaid || 0) + amt;
  await b.save();
  res.json(b);
});

const waiveFee = asyncHandler(async (req, res, next) => {
  const Borrow = getLibraryBorrowingModel(req.schoolDb);
  const b = await Borrow.findById(req.params.id);
  if (!b) return next(createError(404, "Not found"));
  b.feesAccrued = 0;
  await b.save();
  res.json(b);
});

const markAsLost = asyncHandler(async (req, res, next) => {
  const Borrow = getLibraryBorrowingModel(req.schoolDb);
  const Item = getLibraryItemModel(req.schoolDb);
  const b = await Borrow.findById(req.params.id);
  if (!b) return next(createError(404, "Not found"));
  b.status = "Lost";
  await b.save();
  const item = await Item.findById(b.item);
  if (item) {
    item.status = "Lost";
    await item.save();
  }
  res.json(b);
});

const addReminderSent = asyncHandler(async (req, res, next) => {
  const Borrow = getLibraryBorrowingModel(req.schoolDb);
  const b = await Borrow.findById(req.params.id);
  if (!b) return next(createError(404, "Not found"));
  b.remindersSent = b.remindersSent || [];
  b.remindersSent.push({ at: new Date() });
  await b.save();
  res.json(b);
});

const getBorrowerHistory = asyncHandler(async (req, res) => {
  const Borrow = getLibraryBorrowingModel(req.schoolDb);
  const Item = getLibraryItemModel(req.schoolDb);
  const { borrowerId } = req.params;
  const rows = await Borrow.find({ borrowerUser: borrowerId })
    .populate({ path: "item", model: Item })
    .sort({ checkedOutAt: -1 });
  res.json({ success: true, data: rows });
});

const getActiveCheckouts = asyncHandler(async (req, res) => {
  const Borrow = getLibraryBorrowingModel(req.schoolDb);
  const Item = getLibraryItemModel(req.schoolDb);
  const { borrowerId } = req.params;
  const rows = await Borrow.find({
    borrowerUser: borrowerId,
    status: "CheckedOut",
  }).populate({ path: "item", model: Item });
  res.json({ success: true, data: rows });
});

const getOverdueItems = asyncHandler(async (req, res) => {
  const Borrow = getLibraryBorrowingModel(req.schoolDb);
  const Item = getLibraryItemModel(req.schoolDb);
  const now = new Date();
  const rows = await Borrow.find({
    status: "CheckedOut",
    dueDate: { $lt: now },
  }).populate({ path: "item", model: Item });
  res.json({ success: true, count: rows.length, data: rows });
});

const getItemsDueSoon = asyncHandler(async (req, res) => {
  const Borrow = getLibraryBorrowingModel(req.schoolDb);
  const Item = getLibraryItemModel(req.schoolDb);
  const now = new Date();
  const soon = new Date();
  soon.setDate(soon.getDate() + 3);
  const rows = await Borrow.find({
    status: "CheckedOut",
    dueDate: { $gte: now, $lte: soon },
  }).populate({ path: "item", model: Item });
  res.json({ success: true, data: rows });
});

const getBorrowingStatistics = asyncHandler(async (req, res) => {
  const Borrow = getLibraryBorrowingModel(req.schoolDb);
  const out = await Borrow.countDocuments({ status: "CheckedOut" });
  const ret = await Borrow.countDocuments({ status: "Returned" });
  const lost = await Borrow.countDocuments({ status: "Lost" });
  res.json({ success: true, checkedOut: out, returned: ret, lost });
});

module.exports = {
  getAllBorrowingRecords,
  createBorrowingRecord,
  getBorrowingRecord,
  returnItem,
  renewLoan,
  recordDamage,
  registerPayment,
  waiveFee,
  markAsLost,
  addReminderSent,
  getBorrowerHistory,
  getActiveCheckouts,
  getOverdueItems,
  getItemsDueSoon,
  getBorrowingStatistics,
};
