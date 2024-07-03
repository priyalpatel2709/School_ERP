const asyncHandler = require("express-async-handler");
const getHomeworkModel = require("../models/homeWorkModel");
const getClassModel = require("../models/classModel");
const getStudentModel = require("../models/studentModel");
const getUserModel = require("../models/userModel");
const crudOperations = require("../utils/crudOperations");

const createHomeWork = asyncHandler(async (req, res, next) => {
  const HomeWork = getHomeworkModel(req.schoolDb);
  // Initialize CRUD operations for the Class model
  const HomeWorkOperations = crudOperations({
    mainModel: HomeWork,
    populateModels: [],
  });

  // Call the create method from crudOperations
  HomeWorkOperations.create(req, res, next);
});

const getAllHomeWork = asyncHandler(async (req, res, next) => {
  const HomeWork = getHomeworkModel(req.schoolDb);
  const Class = getClassModel(req.schoolDb);
  const Student = getStudentModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  // Initialize CRUD operations for the Class model
  const HomeWorkOperations = crudOperations({
    mainModel: HomeWork,
    populateModels: [
      {
        field: "assignedBy",
        model: User,
        select: "name",
        populateFields: [],
      },
      {
        field: "class",
        model: Class,
        select: "division classNumber",
        populateFields: [],
      },
      {
        field: "submissions.student",
        model: Student,
        select: "roleNumber",
        populateFields: [
          {
            field: "user",
            model: User,
            select: "name",
          },
        ],
      },
    ],
  });

  // Call the create method from crudOperations
  HomeWorkOperations.getAll(req, res, next);
});

const getHomeWorkById = asyncHandler(async (req, res, next) => {
  const HomeWork = getHomeworkModel(req.schoolDb);
  const Class = getClassModel(req.schoolDb);
  const Student = getStudentModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const HomeWorkOperations = crudOperations({
    mainModel: HomeWork,
    populateModels: [
      {
        field: "assignedBy",
        model: User,
        // select: "name",
        populateFields: [],
      },
      {
        field: "class",
        model: Class,
        // select: "division classNumber",
        populateFields: [],
      },
      {
        field: "submissions.student",
        model: Student,
        // select: "roleNumber",
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
  HomeWorkOperations.getById(req, res, next);
});

const deleteById = asyncHandler(async (req, res, next) => {
  const HomeWork = getHomeworkModel(req.schoolDb);
  const HomeWorkOperations = crudOperations({
    mainModel: HomeWork,
    populateModels: [],
  });

  HomeWorkOperations.deleteById(req, res, next);
});

const deleteAll = asyncHandler(async (req, res, next) => {
  const HomeWork = getHomeworkModel(req.schoolDb);
  const HomeWorkOperations = crudOperations({
    mainModel: HomeWork,
    populateModels: [],
  });

  HomeWorkOperations.deleteAll(req, res, next);
});

const updateById = asyncHandler(async (req, res, next) => {
  const HomeWork = getHomeworkModel(req.schoolDb);
  const HomeWorkOperations = crudOperations({
    mainModel: HomeWork,
    populateModels: [],
  });

  HomeWorkOperations.updateById(req, res, next);
});

const submitHomework = asyncHandler(async (req, res, next) => {
  const Homework = getHomeworkModel(req.schoolDb);
  const { homeworkId, studentId, fileUrl } = req.body;

  const homework = await Homework.findById(homeworkId);
  if (!homework) {
    return res.status(404).json({ message: "Homework not found" });
  }

  homework.submissions.push({
    student: studentId,
    submittedAt: new Date(),
    fileUrl,
  });

  const updatedHomework = await homework.save();
  res.status(200).json(updatedHomework);
});
const gradeHomework = asyncHandler(async (req, res, next) => {
  const Homework = getHomeworkModel(req.schoolDb);
  const { homeworkId, studentId, grade, feedback } = req.body;

  const homework = await Homework.findById(homeworkId);
  if (!homework) {
    return res.status(404).json({ message: "Homework not found" });
  }

  const submission = homework.submissions.find(
    (sub) => sub.student.toString() === studentId
  );

  if (!submission) {
    return res.status(404).json({ message: "Submission not found" });
  }

  submission.grade = grade;
  submission.feedback = feedback;

  const updatedHomework = await homework.save();
  res.status(200).json(updatedHomework);
});

module.exports = {
  createHomeWork,
  getAllHomeWork,
  getHomeWorkById,
  deleteById,
  deleteAll,
  updateById,
  submitHomework,
  gradeHomework
};
