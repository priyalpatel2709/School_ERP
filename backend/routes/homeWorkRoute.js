const express = require("express");
const {
  createHomeWork,
  getAllHomeWork,
  getHomeWorkById,
  deleteById,
  deleteAll,
  updateById,
  submitHomework,
  gradeHomework,
} = require("../controllers/homeWorkController");
const identifyTenant = require("../middleware/IdentificationMiddleware");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
//curt oration
router.post("/", identifyTenant, protect, createHomeWork);
router.get("/", identifyTenant, protect, getAllHomeWork);
router.get("/:id", identifyTenant, protect, getHomeWorkById);
router.delete("/:id", identifyTenant, protect, deleteById);
router.delete("/", identifyTenant, protect, deleteAll);
router.put("/:id", identifyTenant, protect, updateById);

//submit by student
router.post("/submit", identifyTenant, protect, submitHomework);
router.post("/grade", identifyTenant, protect, gradeHomework);

module.exports = router;
