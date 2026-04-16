const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const { connectToDatabase } = require("../config/db");
const { getFeePaymentModel } = require("../models");
const { listSchoolConnectionKeys } = require("../utils/schoolAccess");

const getAllSchoolsFeeDailyCollection = asyncHandler(async (req, res, next) => {
  const { date } = req.query;
  if (!date) {
    return next(createError(400, "date query parameter is required"));
  }

  const schoolKeys = listSchoolConnectionKeys(req.user);
  if (!schoolKeys.length) {
    return next(createError(400, "No schools assigned to this account"));
  }

  const startDate = new Date(date);
  if (Number.isNaN(startDate.getTime())) {
    return next(createError(400, "Invalid date"));
  }
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(startDate);
  endDate.setHours(23, 59, 59, 999);

  const bySchool = [];
  let grandTotal = 0;
  let totalPayments = 0;

  for (const dbKey of schoolKeys) {
    let conn;
    try {
      conn = await connectToDatabase(dbKey);
    } catch (e) {
      bySchool.push({
        schoolId: dbKey,
        success: false,
        error: e.message,
        totalCollection: 0,
        count: 0,
        data: [],
      });
      continue;
    }

    const FeePayment = getFeePaymentModel(conn);
    const payments = await FeePayment.find({
      paymentDate: { $gte: startDate, $lte: endDate },
      status: "Success",
    })
      .populate("student")
      .populate("invoice", "invoiceNumber")
      .populate("collectedBy", "name")
      .lean();

    const totalCollection = payments.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );
    grandTotal += totalCollection;
    totalPayments += payments.length;

    bySchool.push({
      schoolId: dbKey,
      success: true,
      totalCollection,
      count: payments.length,
      data: payments,
    });
  }

  res.json({
    success: true,
    message: "Daily fee collection aggregated for all assigned schools",
    data: {
      date,
      grandTotal,
      totalPayments,
      bySchool,
    },
  });
});

module.exports = {
  getAllSchoolsFeeDailyCollection,
};
