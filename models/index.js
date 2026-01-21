const getHomeworkModel = require("./homeWorkModel");
const getClassModel = require("./classModel");
const getRoleModel = require("./roleModel");
const getSchoolDetailModel = require("./schoolDetailModel");
const getStudentModel = require("./studentModel");
const getUserModel = require("./userModel");
const getTeacherModel = require("./teacherModel");
const getSubjectModel = require("./subjectModel");
const getTimeTableModel = require("./timeTableModel");
const getNotificationModel = require("./notificationModel");

// Phase 2: Fee Management Models
const getFeeStructureModel = require("./feeStructureModel");
const getFeeInvoiceModel = require("./feeInvoiceModel");
const getFeePaymentModel = require("./feePaymentModel");

// Phase 2: Attendance Models
const getStudentAttendanceModel = require("./studentAttendanceModel");
const getStaffAttendanceModel = require("./staffAttendanceModel");
const getLeaveApplicationModel = require("./leaveApplicationModel");

// Phase 2: Examination Models
const getExaminationModel = require("./examinationModel");
const getExamResultModel = require("./examResultModel");
const getGradingSystemModel = require("./gradingSystemModel");

module.exports = {
  getHomeworkModel,
  getClassModel,
  getRoleModel,
  getSchoolDetailModel,
  getStudentModel,
  getUserModel,
  getTeacherModel,
  getSubjectModel,
  getTimeTableModel,
  getNotificationModel,
  // Phase 2: Fee Management
  getFeeStructureModel,
  getFeeInvoiceModel,
  getFeePaymentModel,
  // Phase 2: Attendance
  getStudentAttendanceModel,
  getStaffAttendanceModel,
  getLeaveApplicationModel,
  // Phase 2: Examination
  getExaminationModel,
  getExamResultModel,
  getGradingSystemModel,
};
