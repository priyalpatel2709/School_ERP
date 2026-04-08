const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const { sendEmail, sendSms } = require("../services/communicationService");
const {
  getStudentModel,
  getUserModel,
  getFeeInvoiceModel,
} = require("../models");

const postSendEmail = asyncHandler(async (req, res, next) => {
  const { to, subject, text, html, templateType } = req.body;
  if (!to || !subject) {
    return next(createError(400, "to and subject required"));
  }
  const result = await sendEmail({ to, subject, text, html });
  res.json({ success: true, ...result, templateType: templateType || null });
});

const postSendSms = asyncHandler(async (req, res, next) => {
  const { to, body: smsBody, templateType } = req.body;
  if (!to || !smsBody) {
    return next(createError(400, "to and body required"));
  }
  const result = await sendSms({ to, body: smsBody });
  res.json({ success: true, ...result, templateType: templateType || null });
});

/**
 * Notify guardians about fee due (uses first invoice found with balance > 0).
 */
const postFeeReminderForStudent = asyncHandler(async (req, res, next) => {
  const { studentId, channel } = req.body;
  if (!studentId) return next(createError(400, "studentId required"));

  const Student = getStudentModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const FeeInvoice = getFeeInvoiceModel(req.schoolDb);

  const student = await Student.findById(studentId).populate({
    path: "user",
    model: User,
    select: "name email",
  });
  if (!student) return next(createError(404, "Student not found"));

  const inv = await FeeInvoice.findOne({
    student: studentId,
    balanceAmount: { $gt: 0 },
  }).sort({ dueDate: 1 });

  if (!inv) {
    return res.json({
      success: true,
      message: "No outstanding invoice for this student",
      dispatched: false,
    });
  }

  const guardians = (student.guardianInfo || []).filter((g) => g.email);
  if (guardians.length === 0 && (!student.user || !student.user.email)) {
    return next(createError(400, "No email on file for student or guardians"));
  }

  const lines = [];
  const subject = `Fee reminder — Invoice ${inv.invoiceNumber}`;
  const text = `Dear parent, a fee balance of ${inv.balanceAmount} is due on ${inv.dueDate?.toISOString?.().slice(0, 10) || ""} for invoice ${inv.invoiceNumber}.`;

  const targets = new Set();
  guardians.forEach((g) => targets.add(g.email));
  if (student.user && student.user.email) targets.add(student.user.email);

  for (const to of targets) {
    if (channel === "sms") {
      lines.push(await sendSms({ to, body: text }));
    } else {
      lines.push(await sendEmail({ to, subject, text }));
    }
  }

  res.json({ success: true, dispatched: true, results: lines });
});

const postAbsenceAlert = asyncHandler(async (req, res, next) => {
  const { studentId, date, channel } = req.body;
  if (!studentId) return next(createError(400, "studentId required"));

  const Student = getStudentModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const student = await Student.findById(studentId).populate({
    path: "user",
    model: User,
    select: "name email",
  });
  if (!student) return next(createError(404, "Student not found"));

  const when = date || new Date().toISOString().slice(0, 10);
  const studentLabel =
    student.user && student.user.name
      ? `${student.user.name}`
      : `Student ${studentId}`;
  const text = `${studentLabel} was marked absent on ${when}.`;

  const targets = [];
  (student.guardianInfo || []).forEach((g) => {
    if (g.email) targets.push({ to: g.email, type: "email" });
    if (g.phone) targets.push({ to: g.phone, type: "sms" });
  });
  if (targets.length === 0) {
    return res.json({
      success: true,
      dispatched: false,
      message: "No guardian email/phone on file",
    });
  }

  const results = [];
  for (const t of targets) {
    if (channel === "sms" || t.type === "sms") {
      results.push(await sendSms({ to: t.to, body: text }));
    } else {
      results.push(
        await sendEmail({
          to: t.to,
          subject: "Absent notification",
          text,
        }),
      );
    }
  }
  res.json({ success: true, dispatched: true, results });
});

module.exports = {
  postSendEmail,
  postSendSms,
  postFeeReminderForStudent,
  postAbsenceAlert,
};
