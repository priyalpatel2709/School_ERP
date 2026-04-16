const createError = require("http-errors");

const requireAdminRoleName = (req, res, next) => {
  const rn = String(req.user?.roleName || "").toLowerCase();
  if (rn !== "admin") {
    return next(createError(403, "Admin access required"));
  }
  next();
};

module.exports = requireAdminRoleName;
