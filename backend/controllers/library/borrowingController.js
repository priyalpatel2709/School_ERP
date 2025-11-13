const { BorrowingRecord, LibraryItem, LibraryBook } = require('../../models/library');
const { catchAsync } = require('../../utils/errorHandlers');
const AppError = require('../../utils/appError');
const mongoose = require('mongoose');

// Get all borrowing records with filtering and pagination
exports.getAllBorrowingRecords = catchAsync(async (req, res) => {
  const query = { schoolId: req.user.schoolId };
  
  // Apply filters
  if (req.query.status) query.status = req.query.status;
  if (req.query.borrowerId) query.borrowerId = req.query.borrowerId;
  if (req.query.bookId) query.bookId = req.query.bookId;
  if (req.query.itemId) query.itemId = req.query.itemId;
  if (req.query.borrowerType) query.borrowerType = req.query.borrowerType;
  if (req.query.academicYear) query.academicYear = req.query.academicYear;
  
  // Date range filters
  if (req.query.checkoutAfter) {
    query.checkoutDate = { $gte: new Date(req.query.checkoutAfter) };
  }
  
  if (req.query.checkoutBefore) {
    query.checkoutDate = query.checkoutDate || {};
    query.checkoutDate.$lte = new Date(req.query.checkoutBefore);
  }
  
  if (req.query.dueAfter) {
    query.dueDate = { $gte: new Date(req.query.dueAfter) };
  }
  
  if (req.query.dueBefore) {
    query.dueDate = query.dueDate || {};
    query.dueDate.$lte = new Date(req.query.dueBefore);
  }
  
  if (req.query.returnAfter) {
    query.returnDate = { $gte: new Date(req.query.returnAfter) };
  }
  
  if (req.query.returnBefore) {
    query.returnDate = query.returnDate || {};
    query.returnDate.$lte = new Date(req.query.returnBefore);
  }
  
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = (page - 1) * limit;
  
  // Sort options
  const sortBy = req.query.sortBy || 'checkoutDate';
  const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
  const sort = { [sortBy]: sortOrder };
  
  // Execute query with pagination, sorting and population
  const records = await BorrowingRecord.find(query)
    .populate('itemId', 'accessionNumber barcode')
    .populate('bookId', 'title authors isbn publisher')
    .populate('borrowerId', 'name email phone')
    .populate('issuedByLibrarianId', 'name')
    .sort(sort)
    .skip(skip)
    .limit(limit);
  
  const totalRecords = await BorrowingRecord.countDocuments(query);
  
  res.status(200).json({
    status: 'success',
    results: records.length,
    pagination: {
      total: totalRecords,
      page,
      limit,
      pages: Math.ceil(totalRecords / limit)
    },
    data: records
  });
});

