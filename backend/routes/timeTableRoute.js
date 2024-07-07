const express = require("express");
const router = express.Router();
const identifyTenant = require("../middleware/IdentificationMiddleware");
const { protect } = require("../middleware/authMiddleware");

const {
  createTimeTable,
  getAllTimeTable,
  getTimeTableById,
  deleteAllTimeTable,
  deleteTimeTableById,
  updateTimeTableById,
  deleteLectureFromTimeTable,
} = require("../controllers/timeTableController");

router.post("/", identifyTenant, protect, createTimeTable);
router.get("/", identifyTenant, protect, getAllTimeTable);
router.get("/:id", identifyTenant, protect, getTimeTableById);
router.put("/:id", identifyTenant, protect, updateTimeTableById);
router.delete("/:id", identifyTenant, protect, deleteTimeTableById);
router.delete("/", identifyTenant, protect, deleteAllTimeTable);
router.delete(
  "/:id/:day/:lectureIndex",
  identifyTenant,
  protect,
  deleteLectureFromTimeTable
);

module.exports = router;
