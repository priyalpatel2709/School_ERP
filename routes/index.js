const userRouters = require("./userRoute");
const classRoutes = require("./classRoute");
const homeWorkRoutes = require("./homeWorkRoute");
const roleRoutes = require("./roleRoute");
const schoolDetailRoutes = require("./schoolDetailRoute");
const studentRoutes = require("./studentRoute");
const teacherRoutes = require("./teacherRoute");
const subjectRoutes = require("./subjectRoute");
const timeTableRoutes = require("./timeTableRoute");
const notificationRoutes = require("./notificationRoute");

// Phase 2 Routes
const feeRoutes = require("./feeRoute");
const attendanceRoutes = require("./attendanceRoute");
const leaveRoutes = require("./leaveRoute");
const examinationRoutes = require("./examinationRoute");
const gradingRoutes = require("./gradingRoute");
const substitutionRoutes = require("./substitutionRoute");
const admissionRoutes = require("./admissionRoute");
const payrollRoutes = require("./payrollRoute");
const transportRoutes = require("./transportRoute");
const communicationRoutes = require("./communicationRoute");
const libraryRoutes = require("./library");
const reportRoutes = require("./reportRoutes");

module.exports = {
  userRouters,
  classRoutes,
  homeWorkRoutes,
  roleRoutes,
  schoolDetailRoutes,
  studentRoutes,
  teacherRoutes,
  subjectRoutes,
  timeTableRoutes,
  notificationRoutes,
  // Phase 2
  feeRoutes,
  attendanceRoutes,
  leaveRoutes,
  examinationRoutes,
  gradingRoutes,
  substitutionRoutes,
  admissionRoutes,
  payrollRoutes,
  transportRoutes,
  communicationRoutes,
  libraryRoutes,
  reportRoutes,
};
