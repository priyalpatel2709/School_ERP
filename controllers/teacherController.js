const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
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
      roleName: "Teacher",
      schoolID: req.user.schoolID,
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
      }),
    );
  }
});

const assignSubjects = asyncHandler(async (req, res, next) => {
  const Teacher = getTeacherModel(req.schoolDb);
  const Subject = getSubjectModel(req.schoolDb);
  const { teacherId, subjectIds } = req.body;

  try {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return next(createError(404, "Teacher not found"));

    if (teacher.employment.status !== "Active") {
      return next(
        createError(400, "Cannot assign subjects to inactive teacher"),
      );
    }

    // Validate subjects
    const subjects = await Subject.find({ _id: { $in: subjectIds } });
    if (subjects.length !== subjectIds.length) {
      return next(createError(400, "One or more subjects invalid"));
    }

    // Add without duplicates
    const uniqueIds = new Set(teacher.subjects.map((s) => s.toString()));
    subjectIds.forEach((id) => uniqueIds.add(id));

    teacher.subjects = Array.from(uniqueIds);
    await teacher.save();

    res.status(200).json({
      message: "Subjects assigned successfully",
      subjects: teacher.subjects,
    });
  } catch (err) {
    next(createError(500, err.message));
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
    next(createError(500, "Error fetching homework", { error: error.message }));
  }
});

const getTimeTableByTeacherId = asyncHandler(async (req, res, next) => {
  const TimeTable = getTimeTableModel(req.schoolDb);
  const Teacher = getTeacherModel(req.schoolDb);
  const Subject = getSubjectModel(req.schoolDb);

  let teacherId = req.params.teacherId;

  try {
    // Check if the provided ID is a User ID (by checking if a Teacher exists with this user ID)
    const teacherProfile = await Teacher.findOne({ user: teacherId });
    if (teacherProfile) {
      teacherId = teacherProfile._id.toString();
    }
    // If not found by user, assume it is already a Teacher ID (or invalid)

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
    })
      .populate({
        path: "class",
        model: getClassModel(req.schoolDb),
        select: "classNumber division academicYear",
      })
      .populate({
        path: "week.Monday.subject week.Tuesday.subject week.Wednesday.subject week.Thursday.subject week.Friday.subject week.Saturday.subject week.Sunday.subject",
        model: Subject,
        select: "name code",
      });

    // Collect all lectures for the given teacher ID
    const teacherLectures = [];

    timeTables.forEach((timeTable) => {
      for (const [day, lectures] of Object.entries(timeTable.week)) {
        if (!Array.isArray(lectures)) continue; // Skip non-day properties if any
        lectures.forEach((lecture) => {
          if (lecture.teacher && lecture.teacher.toString() === teacherId) {
            teacherLectures.push({
              day,
              class: timeTable.class,
              subject: lecture.subject,
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

const getTeacherByUserId = asyncHandler(async (req, res, next) => {
  const Teacher = getTeacherModel(req.schoolDb);
  const Class = getClassModel(req.schoolDb);
  const Subject = getSubjectModel(req.schoolDb);
  const User = getUserModel(req.usersDb);

  // Set query parameters for getByField operation
  req.query.fieldKey = "user";
  req.query.fieldValue = req.params.id;

  const studentOperations = crudOperations({
    mainModel: Teacher,
    populateModels: [
      {
        field: "user",
        model: User,
        select: "name email",
      },
      {
        field: "classes",
        model: Class,
        select: "classNumber division subjects",
        populateFields: [
          {
            field: "subjects",
            model: Subject,
            select: "name description",
          },
        ],
      },
      {
        field: "subjects",
        model: Subject,
        select: "name description",
      },
    ],
  });

  studentOperations.getByField(req, res, next);
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
  assignSubjects,
  getTeacherByUserId,
};
