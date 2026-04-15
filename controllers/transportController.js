const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const {
  getTransportRouteModel,
  getTransportVehicleModel,
} = require("../models");

// --- Bus routes (roads) ---

const createBusRoute = asyncHandler(async (req, res, next) => {
  const Route = getTransportRouteModel(req.schoolDb);
  const row = new Route(req.body);
  await row.save();
  res.status(201).json(row);
});

const listBusRoutes = asyncHandler(async (req, res) => {
  const Route = getTransportRouteModel(req.schoolDb);
  const Vehicle = getTransportVehicleModel(req.schoolDb);
  const { academicYear } = req.query;
  const q = academicYear ? { academicYear } : {};
  const rows = await Route.find(q).populate("assignedVehicle");
  res.json({ success: true, data: rows });
});

const getBusRouteById = asyncHandler(async (req, res, next) => {
  const Route = getTransportRouteModel(req.schoolDb);
  const row = await Route.findById(req.params.id).populate("assignedVehicle");
  if (!row) return next(createError(404, "Not found"));
  res.json(row);
});

const updateBusRoute = asyncHandler(async (req, res, next) => {
  const Route = getTransportRouteModel(req.schoolDb);
  const row = await Route.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!row) return next(createError(404, "Not found"));
  res.json(row);
});

const deleteBusRoute = asyncHandler(async (req, res, next) => {
  const Route = getTransportRouteModel(req.schoolDb);
  const row = await Route.findByIdAndDelete(req.params.id);
  if (!row) return next(createError(404, "Not found"));
  res.json({ success: true });
});

// --- Vehicles ---

const createVehicle = asyncHandler(async (req, res, next) => {
  const Vehicle = getTransportVehicleModel(req.schoolDb);
  const row = new Vehicle(req.body);
  await row.save();
  res.status(201).json(row);
});

const listVehicles = asyncHandler(async (req, res) => {
  const Vehicle = getTransportVehicleModel(req.schoolDb);
  const Route = getTransportRouteModel(req.schoolDb);
  const rows = await Vehicle.find({}).populate({ path: "route", model: Route });
  res.json({ success: true, data: rows });
});

const getVehicleById = asyncHandler(async (req, res, next) => {
  const Vehicle = getTransportVehicleModel(req.schoolDb);
  const Route = getTransportRouteModel(req.schoolDb);
  const row = await Vehicle.findById(req.params.id).populate({
    path: "route",
    model: Route,
  });
  if (!row) return next(createError(404, "Not found"));
  res.json(row);
});

const updateVehicle = asyncHandler(async (req, res, next) => {
  const Vehicle = getTransportVehicleModel(req.schoolDb);
  const row = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!row) return next(createError(404, "Not found"));
  res.json(row);
});

const deleteVehicle = asyncHandler(async (req, res, next) => {
  const Vehicle = getTransportVehicleModel(req.schoolDb);
  const row = await Vehicle.findByIdAndDelete(req.params.id);
  if (!row) return next(createError(404, "Not found"));
  res.json({ success: true });
});

module.exports = {
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
};
