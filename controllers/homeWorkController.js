const asyncHandler = require("express-async-handler");
const createError = require("http-errors");

const {
  getHomeworkModel,
  getClassModel,
  getStudentModel,
  getUserModel,
  getTeacherModel,
  getSubjectModel,
} = require("../models");

const crudOperations = require("../utils/crudOperations");

const createHomeWork = asyncHandler(async (req, res, next) => {
  const HomeWork = getHomeworkModel(req.schoolDb);

  // Custom validation if needed, or rely on Mongoose defaults (e.g. status='Draft')
  const HomeWorkOperations = crudOperations({
    mainModel: HomeWork,
    populateModels: [],
  });

  HomeWorkOperations.create(req, res, next);
});

const getAllHomeWork = asyncHandler(async (req, res, next) => {
  const HomeWork = getHomeworkModel(req.schoolDb);
  const Class = getClassModel(req.schoolDb);
  const Student = getStudentModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const Teacher = getTeacherModel(req.schoolDb);
  const Subject = getSubjectModel(req.schoolDb);

  const HomeWorkOperations = crudOperations({
    mainModel: HomeWork,
    populateModels: [
      {
        field: "assignedBy",
        model: Teacher,
        select: "user",
        populateFields: [
          {
            field: "user",
            model: User,
            select: "name email",
          },
        ],
      },
      {
        field: "class",
        model: Class,
        select: "division classNumber",
        populateFields: [],
      },
      {
        field: "subject",
        model: Subject,
        select: "name code",
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

  HomeWorkOperations.getAll(req, res, next);
});

const getHomeWorkById = asyncHandler(async (req, res, next) => {
  const HomeWork = getHomeworkModel(req.schoolDb);
  const Class = getClassModel(req.schoolDb);
  const Student = getStudentModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const Teacher = getTeacherModel(req.schoolDb);
  const Subject = getSubjectModel(req.schoolDb);

  const HomeWorkOperations = crudOperations({
    mainModel: HomeWork,
    populateModels: [
      {
        field: "assignedBy",
        model: Teacher,
        populateFields: [
          {
            field: "user",
            model: User,
            select: "name",
          },
        ],
      },
      {
        field: "class",
        model: Class,
        populateFields: [],
      },
      {
        field: "subject",
        model: Subject,
        select: "name code",
        populateFields: [],
      },
      {
        field: "submissions.student",
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
  const { homeworkId, studentId, attachments } = req.body;

  const homework = await Homework.findById(homeworkId);
  if (!homework) {
    return res.status(404).json({ message: "Homework not found" });
  }

  // Calculate Late Status
  const now = new Date();
  const isLate = homework.dueDate ? now > new Date(homework.dueDate) : false;

  const submissionIndex = homework.submissions.findIndex(
    (sub) => sub.student.toString() === studentId
  );

  if (submissionIndex !== -1) {
    // Update existing
    homework.submissions[submissionIndex].attachments =
      attachments || homework.submissions[submissionIndex].attachments;
    homework.submissions[submissionIndex].submittedAt = now;
    homework.submissions[submissionIndex].isLate = isLate;
  } else {
    // New Submission
    homework.submissions.push({
      student: studentId,
      submittedAt: now,
      attachments: attachments || [],
      isLate,
    });
  }

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

const getHomeworkByStudent = asyncHandler(async (req, res, next) => {
  const Homework = getHomeworkModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const Student = getStudentModel(req.schoolDb);
  const Subject = getSubjectModel(req.schoolDb);

  const { studentId } = req.params;

  try {
    // 1. Get Student Class info
    const student = await Student.find({ user: studentId });
    if (!student) {
      return next(createError(404, "Student not found"));
    }

    // 2. Fetch all Published homework for this class
    const homeworks = await Homework.find(
      {
        class: { $in: student.class },
        status: { $in: ["Published", "Archived"] }, // Show archived too? Maybe.
      }
      // { title: 1, description: 1, _id: 1, assignedBy: 1, dueDate: 1, subject: 1, attachments: 1, submissions: 1 } // select logic
    )
      .sort({ createdAt: -1 })
      .populate({
        path: "assignedBy",
        populate: {
          path: "user",
          model: User,
          select: "name",
        },
      })
      .populate({
        path: "subject",
        model: Subject,
        select: "name code",
      })
      .lean();

    // 3. Process to add MySubmission status
    const result = homeworks.map((hw) => {
      const mySub = hw.submissions
        ? hw.submissions.find((s) => s.student.toString() === studentId)
        : null;

      let status = "Pending";
      if (mySub) {
        status = mySub.isLate ? "Submitted Late" : "Submitted";
        if (mySub.grade) status = "Graded";
      } else if (hw.dueDate && new Date() > new Date(hw.dueDate)) {
        status = "Overdue";
      }

      return {
        _id: hw._id,
        title: hw.title,
        description: hw.description,
        subject: hw.subject,
        teacher: hw.assignedBy?.user?.name,
        dueDate: hw.dueDate,
        attachments: hw.attachments,
        mySubmission: mySub,
        status: status,
      };
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getHomeworkByStudent:", err);
    next(createError(500, "Error fetching homework", { error: err.message }));
  }
});

const getHomeworkByTeacher = asyncHandler(async (req, res, next) => {
  const Homework = getHomeworkModel(req.schoolDb);
  const Class = getClassModel(req.schoolDb);
  const Subject = getSubjectModel(req.schoolDb);
  const Teacher = getTeacherModel(req.schoolDb); // Added Teacher model

  let { teacherId } = req.params;

  try {
    // Check if the provided ID is a User ID (by checking if a Teacher exists with this user ID)
    const teacherProfile = await Teacher.findOne({ user: teacherId });
    if (teacherProfile) {
      teacherId = teacherProfile._id;
    }

    const homeworks = await Homework.find({ assignedBy: teacherId })
      .sort({ createdAt: -1 })
      .populate({
        path: "class",
        model: Class,
        select: "classNumber division",
      })
      .populate({
        path: "subject",
        model: Subject,
        select: "name code",
      })
      .lean();

    // Add summary stats (e.g. 10/30 submitted)
    // This requires fetching class student count, which might be expensive here.
    // Keeping it simple for list view.

    res.status(200).json(homeworks);
  } catch (err) {
    console.error("Error in getHomeworkByTeacher:", err);
    next(
      createError(500, "Error fetching teacher homework", {
        error: err.message,
      })
    );
  }
});

module.exports = {
  createHomeWork,
  getAllHomeWork,
  getHomeWorkById,
  deleteById,
  deleteAll,
  updateById,
  submitHomework,
  gradeHomework,
  getHomeworkByStudent,
  getHomeworkByTeacher,
};
