const express = require("express");
const router = express.Router();
const identifyTenant = require("../middleware/IdentificationMiddleware");
const { protect } = require("../middleware/authMiddleware");

const {
  createTimeTable,
  getAllTimeTable,
  getTimeTableById,
  getTimeTableByClassId,
  deleteAllTimeTable,
  deleteTimeTableById,
  updateTimeTableById,
  deleteLectureFromTimeTable,
  getTimeTableConflicts,
  autoGenerateTimeTable,
} = require("../controllers/timeTableController");

router.post("/", identifyTenant, protect, createTimeTable);
router.get("/", identifyTenant, protect, getAllTimeTable);
router.get("/conflicts", identifyTenant, protect, getTimeTableConflicts);
router.post("/auto-generate", identifyTenant, protect, autoGenerateTimeTable);
router.get("/class/:classId", identifyTenant, protect, getTimeTableByClassId);
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
