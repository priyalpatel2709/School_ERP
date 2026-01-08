const asyncHandler = require("express-async-handler");

const crudOperations = require("../utils/crudOperations");

const {
  getSubjectModel,
  getTeacherModel,
  getUserModel,
  getClassModel,
} = require("../models");

const createSubject = asyncHandler(async (req, res, next) => {
  const Subject = getSubjectModel(req.schoolDb);

  const subjectOperations = crudOperations({
    mainModel: Subject,
    populateModels: [],
  });

  subjectOperations.create(req, res, next);
});

const getAllSubject = asyncHandler(async (req, res, next) => {
  const Teacher = getTeacherModel(req.schoolDb);
  const Subject = getSubjectModel(req.schoolDb);
  const Class = getClassModel(req.schoolDb);
  const User = getUserModel(req.usersDb);

  const subjectOperations = crudOperations({
    mainModel: Subject,
    populateModels: [
      {
        field: "teachers",
        model: Teacher,
        select: "user classes subjects",
        populateFields: [
          {
            field: "user",
            model: User,
            select: "name",
          },
          {
            field: "classes",
            model: Class,
            select: "classNumber division",
          },
        ],
      },
    ],
  });

  subjectOperations.getAll(req, res, next);
});

const getSubjectById = asyncHandler(async (req, res, next) => {
  const Teacher = getTeacherModel(req.schoolDb);
  const Subject = getSubjectModel(req.schoolDb);
  const Class = getClassModel(req.schoolDb);
  const User = getUserModel(req.usersDb);

  const subjectOperations = crudOperations({
    mainModel: Subject,
    populateModels: [
      {
        field: "teachers",
        model: Teacher,
        populateFields: [
          {
            field: "user",
            model: User,
          },
          {
            field: "classes",
            model: Class,
          },
        ],
      },
    ],
  });

  subjectOperations.getById(req, res, next);
});

const updateSubject = asyncHandler(async (req, res, next) => {
  const Subject = getSubjectModel(req.schoolDb);

  const subjectOperations = crudOperations({
    mainModel: Subject,
    populateModels: [],
  });

  subjectOperations.updateById(req, res, next);
});

const deleteAllSubject = asyncHandler(async (req, res, next) => {
  const Subject = getSubjectModel(req.schoolDb);

  const subjectOperations = crudOperations({
    mainModel: Subject,
    populateModels: [],
  });

  subjectOperations.deleteAll(req, res, next);
});

const deleteSubjectById = asyncHandler(async (req, res, next) => {
  const Subject = getSubjectModel(req.schoolDb);

  const subjectOperations = crudOperations({
    mainModel: Subject,
    populateModels: [],
  });

  subjectOperations.deleteById(req, res, next);
});
module.exports = {
  createSubject,
  getAllSubject,
  getSubjectById,
  updateSubject,
  deleteAllSubject,
  deleteSubjectById,
};
