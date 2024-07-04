const asyncHandler = require("express-async-handler");

const crudOperations = require("../utils/crudOperations");

const {
  getClassModel,
  getUserModel,
  getTeacherModel,
  getStudentModel,
  getSubjectModel,
} = require("../models");

const createClass = asyncHandler(async (req, res, next) => {
  const Class = getClassModel(req.schoolDb);

  const classOperations = crudOperations({
    mainModel: Class,
    populateModels: [],
  });

  classOperations.create(req, res, next);
});

const getAllClass = asyncHandler(async (req, res, next) => {
  const Class = getClassModel(req.schoolDb);
  const Teacher = getTeacherModel(req.schoolDb);
  const Student = getStudentModel(req.schoolDb);
  const Subject = getSubjectModel(req.schoolDb);
  const User = getUserModel(req.usersDb);

  const classOperations = crudOperations({
    mainModel: Class,
    populateModels: [
      {
        field: "classTeacher",
        model: Teacher,
        select: "user",
        populateFields: [
          {
            field: "user",
            model: User,
            select: "name",
          },
        ],
      },
      {
        field: "students",
        model: Student,
        populateFields: [
          {
            field: "user",
            model: User,
            select: "name",
          },
        ],
      },
      {
        field: "subjects",
        model: Subject,
        select: "name code teachers",
        populateFields: [
          {
            field: "teachers",
            model: Teacher,
            select: "user",
            populateFields: [
              {
                field: "user",
                model: User,
                select: "name",
              },
            ],
          },
        ],
      },
    ],
  });

  classOperations.getAll(req, res, next);
});

const getById = asyncHandler(async (req, res, next) => {
  const Class = getClassModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const Student = getStudentModel(req.schoolDb);
  const Teacher = getTeacherModel(req.schoolDb);
  const classOperations = crudOperations({
    mainModel: Class,
    populateModels: [
      {
        field: "classTeacher",
        model: Teacher,
        // select: "user",
        populateFields: [
          {
            field: "user",
            model: User,
            select: "name",
          },
        ],
      },
      {
        field: "students",
        model: Student,
        populateFields: [
          {
            field: "user",
            model: User,
            // select: "name",
          },
        ],
      },
    ],
  });

  classOperations.getById(req, res, next);
});

const deleteById = asyncHandler(async (req, res, next) => {
  const Class = getClassModel(req.schoolDb);

  const classOperations = crudOperations({
    mainModel: Class,
    populateModels: [],
  });

  classOperations.deleteById(req, res, next);
});

const deleteAllId = asyncHandler(async (req, res, next) => {
  const Class = getClassModel(req.schoolDb);

  const classOperations = crudOperations({
    mainModel: Class,
    populateModels: [],
  });

  classOperations.deleteAll(req, res, next);
});

const updateById = asyncHandler(async (req, res, next) => {
  const Class = getClassModel(req.schoolDb);

  const classOperations = crudOperations({
    mainModel: Class,
    populateModels: [],
  });

  classOperations.updateById(req, res, next);
});

module.exports = {
  createClass,
  getAllClass,
  getById,
  deleteById,
  deleteAllId,
  updateById,
};
