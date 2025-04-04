const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LibraryBook",
    required: true,
    index: true
  },
  accessionNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  rfidTag: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  status: {
    type: String,
    enum: ["available", "checked-out", "on-hold", "in-transit", "lost", "damaged", "being-repaired", "withdrawn", "reserved", "processing"],
    default: "processing",
    index: true
  },
  format: {
    type: String,
    enum: ["print", "ebook", "audiobook", "cd", "dvd", "magazine", "journal", "reference", "other"],
    default: "print"
  },
  acquisition: {
    type: {
      type: String,
      enum: ["purchase", "donation", "subscription", "exchange", "other"],
      default: "purchase"
    },
    date: {
      type: Date,
      default: Date.now
    },
    source: String,
    price: Number,
    currency: {
      type: String,
      default: "INR"
    },
    orderNumber: String,
    donatedBy: String,
    donationDate: Date,
    notes: String
  },
  condition: {
    status: {
      type: String,
      enum: ["new", "excellent", "good", "fair", "poor", "damaged", "unusable"],
      default: "new"
    },
    notes: String,
    lastInspectionDate: Date,
    repairHistory: [{
      date: Date,
      description: String,
      cost: Number,
      performedBy: String,
      result: {
        type: String,
        enum: ["repaired", "partially-repaired", "beyond-repair"],
      }
    }]
  },
  location: {
    section: {
      type: String,
      index: true
    },
    shelf: String,
    row: String,
    position: String,
    isReservedShelf: {
      type: Boolean,
      default: false
    },
    temporary: {
      isTemporary: {
        type: Boolean,
        default: false
      },
      location: String,
      until: Date,
      reason: String
    },
    notes: String
  },
  circulation: {
    isCirculable: {
      type: Boolean,
      default: true
    },
    maxLoanPeriod: {
      type: Number,
      default: 14
    }, // in days
    maxRenewals: {
      type: Number,
      default: 2
    },
    isReferenceMaterial: {
      type: Boolean,
      default: false
    },
    specialCirculationRules: String
  },
  currentLoan: {
    borrowerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },
    borrowerType: {
      type: String,
      enum: ["student", "teacher", "staff", "guest"]
    },
    checkoutDate: Date,
    dueDate: Date,
    renewalCount: {
      type: Number,
      default: 0
    },
    renewalHistory: [{
      renewalDate: Date,
      previousDueDate: Date,
      newDueDate: Date,
      renewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      notes: String
    }],
    overdue: {
      type: Boolean,
      default: false
    },
    overdueNotificationsSent: {
      type: Number,
      default: 0
    },
    lastOverdueNotification: Date,
    notes: String
  },
  reservation: {
    isReserved: {
      type: Boolean,
      default: false
    },
    reservedFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    reservationType: {
      type: String,
      enum: ["in-advance", "when-available", "hold-on-return"]
    },
    reservationDate: Date,
    expiryDate: Date,
    notificationSent: {
      type: Boolean,
      default: false
    },
    notificationDate: Date,
    priority: {
      type: Number,
      default: 0
    },
    notes: String
  },
  usage: {
    totalCheckouts: {
      type: Number,
      default: 0
    },
    lastCheckoutDate: Date,
    returnsOnTime: {
      type: Number,
      default: 0
    },
    returnsLate: {
      type: Number,
      default: 0
    },
    averageLoanDuration: Number, // in days
    checkoutHistory: [{
      borrowerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      checkoutDate: Date,
      returnDate: Date,
      onTime: Boolean
    }]
  },
  physicalAttributes: {
    hasDustJacket: Boolean,
    hasCoverProtection: Boolean,
    hasBarcode: Boolean,
    hasSpineLabel: Boolean,
    additionalMarkings: String,
    customModifications: String
  },
  restrictions: {
    restrictedTo: [{
      type: String,
      enum: ["faculty", "students", "researchers", "seniorGrades", "juniorGrades", "specificClasses"]
    }],
    specificClasses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class"
    }],
    notes: String
  },
  notes: [{
    date: {
      type: Date,
      default: Date.now
    },
    text: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    type: {
      type: String,
      enum: ["general", "condition", "circulation", "acquisitions", "cataloging"],
      default: "general"
    },
    isPublic: {
      type: Boolean,
      default: false
    }
  }],
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  deaccessionInfo: {
    isDeaccessioned: {
      type: Boolean,
      default: false
    },
    date: Date,
    reason: {
      type: String,
      enum: ["damaged", "lost", "obsolete", "duplicate", "low-usage", "inappropriate", "other"]
    },
    notes: String,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    disposalMethod: {
      type: String,
      enum: ["discarded", "donated", "sold", "recycled", "other"]
    }
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SchoolDetail",
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

// Compound indexes for efficient queries
itemSchema.index({ status: 1, schoolId: 1 });
itemSchema.index({ bookId: 1, status: 1 });
itemSchema.index({ 'currentLoan.borrowerId': 1, status: 1 });
itemSchema.index({ 'currentLoan.dueDate': 1, 'currentLoan.overdue': 1 });
itemSchema.index({ 'reservation.isReserved': 1, 'reservation.expiryDate': 1 });
itemSchema.index({ 'location.section': 1, status: 1 });

// Virtual for due date status
itemSchema.virtual('dueStatus').get(function() {
  if (!this.currentLoan || !this.currentLoan.dueDate) {
    return null;
  }
  
  const now = new Date();
  const dueDate = new Date(this.currentLoan.dueDate);
  const diffDays = Math.floor((dueDate - now) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return {
      status: 'overdue',
      days: Math.abs(diffDays)
    };
  } else if (diffDays === 0) {
    return {
      status: 'due-today'
    };
  } else if (diffDays <= 2) {
    return {
      status: 'due-soon',
      days: diffDays
    };
  } else {
    return {
      status: 'on-time',
      days: diffDays
    };
  }
});

// Pre-save hook to update loan status
itemSchema.pre('save', function(next) {
  // Update status based on current loan
  if (this.currentLoan && this.currentLoan.borrowerId && this.currentLoan.dueDate) {
    this.status = 'checked-out';
    
    // Check if overdue
    const now = new Date();
    const dueDate = new Date(this.currentLoan.dueDate);
    if (now > dueDate) {
      this.currentLoan.overdue = true;
    }
  } else if (this.reservation && this.reservation.isReserved) {
    this.status = 'reserved';
  }
  
  next();
});

// Static method to find items due soon
itemSchema.statics.findDueSoonItems = function(daysThreshold = 3) {
  const today = new Date();
  const thresholdDate = new Date();
  thresholdDate.setDate(today.getDate() + daysThreshold);
  
  return this.find({
    status: 'checked-out',
    'currentLoan.dueDate': { $gte: today, $lte: thresholdDate },
    'currentLoan.overdue': false
  })
  .populate('bookId', 'title authors')
  .populate('currentLoan.borrowerId', 'name email')
  .sort({ 'currentLoan.dueDate': 1 });
};

// Static method to find overdue items
itemSchema.statics.findOverdueItems = function() {
  const today = new Date();
  
  return this.find({
    status: 'checked-out',
    'currentLoan.dueDate': { $lt: today }
  })
  .populate('bookId', 'title authors')
  .populate('currentLoan.borrowerId', 'name email')
  .sort({ 'currentLoan.dueDate': 1 });
};

// Instance method to check if item can be renewed
itemSchema.methods.canBeRenewed = function() {
  if (this.status !== 'checked-out' || !this.currentLoan) {
    return { renewable: false, reason: 'Item not checked out' };
  }
  
  if (this.currentLoan.renewalCount >= this.circulation.maxRenewals) {
    return { renewable: false, reason: 'Maximum renewals reached' };
  }
  
  if (this.reservation && this.reservation.isReserved) {
    return { renewable: false, reason: 'Item is reserved by another user' };
  }
  
  return { renewable: true };
};

const LibraryItem = mongoose.model('LibraryItem', itemSchema);

module.exports = LibraryItem; 