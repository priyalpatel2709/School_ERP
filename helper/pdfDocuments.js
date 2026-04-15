const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const { UPLOAD_ROOT, publicUrlForStoredFile } = require("./uploadPaths");

function docToBuffer(doc) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.end();
  });
}

/**
 * @param {object} opts
 * @returns {Promise<string>} Public URL path for the saved PDF
 */
async function generateAndSaveFeeReceiptPdf(opts) {
  const {
    receiptNumber,
    paymentDate,
    amount,
    paymentMode,
    studentName,
    invoiceNumber,
    schoolName,
  } = opts;

  const doc = new PDFDocument({ margin: 50 });
  doc.fontSize(18).text("Fee Payment Receipt", { align: "center" });
  doc.moveDown();
  doc.fontSize(10);
  if (schoolName) doc.text(`School: ${schoolName}`);
  doc.text(`Receipt No: ${receiptNumber}`);
  doc.text(`Date: ${new Date(paymentDate).toISOString().slice(0, 10)}`);
  doc.text(`Invoice: ${invoiceNumber || "—"}`);
  doc.moveDown();
  doc.text(`Student: ${studentName || "—"}`);
  doc.text(`Amount: ${amount}`);
  doc.text(`Mode: ${paymentMode}`);

  const buf = await docToBuffer(doc);
  const dir = path.join(UPLOAD_ROOT, "receipts");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filename = `${receiptNumber.replace(/[^a-zA-Z0-9-_]/g, "_")}.pdf`;
  const full = path.join(dir, filename);
  fs.writeFileSync(full, buf);
  return publicUrlForStoredFile(`receipts/${filename}`);
}

/**
 * @param {object} opts
 * @returns {Promise<string>}
 */
async function generateAndSaveReportCardPdf(opts) {
  const {
    studentName,
    classLabel,
    examName,
    academicYear,
    overallPercentage,
    overallGrade,
    classRank,
    subjectRows,
    remarks,
  } = opts;

  const doc = new PDFDocument({ margin: 50 });
  doc.fontSize(16).text("Report Card", { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(11);
  doc.text(`Student: ${studentName || "—"}`);
  doc.text(`Class: ${classLabel || "—"}`);
  doc.text(`Examination: ${examName || "—"}`);
  doc.text(`Academic year: ${academicYear || "—"}`);
  doc.moveDown();
  if (subjectRows && subjectRows.length) {
    doc.fontSize(10).text("Subject marks:");
    subjectRows.forEach((r) => {
      doc.text(
        `  ${r.name}: ${r.obtained}/${r.max} (${r.percentage != null ? r.percentage + "%" : "—"})  Grade: ${r.grade || "—"}`,
      );
    });
  }
  doc.moveDown();
  doc.fontSize(11);
  doc.text(`Overall: ${overallPercentage != null ? overallPercentage + "%" : "—"}`);
  doc.text(`Grade: ${overallGrade || "—"}`);
  doc.text(`Rank: ${classRank != null ? classRank : "—"}`);
  if (remarks) {
    doc.moveDown();
    doc.fontSize(10).text(`Remarks: ${remarks}`);
  }

  const buf = await docToBuffer(doc);
  const dir = path.join(UPLOAD_ROOT, "report-cards");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const safe = `${String(studentName || "student").slice(0, 20)}_${Date.now()}`.replace(
    /[^a-zA-Z0-9-_]/g,
    "_",
  );
  const filename = `${safe}.pdf`;
  const full = path.join(dir, filename);
  fs.writeFileSync(full, buf);
  return publicUrlForStoredFile(`report-cards/${filename}`);
}

/**
 * @param {object} opts — payroll line fields
 * @returns {Promise<string>}
 */
async function generateAndSavePayslipPdf(opts) {
  const { employeeName, month, year, basic, allowances, deductions, net, runId } = opts;
  const doc = new PDFDocument({ margin: 50 });
  doc.fontSize(16).text("Salary Slip", { align: "center" });
  doc.moveDown();
  doc.fontSize(11);
  doc.text(`Employee: ${employeeName || "—"}`);
  doc.text(`Period: ${month}/${year}`);
  if (runId) doc.text(`Run ID: ${runId}`);
  doc.moveDown();
  doc.text(`Basic: ${basic}`);
  doc.text(`Allowances: ${allowances}`);
  doc.text(`Deductions: ${deductions}`);
  doc.fontSize(12).text(`Net pay: ${net}`, { underline: true });
  const buf = await docToBuffer(doc);
  const dir = path.join(UPLOAD_ROOT, "payslips");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filename = `payslip_${runId || "adhoc"}_${Date.now()}.pdf`.replace(/[^a-zA-Z0-9-_.]/g, "_");
  const full = path.join(dir, filename);
  fs.writeFileSync(full, buf);
  return publicUrlForStoredFile(`payslips/${filename}`);
}

module.exports = {
  generateAndSaveFeeReceiptPdf,
  generateAndSaveReportCardPdf,
  generateAndSavePayslipPdf,
};
