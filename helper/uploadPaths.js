const fs = require("fs");
const path = require("path");

const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

function ensureUploadsDirs() {
  const dirs = [
    path.join(UPLOAD_ROOT, "receipts"),
    path.join(UPLOAD_ROOT, "report-cards"),
    path.join(UPLOAD_ROOT, "payslips"),
    path.join(UPLOAD_ROOT, "users"),
  ];
  for (const d of dirs) {
    if (!fs.existsSync(d)) {
      fs.mkdirSync(d, { recursive: true });
    }
  }
}

function publicUrlForStoredFile(relativeFromUploads) {
  const normalized = relativeFromUploads.replace(/\\/g, "/");
  return `/uploads/${normalized}`;
}

module.exports = {
  UPLOAD_ROOT,
  ensureUploadsDirs,
  publicUrlForStoredFile,
};
