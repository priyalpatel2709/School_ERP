const asyncHandler = require("express-async-handler");
const { getTeacherModel, getUserModel, getClassModel } = require("../models");
const crudOperations = require("../utils/crudOperations");

const createTeacher = asyncHandler(async (req, res, next) => {
  const Teacher = getTeacherModel(req.schoolDb);

  const teacherOperations = crudOperations({
    mainModel: Teacher,
    populateModels: [],
  });

  teacherOperations.create(req, res, next);
});

const getAllTeacher = asyncHandler(async (req, res, next) => {
  const Teacher = getTeacherModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const Class = getClassModel(req.schoolDb);

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

  teacherOperations.getAll(req, res, next);
});

const getTeacherById = asyncHandler(async (req, res, next) => {
  const Teacher = getTeacherModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const Class = getClassModel(req.schoolDb);

  const teacherOperations = crudOperations({
    mainModel: Teacher,
    populateModels: [
      {
        field: "user",
        model: User,
        select: "-password",
        populateFields: [],
      },
      {
        field: "classes",
        model: Class,
        populateFields: [],
      },
    ],
  });

  teacherOperations.getById(req, res, next);
});

const updateTeacherById = asyncHandler(async (req, res, next) => {
  const Teacher = getTeacherModel(req.schoolDb);

  const teacherOperations = crudOperations({
    mainModel: Teacher,
    populateModels: [],
  });

  teacherOperations.updateById(req, res, next);
});

const deleteAllTeacher = asyncHandler(async (req, res, next) => {
  const Teacher = getTeacherModel(req.schoolDb);

  const teacherOperations = crudOperations({
    mainModel: Teacher,
    populateModels: [],
  });

  teacherOperations.deleteAll(req, res, next);
});

const deleteTeacherById = asyncHandler(async (req, res, next) => {
  const Teacher = getTeacherModel(req.schoolDb);

  const teacherOperations = crudOperations({
    mainModel: Teacher,
    populateModels: [],
  });

  teacherOperations.deleteById(req, res, next);
});

module.exports = {
  createTeacher,
  getAllTeacher,
  getTeacherById,
  updateTeacherById,
  deleteTeacherById,
  deleteAllTeacher,
};
