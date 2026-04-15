const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const {
  getLibraryItemModel,
  getLibraryBorrowingModel,
} = require("../../models");

const getAllItems = asyncHandler(async (req, res) => {
  const Item = getLibraryItemModel(req.schoolDb);
  const rows = await Item.find({}).sort({ title: 1 });
  res.json({ success: true, data: rows });
});

const createItem = asyncHandler(async (req, res, next) => {
  const Item = getLibraryItemModel(req.schoolDb);
  const body = { ...req.body };
  if (body.totalCopies != null && body.availableCopies == null) {
    body.availableCopies = body.totalCopies;
  }
  const row = new Item(body);
  await row.save();
  res.status(201).json(row);
});

const getItem = asyncHandler(async (req, res, next) => {
  const Item = getLibraryItemModel(req.schoolDb);
  const row = await Item.findById(req.params.id);
  if (!row) return next(createError(404, "Item not found"));
  res.json(row);
});

const updateItem = asyncHandler(async (req, res, next) => {
  const Item = getLibraryItemModel(req.schoolDb);
  const row = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!row) return next(createError(404, "Item not found"));
  res.json(row);
});

const deleteItem = asyncHandler(async (req, res, next) => {
  const Item = getLibraryItemModel(req.schoolDb);
  const row = await Item.findByIdAndDelete(req.params.id);
  if (!row) return next(createError(404, "Item not found"));
  res.json({ success: true });
});

const checkoutItem = asyncHandler(async (req, res, next) => {
  const Item = getLibraryItemModel(req.schoolDb);
  const Borrow = getLibraryBorrowingModel(req.schoolDb);
  const item = await Item.findById(req.params.id);
  if (!item) return next(createError(404, "Item not found"));
  if (item.availableCopies < 1) {
    return next(createError(400, "No copies available"));
  }

  const { borrowerUser, borrowerType, student, loanDays = 14 } = req.body;
  if (!borrowerUser || !borrowerType) {
    return next(createError(400, "borrowerUser and borrowerType required"));
  }

  const due = new Date();
  due.setDate(due.getDate() + Number(loanDays));

  item.availableCopies -= 1;
  await item.save();

  const borrow = await Borrow.create({
    item: item._id,
    borrowerUser,
    borrowerType,
    student: student || undefined,
    dueDate: due,
    status: "CheckedOut",
  });

  res.status(201).json({ borrowing: borrow, item });
});

const returnItem = asyncHandler(async (req, res, next) => {
  const Item = getLibraryItemModel(req.schoolDb);
  const Borrow = getLibraryBorrowingModel(req.schoolDb);
  const item = await Item.findById(req.params.id);
  if (!item) return next(createError(404, "Item not found"));

  const active = await Borrow.findOne({
    item: item._id,
    status: "CheckedOut",
  }).sort({ checkedOutAt: -1 });
  if (!active) return next(createError(400, "No active checkout for this item"));

  active.returnedAt = new Date();
  active.status = "Returned";
  await active.save();

  item.availableCopies = Math.min(item.totalCopies, item.availableCopies + 1);
  await item.save();

  res.json({ success: true, borrowing: active });
});

const renewItem = asyncHandler(async (req, res, next) => {
  const Borrow = getLibraryBorrowingModel(req.schoolDb);
  const active = await Borrow.findOne({
    item: req.params.id,
    status: "CheckedOut",
  }).sort({ checkedOutAt: -1 });
  if (!active) return next(createError(400, "No active checkout"));
  const extra = Number(req.body.extraDays || 7);
  active.dueDate = new Date(active.dueDate);
  active.dueDate.setDate(active.dueDate.getDate() + extra);
  active.renewalsCount = (active.renewalsCount || 0) + 1;
  await active.save();
  res.json(active);
});

const reserveItem = asyncHandler(async (req, res, next) => {
  const Item = getLibraryItemModel(req.schoolDb);
  const item = await Item.findById(req.params.id);
  if (!item) return next(createError(404, "Not found"));
  const { userId } = req.body;
  if (!userId) return next(createError(400, "userId required"));
  item.reservations = item.reservations || [];
  item.reservations.push({ user: userId });
  await item.save();
  res.json(item);
});

const cancelReservation = asyncHandler(async (req, res, next) => {
  const Item = getLibraryItemModel(req.schoolDb);
  const item = await Item.findById(req.params.id);
  if (!item) return next(createError(404, "Not found"));
  const { userId } = req.body;
  item.reservations = (item.reservations || []).filter(
    (r) => String(r.user) !== String(userId),
  );
  await item.save();
  res.json(item);
});

const markAsLost = asyncHandler(async (req, res, next) => {
  const Item = getLibraryItemModel(req.schoolDb);
  const Borrow = getLibraryBorrowingModel(req.schoolDb);
  const item = await Item.findById(req.params.id);
  if (!item) return next(createError(404, "Not found"));
  item.status = "Lost";
  item.availableCopies = 0;
  await item.save();
  await Borrow.updateMany(
    { item: item._id, status: "CheckedOut" },
    { status: "Lost" },
  );
  res.json(item);
});

const getItemStatistics = asyncHandler(async (req, res) => {
  const Item = getLibraryItemModel(req.schoolDb);
  const total = await Item.countDocuments();
  const byCat = await Item.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);
  res.json({ success: true, total, byCategory: byCat });
});

const getDueItems = asyncHandler(async (req, res) => {
  const Borrow = getLibraryBorrowingModel(req.schoolDb);
  const Item = getLibraryItemModel(req.schoolDb);
  const now = new Date();
  const rows = await Borrow.find({
    status: "CheckedOut",
    dueDate: { $lt: now },
  }).populate("item", "title isbn");
  res.json({ success: true, count: rows.length, data: rows });
});

module.exports = {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  checkoutItem,
  returnItem,
  renewItem,
  reserveItem,
  cancelReservation,
  markAsLost,
  getItemStatistics,
  getDueItems,
};
