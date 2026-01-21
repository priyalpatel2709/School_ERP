const { connectToDatabase } = require("../config/db");

const identifyTenant = async (req, res, next) => {
  let schoolId =
    req.body.schoolId || req.header("X-School-Id") || req.query.schoolId;

  // Check cookie as last resort and add 'school_' prefix if needed
  if (!schoolId && req.cookies && req.cookies["X-School-Id"]) {
    const cookieValue = req.cookies["X-School-Id"];
    schoolId = cookieValue;
  }

  // Default to "Users" database if no schoolId is provided and base URL is "/user"

  if (!schoolId && req.baseUrl === "/api/v1/user") {
    schoolId = "Users";
  }

  // Check if both "Users" and another database need to be connected
  if (!schoolId) {
    return res.status(400).json({ message: "School ID is required" });
  }

  try {
    // Connect to the "Users" database
    req.usersDb = await connectToDatabase("Users");

    // Connect to the specified school database if schoolId is not "Users"
    if (schoolId !== "Users") {
      req.schoolDb = await connectToDatabase(schoolId);
    }

    next();
  } catch (err) {
    res
      .status(500)
      .json({ message: "Database connection error", error: err.message });
  }
};

module.exports = identifyTenant;
