const express = require("express");
const router = express.Router();
const {
  createNotification,
  getAllNotification,
  getNotificationById,
  deleteById,
  deleteAll,
  updateById,
  sendNotification,
  cleanupExpiredNotifications,
} = require("../controllers/notificationController");
const identifyTenant = require("../middleware/IdentificationMiddleware");
const { protect } = require("../middleware/authMiddleware");

router.post("/", identifyTenant, protect, createNotification);
router.get("/", identifyTenant, protect, getAllNotification);
router.get("/:id", identifyTenant, protect, getNotificationById);

router.delete("/", identifyTenant, protect, deleteAll);
router.put("/:id", identifyTenant, protect, updateById);
router.post("/sendNotification", identifyTenant, protect, sendNotification);
router.delete(
  "/cleanupExpiredNotifications",
  identifyTenant,
  protect,
  cleanupExpiredNotifications
);
router.delete("/:id", identifyTenant, protect, deleteById);

module.exports = router;