// Get a single borrowing record by ID
exports.getBorrowingRecord = catchAsync(async (req, res, next) => {
  const record = await BorrowingRecord.findOne({
    _id: req.params.id,
    schoolId: req.user.schoolId
  })
  .populate('itemId')
  .populate('bookId')
  .populate('borrowerId', 'name email phone')
  .populate('issuedByLibrarianId', 'name')
  .populate('returnedToLibrarianId', 'name')
  .populate('renewalHistory.renewedBy', 'name');
  
  if (!record) {
    return next(new AppError('No borrowing record found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: record
  });
});

// Create new borrowing record (checkout an item)
exports.createBorrowingRecord = catchAsync(async (req, res, next) => {
  const { 
    itemId, 
    borrowerId, 
    borrowerType, 
    dueDate, 
    notes, 
    academicYear, 
    semester 
  } = req.body;
  
  if (!itemId || !borrowerId || !borrowerType || !dueDate) {
    return next(new AppError('Please provide item ID, borrower ID, borrower type and due date', 400));
  }
  
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Find the item and ensure it's available
    const item = await LibraryItem.findOne({
      _id: itemId,
      schoolId: req.user.schoolId,
      status: 'available'
    }).session(session);
    
    if (!item) {
      throw new AppError('Item not found or not available for checkout', 404);
    }
    
    // If item is reserved, ensure it's for this borrower
    if (item.reservation && item.reservation.isReserved && 
        item.reservation.reservedFor.toString() !== borrowerId) {
      throw new AppError('Item is reserved for another borrower', 400);
    }
    
    // Update item status
    item.status = 'checked-out';
    item.currentLoan = {
      borrowerId,
      borrowerType,
      checkoutDate: new Date(),
      dueDate: new Date(dueDate),
      renewalCount: 0,
      overdue: false,
      notes
    };
    
    // Update item usage statistics
    item.usage.totalCheckouts += 1;
    item.usage.lastCheckoutDate = new Date();
    item.usage.checkoutHistory.push({
      borrowerId,
      checkoutDate: new Date(),
      onTime: null // Will be set when returned
    });
    
    // Clear reservation if applicable
    if (item.reservation && item.reservation.isReserved) {
      item.reservation.isReserved = false;
    }
    
    item.lastUpdatedBy = req.user._id;
    
    // Create borrowing record
    const borrowingRecord = new BorrowingRecord({
      itemId,
      bookId: item.bookId,
      borrowerId,
      borrowerType,
      checkoutDate: new Date(),
      dueDate: new Date(dueDate),
      issuedByLibrarianId: req.user._id,
      academicYear,
      semester,
      schoolId: req.user.schoolId,
      status: 'active'
    });
    
    // Add note if provided
    if (notes) {
      borrowingRecord.notes.push({
        date: new Date(),
        text: notes,
        addedBy: req.user._id,
        type: 'general'
      });
    }
    
    await item.save({ session });
    await borrowingRecord.save({ session });
    
    await session.commitTransaction();
    
    res.status(201).json({
      status: 'success',
      data: borrowingRecord
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});

// Return an item
exports.returnItem = catchAsync(async (req, res, next) => {
  const { 
    condition, 
    returnCondition, 
    returnNotes 
  } = req.body;
  
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Find the borrowing record
    const borrowingRecord = await BorrowingRecord.findOne({
      _id: req.params.id,
      schoolId: req.user.schoolId,
      returnDate: null // Ensure the item hasn't been returned yet
    }).session(session);
    
    if (!borrowingRecord) {
      throw new AppError('No active borrowing record found with that ID', 404);
    }
    
    // Find the corresponding item
    const item = await LibraryItem.findOne({
      _id: borrowingRecord.itemId,
      schoolId: req.user.schoolId,
      status: 'checked-out'
    }).session(session);
    
    if (!item) {
      throw new AppError('Associated library item not found or not checked out', 404);
    }
    
    // Mark the borrowing record as returned
    await borrowingRecord.markAsReturned(
      req.user._id,
      returnCondition,
      returnNotes
    );
    
    // Update the item's condition if provided
    if (condition) {
      item.condition.status = condition;
      item.condition.lastInspectionDate = new Date();
      if (returnNotes) {
        item.condition.notes = returnNotes;
      }
    }
    
    // Reset the item status based on reservations
    if (item.reservation && item.reservation.isReserved) {
      item.status = 'on-hold';
      
      // Add a note about the reservation
      item.notes.push({
        date: new Date(),
        text: `Item returned and placed on hold for reservation ID: ${item.reservation.reservedFor}`,
        addedBy: req.user._id,
        type: 'circulation'
      });
    } else {
      item.status = 'available';
    }
    
    // Clear current loan
    item.currentLoan = null;
    item.lastUpdatedBy = req.user._id;
    
    // Update return status in checkout history
    if (item.usage.checkoutHistory.length > 0) {
      const lastCheckout = item.usage.checkoutHistory[item.usage.checkoutHistory.length - 1];
      
      if (!lastCheckout.returnDate) {
        lastCheckout.returnDate = new Date();
        
        // Check if returned on time
        const dueDate = new Date(borrowingRecord.dueDate);
        const now = new Date();
        const onTime = now <= dueDate;
        lastCheckout.onTime = onTime;
        
        // Update return statistics
        if (onTime) {
          item.usage.returnsOnTime += 1;
        } else {
          item.usage.returnsLate += 1;
        }
      }
    }
    
    await item.save({ session });
    
    await session.commitTransaction();
    
    res.status(200).json({
      status: 'success',
      data: borrowingRecord
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});

// Renew a loan
exports.renewLoan = catchAsync(async (req, res, next) => {
  const { newDueDate, notes } = req.body;
  
  if (!newDueDate) {
    return next(new AppError('Please provide a new due date', 400));
  }
  
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Find the borrowing record
    const borrowingRecord = await BorrowingRecord.findOne({
      _id: req.params.id,
      schoolId: req.user.schoolId,
      returnDate: null // Ensure the item hasn't been returned yet
    }).session(session);
    
    if (!borrowingRecord) {
      throw new AppError('No active borrowing record found with that ID', 404);
    }
    
    // Find the corresponding item
    const item = await LibraryItem.findOne({
      _id: borrowingRecord.itemId,
      schoolId: req.user.schoolId,
      status: 'checked-out'
    }).session(session);
    
    if (!item) {
      throw new AppError('Associated library item not found or not checked out', 404);
    }
    
    // Check if the item can be renewed
    const renewalCheck = item.canBeRenewed();
    if (!renewalCheck.renewable) {
      throw new AppError(`Item cannot be renewed: ${renewalCheck.reason}`, 400);
    }
    
    // Renew the borrowing record
    await borrowingRecord.renewLoan(
      newDueDate,
      req.user._id,
      notes
    );
    
    // Update the item's due date and renewal information
    const previousDueDate = new Date(item.currentLoan.dueDate);
    
    item.currentLoan.dueDate = new Date(newDueDate);
    item.currentLoan.renewalCount += 1;
    item.currentLoan.overdue = false;
    
    // Add to renewal history
    item.currentLoan.renewalHistory.push({
      renewalDate: new Date(),
      previousDueDate,
      newDueDate: new Date(newDueDate),
      renewedBy: req.user._id,
      notes
    });
    
    item.lastUpdatedBy = req.user._id;
    
    await item.save({ session });
    
    await session.commitTransaction();
    
    res.status(200).json({
      status: 'success',
      data: borrowingRecord
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});

// Record book damage
exports.recordDamage = catchAsync(async (req, res, next) => {
  const { damageLevel, feeAmount, notes } = req.body;
  
  if (!damageLevel) {
    return next(new AppError('Please provide damage level', 400));
  }
  
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Find the borrowing record
    const borrowingRecord = await BorrowingRecord.findOne({
      _id: req.params.id,
      schoolId: req.user.schoolId
    }).session(session);
    
    if (!borrowingRecord) {
      throw new AppError('No borrowing record found with that ID', 404);
    }
    
    // Register damage on the borrowing record
    await borrowingRecord.registerDamage(
      damageLevel,
      feeAmount,
      notes,
      req.user._id
    );
    
    // If the item is already returned, update its condition
    if (borrowingRecord.returnDate) {
      const item = await LibraryItem.findById(borrowingRecord.itemId).session(session);
      
      if (item) {
        item.condition.status = damageLevel === 'minor-damage' 
          ? 'fair' 
          : damageLevel === 'major-damage' 
            ? 'poor' 
            : 'damaged';
            
        item.condition.lastInspectionDate = new Date();
        
        if (notes) {
          item.condition.notes = notes;
        }
        
        // If severely damaged, change status
        if (damageLevel === 'unusable') {
          item.status = 'damaged';
        }
        
        item.lastUpdatedBy = req.user._id;
        await item.save({ session });
      }
    }
    
    await session.commitTransaction();
    
    res.status(200).json({
      status: 'success',
      data: borrowingRecord
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});

// Register payment of fees
exports.registerPayment = catchAsync(async (req, res, next) => {
  const { feeType, amount, notes } = req.body;
  
  if (!feeType || !['late', 'damage', 'lost'].includes(feeType)) {
    return next(new AppError('Please provide a valid fee type (late, damage, or lost)', 400));
  }
  
  // Find the borrowing record
  const borrowingRecord = await BorrowingRecord.findOne({
    _id: req.params.id,
    schoolId: req.user.schoolId
  });
  
  if (!borrowingRecord) {
    return next(new AppError('No borrowing record found with that ID', 404));
  }
  
  // Update the corresponding fee
  const feeField = `${feeType}Fee`;
  borrowingRecord[feeField].paid = true;
  borrowingRecord[feeField].paidDate = new Date();
  
  if (amount) {
    borrowingRecord[feeField].amount = amount;
  }
  
  // Add a note
  borrowingRecord.notes.push({
    date: new Date(),
    text: notes || `${feeType} fee payment recorded`,
    addedBy: req.user._id,
    type: 'fee'
  });
  
  await borrowingRecord.save();
  
  res.status(200).json({
    status: 'success',
    data: borrowingRecord
  });
});

// Waive fees
exports.waiveFee = catchAsync(async (req, res, next) => {
  const { feeType, reason } = req.body;
  
  if (!feeType || !['late', 'damage', 'lost'].includes(feeType)) {
    return next(new AppError('Please provide a valid fee type (late, damage, or lost)', 400));
  }
  
  if (!reason) {
    return next(new AppError('Please provide a reason for waiving the fee', 400));
  }
  
  // Find the borrowing record
  const borrowingRecord = await BorrowingRecord.findOne({
    _id: req.params.id,
    schoolId: req.user.schoolId
  });
  
  if (!borrowingRecord) {
    return next(new AppError('No borrowing record found with that ID', 404));
  }
  
  // Update the corresponding fee
  const feeField = `${feeType}Fee`;
  borrowingRecord[feeField].waived = true;
  borrowingRecord[feeField].waivedBy = req.user._id;
  borrowingRecord[feeField].waivedReason = reason;
  
  // Add a note
  borrowingRecord.notes.push({
    date: new Date(),
    text: `${feeType} fee waived: ${reason}`,
    addedBy: req.user._id,
    type: 'fee'
  });
  
  await borrowingRecord.save();
  
  res.status(200).json({
    status: 'success',
    data: borrowingRecord
  });
});

// Mark as lost
exports.markAsLost = catchAsync(async (req, res, next) => {
  const { notes, replacementFee } = req.body;
  
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Find the borrowing record
    const borrowingRecord = await BorrowingRecord.findOne({
      _id: req.params.id,
      schoolId: req.user.schoolId,
      returnDate: null // Ensure the item hasn't been returned yet
    }).session(session);
    
    if (!borrowingRecord) {
      throw new AppError('No active borrowing record found with that ID', 404);
    }
    
    // Update the borrowing record
    borrowingRecord.status = 'lost';
    borrowingRecord.returnStatus = 'lost';
    
    if (replacementFee) {
      borrowingRecord.lostFee.amount = replacementFee;
    }
    
    // Add a note
    borrowingRecord.notes.push({
      date: new Date(),
      text: notes || 'Item marked as lost',
      addedBy: req.user._id,
      type: 'general'
    });
    
    // Find and update the item
    const item = await LibraryItem.findById(borrowingRecord.itemId).session(session);
    
    if (item) {
      item.status = 'lost';
      item.currentLoan = null;
      
      // Add a note to the item
      item.notes.push({
        date: new Date(),
        text: notes || 'Item marked as lost',
        addedBy: req.user._id,
        type: 'condition'
      });
      
      item.lastUpdatedBy = req.user._id;
      await item.save({ session });
    }
    
    await borrowingRecord.save({ session });
    
    await session.commitTransaction();
    
    res.status(200).json({
      status: 'success',
      data: borrowingRecord
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});

// Get borrower's checkout history
exports.getBorrowerHistory = catchAsync(async (req, res, next) => {
  const borrowerId = req.params.borrowerId;
  const limit = parseInt(req.query.limit, 10) || 50;
  
  const records = await BorrowingRecord.findBorrowerHistory(
    borrowerId,
    req.user.schoolId,
    limit
  );
  
  res.status(200).json({
    status: 'success',
    results: records.length,
    data: records
  });
});

// Get borrower's active checkouts
exports.getActiveCheckouts = catchAsync(async (req, res, next) => {
  const borrowerId = req.params.borrowerId;
  
  const records = await BorrowingRecord.findActiveCheckouts(
    borrowerId,
    req.user.schoolId
  );
  
  res.status(200).json({
    status: 'success',
    results: records.length,
    data: records
  });
});

// Get overdue items
exports.getOverdueItems = catchAsync(async (req, res) => {
  const daysThreshold = parseInt(req.query.days, 10) || 0;
  
  const records = await BorrowingRecord.findOverdueRecords(
    req.user.schoolId,
    daysThreshold
  );
  
  res.status(200).json({
    status: 'success',
    results: records.length,
    data: records
  });
});

// Get items due soon
exports.getItemsDueSoon = catchAsync(async (req, res) => {
  const daysThreshold = parseInt(req.query.days, 10) || 3;
  
  const records = await BorrowingRecord.findDueSoonRecords(
    req.user.schoolId,
    daysThreshold
  );
  
  res.status(200).json({
    status: 'success',
    results: records.length,
    data: records
  });
});

// Add a notification/reminder sent
exports.addReminderSent = catchAsync(async (req, res, next) => {
  const { type, method, messageContent } = req.body;
  
  if (!type || !method) {
    return next(new AppError('Please provide notification type and method', 400));
  }
  
  // Find the borrowing record
  const borrowingRecord = await BorrowingRecord.findOne({
    _id: req.params.id,
    schoolId: req.user.schoolId
  });
  
  if (!borrowingRecord) {
    return next(new AppError('No borrowing record found with that ID', 404));
  }
  
  // Add the reminder
  borrowingRecord.remindersSent.push({
    date: new Date(),
    type,
    method,
    sentBy: req.user._id,
    messageContent,
    successful: true
  });
  
  await borrowingRecord.save();
  
  res.status(200).json({
    status: 'success',
    data: borrowingRecord
  });
});

// Get borrowing statistics
exports.getBorrowingStatistics = catchAsync(async (req, res) => {
  const schoolId = req.user.schoolId;
  
  // Optional date range filters
  const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
  const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
  
  // Build date range filter if provided
  const dateFilter = {};
  if (startDate) {
    dateFilter.checkoutDate = { $gte: startDate };
    if (endDate) {
      dateFilter.checkoutDate.$lte = endDate;
    }
  } else if (endDate) {
    dateFilter.checkoutDate = { $lte: endDate };
  }
  
  const stats = await Promise.all([
    // Total records
    BorrowingRecord.countDocuments({ 
      schoolId,
      ...dateFilter
    }),
    
    // Active loans
    BorrowingRecord.countDocuments({ 
      schoolId,
      status: 'active',
      ...dateFilter
    }),
    
    // Overdue loans
    BorrowingRecord.countDocuments({ 
      schoolId,
      status: 'overdue',
      ...dateFilter
    }),
    
    // Checkouts by borrower type
    BorrowingRecord.aggregate([
      { 
        $match: { 
          schoolId: mongoose.Types.ObjectId(schoolId),
          ...dateFilter
        } 
      },
      { $group: { _id: '$borrowerType', count: { $sum: 1 } } }
    ]),
    
    // Most borrowed books (top 10)
    BorrowingRecord.aggregate([
      { 
        $match: { 
          schoolId: mongoose.Types.ObjectId(schoolId),
          ...dateFilter
        } 
      },
      { $group: { _id: '$bookId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { 
        $lookup: {
          from: 'librarybooks',
          localField: '_id',
          foreignField: '_id',
          as: 'bookInfo'
        }
      },
      { 
        $project: { 
          _id: 1, 
          count: 1, 
          title: { $arrayElemAt: ['$bookInfo.title', 0] },
          authors: { $arrayElemAt: ['$bookInfo.authors', 0] }
        } 
      }
    ]),
    
    // Checkouts by month (last 12 months)
    BorrowingRecord.aggregate([
      { 
        $match: { 
          schoolId: mongoose.Types.ObjectId(schoolId),
          checkoutDate: { 
            $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) 
          }
        } 
      },
      { 
        $group: { 
          _id: { 
            month: { $month: '$checkoutDate' }, 
            year: { $year: '$checkoutDate' } 
          },
          count: { $sum: 1 }
        } 
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]),
    
    // Late returns percentage
    BorrowingRecord.aggregate([
      { 
        $match: { 
          schoolId: mongoose.Types.ObjectId(schoolId),
          returnDate: { $ne: null },
          ...dateFilter
        } 
      },
      { 
        $group: { 
          _id: null,
          total: { $sum: 1 },
          late: { 
            $sum: { 
              $cond: [{ $eq: ['$returnStatus', 'late'] }, 1, 0] 
            } 
          }
        } 
      },
      { 
        $project: { 
          _id: 0,
          total: 1,
          late: 1,
          percentage: { 
            $multiply: [{ $divide: ['$late', '$total'] }, 100] 
          }
        } 
      }
    ])
  ]);
  
  res.status(200).json({
    status: 'success',
    data: {
      totalRecords: stats[0],
      activeLoans: stats[1],
      overdueLoans: stats[2],
      checkoutsByBorrowerType: stats[3],
      mostBorrowedBooks: stats[4],
      checkoutsByMonth: stats[5],
      lateReturnsStats: stats[6].length > 0 ? stats[6][0] : { total: 0, late: 0, percentage: 0 }
    }
  });
}); 