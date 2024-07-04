const asyncHandler = require("express-async-handler");
const {
  getTeacherModel,
  getUserModel,
  getClassModel,
  getRoleModel,
} = require("../models");
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

const createTeacherWithUser = asyncHandler(async (req, res, next) => {
  const Teacher = getTeacherModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const Role = getRoleModel(req.schoolDb);

  const { classes, leaves, salary, subjects, user, calendar } = req.body;

  try {
    // Retrieve the student role
    let teacherRole = await Role.findOne({ roleName: "teacher" });

    // If the student role does not exist, create it
    if (!teacherRole) {
      teacherRole = new Role({
        roleName: "teacher",
        access: ["teacher", "student"],
      });
      teacherRole = await teacherRole.save();
    }
    // Create the new user with the Teacher role
    const newUser = new User({
      ...user,
      role: teacherRole._id,
    });
    const savedUser = await newUser.save();

    // Create the new student and associate it with the created user
    const newTeacher = new Teacher({
      classes,
      leaves,
      salary,
      subjects,
      calendar,
      user: savedUser._id,
    });

    const savedTeacher = await newTeacher.save();

    res.status(201).json(savedTeacher);
  } catch (err) {
    console.error("Error in createTeacherWithUser:", err); // Log the error for debugging
    next(
      createError(500, "Error creating student with user", {
        error: err.message,
      })
    );
  }
});

module.exports = {
  createTeacher,
  getAllTeacher,
  getTeacherById,
  updateTeacherById,
  deleteTeacherById,
  deleteAllTeacher,
  createTeacherWithUser,
};
