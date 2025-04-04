const mongoose = require("mongoose");

const borrowingRecordSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LibraryItem",
    required: true,
    index: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LibraryBook",
    required: true,
    index: true
  },
  borrowerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  borrowerType: {
    type: String,
    enum: ["student", "teacher", "staff", "guest"],
    required: true
  },
  checkoutDate: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  dueDate: {
    type: Date,
    required: true,
    index: true
  },
  returnDate: {
    type: Date,
    default: null,
    index: true
  },
  returnedToLibrarianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  issuedByLibrarianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  renewalCount: {
    type: Number,
    default: 0
  },
  renewalHistory: [{
    renewalDate: {
      type: Date,
      required: true
    },
    previousDueDate: {
      type: Date,
      required: true
    },
    newDueDate: {
      type: Date,
      required: true
    },
    renewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    notes: String
  }],
  returnStatus: {
    type: String,
    enum: ["on-time", "late", "damaged", "lost", null],
    default: null
  },
  returnCondition: {
    type: String,
    enum: ["unchanged", "minor-damage", "major-damage", "unusable", null],
    default: null
  },
  lateFee: {
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: "INR"
    },
    paid: {
      type: Boolean,
      default: false
    },
    paidDate: Date,
    waived: {
      type: Boolean,
      default: false
    },
    waivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    waivedReason: String
  },
  damageFee: {
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: "INR"
    },
    paid: {
      type: Boolean,
      default: false
    },
    paidDate: Date,
    waived: {
      type: Boolean,
      default: false
    },
    waivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    waivedReason: String
  },
  lostFee: {
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: "INR"
    },
    paid: {
      type: Boolean,
      default: false
    },
    paidDate: Date,
    waived: {
      type: Boolean,
      default: false
    },
    waivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    waivedReason: String
  },
  remindersSent: [{
    date: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      enum: ["upcoming-due", "due-today", "overdue", "renewal-reminder", "hold-available"],
      required: true
    },
    method: {
      type: String,
      enum: ["email", "sms", "app-notification", "in-person"],
      required: true
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    messageContent: String,
    successful: {
      type: Boolean,
      default: true
    }
  }],
  notes: [{
    date: {
      type: Date,
      default: Date.now
    },
    text: {
      type: String,
      required: true
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      enum: ["general", "renewal", "return", "fee", "damage", "system"],
      default: "general"
    }
  }],
  status: {
    type: String,
    enum: ["active", "returned", "overdue", "lost", "claimed-returned"],
    default: "active",
    index: true
  },
  academicYear: {
    type: String,
    index: true
  },
  semester: String,
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SchoolDetail",
    required: true,
    index: true
  },
  metaData: [{
    key: { 
      type: String 
    },
    value: mongoose.Schema.Types.Mixed
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Compound indexes for frequent queries
borrowingRecordSchema.index({ borrowerId: 1, status: 1 });
borrowingRecordSchema.index({ bookId: 1, status: 1 });
borrowingRecordSchema.index({ dueDate: 1, status: 1 });
borrowingRecordSchema.index({ schoolId: 1, status: 1 });
borrowingRecordSchema.index({ borrowerType: 1, schoolId: 1 });
borrowingRecordSchema.index({ checkoutDate: 1, borrowerId: 1 });

// Virtual for calculating days overdue
borrowingRecordSchema.virtual('daysOverdue').get(function() {
  if (this.returnDate || !this.dueDate) {
    return 0;
  }
  
  const now = new Date();
  const dueDate = new Date(this.dueDate);
  if (now <= dueDate) {
    return 0;
  }
  
  const diffInMs = now - dueDate;
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
});

// Virtual for calculating late fee in real-time
borrowingRecordSchema.virtual('currentLateFee').get(function() {
  if (this.returnDate || !this.dueDate || this.lateFee.paid || this.lateFee.waived) {
    return this.lateFee.amount;
  }
  
  // Calculate days overdue
  const daysOverdue = this.daysOverdue;
  if (daysOverdue <= 0) {
    return 0;
  }
  
  // Assume a daily late fee of 1 (currency units) or use from configuration
  const dailyLateFee = 1;
  return daysOverdue * dailyLateFee;
});

// Virtual for calculating total fees
borrowingRecordSchema.virtual('totalFees').get(function() {
  // If the book is still checked out, use current late fee, otherwise use recorded late fee
  const lateFeeAmount = this.returnDate ? this.lateFee.amount : this.currentLateFee;
  
  return {
    total: lateFeeAmount + this.damageFee.amount + this.lostFee.amount,
    breakdown: {
      lateFee: lateFeeAmount,
      damageFee: this.damageFee.amount,
      lostFee: this.lostFee.amount
    },
    paid: (this.lateFee.paid && this.damageFee.paid && this.lostFee.paid),
    partiallyPaid: (this.lateFee.paid || this.damageFee.paid || this.lostFee.paid)
  };
});

// Virtual for loan duration
borrowingRecordSchema.virtual('loanDuration').get(function() {
  if (!this.checkoutDate) {
    return 0;
  }
  
  const endDate = this.returnDate || new Date();
  const startDate = new Date(this.checkoutDate);
  const diffInMs = endDate - startDate;
  
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to update status
borrowingRecordSchema.pre('save', function(next) {
  // If already returned, keep status as returned
  if (this.returnDate) {
    this.status = 'returned';
    next();
    return;
  }
  
  // Check if overdue
  const now = new Date();
  const dueDate = new Date(this.dueDate);
  
  if (now > dueDate) {
    this.status = 'overdue';
  } else {
    this.status = 'active';
  }
  
  next();
});

// Static method to find all overdue records
borrowingRecordSchema.statics.findOverdueRecords = function(schoolId, daysThreshold = 0) {
  const today = new Date();
  const thresholdDate = new Date(today);
  thresholdDate.setDate(today.getDate() - daysThreshold);
  
  return this.find({
    schoolId,
    status: 'overdue',
    returnDate: null,
    dueDate: { $lte: thresholdDate }
  })
  .populate('itemId', 'accessionNumber barcode')
  .populate('bookId', 'title authors isbn')
  .populate('borrowerId', 'name email phone')
  .sort({ dueDate: 1 });
};

// Static method to find records due soon
borrowingRecordSchema.statics.findDueSoonRecords = function(schoolId, daysThreshold = 3) {
  const today = new Date();
  const futureDateThreshold = new Date(today);
  futureDateThreshold.setDate(today.getDate() + daysThreshold);
  
  return this.find({
    schoolId,
    status: 'active',
    returnDate: null,
    dueDate: { $gte: today, $lte: futureDateThreshold }
  })
  .populate('itemId', 'accessionNumber barcode')
  .populate('bookId', 'title authors isbn')
  .populate('borrowerId', 'name email phone')
  .sort({ dueDate: 1 });
};

// Static method to find borrower's checkout history
borrowingRecordSchema.statics.findBorrowerHistory = function(borrowerId, schoolId, limit = 50) {
  return this.find({ borrowerId, schoolId })
    .populate('itemId', 'accessionNumber barcode')
    .populate('bookId', 'title authors isbn coverImage')
    .sort({ checkoutDate: -1 })
    .limit(limit);
};

// Static method to find active checkouts by borrower
borrowingRecordSchema.statics.findActiveCheckouts = function(borrowerId, schoolId) {
  return this.find({
    borrowerId,
    schoolId,
    returnDate: null
  })
  .populate('itemId', 'accessionNumber barcode')
  .populate('bookId', 'title authors isbn coverImage')
  .sort({ dueDate: 1 });
};

// Instance method to mark as returned
borrowingRecordSchema.methods.markAsReturned = function(returnedToLibrarianId, condition, notes) {
  const now = new Date();
  
  this.returnDate = now;
  this.returnedToLibrarianId = returnedToLibrarianId;
  
  if (condition) {
    this.returnCondition = condition;
  }
  
  // Determine return status
  if (now > this.dueDate) {
    this.returnStatus = 'late';
    
    // Calculate late fee if applicable
    const daysLate = Math.floor((now - this.dueDate) / (1000 * 60 * 60 * 24));
    const dailyLateFee = 1; // This could come from configuration
    this.lateFee.amount = daysLate * dailyLateFee;
  } else {
    this.returnStatus = 'on-time';
  }
  
  // Add note if provided
  if (notes) {
    this.notes.push({
      date: now,
      text: notes,
      addedBy: returnedToLibrarianId,
      type: 'return'
    });
  }
  
  this.status = 'returned';
  
  return this.save();
};

// Instance method to register damage
borrowingRecordSchema.methods.registerDamage = function(damageLevel, feeAmount, notes, userId) {
  this.returnCondition = damageLevel || 'minor-damage';
  
  if (feeAmount > 0) {
    this.damageFee.amount = feeAmount;
  }
  
  if (notes) {
    this.notes.push({
      date: new Date(),
      text: notes,
      addedBy: userId,
      type: 'damage'
    });
  }
  
  return this.save();
};

// Instance method to renew loan
borrowingRecordSchema.methods.renewLoan = function(newDueDate, renewedBy, notes) {
  const now = new Date();
  
  // Store previous due date before changing
  const previousDueDate = new Date(this.dueDate);
  
  // Update the due date
  this.dueDate = new Date(newDueDate);
  this.renewalCount += 1;
  
  // Add to renewal history
  this.renewalHistory.push({
    renewalDate: now,
    previousDueDate,
    newDueDate: new Date(newDueDate),
    renewedBy,
    notes
  });
  
  // If item was overdue, it's now active again
  if (this.status === 'overdue') {
    this.status = 'active';
  }
  
  // Add a note about the renewal
  this.notes.push({
    date: now,
    text: notes || `Loan renewed. New due date: ${new Date(newDueDate).toDateString()}`,
    addedBy: renewedBy,
    type: 'renewal'
  });
  
  return this.save();
};

const BorrowingRecord = mongoose.model('BorrowingRecord', borrowingRecordSchema);

module.exports = BorrowingRecord; 