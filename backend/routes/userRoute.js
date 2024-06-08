const express = require("express");
const router = express.Router();
const { authUser, registerUser } = require("../controllers/userController");
const identifyTenant = require("../middleware/IdentificationMiddleware");

router.post("/login", identifyTenant, authUser);
router.post("/", identifyTenant, registerUser);

module.exports = router;
