const asyncHandler = require("express-async-handler"); // Ensure asyncHandler is required
const crudOperations = require("../utils/crudOperations");
const { getRoleModel } = require("../models");

//create new role
const createRole = asyncHandler(async (req, res, next) => {
  const Role = getRoleModel(req.schoolDb);
  const roleOperations = crudOperations({
    mainModel: Role,
    populateModels: [],
  });
  roleOperations.create(req, res, next);
});

const getAllRoles = asyncHandler(async (req, res, next) => {
  const Role = getRoleModel(req.schoolDb);
  const roleOperations = crudOperations({
    mainModel: Role,
    populateModels: [],
  });

  roleOperations.getAll(req, res, next);
});

const getById = asyncHandler(async (req, res, next) => {
  const Role = getRoleModel(req.schoolDb);
  const roleOperations = crudOperations({
    mainModel: Role,
    populateModels: [],
  });

  roleOperations.getById(req, res, next);
});

const deleteById = asyncHandler(async (req, res, next) => {
  const Role = getRoleModel(req.schoolDb);
  const roleOperations = crudOperations({
    mainModel: Role,
    populateModels: [],
  });

  roleOperations.deleteById(req, res, next);
});

const deleteAllId = asyncHandler(async (req, res, next) => {
  const Role = getRoleModel(req.schoolDb);
  const roleOperations = crudOperations({
    mainModel: Role,
    populateModels: [],
  });

  roleOperations.deleteAll(req, res, next);
});

const updateById = asyncHandler(async (req, res, next) => {
  const Role = getRoleModel(req.schoolDb);
  const roleOperations = crudOperations({
    mainModel: Role,
    populateModels: [],
  });

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
