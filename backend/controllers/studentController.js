const asyncHandler = require("express-async-handler"); // Ensure asyncHandler is required
const getStudentModel = require("../models/studentModel");
const getUserModel = require("../models/userModel");
const getRoleModel = require("../models/roleModel");
const crudOperations = require("../utils/crudOperations");

//create new Student
const createStudent = asyncHandler(async (req, res, next) => {
  //   const Role = getRoleModel(req.schoolDb);
  const Student = getStudentModel(req.schoolDb);
  const User = getUserModel(req.schoolDb);
  const roleOperations = crudOperations({
    mainModel: Student,
    populateModels: [{ field: "user", model: User }],
  });
  roleOperations.create(req, res, next);
});

const getAllStudent = asyncHandler(async (req, res, next) => {
  const Role = getRoleModel(req.schoolDb);
  const Student = getStudentModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const roleOperations = crudOperations({
    mainModel: Student,
    populateModels: [
      {
        field: "user", // Field in the document to populate (assuming 'user' is ObjectId reference)
        model: User, // Mongoose model to use for 'user' population
        populate: {
          // Optional: Populate configuration for 'user.role'
          path: "role", // Path to the nested field 'role' within 'user'
          model: Role, // Model of the referenced document (Role model)
        },
      },
      //   { field: "role", model: Role },
    ],
  });
  roleOperations.getAll(req, res, next);
});

const getStudentById = asyncHandler(async (req, res, next) => {
  const Role = getRoleModel(req.schoolDb);
  const Student = getStudentModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const roleOperations = crudOperations({
    mainModel: Student,
    populateModels: [
      { field: "user", model: User },
      { field: "role", model: Role },
    ],
  });
  roleOperations.getById(req, res, next);
});

const updateStudent = asyncHandler(async (req, res, next) => {
  const Role = getRoleModel(req.schoolDb);
  const Student = getStudentModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const roleOperations = crudOperations({
    mainModel: Student,
    populateModels: [
      { field: "user", model: User },
      { field: "role", model: Role },
    ],
  });
  roleOperations.updateById(req, res, next);
});

const deleteAllStudent = asyncHandler(async (req, res, next) => {
  const Role = getRoleModel(req.schoolDb);
  const Student = getStudentModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const roleOperations = crudOperations({
    mainModel: Student,
    populateModels: [
      { field: "user", model: User },
      { field: "role", model: Role },
    ],
  });
  roleOperations.deleteAll(req, res, next);
});

const deleteByStudentId = asyncHandler(async (req, res, next) => {
  const Role = getRoleModel(req.schoolDb);
  const Student = getStudentModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const roleOperations = crudOperations({
    mainModel: Student,
    populateModels: [
      { field: "user", model: User },
      { field: "role", model: Role },
    ],
  });
  roleOperations.deleteById(req, res, next);
});

module.exports = {
  createStudent,
  getAllStudent,
  updateStudent,
  deleteAllStudent,
  deleteByStudentId,
  getStudentById,
};
