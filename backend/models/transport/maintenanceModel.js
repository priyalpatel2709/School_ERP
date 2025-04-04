const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TransportVehicle',
    required: true,
    index: true
  },
  maintenanceType: {
    type: String,
    enum: ['scheduled', 'repair', 'inspection', 'accident', 'recall', 'upgrade', 'other'],
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'delayed'],
    default: 'scheduled',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  scheduledDate: {
    type: Date,
    required: true,
    index: true
  },
  startDate: Date,
  completionDate: Date,
  estimatedDuration: Number, // in hours
  actualDuration: Number, // in hours
  description: {
    type: String,
    required: true
  },
  tasks: [{
    description: String,
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'skipped'],
      default: 'pending'
    },
    assignedTo: String,
    estimatedTime: Number, // in hours
    actualTime: Number, // in hours
    notes: String
  }],
  partsReplaced: [{
    partName: String,
    partNumber: String,
    quantity: Number,
    unitCost: Number,
    totalCost: Number,
    supplier: String,
    warrantyPeriod: String,
    notes: String
  }],
  serviceProvider: {
    name: String,
    type: {
      type: String,
      enum: ['in-house', 'dealer', 'external-workshop', 'mobile-service', 'other']
    },
    contactPerson: String,
    contactNumber: String,
    email: String,
    address: String
  },
  odometerReading: {
    start: Number,
    end: Number
  },
  cost: {
    laborCost: Number,
    partsCost: Number, 
    miscCost: Number,
    totalCost: Number,
    currency: {
      type: String,
      default: 'INR'
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'partially-paid', 'paid'],
      default: 'unpaid'
    },
    invoice: {
      invoiceNumber: String,
      invoiceDate: Date,
      invoiceAmount: Number,
      invoiceCopy: String // URL to invoice document
    }
  },
  issues: [{
    description: String,
    diagnosis: String,
    solution: String,
    isCritical: {
      type: Boolean,
      default: false
    }
  }],
  recommendations: [{
    description: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    timeframe: String // e.g., "within 3 months", "next service"
  }],
  documents: [{
    type: {
      type: String,
      enum: ['jobcard', 'invoice', 'diagnosis', 'warranty', 'parts-certificate', 'photo', 'video', 'other']
    },
    title: String,
    url: String,
    uploadDate: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  nextMaintenanceDate: {
    type: Date,
    index: true
  },
  nextMaintenanceOdometer: Number,
  requestedBy: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    date: {
      type: Date,
      default: Date.now
    }
  },
  approvedBy: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    date: Date,
    notes: String
  },
  performedBy: [{
    name: String,
    role: String,
    contactNumber: String,
    email: String,
    tasks: [String]
  }],
  verifiedBy: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    date: Date,
    qualityRating: {
      type: Number,
      min: 1,
      max: 5
    },
    notes: String
  },
  serviceFeedback: {
    rating: {
      type: Number, 
      min: 1,
      max: 5
    },
    comments: String,
    providedBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      name: String,
      date: Date
    }
  },
  customFields: [{
    fieldName: String,
    fieldValue: mongoose.Schema.Types.Mixed
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

// Compound indexes for more efficient querying
maintenanceSchema.index({ vehicleId: 1, status: 1 });
maintenanceSchema.index({ vehicleId: 1, scheduledDate: 1 });
maintenanceSchema.index({ status: 1, scheduledDate: 1 });
maintenanceSchema.index({ scheduledDate: 1, schoolId: 1 });
maintenanceSchema.index({ 'cost.paymentStatus': 1, schoolId: 1 });
maintenanceSchema.index({ nextMaintenanceDate: 1, vehicleId: 1 });

// Virtual for total cost calculation
maintenanceSchema.virtual('totalCostCalculated').get(function() {
  let total = 0;
  
  if (this.cost) {
    total += this.cost.laborCost || 0;
    total += this.cost.partsCost || 0;
    total += this.cost.miscCost || 0;
  }
  
  return total;
});

// Virtual for maintenance duration
maintenanceSchema.virtual('duration').get(function() {
  if (!this.startDate || !this.completionDate) {
    return null;
  }
  
  const start = new Date(this.startDate);
  const end = new Date(this.completionDate);
  
  // Return duration in hours
  return Math.round((end - start) / (1000 * 60 * 60) * 10) / 10;
});

// Method to calculate cost breakdown
maintenanceSchema.methods.getCostBreakdown = function() {
  const totalCost = this.cost?.totalCost || this.totalCostCalculated || 0;
  
  if (totalCost === 0) {
    return {
      labor: 0,
      parts: 0,
      misc: 0
    };
  }
  
  return {
    labor: ((this.cost?.laborCost || 0) / totalCost) * 100,
    parts: ((this.cost?.partsCost || 0) / totalCost) * 100,
    misc: ((this.cost?.miscCost || 0) / totalCost) * 100
  };
};

// Pre-save hook to update total cost
maintenanceSchema.pre('save', function(next) {
  if (this.cost) {
    const laborCost = this.cost.laborCost || 0;
    const partsCost = this.cost.partsCost || 0;
    const miscCost = this.cost.miscCost || 0;
    
    this.cost.totalCost = laborCost + partsCost + miscCost;
  }
  
  // If maintenance is completed, ensure completion date is set
  if (this.status === 'completed' && !this.completionDate) {
    this.completionDate = new Date();
  }
  
  next();
});

// Static method to find vehicles due for maintenance
maintenanceSchema.statics.findVehiclesDueForMaintenance = async function(daysThreshold = 7) {
  const today = new Date();
  const thresholdDate = new Date();
  thresholdDate.setDate(today.getDate() + daysThreshold);
  
  return this.aggregate([
    {
      $match: {
        nextMaintenanceDate: { $gte: today, $lte: thresholdDate }
      }
    },
    {
      $group: {
        _id: '$vehicleId',
        dueMaintenances: {
          $push: {
            _id: '$_id',
            title: '$title',
            maintenanceType: '$maintenanceType',
            nextMaintenanceDate: '$nextMaintenanceDate'
          }
        }
      }
    },
    {
      $lookup: {
        from: 'transportvehicles',
        localField: '_id',
        foreignField: '_id',
        as: 'vehicle'
      }
    },
    {
      $unwind: '$vehicle'
    },
    {
      $project: {
        _id: 1,
        vehicle: {
          _id: 1,
          regNumber: 1,
          type: 1,
          make: 1,
          model: 1
        },
        dueMaintenances: 1
      }
    }
  ]);
};

const TransportMaintenance = mongoose.model('TransportMaintenance', maintenanceSchema);

module.exports = TransportMaintenance; 