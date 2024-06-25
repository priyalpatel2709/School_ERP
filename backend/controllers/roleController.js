const asyncHandler = require("express-async-handler"); // Ensure asyncHandler is required
const getRoleModel = require("../models/roleModel");
const crudOperations = require("../utils/crudOperations");

//create new role
const createRole = asyncHandler(async (req, res, next) => {
  const Role = getRoleModel(req.db);
  const roleOperations = crudOperations(Role);
  roleOperations.create(req, res, next);
});

const getAllRoles = asyncHandler(async (req, res, next) => {
  const Role = getRoleModel(req.db);
  const roleOperations = crudOperations(Role);
  roleOperations.getAll(req, res, next);
});

const getById = asyncHandler(async (req, res, next) => {
  const Role = getRoleModel(req.db);
  const roleOperations = crudOperations(Role);
  roleOperations.getById(req, res, next);
});

const deleteById = asyncHandler(async (req, res, next) => {
  const Role = getRoleModel(req.db);
  const roleOperations = crudOperations(Role);
  roleOperations.deleteById(req, res, next);
});

const deleteAllId = asyncHandler(async (req, res, next) => {
  const Role = getRoleModel(req.db);
  const roleOperations = crudOperations(Role);
  roleOperations.deleteAll(req, res, next);
});

const updateById = asyncHandler(async (req, res, next) => {
  const Role = getRoleModel(req.db);
  const roleOperations = crudOperations(Role);
  roleOperations.updateById(req, res, next);
});

module.exports = {
  createRole,
  getAllRoles,
  getById,
  deleteById,
  deleteAllId,
  updateById,
};
