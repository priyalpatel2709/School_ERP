const express = require("express");
const router = express.Router();
const usersDbOnly = require("../middleware/usersDbOnly");
const { protect } = require("../middleware/authMiddleware");
const requireAdminRoleName = require("../middleware/requireAdminRoleName");
const {
  getAllSchoolsFeeDailyCollection,
} = require("../controllers/multiSchoolReportController");

router.get(
  "/fee/daily-collection",
  usersDbOnly,
  protect,
  requireAdminRoleName,
  getAllSchoolsFeeDailyCollection
);

module.exports = router;
