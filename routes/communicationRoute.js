const express = require("express");
const router = express.Router();
const identifyTenant = require("../middleware/IdentificationMiddleware");
const { protect } = require("../middleware/authMiddleware");
const {
  postSendEmail,
  postSendSms,
  postFeeReminderForStudent,
  postAbsenceAlert,
} = require("../controllers/communicationController");

router.post("/email", identifyTenant, protect, postSendEmail);
router.post("/sms", identifyTenant, protect, postSendSms);
router.post("/fee-reminder", identifyTenant, protect, postFeeReminderForStudent);
router.post("/absence-alert", identifyTenant, protect, postAbsenceAlert);

module.exports = router;
