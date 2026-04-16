const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const {
  getStudentModel,
  getUserModel,

  getClassModel,
  getTeacherModel,
  getSubjectModel,
  getTimeTableModel,
} = require("../models");
const crudOperations = require("../utils/crudOperations");
const { timeTablePopulateModel } = require("../utils/miscellaneousFunctions");
const { storedSchoolIdForActiveTenant } = require("../utils/schoolAccess");
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
          return next(
            createError(
              400,
              `Class ${cls.classNumber}-${cls.division} is full (Max: ${cls.maxStudents})`,
            ),
          );
        }
      }
    }

    const schoolIDForUser = storedSchoolIdForActiveTenant(req.user, req.tenantId);
    if (!schoolIDForUser) {
      return next(createError(400, "Could not resolve school ID for new user"));
    }

    // 2. Create the new user with the student role
    const newUser = new User({
      ...user,
      schoolID: schoolIDForUser,
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
        { $push: { students: savedStudent._id } },
      );
    }

    res.status(201).json(savedStudent);
  } catch (err) {
    console.error("Error in createStudentWithUser:", err); // Log the error for debugging
    next(
      createError(500, "Error creating student with user", {
        error: err.message,
      }),
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
  const { studentId, guardianRelation, userData, guardianData } = req.body;
  // userData = { name, email, password, phone, address... }
  // guardianData (optional) = { name, email, phone, occupation, address, isPrimaryContact }

  try {
    // Validate required fields
    if (!studentId || !guardianRelation || !userData) {
      return next(
        createError(
          400,
          "Missing required fields: studentId, guardianRelation, and userData are required",
        ),
      );
    }

    if (!userData.name || !userData.email) {
      return next(
        createError(400, "userData must contain at least name and email"),
      );
    }

    // Validate guardianRelation
    const validRelations = ["Father", "Mother", "Guardian"];
    if (!validRelations.includes(guardianRelation)) {
      return next(
        createError(
          400,
          `Invalid guardianRelation. Must be one of: ${validRelations.join(", ")}`,
        ),
      );
    }

    // Find the student
    const student = await Student.findById(studentId);
    if (!student) {
      return next(createError(404, "Student not found"));
    }

    // Find or create the guardian in student's guardianInfo
    let guardianIndex = student.guardianInfo.findIndex(
      (g) => g.relation === guardianRelation,
    );

    if (guardianIndex === -1) {
      // Guardian doesn't exist - create it automatically
      console.log(
        `Guardian with relation '${guardianRelation}' not found. Creating new guardian entry...`,
      );

      // Use guardianData if provided, otherwise use userData
      const newGuardianData = guardianData || {
        name: userData.name,
        email: userData.email,
        phone: userData.phone || "",
        occupation: userData.occupation || "",
        address: userData.address || "",
        isPrimaryContact: student.guardianInfo.length === 0, // First guardian is primary
      };

      student.guardianInfo.push({
        relation: guardianRelation,
        ...newGuardianData,
      });

      console.log("student ", student);

      await student.save();

      // Get the index of the newly added guardian
      guardianIndex = student.guardianInfo.length - 1;
    }

    // Check if guardian already has a user account
    if (student.guardianInfo[guardianIndex].user) {
      return next(
        createError(
          400,
          `Guardian (${guardianRelation}) already has a user account linked`,
        ),
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return next(createError(400, "A user with this email already exists"));
    }

    const schoolIDForUser = storedSchoolIdForActiveTenant(req.user, req.tenantId);
    if (!schoolIDForUser) {
      return next(createError(400, "Could not resolve school ID for new user"));
    }

    // Create User with Parent role and schoolID
    const newUser = new User({
      ...userData,
      roleName: "Parent",
      loginID: userData.email,
      schoolID: schoolIDForUser,
    });
    const savedUser = await newUser.save();

    // Link the user to the guardian in student profile
    student.guardianInfo[guardianIndex].user = savedUser._id;

    // Update guardian info with user data if not already set
    if (!student.guardianInfo[guardianIndex].email) {
      student.guardianInfo[guardianIndex].email = userData.email;
    }
    if (!student.guardianInfo[guardianIndex].phone && userData.phone) {
      student.guardianInfo[guardianIndex].phone = userData.phone;
    }

    await student.save();

    // Populate the saved user for response
    const populatedStudent = await Student.findById(studentId).populate({
      path: "guardianInfo.user",
      model: User,
      select: "-password", // Exclude password from response
    });

    res.status(201).json({
      message: "Parent account created successfully",
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        roleName: savedUser.roleName,
        schoolID: savedUser.schoolID,
      },
      student: {
        _id: populatedStudent._id,
        guardianInfo: populatedStudent.guardianInfo,
      },
    });
  } catch (err) {
    console.error("Error in createParentAccount:", err);
    // Handle mongoose validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return next(createError(400, `Validation Error: ${messages.join(", ")}`));
    }
    next(createError(500, `Error creating parent account: ${err.message}`));
  }
});

