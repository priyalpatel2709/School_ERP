const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const {
  getTimeTableModel,
  getTeacherModel,
  getSubjectModel,
  getUserModel,
  getClassModel
} = require("../models");
const crudOperations = require("../utils/crudOperations");
const { timeTablePopulateModel } = require("../utils/miscellaneousFunctions");
const { findTeacherSlotConflicts, DAYS } = require("../utils/timeTableConflicts");

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
  const Class = getClassModel(req.schoolDb);

  const { class: classId, academicYear } = req.query;
  const filter = {};
  if (classId) filter.class = classId;
  if (academicYear) filter.academicYear = academicYear;

  const populateModels = [
    {
      field: "class",
      model: Class,
      select: "classNumber division academicYear",
    },
    ...timeTablePopulateModel(User, Teacher, Subject),
  ];

  const timeTableOperations = crudOperations({
    mainModel: TimeTable,
    populateModels: populateModels,
  });

  // Overriding default getAll to support filters
  try {
    let query = TimeTable.find(filter);
    const { populateNestedFields } = require("../utils/crudOperations");
    // Since we need populateNestedFields and it's not exported, we use the query directly if possible
    // or just let crudOperations handle it if we modify it.
    // Actually, let's keep it simple and just use the query.

    // Instead of overriding, let's just use the query directly here to respect the filter
    query = TimeTable.find(filter).populate([
      {
        path: "class",
        model: Class,
        select: "classNumber division academicYear",
      },
      ...populateModels.filter(m => m.field !== "class").map(m => ({
        path: m.field,
        model: m.model,
        select: m.select,
        populate: m.populateFields ? m.populateFields.map(nf => ({ path: nf.field, model: nf.model, select: nf.select })) : undefined
      }))
    ]);

    const documents = await query;
    res.status(200).json(documents);
  } catch (err) {
    next(err);
  }
});

const getTimeTableByClassId = asyncHandler(async (req, res, next) => {
  const TimeTable = getTimeTableModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const Teacher = getTeacherModel(req.schoolDb);
  const Subject = getSubjectModel(req.schoolDb);
  const Class = getClassModel(req.schoolDb);

  const { classId } = req.params;

  let query = TimeTable.findOne({ class: classId })
    .populate({
      path: "class",
      model: Class,
      select: "classNumber division academicYear",
    });

  // Manually apply the population for each day of the week since timeTablePopulateModel 
  // returns an array intended for the crudOperations helper.
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  days.forEach(day => {
    query = query.populate({
      path: `week.${day}.subject`,
      model: Subject,
      select: "name code"
    }).populate({
      path: `week.${day}.teacher`,
      model: Teacher,
      select: "user",
      populate: {
        path: "user",
        model: User,
        select: "name"
      }
    });
  });

  const timeTable = await query;

  if (!timeTable) {
    return res.status(200).json(null); // Return null rather than 404 for easier frontend handling
  }

  res.status(200).json(timeTable);
});

const getTimeTableById = asyncHandler(async (req, res, next) => {
  const TimeTable = getTimeTableModel(req.schoolDb);
  const Teacher = getTeacherModel(req.schoolDb);
  const Subject = getSubjectModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const Class = getClassModel(req.schoolDb);

  const populateModels = [
    {
      field: "class",
      model: Class,
      select: "classNumber division academicYear",
    },
    ...timeTablePopulateModel(User, Teacher, Subject),
  ];
  const timeTableOperations = crudOperations({
    mainModel: TimeTable,
    populateModels: populateModels,
  });
  await timeTableOperations.getById(req, res, next);
});

