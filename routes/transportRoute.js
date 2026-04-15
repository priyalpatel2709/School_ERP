const express = require("express");
const router = express.Router();
const identifyTenant = require("../middleware/IdentificationMiddleware");
const { protect } = require("../middleware/authMiddleware");
const {
  createBusRoute,
  listBusRoutes,
  getBusRouteById,
  updateBusRoute,
  deleteBusRoute,
  createVehicle,
  listVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/transportController");

router.post("/bus-routes", identifyTenant, protect, createBusRoute);
router.get("/bus-routes", identifyTenant, protect, listBusRoutes);
router.get("/bus-routes/:id", identifyTenant, protect, getBusRouteById);
router.put("/bus-routes/:id", identifyTenant, protect, updateBusRoute);
router.delete("/bus-routes/:id", identifyTenant, protect, deleteBusRoute);

router.post("/vehicles", identifyTenant, protect, createVehicle);
router.get("/vehicles", identifyTenant, protect, listVehicles);
router.get("/vehicles/:id", identifyTenant, protect, getVehicleById);
router.put("/vehicles/:id", identifyTenant, protect, updateVehicle);
router.delete("/vehicles/:id", identifyTenant, protect, deleteVehicle);

module.exports = router;
