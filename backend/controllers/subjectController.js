const asyncHandler = require("express-async-handler");
const crudOperations = require("../utils/crudOperations");
const {
  getSubjectModel,
  getTeacherModel,
  getUserModel,
  getClassModel,
} = require("../models");

const getSubjectOperations = (req, populateModels = []) => {
  const Subject = getSubjectModel(req.schoolDb);
  return crudOperations({ mainModel: Subject, populateModels });
};

const createSubject = asyncHandler(async (req, res, next) => {
  getSubjectOperations(req).create(req, res, next);
});

const getAllSubject = asyncHandler(async (req, res, next) => {
  const Teacher = getTeacherModel(req.schoolDb);
  const Class = getClassModel(req.schoolDb);
  const User = getUserModel(req.usersDb);

  const populateModels = [
    {
      field: "teachers",
      model: Teacher,
      select: "user classes subjects",
      populateFields: [
        { field: "user", model: User, select: "name" },
        { field: "classes", model: Class, select: "classNumber division" },
      ],
    },
  ];

  getSubjectOperations(req, populateModels).getAll(req, res, next);
});

const getSubjectById = asyncHandler(async (req, res, next) => {
  const Teacher = getTeacherModel(req.schoolDb);
  const Class = getClassModel(req.schoolDb);
  const User = getUserModel(req.usersDb);

  const populateModels = [
    {
      field: "teachers",
      model: Teacher,
      populateFields: [
        { field: "user", model: User },
        { field: "classes", model: Class },
      ],
    },
  ];

  getSubjectOperations(req, populateModels).getById(req, res, next);
});

const updateSubject = asyncHandler(async (req, res, next) => {
  getSubjectOperations(req).updateById(req, res, next);
});

const deleteAllSubject = asyncHandler(async (req, res, next) => {
  getSubjectOperations(req).deleteAll(req, res, next);
});

const deleteSubjectById = asyncHandler(async (req, res, next) => {
  getSubjectOperations(req).deleteById(req, res, next);
});

module.exports = {
  createSubject,
  getAllSubject,
  getSubjectById,
  updateSubject,
  deleteAllSubject,
  deleteSubjectById,
};
