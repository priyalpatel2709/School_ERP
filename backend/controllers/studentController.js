const asyncHandler = require("express-async-handler");
const { getStudentModel, getUserModel, getRoleModel } = require("../models");
const crudOperations = require("../utils/crudOperations");

//create new Student
const createStudent = asyncHandler(async (req, res, next) => {
  //   const Role = getRoleModel(req.schoolDb);
  const Student = getStudentModel(req.schoolDb);
  const User = getUserModel(req.schoolDb);
  const roleOperations = crudOperations({
    mainModel: Student,
    populateModels: [{ field: "user", model: User, populateModels: [] }],
  });
  roleOperations.create(req, res, next);
});

const getAllStudent = asyncHandler(async (req, res, next) => {
  const User = getUserModel(req.usersDb);
  const School = getStudentModel(req.schoolDb);
  const Role = getRoleModel(req.schoolDb);

  const roleOperations = crudOperations({
    mainModel: School,
    populateModels: [
      {
        field: "user",
        model: User,
        populateFields: [
          {
            field: "role",
            model: Role,
          },
        ],
      },
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
      {
        field: "user",
        model: User,
        populateFields: [
          {
            field: "role",
            model: Role,
          },
        ],
      },
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
      {
        field: "user",
        model: User,
        populateFields: [
          {
            field: "role",
            model: Role,
          },
        ],
      },
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
      {
        field: "user",
        model: User,
        populateFields: [
          {
            field: "role",
            model: Role,
          },
        ],
      },
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
      {
        field: "user",
        model: User,
        populateFields: [
          {
            field: "role",
            model: Role,
          },
        ],
      },
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
