const asyncHandler = require("express-async-handler");
const {
  getTimeTableModel,
  getTeacherModel,
  getSubjectModel,
  getUserModel,
} = require("../models");
const crudOperations = require("../utils/crudOperations");
const { timeTablePopulateModel } = require("../utils/miscellaneousFunctions");

const createTimeTable = asyncHandler(async (req, res, next) => {
  const TimeTable = getTimeTableModel(req.schoolDb);
  const timeTableOperations = crudOperations({
    mainModel: TimeTable,
    populateModels: [],
  });
  timeTableOperations.create(req, res, next);
});

const getAllTimeTable = asyncHandler(async (req, res, next) => {
  const TimeTable = getTimeTableModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const Teacher = getTeacherModel(req.schoolDb);
  const Subject = getSubjectModel(req.schoolDb);
  const populateModels = timeTablePopulateModel(User, Teacher, Subject);

  const timeTableOperations = crudOperations({
    mainModel: TimeTable,
    populateModels: populateModels,
  });
  await timeTableOperations.getAll(req, res, next);
});

const getTimeTableById = asyncHandler(async (req, res, next) => {
  const TimeTable = getTimeTableModel(req.schoolDb);
  const Teacher = getTeacherModel(req.schoolDb);
  const Subject = getSubjectModel(req.schoolDb);
  const User = getUserModel(req.usersDb);

  const populateModels = timeTablePopulateModel(User, Teacher, Subject);
  const timeTableOperations = crudOperations({
    mainModel: TimeTable,
    populateModels: populateModels,
  });
  await timeTableOperations.getById(req, res, next);
});

const updateTimeTableById = asyncHandler(async (req, res, next) => {
  const TimeTable = getTimeTableModel(req.schoolDb);
  const { day, lectures } = req.body;
  const { id } = req.params;

  try {
    // Find the existing time table document by ID
    let timeTable = await TimeTable.findById(id);

    if (!timeTable) {
      return res.status(404).json({ message: "Time table not found" });
    }

    // Update lectures for the specified day
    for (const lecture of lectures) {
      const {
        index,
        subjectId,
        teacherId,
        startTime,
        endTime,
        isBreak,
        classRoom,
        lectureNumber,
      } = lecture;

      if (index < timeTable.week[day].length) {
        // Update existing or add new lecture
        timeTable.week[day][index] = {
          ...(subjectId && { subject: subjectId }), // Only add subject if it exists
          ...(teacherId && { teacher: teacherId }), // Only add teacher if it exists
          startTime,
          endTime,
          isBreak,
          classRoom,
          lectureNumber,
        };
      } else {
        // Add new lecture if index is out of bounds
        timeTable.week[day].push({
          ...(subjectId && { subject: subjectId }),
          ...(teacherId && { teacher: teacherId }),
          startTime,
          endTime,
          isBreak,
          classRoom,
        });
      }
    }

    // Save the updated time table document
    const updatedTimeTable = await timeTable.save();

    res.status(200).json(updatedTimeTable);
  } catch (error) {
    console.error("Error updating time table:", error);
    next(error);
  }
});

const deleteLectureFromTimeTable = asyncHandler(async (req, res, next) => {
  const TimeTable = getTimeTableModel(req.schoolDb);
  const { id, day, lectureIndex } = req.params; // Assuming lectureIndex is part of the route params

  try {
    // Find the existing timetable document by ID
    let timeTable = await TimeTable.findById(id);

    if (!timeTable) {
      return res.status(404).json({ message: "Time table not found" });
    }

    // Check if the day and lectureIndex are within valid ranges
    if (day < 0 || day >= timeTable.week.length) {
      return res.status(400).json({ message: "Invalid day index" });
    }

    if (lectureIndex < 0 || lectureIndex >= timeTable.week[day].length) {
      return res.status(400).json({ message: "Invalid lecture index" });
    }

    // Remove the lecture from the timetable
    timeTable.week[day].splice(lectureIndex, 1);

    // Save the updated timetable document
    const updatedTimeTable = await timeTable.save();

    res.status(200).json(updatedTimeTable);
  } catch (error) {
    console.error("Error deleting lecture from time table:", error);
    next(error);
  }
});

const deleteTimeTableById = asyncHandler(async (req, res, next) => {
  const TimeTable = getTimeTableModel(req.schoolDb);
  const timeTableOperations = crudOperations({
    mainModel: TimeTable,
    populateModels: [],
  });
  await timeTableOperations.deleteById(req, res, next);
});

const deleteAllTimeTable = asyncHandler(async (req, res, next) => {
  const TimeTable = getTimeTableModel(req.schoolDb);
  const timeTableOperations = crudOperations({
    mainModel: TimeTable,
    populateModels: [],
  });
  await timeTableOperations.deleteAll(req, res, next);
});

module.exports = {
  createTimeTable,
  getAllTimeTable,
  getTimeTableById,
  updateTimeTableById,
  deleteTimeTableById,
  deleteAllTimeTable,
  deleteLectureFromTimeTable,
};
