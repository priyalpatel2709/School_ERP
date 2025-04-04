const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TransportRoute',
    required: true,
    index: true
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TransportVehicle',
    required: true,
    index: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TransportDriver',
    required: true,
    index: true
  },
  journey: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'special'],
    required: true,
    index: true
  },
  direction: {
    type: String,
    enum: ['pickup', 'dropoff'],
    required: true
  },
  departureTime: {
    scheduled: Date,
    actual: Date,
    delay: Number // in minutes
  },
  arrivalTime: {
    scheduled: Date,
    actual: Date,
    delay: Number // in minutes
  },
  students: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    stopId: mongoose.Schema.Types.ObjectId,
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'left-early', 'unscheduled', 'not-required'],
      required: true
    },
    arrivalTime: Date, // Only for pickup - when student boarded
    departureTime: Date, // Only for dropoff - when student alighted
    notes: String,
    capturedBy: {
      type: String,
      enum: ['driver', 'staff', 'automated', 'parent-app'],
      default: 'driver'
    },
    attendanceTakenAt: {
      type: Date,
      default: Date.now
    },
    notificationSent: {
      boarding: {
        sent: { type: Boolean, default: false },
        sentAt: Date,
        recipients: [String]
      },
      alighting: {
        sent: { type: Boolean, default: false },
        sentAt: Date,
        recipients: [String]
      },
      absence: {
        sent: { type: Boolean, default: false },
        sentAt: Date,
        recipients: [String]
      }
    }
  }],
  issues: [{
    type: {
      type: String,
      enum: ['breakdown', 'delay', 'accident', 'traffic', 'weather', 'absentDriver', 'disciplinary', 'other'],
      required: true
    },
    description: String,
    timeOccurred: Date,
    actionTaken: String,
    reportedBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      name: String,
      role: String
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    resolved: {
      type: Boolean,
      default: false
    },
    resolvedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    followUpAction: String
  }],
  weather: {
    condition: String,
    temperature: Number,
    notes: String
  },
  routeCompletion: {
    type: String,
    enum: ['complete', 'partial', 'cancelled'],
    default: 'complete'
  },
  stopsCovered: [mongoose.Schema.Types.ObjectId],
  stopsSkipped: [{
    stopId: mongoose.Schema.Types.ObjectId,
    reason: String
  }],
  vehicleCondition: {
    startingFuel: Number, // percentage
    endingFuel: Number, // percentage
    odometerStart: Number,
    odometerEnd: Number,
    issues: [String]
  },
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'video', 'document', 'other']
    },
    url: String,
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  verifiedBy: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    timestamp: {
      type: Date
    },
    comments: String
  },
  reviewNotes: String,
  schoolId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SchoolDetail',
    required: true,
    index: true
  },
  metaData: [{
    key: { type: String },
    value: mongoose.Schema.Types.Mixed
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true } 
});

// Compound indexes for more efficient querying
attendanceSchema.index({ date: 1, routeId: 1, journey: 1, direction: 1 }, { unique: true });
attendanceSchema.index({ date: 1, schoolId: 1 });
attendanceSchema.index({ date: 1, vehicleId: 1 });
attendanceSchema.index({ date: 1, driverId: 1 });
attendanceSchema.index({ 'students.studentId': 1, date: 1 });
attendanceSchema.index({ 'students.status': 1, date: 1 });
attendanceSchema.index({ routeCompletion: 1, date: 1 });

// Virtual for attendance statistics
attendanceSchema.virtual('stats').get(function() {
  if (!this.students || this.students.length === 0) {
    return {
      total: 0,
      present: 0,
      absent: 0,
      late: 0,
      unscheduled: 0,
      attendanceRate: 0
    };
  }
  
  const stats = {
    total: this.students.length,
    present: 0,
    absent: 0,
    late: 0,
    leftEarly: 0,
    unscheduled: 0,
    notRequired: 0
  };
  
  this.students.forEach(student => {
    switch(student.status) {
      case 'present':
        stats.present++;
        break;
      case 'absent':
        stats.absent++;
        break;
      case 'late':
        stats.late++;
        break;
      case 'left-early':
        stats.leftEarly++;
        break;
      case 'unscheduled':
        stats.unscheduled++;
        break;
      case 'not-required':
        stats.notRequired++;
        break;
    }
  });
  
  // Calculate expected students (excluding those not required)
  const expectedStudents = stats.total - stats.notRequired;
  
  // Calculate attendance rate (present + late) / expected
  stats.attendanceRate = expectedStudents ? 
    ((stats.present + stats.late) / expectedStudents) * 100 : 0;
  
  return stats;
});

// Method to check if all attendance is taken
attendanceSchema.methods.isAttendanceComplete = function() {
  if (!this.students || this.students.length === 0) {
    return false;
  }
  
  // Check if any student has no status or unscheduled status
  return !this.students.some(student => 
    !student.status || student.status === 'unscheduled'
  );
};

// Static method to get attendance for a student over a date range
attendanceSchema.statics.getStudentAttendance = async function(studentId, startDate, endDate) {
  return this.find({
    'students.studentId': studentId,
    date: { $gte: startDate, $lte: endDate }
  })
  .sort({ date: 1 })
  .select('date journey direction students.$')
  .lean();
};

const TransportAttendance = mongoose.model('TransportAttendance', attendanceSchema);

module.exports = TransportAttendance; 