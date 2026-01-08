const asyncHandler = require("express-async-handler");
const {
  getStudentModel,
  getUserModel,

  getClassModel,
  getTeacherModel,
} = require("../models");
const crudOperations = require("../utils/crudOperations");
const mongoose = require("mongoose");

//create new Student
const createStudent = asyncHandler(async (req, res, next) => {
  const Student = getStudentModel(req.schoolDb);
  const User = getUserModel(req.schoolDb);
  const studentOperations = crudOperations({
    mainModel: Student,
    populateModels: [{ field: "user", model: User, populateModels: [] }],
  });
  studentOperations.create(req, res, next);
});

const getAllStudent = asyncHandler(async (req, res, next) => {
  const User = getUserModel(req.usersDb);
  const Student = getStudentModel(req.schoolDb);
  const Class = getClassModel(req.schoolDb);

  const studentOperations = crudOperations({
    mainModel: Student,
    populateModels: [
      {
        field: "user",
        model: User,
      },
      {
        field: "class",
        model: Class,
        select: "classNumber division",
      },
    ],
  });
  studentOperations.getAll(req, res, next);
});

const getStudentById = asyncHandler(async (req, res, next) => {
  const Student = getStudentModel(req.schoolDb);
  const Class = getClassModel(req.schoolDb);
  const Teacher = getTeacherModel(req.schoolDb);
  const User = getUserModel(req.usersDb);

  const studentOperations = crudOperations({
    mainModel: Student,
    populateModels: [
      {
        field: "user",
        model: User,
      },
      {
        field: "class",
        model: Class,
        populateFields: [
          {
            field: "classTeacher",
            model: Teacher,
            select: "user",
            populateFields: [{ field: "user", model: User, select: "name" }],
          },
        ],
      },
    ],
  });
  studentOperations.getById(req, res, next);
});

const updateStudent = asyncHandler(async (req, res, next) => {
  const Student = getStudentModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const studentOperations = crudOperations({
    mainModel: Student,
  });
  studentOperations.updateById(req, res, next);
});

const deleteAllStudent = asyncHandler(async (req, res, next) => {
  const Student = getStudentModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const studentOperations = crudOperations({
    mainModel: Student,
  });
  studentOperations.deleteAll(req, res, next);
});

const deleteByStudentId = asyncHandler(async (req, res, next) => {
  const Student = getStudentModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const studentOperations = crudOperations({
    mainModel: Student,
  });
  studentOperations.deleteById(req, res, next);
});

// Create a student along with a new user
const createStudentWithUser = asyncHandler(async (req, res, next) => {
  const Student = getStudentModel(req.schoolDb);
  const User = getUserModel(req.usersDb);

  try {
    // Extract user data from the request body
    const { user, ...studentData } = req.body;

    // Create the new user with the student role
    const newUser = new User({
      ...user,
    });
    const savedUser = await newUser.save();

    // Create the new student and associate it with the created user
    const newStudent = new Student({
      ...studentData,
      user: savedUser._id,
    });

    const savedStudent = await newStudent.save();

    res.status(201).json(savedStudent);
  } catch (err) {
    console.error("Error in createStudentWithUser:", err); // Log the error for debugging
    next(
      createError(500, "Error creating student with user", {
        error: err.message,
      })
    );
  }
});

module.exports = {
  createStudent,
  getAllStudent,
  updateStudent,
  deleteAllStudent,
  deleteByStudentId,
  getStudentById,
  createStudentWithUser,
};
