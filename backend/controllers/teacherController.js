const asyncHandler = require("express-async-handler");
const { getTeacherModel, getUserModel, getClassModel } = require("../models");
const crudOperations = require("../utils/crudOperations");

const createTeacher = asyncHandler(async (req, res, next) => {
  const Teacher = getTeacherModel(req.schoolDb);
  // Initialize CRUD operations for the Class model
  const teacherOperations = crudOperations({
    mainModel: Teacher,
    populateModels: [],
  });

  // Call the create method from crudOperations
  teacherOperations.create(req, res, next);
});

const getAllTeacher = asyncHandler(async (req, res, next) => {
  const Teacher = getTeacherModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const Class = getClassModel(req.schoolDb);
  // Initialize CRUD operations for the Class model
  const teacherOperations = crudOperations({
    mainModel: Teacher,
    populateModels: [
      {
        field: "user",
        model: User,
        select: "name",
        populateFields: [],
      },
      {
        field: "classes",
        model: Class,
        populateFields: [],
      },
    ],
  });

  // Call the create method from crudOperations
  teacherOperations.getAll(req, res, next);
});

module.exports = {
  createTeacher,
  getAllTeacher,
};