const getTimeTableByStudentId = asyncHandler(async (req, res, next) => {
  const Student = getStudentModel(req.schoolDb);
  const TimeTable = getTimeTableModel(req.schoolDb);
  const Teacher = getTeacherModel(req.schoolDb);
  const Subject = getSubjectModel(req.schoolDb);
  const Class = getClassModel(req.schoolDb);
  const User = getUserModel(req.usersDb);

  try {
    // 1. Find the student profile using the logged-in User's ID (req.user._id)
    const student = await Student.findOne({ user: req.user._id }).populate(
      "class",
    );

    if (!student) {
      return next(
        createError(404, "Student profile not found for the logged-in user"),
      );
    }

    // 2. Get the classes assigned to this student
    const classIds = student.class.map((c) => c._id);

    // 3. Find and populate time tables for those classes
    let query = TimeTable.findOne({ class: classIds }).populate({
      path: "class",
      model: Class,
      select: "classNumber division academicYear",
    });

    // Manually apply the population for each day of the week since timeTablePopulateModel
    // returns an array intended for the crudOperations helper.
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    days.forEach((day) => {
      query = query
        .populate({
          path: `week.${day}.subject`,
          model: Subject,
          select: "name code",
        })
        .populate({
          path: `week.${day}.teacher`,
          model: Teacher,
          select: "user",
          populate: {
            path: "user",
            model: User,
            select: "name",
          },
        });
    });

    const timeTable = await query;

    res.status(200).json(timeTable);
  } catch (error) {
    console.error("Error fetching time table:", error);
    next(error);
  }
});

// Get guardian information for a student
const getStudentGuardianInfo = asyncHandler(async (req, res, next) => {
  const Student = getStudentModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const { id } = req.params;

  try {
    const student = await Student.findById(id).populate({
      path: "guardianInfo.user",
      model: User,
      select: "name email phone roleName",
    });

    if (!student) {
      return next(createError(404, "Student not found"));
    }

    res.status(200).json({
      studentId: student._id,
      guardianInfo: student.guardianInfo.map((g) => ({
        relation: g.relation,
        name: g.name,
        email: g.email,
        phone: g.phone,
        occupation: g.occupation,
        address: g.address,
        isPrimaryContact: g.isPrimaryContact,
        hasUserAccount: !!g.user,
        userAccount: g.user || null,
      })),
    });
  } catch (err) {
    console.error("Error fetching guardian info:", err);
    next(createError(500, `Error fetching guardian info: ${err.message}`));
  }
});

