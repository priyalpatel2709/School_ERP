const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const {
  getStudentAttendanceModel,
  getStaffAttendanceModel,
  getStudentModel,
  getClassModel,
  getUserModel,
  getSubjectModel,
  getLeaveApplicationModel,
  getTeacherModel,
} = require("../models");
const crudOperations = require("../utils/crudOperations");

// --- Student Attendance Operations ---

const createStudentAttendance = asyncHandler(async (req, res, next) => {
  const StudentAttendance = getStudentAttendanceModel(req.schoolDb);
  const Student = getStudentModel(req.schoolDb);
  const Class = getClassModel(req.schoolDb);

  const studentAttendanceOperations = crudOperations({
    mainModel: StudentAttendance,
    populateModels: [
      {
        field: "student",
        model: Student,
        select: "user rollNumber admissionNumber",
      },
      { field: "class", model: Class, select: "classNumber division" },
    ],
  });
  studentAttendanceOperations.create(req, res, next);
});

const getAllStudentAttendance = asyncHandler(async (req, res, next) => {
  const StudentAttendance = getStudentAttendanceModel(req.schoolDb);
  const Student = getStudentModel(req.schoolDb);
  const Class = getClassModel(req.schoolDb);
  const User = getUserModel(req.usersDb);

  const studentAttendanceOperations = crudOperations({
    mainModel: StudentAttendance,
    populateModels: [
      {
        field: "student",
        model: Student,
        select: "user rollNumber admissionNumber",
        populateModels: [{ field: "user", model: User, select: "name" }],
      },
      { field: "class", model: Class, select: "classNumber division" },
    ],
  });
  studentAttendanceOperations.getAll(req, res, next);
});

const getStudentAttendanceById = asyncHandler(async (req, res, next) => {
  const StudentAttendance = getStudentAttendanceModel(req.schoolDb);
  const Student = getStudentModel(req.schoolDb);
  const Class = getClassModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const Subject = getSubjectModel(req.schoolDb);
  const LeaveApplication = getLeaveApplicationModel(req.schoolDb);

  const studentAttendanceOperations = crudOperations({
    mainModel: StudentAttendance,
    populateModels: [
      {
        field: "student",
        model: Student,
        select: "user rollNumber admissionNumber",
        populateModels: [{ field: "user", model: User, select: "name" }],
      },
      { field: "class", model: Class, select: "classNumber division" },
      {
        field: "subjectAttendance.subject",
        model: Subject,
        select: "name code",
      },
      { field: "leaveInfo.leaveApplication", model: LeaveApplication },
    ],
  });
  studentAttendanceOperations.getById(req, res, next);
});

const updateStudentAttendance = asyncHandler(async (req, res, next) => {
  const StudentAttendance = getStudentAttendanceModel(req.schoolDb);
  const studentAttendanceOperations = crudOperations({
    mainModel: StudentAttendance,
  });
  studentAttendanceOperations.updateById(req, res, next);
});

const deleteStudentAttendance = asyncHandler(async (req, res, next) => {
  const StudentAttendance = getStudentAttendanceModel(req.schoolDb);
  const studentAttendanceOperations = crudOperations({
    mainModel: StudentAttendance,
  });
  studentAttendanceOperations.deleteById(req, res, next);
});

// --- Staff Attendance Operations ---

const createStaffAttendance = asyncHandler(async (req, res, next) => {
  const StaffAttendance = getStaffAttendanceModel(req.schoolDb);
  const User = getUserModel(req.usersDb);

  const staffAttendanceOperations = crudOperations({
    mainModel: StaffAttendance,
    populateModels: [{ field: "staff", model: User, select: "name email" }],
  });
  staffAttendanceOperations.create(req, res, next);
});

const getAllStaffAttendance = asyncHandler(async (req, res, next) => {
  const StaffAttendance = getStaffAttendanceModel(req.schoolDb);
  const User = getUserModel(req.usersDb);

  const staffAttendanceOperations = crudOperations({
    mainModel: StaffAttendance,
    populateModels: [
      { field: "staff", model: User, select: "name email roleName" },
    ],
  });
  staffAttendanceOperations.getAll(req, res, next);
});

const getStaffAttendanceById = asyncHandler(async (req, res, next) => {
  const StaffAttendance = getStaffAttendanceModel(req.schoolDb);
  const User = getUserModel(req.usersDb);
  const LeaveApplication = getLeaveApplicationModel(req.schoolDb);

  const staffAttendanceOperations = crudOperations({
    mainModel: StaffAttendance,
    populateModels: [
      { field: "staff", model: User, select: "name email roleName" },
      { field: "leaveInfo.leaveApplication", model: LeaveApplication },
    ],
  });
  staffAttendanceOperations.getById(req, res, next);
});

const updateStaffAttendance = asyncHandler(async (req, res, next) => {
  const StaffAttendance = getStaffAttendanceModel(req.schoolDb);
  const staffAttendanceOperations = crudOperations({
    mainModel: StaffAttendance,
  });
  staffAttendanceOperations.updateById(req, res, next);
});

