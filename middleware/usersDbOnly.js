const { connectToDatabase } = require("../config/db");

const usersDbOnly = async (req, res, next) => {
  try {
    req.usersDb = await connectToDatabase("Users");
    req.tenantId = "Users";
    next();
  } catch (err) {
    res.status(500).json({
      message: "Database connection error",
      error: err.message,
    });
  }
};

module.exports = usersDbOnly;
