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
  const Class = getClassModel(req.schoolDb);

  try {
    // Extract user and class data
    const { user, ...studentData } = req.body;
    const classIds = studentData.class || [];

    // 1. Capacity Check
    if (classIds.length > 0) {
      const classes = await Class.find({ _id: { $in: classIds } });
      for (const cls of classes) {
        if (cls.students.length >= cls.maxStudents) {
          return next(createError(400, `Class ${cls.classNumber}-${cls.division} is full (Max: ${cls.maxStudents})`));
        }
      }
    }

    // 2. Create the new user with the student role
    const newUser = new User({
      ...user,
    });
    const savedUser = await newUser.save();

    // 3. Create the new student and associate it with the created user
    const newStudent = new Student({
      ...studentData,
      user: savedUser._id,
    });

    const savedStudent = await newStudent.save();

    // 4. Update Classes to include this student
    if (classIds.length > 0) {
      await Class.updateMany(
        { _id: { $in: classIds } },
        { $push: { students: savedStudent._id } }
      );
    }

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

const linkSibling = asyncHandler(async (req, res, next) => {
  const Student = getStudentModel(req.schoolDb);
  const { studentId, siblingId } = req.body;

  if (studentId === siblingId) {
    return next(createError(400, "Cannot link student as their own sibling"));
  }

  try {
    const student = await Student.findById(studentId);
    const sibling = await Student.findById(siblingId);

    if (!student || !sibling) {
      return next(createError(404, "Student or Sibling not found"));
    }

    // Bi-directional linking
    // Add sibling to student
    if (!student.siblings.includes(siblingId)) {
      student.siblings.push(siblingId);
      await student.save();
    }

    // Add student to sibling (reverse)
    if (!sibling.siblings.includes(studentId)) {
      sibling.siblings.push(studentId);
      await sibling.save();
    }

    res.status(200).json({ message: "Siblings linked successfully", student });

  } catch (err) {
    next(createError(500, err.message));
  }
});

const createParentAccount = asyncHandler(async (req, res, next) => {
  const Student = getStudentModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const { studentId, guardianRelation, userData } = req.body; // userData = { name, email, password... }

  try {
    const student = await Student.findById(studentId);
    if (!student) return next(createError(404, "Student not found"));

    const guardianIndex = student.guardianInfo.findIndex(g => g.relation === guardianRelation);
    if (guardianIndex === -1) {
      return next(createError(404, `Guardian (${guardianRelation}) not found in student profile`));
    }

    // Create User
    const newUser = new User({ ...userData, roleName: "Parent" });
    const savedUser = await newUser.save();

    // Link to Student
    student.guardianInfo[guardianIndex].user = savedUser._id;
    await student.save();

    res.status(201).json({ message: "Parent account created", user: savedUser });

  } catch (err) {
    next(createError(500, err.message));
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
  linkSibling,
  createParentAccount
};
