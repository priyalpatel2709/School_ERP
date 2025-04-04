const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    trim: true,
    index: true 
  },
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: String,
  type: {
    type: String,
    enum: ['regular', 'special', 'event', 'emergency'],
    default: 'regular',
    index: true
  },
  startPoint: {
    name: { type: String, required: true },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: [Number] // [longitude, latitude]
    }
  },
  endPoint: {
    name: { type: String, required: true },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: [Number] // [longitude, latitude]
    }
  },
  stops: [{
    name: { 
      type: String, 
      required: true 
    },
    sequence: { 
      type: Number, 
      required: true 
    },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: [Number] // [longitude, latitude]
    },
    arrivalTime: String, // Format: HH:MM
    departureTime: String, // Format: HH:MM
    waitTime: Number, // in minutes
    landmark: String,
    students: [{
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
      },
      direction: {
        type: String,
        enum: ['pickup', 'dropoff', 'both'],
        default: 'both'
      }
    }]
  }],
  distance: { 
    type: Number, // in kilometers
    min: 0
  },
  estimatedTime: { 
    type: Number, // in minutes
    min: 0 
  },
  operationalDays: [{ 
    type: String, 
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] 
  }],
  schedule: {
    morningDeparture: String, // Format: HH:MM
    afternoonDeparture: String, // Format: HH:MM
    eveningDeparture: String, // Format: HH:MM
    customSchedules: [{
      label: String,
      time: String,
      days: [{ 
        type: String, 
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] 
      }]
    }]
  },
  isActive: { 
    type: Boolean, 
    default: true, 
    index: true 
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  area: {
    zone: String,
    district: String,
    city: String,
    state: String
  },
  fees: [{
    distanceRange: {
      min: Number, // in kilometers
      max: Number  // in kilometers
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    frequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'semi-annual', 'annual'],
      default: 'monthly'
    }
  }],
  restrictions: {
    maxStudents: Number,
    maxCapacity: Number,
    vehicleTypes: [{
      type: String,
      enum: ['bus', 'van', 'car', 'minibus', 'other']
    }]
  },
  safetyNotes: String,
  trafficConditions: String,
  mapImageUrl: String,
  routePathCoordinates: [{
    lat: Number,
    lng: Number,
    sequence: Number
  }],
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

// Indexing for common queries
routeSchema.index({ isActive: 1, schoolId: 1 });
routeSchema.index({ 'startPoint.location': '2dsphere' });
routeSchema.index({ 'endPoint.location': '2dsphere' });
routeSchema.index({ 'stops.location': '2dsphere' });
routeSchema.index({ code: 1, schoolId: 1 }, { unique: true });
routeSchema.index({ 'type': 1, isActive: 1 });

// Virtual for student count
routeSchema.virtual('studentCount').get(function() {
  if (!this.stops) return 0;
  
  const uniqueStudentIds = new Set();
  
  this.stops.forEach(stop => {
    if (stop.students && stop.students.length > 0) {
      stop.students.forEach(student => {
        if (student.studentId) {
          uniqueStudentIds.add(student.studentId.toString());
        }
      });
    }
  });
  
  return uniqueStudentIds.size;
});

// Method to find stops near a location
routeSchema.statics.findStopsNearLocation = async function(coordinates, maxDistance = 1000) {
  return this.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $unwind: '$stops'
    },
    {
      $match: {
        'stops.location': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: coordinates
            },
            $maxDistance: maxDistance // in meters
          }
        }
      }
    },
    {
      $project: {
        _id: 1,
        code: 1,
        name: 1,
        stop: '$stops'
      }
    }
  ]);
};

// Method to calculate the capacity utilization of a route
routeSchema.methods.getCapacityUtilization = function() {
  const studentCount = this.studentCount;
  
  if (!studentCount || !this.restrictions || !this.restrictions.maxStudents) {
    return null;
  }
  
  return (studentCount / this.restrictions.maxStudents) * 100;
};

const TransportRoute = mongoose.model('TransportRoute', routeSchema);

module.exports = TransportRoute; 