// Add or update guardian information for a student
const addOrUpdateGuardianInfo = asyncHandler(async (req, res, next) => {
  const Student = getStudentModel(req.schoolDb);
  const { studentId, guardianData } = req.body;
  // guardianData = { relation, name, email, phone, occupation, address, isPrimaryContact }

  try {
    if (!studentId || !guardianData) {
      return next(
        createError(
          400,
          "Missing required fields: studentId and guardianData are required",
        ),
      );
    }

    if (!guardianData.relation || !guardianData.name) {
      return next(
        createError(
          400,
          "guardianData must contain at least relation and name",
        ),
      );
    }

    const validRelations = ["Father", "Mother", "Guardian"];
    if (!validRelations.includes(guardianData.relation)) {
      return next(
        createError(
          400,
          `Invalid relation. Must be one of: ${validRelations.join(", ")}`,
        ),
      );
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return next(createError(404, "Student not found"));
    }

    // Check if guardian with this relation already exists
    const existingIndex = student.guardianInfo.findIndex(
      (g) => g.relation === guardianData.relation,
    );

    if (existingIndex !== -1) {
      // Update existing guardian
      student.guardianInfo[existingIndex] = {
        ...student.guardianInfo[existingIndex].toObject(),
        ...guardianData,
        // Preserve the user field if it exists
        user: student.guardianInfo[existingIndex].user,
      };
    } else {
      // Add new guardian
      student.guardianInfo.push(guardianData);
    }

    await student.save();

    res.status(200).json({
      message:
        existingIndex !== -1
          ? "Guardian information updated successfully"
          : "Guardian information added successfully",
      student: {
        _id: student._id,
        guardianInfo: student.guardianInfo,
      },
    });
  } catch (err) {
    console.error("Error adding/updating guardian info:", err);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return next(createError(400, `Validation Error: ${messages.join(", ")}`));
    }
    next(
      createError(500, `Error adding/updating guardian info: ${err.message}`),
    );
  }
});

// Get children (students) for a logged-in parent
const getMyChildren = asyncHandler(async (req, res, next) => {

  console.log('Does me ??');
  
  const Student = getStudentModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const Class = getClassModel(req.schoolDb);

  try {
    // Find all students where the logged-in user is listed as a guardian
    const students = await Student.find({
      "guardianInfo.user": req.user._id,
    })
      .populate({
        path: "user",
        model: User,
        select: "name email phone",
      })
      .populate({
        path: "class",
        model: Class,
        select: "classNumber division academicYear",
      })
      .populate({
        path: "guardianInfo.user",
        model: User,
        select: "name email phone roleName",
      });

    if (!students || students.length === 0) {
      return res.status(200).json({
        message: "No children found for this parent account",
        children: [],
      });
    }

    // Format the response to show which relation the parent has to each child
    const children = students.map((student) => {
      // Find the guardian entry that matches the logged-in user
      const guardianEntry = student.guardianInfo.find(
        (g) => g.user && g.user._id.toString() === req.user._id.toString(),
      );

      return {
        _id: student._id,
        studentInfo: {
          user: student.user,
          rollNumber: student.rollNumber,
          admissionNumber: student.admissionNumber,
          admissionDate: student.admissionDate,
          academicYear: student.academicYear,
          studentImage: student.studentImage,
        },
        classes: student.class,
        relationToParent: guardianEntry ? guardianEntry.relation : "Unknown",
        allGuardians: student.guardianInfo.map((g) => ({
          relation: g.relation,
          name: g.name,
          email: g.email,
          phone: g.phone,
          isPrimaryContact: g.isPrimaryContact,
          hasUserAccount: !!g.user,
        })),
        siblings: student.siblings,
      };
    });

    res.status(200).json({
      message: "Children retrieved successfully",
      parentInfo: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        roleName: req.user.roleName,
      },
      totalChildren: children.length,
      children: children,
    });
  } catch (err) {
    console.error("Error fetching parent's children:", err);
    next(createError(500, `Error fetching children: ${err.message}`));
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
  createParentAccount,
  getTimeTableByStudentId,
  getStudentGuardianInfo,
  addOrUpdateGuardianInfo,
  getMyChildren,
};