const deleteStaffAttendance = asyncHandler(async (req, res, next) => {
  const StaffAttendance = getStaffAttendanceModel(req.schoolDb);
  const staffAttendanceOperations = crudOperations({
    mainModel: StaffAttendance,
  });
  staffAttendanceOperations.deleteById(req, res, next);
});

// --- Additional Use Cases ---

// Bulk mark attendance for entire class
const bulkMarkStudentAttendance = asyncHandler(async (req, res, next) => {
  const { classId, date, academicYear, attendanceRecords } = req.body;

  // Validate that attendanceRecords is an array
  if (!attendanceRecords || !Array.isArray(attendanceRecords)) {
    return next(createError(400, "attendanceRecords must be an array"));
  }

  if (attendanceRecords.length === 0) {
    return next(createError(400, "attendanceRecords array cannot be empty"));
  }

  const StudentAttendance = getStudentAttendanceModel(req.schoolDb);

  const attendanceEntries = [];

  for (const record of attendanceRecords) {
    const attendance = new StudentAttendance({
      student: record.studentId,
      class: classId,
      date,
      academicYear,
      attendanceMode: record.attendanceMode || "Daily",
      dailyStatus: record.dailyStatus,
      subjectAttendance: record.subjectAttendance,
      markedBy: req.user._id,
    });

    await attendance.save();
    attendanceEntries.push(attendance);
  }

  res.status(201).json({
    success: true,
    message: `Attendance marked for ${attendanceEntries.length} students`,
    data: attendanceEntries,
  });
});

// Get monthly attendance report for a student
const getMonthlyAttendanceReport = asyncHandler(async (req, res, next) => {
  const { studentId } = req.params;
  const { month, year } = req.query;

  const StudentAttendance = getStudentAttendanceModel(req.schoolDb);

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const attendance = await StudentAttendance.find({
    student: studentId,
    date: { $gte: startDate, $lte: endDate },
  }).sort({ date: 1 });

  const totalDays = attendance.length;
  const presentDays = attendance.filter(
    (a) => a.overallStatus === "Present",
  ).length;
  const absentDays = attendance.filter(
    (a) => a.overallStatus === "Absent",
  ).length;
  const leaveDays = attendance.filter(
    (a) => a.overallStatus === "On Leave",
  ).length;
  const percentage =
    totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

  res.status(200).json({
    success: true,
    summary: {
      totalDays,
      presentDays,
      absentDays,
      leaveDays,
      percentage,
    },
    data: attendance,
  });
});

// Get class attendance for a specific date
const getClassAttendanceByDate = asyncHandler(async (req, res, next) => {
  const { classId, date } = req.params;

  const StudentAttendance = getStudentAttendanceModel(req.schoolDb);
  const Student = getStudentModel(req.schoolDb);
  const User = getUserModel(req.usersDb);

  const attendanceDate = new Date(date);

  const attendance = await StudentAttendance.find({
    class: classId,
    date: attendanceDate,
  }).populate({
    path: "student",
    model: Student,
    select: "user rollNumber admissionNumber",
    populate: { path: "user", model: User, select: "name" },
  });

  res.status(200).json({
    success: true,
    count: attendance.length,
    data: attendance,
  });
});

// Staff check-in
const staffCheckIn = asyncHandler(async (req, res, next) => {
  const { staff: staffInput, location, method, status } = req.body;
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  const StaffAttendance = getStaffAttendanceModel(req.schoolDb);
  const Teacher = getTeacherModel(req.schoolDb);

  let staffUserId = staffInput;

  // Check if the provided ID is a Teacher ID (by checking if a Teacher exists with this ID)
  const teacherProfile = await Teacher.findById(staffInput);

  if (teacherProfile) {
    staffUserId = teacherProfile.user.toString();
  }

  // Check if already checked in today
  const existing = await StaffAttendance.findOne({
    staff: staffUserId,
    date,
  });

  if (existing && existing.checkIn.time) {
    return next(createError(400, "Already checked in for today"));
  }

  const attendance =
    existing ||
    new StaffAttendance({
      staff: staffUserId,
      date,
      academicYear: req.body.academicYear,
    });

  if (status) {
    attendance.status = status;
  }

  attendance.checkIn = {
    time: new Date(),
    location: location || "School",
    method: method || "Manual",
    markedBy: req.user._id,
  };

  await attendance.save();

  res.status(200).json({
    success: true,
    message: "Checked in successfully",
    data: attendance,
  });
});

// Staff check-out
const staffCheckOut = asyncHandler(async (req, res, next) => {
  const { staff: staffInput, location, method, status } = req.body;
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  const StaffAttendance = getStaffAttendanceModel(req.schoolDb);
  const Teacher = getTeacherModel(req.schoolDb);

  let staffUserId = staffInput;

  // Find teacher profile to get the underlying user ID
  const teacherProfile = await Teacher.findById(staffInput);

  if (teacherProfile) {
    staffUserId = teacherProfile.user.toString();
  }

  const attendance = await StaffAttendance.findOne({
    staff: staffUserId,
    date,
  });

  if (!attendance) {
    return next(createError(404, "No check-in found for today"));
  }

  if (attendance.checkOut.time) {
    return next(createError(400, "Already checked out for today"));
  }

  if (status) {
    attendance.status = status;
  }

  attendance.checkOut = {
    time: new Date(),
    location: location || "School",
    method: method || "Manual",
    markedBy: req.user._id,
  };

  await attendance.save();

  res.status(200).json({
    success: true,
    message: "Checked out successfully",
    data: attendance,
  });
});

