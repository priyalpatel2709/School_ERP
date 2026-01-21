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
  const {
    message,
    targetType, // 'all', 'role', 'class', 'specific'
    targetRoles, // ['Teacher', 'Student', 'Parent'] - for role-based
    targetClasses, // [classId1, classId2] - for class-based
    targetUserIds, // [userId1, userId2] - for specific users
    includeParents, // boolean - include parents of students
    expireDate,
    type
  } = req.body;

  const { schoolDb, usersDb, user } = req;

  const Notification = getNotificationModel(schoolDb);
  const Teacher = getTeacherModel(schoolDb);
  const Student = getStudentModel(schoolDb);
  const Class = getClassModel(schoolDb);
  const User = getUserModel(usersDb);

  // Validate required fields
  if (!message || !type) {
    return res.status(400).json({ message: "Message and type are required" });
  }

  // Create and save the notification
  const notification = new Notification({
    type: type,
    message,
    sender: user._id,
    expireDate: expireDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  await notification.save();

  // Collect all target user IDs
  const targetUserIdsSet = new Set();

  // Helper function to add user IDs to the set
  const addUserIds = (userIds) => {
    userIds.forEach(id => {
      if (id) targetUserIdsSet.add(id.toString());
    });
  };

  // 1. Handle 'all' target type - send to everyone
  if (targetType === 'all') {
    const allUsers = await User.find({}).select('_id');
    addUserIds(allUsers.map(u => u._id));
  }

  // 2. Handle 'role' target type - send to specific roles
  else if (targetType === 'role' && targetRoles && targetRoles.length > 0) {
    for (const role of targetRoles) {
      if (role === 'Teacher') {
        const teachers = await Teacher.find({}).select('user');
        addUserIds(teachers.map(t => t.user).filter(Boolean));
      }
      else if (role === 'Student') {
        const students = await Student.find({}).select('user guardianInfo');
        addUserIds(students.map(s => s.user).filter(Boolean));

        // Include parents if requested
        if (includeParents) {
          students.forEach(student => {
            if (student.guardianInfo) {
              student.guardianInfo.forEach(guardian => {
                if (guardian.user) {
                  targetUserIdsSet.add(guardian.user.toString());
                }
              });
            }
          });
        }
      }
      else if (role === 'Parent') {
        // Get all parents from student guardian info
        const students = await Student.find({}).select('guardianInfo');
        students.forEach(student => {
          student.guardianInfo.forEach(guardian => {
            if (guardian.user) {
              targetUserIdsSet.add(guardian.user.toString());
            }
          });
        });
      }
      else {
        // For other roles, find users directly by roleName
        const users = await User.find({ roleName: role }).select('_id');
        addUserIds(users.map(u => u._id));
      }
    }
  }

  // 3. Handle 'class' target type - send to specific classes
  else if (targetType === 'class' && targetClasses && targetClasses.length > 0) {
    const classes = await Class.find({ _id: { $in: targetClasses } })
      .select('students classTeacher subjects');

    for (const cls of classes) {
      // Add class teacher - need to fetch the teacher document to get user ID
      if (cls.classTeacher) {
        const classTeacher = await Teacher.findById(cls.classTeacher).select('user');
        if (classTeacher?.user) {
          targetUserIdsSet.add(classTeacher.user.toString());
        }
      }

      // Add students - need to fetch student documents to get user IDs
      if (cls.students && cls.students.length > 0) {
        const students = await Student.find({
          _id: { $in: cls.students }
        }).select('user guardianInfo');

        students.forEach(student => {
          if (student.user) {
            targetUserIdsSet.add(student.user.toString());
          }

          // Add parents if requested
          if (includeParents && student.guardianInfo) {
            student.guardianInfo.forEach(guardian => {
              if (guardian.user) {
                targetUserIdsSet.add(guardian.user.toString());
              }
            });
          }
        });
      }

      // Add subject teachers if available
      if (cls.subjects && cls.subjects.length > 0) {
        const subjectIds = cls.subjects.map(s => s._id || s);
        const subjectTeachers = await Teacher.find({
          subjects: { $in: subjectIds }
        }).select('user');

        addUserIds(subjectTeachers.map(t => t.user).filter(Boolean));
      }
    }
  }

  // 4. Handle 'specific' target type - send to specific users
  else if (targetType === 'specific' && targetUserIds && targetUserIds.length > 0) {
    addUserIds(targetUserIds);
  }

  // Convert Set to Array
  const finalUserIds = Array.from(targetUserIdsSet);

  if (finalUserIds.length === 0) {
    return res.status(400).json({
      message: "No valid recipients found for the notification"
    });
  }

  // Batch update users with notification
  const batchSize = 1000;
  for (let i = 0; i < finalUserIds.length; i += batchSize) {
    const batch = finalUserIds.slice(i, i + batchSize);
    await User.updateMany(
      { _id: { $in: batch } },
      { $push: { notifications: notification._id } }
    );
  }

  // Update notification with recipients
  notification.recipients = finalUserIds.map(userId => ({
    user: userId,
    status: 'unread',
    time: new Date()
  }));
  await notification.save();

  res.status(200).json({
    message: "Notification sent successfully",
    recipientCount: finalUserIds.length,
    notificationId: notification._id
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

// Get notifications for the logged-in user
const getMyNotifications = asyncHandler(async (req, res) => {
  const { schoolDb, user } = req;
  const Notification = getNotificationModel(schoolDb);

  try {
    // Find notifications where the user is in the recipients array
    const notifications = await Notification.find({
      'recipients.user': user._id,
      expireDate: { $gte: new Date() } // Only non-expired
    })
      .select('type message createdAt expireDate recipients.$')
      .sort({ createdAt: -1 }); // Most recent first

    // Extract the user's specific recipient info (read/unread status)
    const notificationsWithStatus = notifications.map(notif => {
      const recipient = notif.recipients.find(
        r => r.user.toString() === user._id.toString()
      );

      return {
        _id: notif._id,
        type: notif.type,
        message: notif.message,
        createdAt: notif.createdAt,
        expireDate: notif.expireDate,
        status: recipient?.status || 'unread',
        readAt: recipient?.time
      };
    });

    res.status(200).json({
      notifications: notificationsWithStatus,
      unreadCount: notificationsWithStatus.filter(n => n.status === 'unread').length
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
});

// Mark notification as read for the logged-in user
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { schoolDb, user } = req;
  const { notificationId } = req.params;
  const Notification = getNotificationModel(schoolDb);

  try {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Find and update the recipient's status
    const recipientIndex = notification.recipients.findIndex(
      r => r.user.toString() === user._id.toString()
    );

    if (recipientIndex === -1) {
      return res.status(403).json({ message: 'Notification not addressed to you' });
    }

    notification.recipients[recipientIndex].status = 'read';
    notification.recipients[recipientIndex].time = new Date();

    await notification.save();

    res.status(200).json({
      message: 'Notification marked as read',
      notificationId: notification._id
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Error updating notification', error: error.message });
  }
});

// Mark all notifications as read for the logged-in user
const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  const { schoolDb, user } = req;
  const Notification = getNotificationModel(schoolDb);

  try {
    const result = await Notification.updateMany(
      {
        'recipients.user': user._id,
        'recipients.status': 'unread'
      },
      {
        $set: {
          'recipients.$[elem].status': 'read',
          'recipients.$[elem].time': new Date()
        }
      },
      {
        arrayFilters: [{ 'elem.user': user._id, 'elem.status': 'unread' }]
      }
    );

    res.status(200).json({
      message: 'All notifications marked as read',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Error updating notifications', error: error.message });
  }
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
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
