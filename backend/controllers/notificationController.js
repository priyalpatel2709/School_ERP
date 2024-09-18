const asyncHandler = require("express-async-handler");
const crudOperations = require("../utils/crudOperations");

const {
  getNotificationModel,
  getUserModel,
  getTeacherModel,
  getStudentModel,
  getClassModel,
} = require("../models");

const createNotification = asyncHandler(async (req, res, next) => {
  const Notification = getNotificationModel(req.schoolDb);

  const notificationOperations = crudOperations({
    mainModel: Notification,
    populateModels: [],
  });

  notificationOperations.create(req, res, next);
});

const getAllNotification = asyncHandler(async (req, res, next) => {
  const User = getUserModel(req.usersDb);
  const Notification = getNotificationModel(req.schoolDb);

  const notificationOperations = crudOperations({
    mainModel: Notification,
    populateModels: [
      {
        field: "recipients.user",
        model: User,
        select: "name roleName",
      },
    ],
  });

  notificationOperations.getAll(req, res, next);
});

const getNotificationById = asyncHandler(async (req, res, next) => {
  const User = getUserModel(req.usersDb);
  const Notification = getNotificationModel(req.schoolDb);

  const notificationOperations = crudOperations({
    mainModel: Notification,
    populateModels: [
      {
        field: "recipients.user",
        model: User,
        select: "name roleName",
      },
    ],
  });

  notificationOperations.getById(req, res, next);
});

const deleteById = asyncHandler(async (req, res, next) => {
  const Notification = getNotificationModel(req.schoolDb);

  const notificationOperations = crudOperations({
    mainModel: Notification,
    populateModels: [],
  });

  notificationOperations.deleteById(req, res, next);
});

const deleteAll = asyncHandler(async (req, res, next) => {
  const Notification = getNotificationModel(req.schoolDb);

  const notificationOperations = crudOperations({
    mainModel: Notification,
    populateModels: [],
  });

  notificationOperations.deleteAll(req, res, next);
});

const updateById = asyncHandler(async (req, res, next) => {
  const Notification = getNotificationModel(req.schoolDb);

  const notificationOperations = crudOperations({
    mainModel: Notification,
    populateModels: [],
  });

  notificationOperations.updateById(req, res, next);
});

const sendNotification = asyncHandler(async (req, res) => {
  const { message, recipients, expireDate, classes, type } = req.body;
  const { schoolDb, usersDb, user } = req;

  const Notification = getNotificationModel(schoolDb);
  const Teacher = getTeacherModel(schoolDb);
  const Student = getStudentModel(schoolDb);
  const Class = getClassModel(schoolDb);
  const User = getUserModel(usersDb);

  // Create and save the notification
  const notification = new Notification({
    type: type,
    message,
    sender: user._id,
    expireDate: expireDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  await notification.save();

  // Batch size for efficient updates
  const batchSize = 1000;

  const updateUsersInBatches = async (userIds) => {
    let batch = [];
    for (const userId of userIds) {
      batch.push(userId);

      if (batch.length === batchSize) {
        // Update the users' notification field in batches
        await User.updateMany(
          { _id: { $in: batch } },
          { $push: { notifications: notification._id } }
        );
        batch = [];
      }
    }

    // Update any remaining users
    if (batch.length > 0) {
      await User.updateMany(
        { _id: { $in: batch } },
        { $push: { notifications: notification._id } }
      );
    }
  };

  const getUsersForClasses = async () => {
    if (!classes || classes.length === 0) return [];

    // Create filters to match the requested classes
    const classFilters = classes.map(({ classNumber, division }) => ({
      classNumber,
      division,
    }));

    // Find the matching classes and populate the user references for students and classTeacher
    const classesFound = await Class.find({ $or: classFilters })
      .populate({
        path: "students",
        select: "user",
      })
      .populate({
        path: "classTeacher",
        select: "user",
      })

      .select("students classTeacher")
      .exec();

    // Use a Set to avoid duplicates
    const userIds = new Set();
    classesFound.forEach((cls) => {
      console.log("File: notificationController.js", "Line 174:", cls);
      if (cls.classTeacher && cls.classTeacher.user) {
        userIds.add(cls.classTeacher.user._id.toString());
      }
      cls.students.forEach((student) => {
        if (student.user) {
          userIds.add(student.user._id.toString());
        }
      });
    });

    // Convert the Set to an Array
    return Array.from(userIds);
  };

  // List of update promises
  const updatePromises = [];

  // Send notifications to the classes' students and class teachers
  if (recipients.includes("classes")) {
    const classUserIds = await getUsersForClasses();
    updatePromises.push(updateUsersInBatches(classUserIds));
  }

  // Send notifications to all teachers
  if (recipients.includes("teachers")) {
    const teacherCursor = Teacher.find().populate("user", "_id").cursor();
    const teacherUserIds = [];
    for (
      let doc = await teacherCursor.next();
      doc != null;
      doc = await teacherCursor.next()
    ) {
      if (doc.user) {
        teacherUserIds.push(doc.user._id);
      }
    }
    updatePromises.push(updateUsersInBatches(teacherUserIds));
  }

  // Send notifications to all students
  if (recipients.includes("students")) {
    const studentCursor = Student.find().populate("user", "_id").cursor();
    const studentUserIds = [];
    for (
      let doc = await studentCursor.next();
      doc != null;
      doc = await studentCursor.next()
    ) {
      if (doc.user) {
        studentUserIds.push(doc.user._id);
      }
    }
    updatePromises.push(updateUsersInBatches(studentUserIds));
  }

  // Wait for all updates to complete
  await Promise.all(updatePromises);

  res.status(200).json({
    message: "Notifications sent and added to user records successfully",
  });
});

const cleanupExpiredNotifications = asyncHandler(async (req, res) => {
  const { schoolDb, usersDb } = req;
  const Notification = getNotificationModel(schoolDb);
  const User = getUserModel(usersDb);

  const currentDate = new Date();

  // Find expired notifications
  const expiredNotifications = await Notification.find({
    expireDate: { $lt: currentDate },
  }).select("_id");

  const expiredNotificationIds = expiredNotifications.map((n) => n._id);

  if (expiredNotificationIds.length === 0) {
    return res.status(200).json({
      message: "No expired notifications found.",
      deletedCount: 0,
    });
  }

  // Remove expired notifications from users
  await User.updateMany(
    { notifications: { $in: expiredNotificationIds } },
    { $pull: { notifications: { $in: expiredNotificationIds } } }
  );

  // Delete expired notifications
  const deleteResult = await Notification.deleteMany({
    _id: { $in: expiredNotificationIds },
  });

  res.status(200).json({
    message: "Expired notifications cleaned up successfully.",
    deletedCount: deleteResult.deletedCount,
  });
});

const getNotificationForUser = asyncHandler(async (req, res) => {
  const { schoolDb, usersDb } = req;
  const Notification = getNotificationModel(schoolDb);
  const User = getUserModel(usersDb);
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const notifications = await Notification.find({
    recipients: { $in: [userId] },
  });
  res.status(200).json({ notifications });
});

// const scheduleNotificationCleanup = (cron, cleanupFunction) => {
//   cron.schedule("0 1 * * *", async () => {
//     try {
//       console.log("Running scheduled notification cleanup...");
//       await cleanupFunction();
//       console.log("Notification cleanup completed successfully.");
//     } catch (error) {
//       console.error("Error during scheduled notification cleanup:", error);
//     }
//   });
// };

module.exports = {
  createNotification,
  getAllNotification,
  getNotificationById,
  deleteById,
  deleteAll,
  updateById,
  sendNotification,
  cleanupExpiredNotifications,
};
