const asyncHandler = require("express-async-handler");
const {
  getTeacherModel,
  getUserModel,
  getClassModel,
  getRoleModel,
  getSubjectModel,
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
  const Subject = getSubjectModel(req.schoolDb);

  const teacherOperations = crudOperations({
    mainModel: Teacher,
    populateModels: [
      {
        field: "user",
        model: User,
        select: "name",
      },
      {
        field: "classes",
        model: Class,
      },
      {
        field: "subjects",
        model: Subject,
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

  try {
    // Retrieve the teacher role
    let teacherRole = await Role.findOne({ roleName: "teacher" });

    // If the teacher role does not exist, create it
    if (!teacherRole) {
      teacherRole = new Role({
        roleName: "teacher",
        access: ["teacher", "student"],
      });
      teacherRole = await teacherRole.save();
    }

    // Extract user data and other teacher-related data from the request body
    const { user, ...teacherData } = req.body;

    // Create the new user with the teacher role
    const newUser = new User({
      ...user,
      role: teacherRole._id,
    });
    const savedUser = await newUser.save();

    // Create the new teacher and associate it with the created user
    const newTeacher = new Teacher({
      ...teacherData,
      user: savedUser._id,
    });

    const savedTeacher = await newTeacher.save();

    res.status(201).json(savedTeacher);
  } catch (err) {
    console.error("Error in createTeacherWithUser:", err); // Log the error for debugging
    next(
      createError(500, "Error creating teacher with user", {
        error: err.message,
      })
    );
  }
});

const searchTeacher = asyncHandler(async (req, res, next) => {
  const Teacher = getTeacherModel(req.schoolDb);
  const User = getUserModel(req.usersDb);

  try {
    // Find the user by name
    const user = await User.findOne({ name: req.query.name });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the teacher by user ID
    const teacher = await Teacher.findOne({ user: user._id });
    // .populate("user");
    // .populate("classes")
    // .populate("calendar")
    // .populate("subjects")
    // .lean();

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json(teacher);
  } catch (error) {
    console.log("File: teacherController.js", "Line 183:", error);
    next(createError(500, "Error fetching homework", { error: error.message }));
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
  searchTeacher,
};
