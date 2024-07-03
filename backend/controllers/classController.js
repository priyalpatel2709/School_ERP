const asyncHandler = require("express-async-handler");
const getClassModel = require("../models/classModel");
const getUserModel = require("../models/userModel");
const crudOperations = require("../utils/crudOperations");
const getRoleModel = require("../models/roleModel");

const createClass = asyncHandler(async (req, res, next) => {
  const Class = getClassModel(req.schoolDb);
  // Initialize CRUD operations for the Class model
  const classOperations = crudOperations({
    mainModel: Class,
    populateModels: [], 
  });

  // Call the create method from crudOperations
  classOperations.create(req, res, next);
});

const getAllClass = asyncHandler(async (req, res, next) => {
  const Class = getClassModel(req.schoolDb);
  const User = getUserModel(req.usersDb);

  const classOperations = crudOperations({
    mainModel: Class,
    populateModels: [
      {
        field: "classTeacher",
        model: User,
        populateFields: [],
      },
      {
        field: "students",
        model: User,
        populateFields: [],
      },
    ],
  });

  // Call the create method from crudOperations
  classOperations.getAll(req, res, next);
});

const getById = asyncHandler(async (req, res, next) => {
  const Class = getClassModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const roleOperations = crudOperations({
    mainModel: Class,
    populateModels: [
      {
        field: "classTeacher",
        model: User,
        populateFields: [],
      },
      {
        field: "students",
        model: User,
        populateFields: [],
      },
    ],
  });

  roleOperations.getById(req, res, next);
});

const deleteById = asyncHandler(async (req, res, next) => {
  const Class = getClassModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const roleOperations = crudOperations({
    mainModel: Class,
    populateModels: [
      {
        field: "classTeacher",
        model: User,
        populateFields: [],
      },
      {
        field: "students",
        model: User,
        populateFields: [],
      },
    ],
  });

  roleOperations.deleteById(req, res, next);
});

const deleteAllId = asyncHandler(async (req, res, next) => {
  const Class = getClassModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const roleOperations = crudOperations({
    mainModel: Class,
    populateModels: [
      {
        field: "classTeacher",
        model: User,
        populateFields: [],
      },
      {
        field: "students",
        model: User,
        populateFields: [],
      },
    ],
  });

  roleOperations.deleteAll(req, res, next);
});

const updateById = asyncHandler(async (req, res, next) => {
  const Class = getClassModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const roleOperations = crudOperations({
    mainModel: Class,
    populateModels: [
      {
        field: "classTeacher",
        model: User,
        populateFields: [],
      },
      {
        field: "students",
        model: User,
        populateFields: [],
      },
    ],
  });

  roleOperations.updateById(req, res, next);
});

module.exports = {
  createClass,
  getAllClass,
  getById,
  deleteById,
  deleteAllId,
  updateById,
};
