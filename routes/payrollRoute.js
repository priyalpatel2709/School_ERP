const express = require("express");
const router = express.Router();
const identifyTenant = require("../middleware/IdentificationMiddleware");
const { protect } = require("../middleware/authMiddleware");
const {
  createPayrollRunDraft,
  listPayrollRuns,
  getPayrollRunById,
  finalizePayrollRun,
} = require("../controllers/payrollController");

router.post("/runs/draft", identifyTenant, protect, createPayrollRunDraft);
router.get("/runs", identifyTenant, protect, listPayrollRuns);
router.get("/runs/:id", identifyTenant, protect, getPayrollRunById);
router.post("/runs/:id/finalize", identifyTenant, protect, finalizePayrollRun);

module.exports = router;