const updateTimeTableById = asyncHandler(async (req, res, next) => {
  const TimeTable = getTimeTableModel(req.schoolDb);
  const { day, lectures, class: classId, academicYear, metaData } = req.body;
  const { id } = req.params;

  try {
    let timeTable = await TimeTable.findById(id);

    if (!timeTable) {
      return res.status(404).json({ message: "Time table not found" });
    }

    // 1. Update top-level fields ONLY if they are provided in the request
    if (classId) timeTable.class = classId;
    if (academicYear) timeTable.academicYear = academicYear;
    if (metaData) timeTable.metaData = metaData;

    // 2. Incremental Update for Lectures
    if (day && Array.isArray(lectures)) {
      if (!timeTable.week[day]) {
        return res.status(400).json({ message: "Invalid day name" });
      }

      lectures.forEach((updatedLecture) => {
        const { index, ...lectureDetails } = updatedLecture;

        // Map frontend 'subjectId'/'teacherId' to model 'subject'/'teacher'
        const lectureData = {
          ...(lectureDetails.subjectId && { subject: lectureDetails.subjectId }),
          ...(lectureDetails.subject && { subject: lectureDetails.subject }), // Support both
          ...(lectureDetails.teacherId && { teacher: lectureDetails.teacherId }),
          ...(lectureDetails.teacher && { teacher: lectureDetails.teacher }), // Support both
          startTime: lectureDetails.startTime,
          endTime: lectureDetails.endTime,
          isBreak: lectureDetails.isBreak,
          classRoom: lectureDetails.classRoom,
          lectureNumber: lectureDetails.lectureNumber,
        };

        if (typeof index === "number" && index < timeTable.week[day].length) {
          // UPDATE: Merge new details into the existing lecture at that index
          timeTable.week[day][index] = {
            ...timeTable.week[day][index].toObject(),
            ...lectureData,
          };
        } else {
          // APPEND: If no index or index out of bounds, add as a new lecture
          timeTable.week[day].push(lectureData);
        }
      });
    }

    // 3. Save only the modifications
    const updatedTimeTable = await timeTable.save();
    res.status(200).json(updatedTimeTable);
  } catch (error) {
    console.error("Error updated time table:", error);
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

    // Check if the day is valid
    if (!timeTable.week[day]) {
      return res.status(400).json({ message: "Invalid day name" });
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

const getTimeTableConflicts = asyncHandler(async (req, res) => {
  const TimeTable = getTimeTableModel(req.schoolDb);
  const { academicYear } = req.query;
  const filter = {};
  if (academicYear) filter.academicYear = academicYear;
  const all = await TimeTable.find(filter).lean();
  const conflicts = findTeacherSlotConflicts(all);
  res.status(200).json({ success: true, count: conflicts.length, conflicts });
});

const autoGenerateTimeTable = asyncHandler(async (req, res, next) => {
  const { classId, academicYear, templateTimeTableId, slotTemplate } = req.body;
  if (!classId || !academicYear) {
    return next(createError(400, "classId and academicYear are required"));
  }

  const TimeTable = getTimeTableModel(req.schoolDb);
  const existing = await TimeTable.findOne({ class: classId, academicYear });
  if (existing) {
    return next(
      createError(400, "Timetable already exists for this class and academic year"),
    );
  }

  let week;
  if (templateTimeTableId) {
    const tpl = await TimeTable.findById(templateTimeTableId).lean();
    if (!tpl || !tpl.week) {
      return next(createError(404, "Template timetable not found"));
    }
    week = JSON.parse(JSON.stringify(tpl.week));
  } else if (slotTemplate && typeof slotTemplate === "object") {
    week = slotTemplate;
  } else {
    week = {};
    DAYS.forEach((d) => {
      week[d] = [];
    });
  }

  const doc = await TimeTable.create({ class: classId, academicYear, week });
  res.status(201).json(doc);
});

module.exports = {
  createTimeTable,
  getAllTimeTable,
  getTimeTableById,
  getTimeTableByClassId,
  updateTimeTableById,
  deleteTimeTableById,
  deleteAllTimeTable,
  deleteLectureFromTimeTable,
  getTimeTableConflicts,
  autoGenerateTimeTable,
};
