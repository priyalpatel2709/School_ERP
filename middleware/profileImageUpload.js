const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { UPLOAD_ROOT, publicUrlForStoredFile } = require("../helper/uploadPaths");

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

const userUploadDir = path.join(UPLOAD_ROOT, "users");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (!fs.existsSync(userUploadDir)) {
      fs.mkdirSync(userUploadDir, { recursive: true });
    }
    cb(null, userUploadDir);
  },
  filename(req, file, cb) {
    const uid = req.uploadTargetUserId || req.user._id;
    const ext = path.extname(file.originalname) || ".jpg";
    const safeExt = ext.match(/^\.(jpe?g|png|gif|webp)$/i) ? ext.toLowerCase() : ".jpg";
    cb(null, `${uid}_${Date.now()}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!ALLOWED.has(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, GIF, and WebP images are allowed"));
    }
    cb(null, true);
  },
});

function publicUrlFromDiskFilename(filename) {
  return publicUrlForStoredFile(`users/${filename}`);
}

module.exports = {
  uploadProfileImageMiddleware: upload.single("image"),
  publicUrlFromDiskFilename,
};
