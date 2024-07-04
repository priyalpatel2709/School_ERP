const asyncHandler = require("express-async-handler");
const { getStudentModel, getUserModel, getRoleModel } = require("../models");
const crudOperations = require("../utils/crudOperations");
const mongoose = require("mongoose");

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

// Create a student along with a new user
const createStudentWithUser = asyncHandler(async (req, res, next) => {
  const Student = getStudentModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const Role = getRoleModel(req.schoolDb);

  const { roleNumber, classId, calendarId, studentImage, user } = req.body;

  try {
    // Retrieve the student role
    let studentRole = await Role.findOne({ roleName: "student" });

    // If the student role does not exist, create it
    if (!studentRole) {
      studentRole = new Role({ roleName: "student", access: ["student"] });
      studentRole = await studentRole.save();
    }

    // Create the new user with the student role
    const newUser = new User({
      ...user,
      role: studentRole._id,
    });
    const savedUser = await newUser.save();

    // Create the new student and associate it with the created user
    const newStudent = new Student({
      roleNumber,
      class: classId,
      calendar: calendarId,
      studentImage,
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
