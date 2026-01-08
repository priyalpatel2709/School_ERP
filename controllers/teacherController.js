const asyncHandler = require("express-async-handler");
const {
  getTeacherModel,
  getUserModel,
  getClassModel,
  getRoleModel,
  getSubjectModel,
  getTimeTableModel,
  getStudentModel,
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
  const Student = getStudentModel(req.schoolDb);

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
        populateFields: [
          {
            field: "students",
            model: Student,
            select: "roleNumber user",
            populateFields: [
              {
                field: "user",
                model: User,
                select: "name email",
              },
            ],
          },

          {
            field: "subjects",
            model: Subject,
            select: "name code type",
          },
        ],
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
  const Student = getStudentModel(req.schoolDb);
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
        populateFields: [
          {
            field: "students",
            model: Student,
            select: "roleNumber user",
            populateFields: [
              {
                field: "user",
                model: User,
                select: "name email",
              },
            ],
          },

          {
            field: "subjects",
            model: Subject,
            select: "name code type",
          },
        ],
      },
      {
        field: "subjects",
        model: Subject,
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

  try {
    // Extract user data and other teacher-related data from the request body
    const { user, ...teacherData } = req.body;

    // Create the new user with the teacher role
    const newUser = new User({
      ...user,
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

const getTimeTableByTeacherId = asyncHandler(async (req, res, next) => {
  const TimeTable = getTimeTableModel(req.schoolDb);

  const Subject = getSubjectModel(req.schoolDb);

  const teacherId = req.params.teacherId;

  try {
    const timeTables = await TimeTable.find({
      $or: [
        { "week.Monday.teacher": teacherId },
        { "week.Tuesday.teacher": teacherId },
        { "week.Wednesday.teacher": teacherId },
        { "week.Thursday.teacher": teacherId },
        { "week.Friday.teacher": teacherId },
        { "week.Saturday.teacher": teacherId },
        { "week.Sunday.teacher": teacherId },
      ],
    }).populate({
      path: "week",
      populate: [
        {
          path: "Monday.subject Tuesday.subject Wednesday.subject Thursday.subject Friday.subject Saturday.subject Sunday.subject",
          model: Subject,
          select: "name code",
        },
      ],
    });

    // Collect all lectures for the given teacher ID
    const teacherLectures = [];

    timeTables.forEach((timeTable) => {
      for (const [day, lectures] of Object.entries(timeTable.week)) {
        lectures.forEach((lecture) => {
          if (lecture.teacher && lecture.teacher._id.toString() === teacherId) {
            teacherLectures.push({
              day,
              subject: lecture.subject,
              teacher: lecture.teacher,
              startTime: lecture.startTime,
              endTime: lecture.endTime,
              isBreak: lecture.isBreak,
              classRoom: lecture.classRoom,
              lectureNumber: lecture.lectureNumber,
              metaData: lecture.metaData,
            });
          }
        });
      }
    });

    res.status(200).json({ teacherLectures });
  } catch (error) {
    console.error("Error fetching time table by teacher ID:", error);
    next(error);
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
  getTimeTableByTeacherId,
};
