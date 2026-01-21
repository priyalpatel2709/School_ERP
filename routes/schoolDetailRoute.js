const express = require("express");
const router = express.Router();
const identifyTenant = require("../middleware/IdentificationMiddleware");
const { protect } = require("../middleware/authMiddleware");
const {
  addSchoolDetail,
  getSchoolDetail,
  updateSchoolDetail,
} = require("../controllers/schoolDetailController");

router.post("/", identifyTenant, protect, addSchoolDetail);
router.get("/", identifyTenant, protect, getSchoolDetail);
router.put("/:id", identifyTenant, protect, updateSchoolDetail);
module.exports = router;
