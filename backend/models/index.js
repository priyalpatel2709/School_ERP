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
const transportModels = require("./transport");
const Transport = require('./transport');
const Library = require('./library');

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
  ...transportModels,
  Transport,
  Library
};