// Get staff monthly attendance report
const getStaffMonthlyReport = asyncHandler(async (req, res, next) => {
  const { staffId } = req.params;
  const { month, year } = req.query;

  const StaffAttendance = getStaffAttendanceModel(req.schoolDb);

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const attendance = await StaffAttendance.find({
    staff: staffId,
    date: { $gte: startDate, $lte: endDate },
  }).sort({ date: 1 });

  const totalDays = attendance.length;
  const presentDays = attendance.filter((a) => a.status === "Present").length;
  const totalLateMinutes = attendance.reduce(
    (sum, a) => sum + (a.lateByMinutes || 0),
    0,
  );
  const avgWorkingHours =
    attendance.reduce((sum, a) => sum + (a.totalHours || 0), 0) /
    (attendance.length || 1);

  res.status(200).json({
    success: true,
    summary: {
      totalDays,
      presentDays,
      totalLateMinutes,
      avgWorkingHours: avgWorkingHours.toFixed(2),
    },
    data: attendance,
  });
});

// Get monthly attendance report for all staff
const getAllStaffMonthlyReport = asyncHandler(async (req, res, next) => {
  const { month, year } = req.query;

  const StaffAttendance = getStaffAttendanceModel(req.schoolDb);
  const User = getUserModel(req.usersDb);

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  // Get all attendance records for the month
  const allAttendance = await StaffAttendance.find({
    date: { $gte: startDate, $lte: endDate },
  })
    .populate({
      path: "staff",
      model: User,
      select: "name email roleName",
    })
    .sort({ staff: 1, date: 1 });

  // Group attendance by staff
  const staffAttendanceMap = {};

  allAttendance.forEach((record) => {
    const staffId = record.staff._id.toString();

    if (!staffAttendanceMap[staffId]) {
      staffAttendanceMap[staffId] = {
        staffInfo: {
          _id: record.staff._id,
          name: record.staff.name,
          email: record.staff.email,
          roleName: record.staff.roleName,
        },
        attendance: [],
      };
    }

    staffAttendanceMap[staffId].attendance.push(record);
  });

  // Calculate summary for each staff member
  const staffReports = Object.values(staffAttendanceMap).map((staffData) => {
    const { staffInfo, attendance } = staffData;

    const totalDays = attendance.length;
    const presentDays = attendance.filter((a) => a.status === "Present").length;
    const absentDays = attendance.filter((a) => a.status === "Absent").length;
    const halfDays = attendance.filter((a) => a.status === "Half Day").length;
    const leaveDays = attendance.filter((a) => a.status === "On Leave").length;
    const totalLateMinutes = attendance.reduce(
      (sum, a) => sum + (a.lateByMinutes || 0),
      0,
    );
    const totalWorkingHours = attendance.reduce(
      (sum, a) => sum + (a.totalHours || 0),
      0,
    );
    const avgWorkingHours =
      totalDays > 0 ? (totalWorkingHours / totalDays).toFixed(2) : "0.00";

    const attendancePercentage =
      totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : "0.00";

    return {
      staff: staffInfo,
      summary: {
        totalDays,
        presentDays,
        absentDays,
        halfDays,
        leaveDays,
        totalLateMinutes,
        totalWorkingHours: totalWorkingHours.toFixed(2),
        avgWorkingHours,
        attendancePercentage,
      },
      attendanceRecords: attendance,
    };
  });

  // Calculate overall school statistics
  const schoolSummary = {
    totalStaff: staffReports.length,
    totalAttendanceRecords: allAttendance.length,
    avgAttendancePercentage:
      staffReports.length > 0
        ? (
            staffReports.reduce(
              (sum, report) =>
                sum + parseFloat(report.summary.attendancePercentage),
              0,
            ) / staffReports.length
          ).toFixed(2)
        : "0.00",
    totalLateMinutes: staffReports.reduce(
      (sum, report) => sum + report.summary.totalLateMinutes,
      0,
    ),
  };

  res.status(200).json({
    success: true,
    month,
    year,
    schoolSummary,
    staffReports,
  });
});

module.exports = {
  // Student Attendance
  createStudentAttendance,
  getAllStudentAttendance,
  getStudentAttendanceById,
  updateStudentAttendance,
  deleteStudentAttendance,
  bulkMarkStudentAttendance,
  getMonthlyAttendanceReport,
  getClassAttendanceByDate,
  // Staff Attendance
  createStaffAttendance,
  getAllStaffAttendance,
  getStaffAttendanceById,
  updateStaffAttendance,
  deleteStaffAttendance,
  staffCheckIn,
  staffCheckOut,
  getStaffMonthlyReport,
  getAllStaffMonthlyReport,
};
