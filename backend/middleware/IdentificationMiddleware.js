const connectToDatabase = require("../config/db");

const identifyTenant = async (req, res, next) => {
  const schoolId =
    req.body.schoolId || req.header("X-School-Id") || req.query.schoolId;

  // const schoolId = req.header("X-School-Id");
  if (!schoolId) {
    return res.status(400).json({ message: "School ID is required" });
  }

  try {
    req.db = await connectToDatabase(schoolId);
    next();
  } catch (err) {
    res
      .status(500)
      .json({ message: "Database connection error", error: err.message });
  }
};

module.exports = identifyTenant;
