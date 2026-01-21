# Phase 2 - Quick Start Guide for Developers

This guide helps developers quickly understand and start working with Phase 2 modules.

---

## 🚀 Getting Started

### Prerequisites
- Node.js and MongoDB installed
- Existing School ERP codebase
- Understanding of Express.js and Mongoose

### What's Already Done ✅
- ✅ 9 Mongoose models created
- ✅ Model exports configured in `models/index.js`
- ✅ Comprehensive documentation created

### What You Need to Do 📝
- Create controllers
- Create routes
- Implement business logic
- Build frontend forms

---

## 📁 File Structure

```
School_ERP/
├── models/
│   ├── feeStructureModel.js       ✅ Created
│   ├── feeInvoiceModel.js         ✅ Created
│   ├── feePaymentModel.js         ✅ Created
│   ├── studentAttendanceModel.js  ✅ Created
│   ├── staffAttendanceModel.js    ✅ Created
│   ├── leaveApplicationModel.js   ✅ Created
│   ├── examinationModel.js        ✅ Created
│   ├── examResultModel.js         ✅ Created
│   ├── gradingSystemModel.js      ✅ Created
│   └── index.js                   ✅ Updated
│
├── controllers/
│   ├── feeController.js           ❌ To Create
│   ├── attendanceController.js    ❌ To Create
│   ├── leaveController.js         ❌ To Create
│   ├── examinationController.js   ❌ To Create
│   └── gradingController.js       ❌ To Create
│
├── routes/
│   ├── feeRoute.js                ❌ To Create
│   ├── attendanceRoute.js         ❌ To Create
│   ├── leaveRoute.js              ❌ To Create
│   ├── examinationRoute.js        ❌ To Create
│   └── gradingRoute.js            ❌ To Create
│
└── doc/
    ├── PHASE2_IMPLEMENTATION_GUIDE.md    ✅ Created
    ├── PHASE2_FORM_STRUCTURES.md         ✅ Created
    ├── PHASE2_SUMMARY.md                 ✅ Created
    └── PHASE2_SCHEMA_RELATIONSHIPS.md    ✅ Created
```

---

## 🎯 Implementation Roadmap

### Week 1: Fee Management
**Day 1-2: Fee Structure**
- [ ] Create `feeController.js` with CRUD operations
- [ ] Create `feeRoute.js` with routes
- [ ] Add permissions to `utils/permissions.js`
- [ ] Test with Postman/curl

**Day 3-4: Fee Invoice**
- [ ] Add invoice operations to `feeController.js`
- [ ] Implement bulk invoice generation
- [ ] Add invoice routes
- [ ] Test invoice generation

**Day 5: Fee Payment**
- [ ] Add payment operations to `feeController.js`
- [ ] Implement receipt generation (PDF)
- [ ] Add payment routes
- [ ] Test payment recording

### Week 2: Attendance System
**Day 1-2: Student Attendance**
- [ ] Create `attendanceController.js`
- [ ] Implement daily and subject-wise marking
- [ ] Create `attendanceRoute.js`
- [ ] Test attendance marking

**Day 3: Staff Attendance**
- [ ] Add staff attendance to controller
- [ ] Implement check-in/check-out
- [ ] Add routes
- [ ] Test staff attendance

**Day 4-5: Leave Management**
- [ ] Create `leaveController.js`
- [ ] Implement application and approval workflow
- [ ] Create `leaveRoute.js`
- [ ] Test leave workflow

### Week 3: Examination System
**Day 1-2: Examination**
- [ ] Create `examinationController.js`
- [ ] Implement exam CRUD operations
- [ ] Create `examinationRoute.js`
- [ ] Test exam creation

**Day 3-4: Exam Results**
- [ ] Add result operations to controller
- [ ] Implement mark entry and calculation
- [ ] Add result routes
- [ ] Test mark entry

**Day 5: Grading System**
- [ ] Create `gradingController.js`
- [ ] Implement grading CRUD
- [ ] Create `gradingRoute.js`
- [ ] Test grading system

### Week 4: Integration & Testing
- [ ] Integration testing
- [ ] Frontend integration
- [ ] Performance testing
- [ ] Bug fixes

---

## 💻 Code Templates

### Controller Template

```javascript
// controllers/feeController.js
const { getFeeStructureModel } = require("../models");
const { getConnection } = require("../config/connection");

// Create Fee Structure
exports.createFeeStructure = async (req, res) => {
  try {
    const connection = await getConnection(req.headers["x-school-id"]);
    const FeeStructure = getFeeStructureModel(connection);
    
    const feeStructure = new FeeStructure({
      ...req.body,
      createdBy: req.user._id
    });
    
    await feeStructure.save();
    
    res.status(201).json({
      success: true,
      message: "Fee structure created successfully",
      data: feeStructure
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Fee Structures
exports.getAllFeeStructures = async (req, res) => {
  try {
    const connection = await getConnection(req.headers["x-school-id"]);
    const FeeStructure = getFeeStructureModel(connection);
    
    const feeStructures = await FeeStructure.find()
      .populate('class', 'className section')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: feeStructures.length,
      data: feeStructures
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Fee Structure by ID
exports.getFeeStructureById = async (req, res) => {
  try {
    const connection = await getConnection(req.headers["x-school-id"]);
    const FeeStructure = getFeeStructureModel(connection);
    
    const feeStructure = await FeeStructure.findById(req.params.id)
      .populate('class', 'className section');
    
    if (!feeStructure) {
      return res.status(404).json({
        success: false,
        message: "Fee structure not found"
      });
    }
    
    res.status(200).json({
      success: true,
      data: feeStructure
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Fee Structure
exports.updateFeeStructure = async (req, res) => {
  try {
    const connection = await getConnection(req.headers["x-school-id"]);
    const FeeStructure = getFeeStructureModel(connection);
    
    const feeStructure = await FeeStructure.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.user._id
      },
      { new: true, runValidators: true }
    );
    
    if (!feeStructure) {
      return res.status(404).json({
        success: false,
        message: "Fee structure not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Fee structure updated successfully",
      data: feeStructure
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Fee Structure
exports.deleteFeeStructure = async (req, res) => {
  try {
    const connection = await getConnection(req.headers["x-school-id"]);
    const FeeStructure = getFeeStructureModel(connection);
    
    const feeStructure = await FeeStructure.findByIdAndDelete(req.params.id);
    
    if (!feeStructure) {
      return res.status(404).json({
        success: false,
        message: "Fee structure not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Fee structure deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

### Route Template

```javascript
// routes/feeRoute.js
const express = require("express");
const router = express.Router();
const feeController = require("../controllers/feeController");
const { authenticate } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/authorize");
const { PERMISSIONS } = require("../utils/permissions");

// Fee Structure Routes
router.post(
  "/fee-structure",
  authenticate,
  authorize(PERMISSIONS.FEE_STRUCTURE_CREATE),
  feeController.createFeeStructure
);

router.get(
  "/fee-structure",
  authenticate,
  authorize(PERMISSIONS.FEE_STRUCTURE_VIEW),
  feeController.getAllFeeStructures
);

router.get(
  "/fee-structure/:id",
  authenticate,
  authorize(PERMISSIONS.FEE_STRUCTURE_VIEW),
  feeController.getFeeStructureById
);

router.put(
  "/fee-structure/:id",
  authenticate,
  authorize(PERMISSIONS.FEE_STRUCTURE_UPDATE),
  feeController.updateFeeStructure
);

router.delete(
  "/fee-structure/:id",
  authenticate,
  authorize(PERMISSIONS.FEE_STRUCTURE_DELETE),
  feeController.deleteFeeStructure
);

module.exports = router;
```

### Permission Template

```javascript
// Add to utils/permissions.js

// Fee Management Permissions
FEE_STRUCTURE_VIEW: 'fee:structure:view',
FEE_STRUCTURE_CREATE: 'fee:structure:create',
FEE_STRUCTURE_UPDATE: 'fee:structure:update',
FEE_STRUCTURE_DELETE: 'fee:structure:delete',

FEE_INVOICE_VIEW: 'fee:invoice:view',
FEE_INVOICE_CREATE: 'fee:invoice:create',
FEE_INVOICE_UPDATE: 'fee:invoice:update',
FEE_INVOICE_DELETE: 'fee:invoice:delete',

FEE_PAYMENT_VIEW: 'fee:payment:view',
FEE_PAYMENT_RECORD: 'fee:payment:record',
FEE_PAYMENT_REFUND: 'fee:payment:refund',

// Attendance Permissions
ATTENDANCE_STUDENT_VIEW: 'attendance:student:view',
ATTENDANCE_STUDENT_MARK: 'attendance:student:mark',
ATTENDANCE_STUDENT_UPDATE: 'attendance:student:update',

ATTENDANCE_STAFF_VIEW: 'attendance:staff:view',
ATTENDANCE_STAFF_MARK: 'attendance:staff:mark',

LEAVE_APPLICATION_VIEW: 'leave:application:view',
LEAVE_APPLICATION_APPLY: 'leave:application:apply',
LEAVE_APPLICATION_APPROVE: 'leave:application:approve',

// Examination Permissions
EXAM_VIEW: 'exam:view',
EXAM_CREATE: 'exam:create',
EXAM_UPDATE: 'exam:update',
EXAM_DELETE: 'exam:delete',

MARKS_VIEW: 'marks:view',
MARKS_ENTER: 'marks:enter',
MARKS_VERIFY: 'marks:verify',

RESULT_VIEW: 'result:view',
RESULT_PUBLISH: 'result:publish',

REPORT_CARD_VIEW: 'reportcard:view',
REPORT_CARD_GENERATE: 'reportcard:generate',

GRADING_SYSTEM_VIEW: 'grading:view',
GRADING_SYSTEM_CREATE: 'grading:create',
GRADING_SYSTEM_UPDATE: 'grading:update',
```

---

## 🧪 Testing with curl

### Create Fee Structure
```bash
curl -X POST http://localhost:3000/api/fee-structure \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-School-Id: school_123" \
  -d '{
    "class": "CLASS_OBJECT_ID",
    "academicYear": "2023-2024",
    "feeHeads": [
      {
        "headName": "Tuition Fee",
        "amount": 5000,
        "frequency": "Monthly",
        "isMandatory": true
      }
    ],
    "effectiveFrom": "2023-04-01",
    "status": "Active"
  }'
```

### Mark Student Attendance
```bash
curl -X POST http://localhost:3000/api/attendance/student \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-School-Id: school_123" \
  -d '{
    "student": "STUDENT_OBJECT_ID",
    "class": "CLASS_OBJECT_ID",
    "date": "2023-04-05",
    "academicYear": "2023-2024",
    "attendanceMode": "Daily",
    "dailyStatus": {
      "morning": {
        "status": "Present"
      },
      "evening": {
        "status": "Present"
      }
    }
  }'
```

### Create Examination
```bash
curl -X POST http://localhost:3000/api/examination \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-School-Id: school_123" \
  -d '{
    "examName": "Mid-Term Examination",
    "examType": "Term Exam",
    "academicYear": "2023-2024",
    "classes": ["CLASS_ID_1", "CLASS_ID_2"],
    "startDate": "2023-09-15",
    "endDate": "2023-09-25",
    "subjects": [
      {
        "subject": "SUBJECT_OBJECT_ID",
        "examDate": "2023-09-15",
        "startTime": "09:00 AM",
        "duration": 180,
        "maxMarks": 100,
        "passingMarks": 33
      }
    ],
    "gradingSystem": "GRADING_SYSTEM_ID",
    "status": "Scheduled"
  }'
```

---

## 🔍 Common Queries

### Get Unpaid Invoices (Defaulters)
```javascript
const FeeInvoice = getFeeInvoiceModel(connection);

const defaulters = await FeeInvoice.find({
  status: { $in: ['Issued', 'Overdue', 'Partially Paid'] },
  balanceAmount: { $gt: 0 }
})
.populate('student', 'user')
.populate({
  path: 'student',
  populate: {
    path: 'user',
    select: 'name email phone'
  }
})
.sort({ dueDate: 1 });
```

### Get Monthly Attendance Report
```javascript
const StudentAttendance = getStudentAttendanceModel(connection);

const monthStart = new Date('2023-04-01');
const monthEnd = new Date('2023-04-30');

const attendance = await StudentAttendance.find({
  student: studentId,
  date: { $gte: monthStart, $lte: monthEnd }
});

const totalDays = attendance.length;
const presentDays = attendance.filter(a => a.overallStatus === 'Present').length;
const percentage = (presentDays / totalDays) * 100;
```

### Get Class Results with Ranks
```javascript
const ExamResult = getExamResultModel(connection);

const results = await ExamResult.find({
  examination: examId,
  class: classId
})
.populate('student', 'user')
.populate({
  path: 'student',
  populate: {
    path: 'user',
    select: 'name'
  }
})
.sort({ overallPercentage: -1 });

// Assign ranks
results.forEach((result, index) => {
  result.classRank = index + 1;
  result.save();
});
```

---

## 📊 Business Logic Examples

### Auto-Generate Monthly Invoices
```javascript
exports.generateMonthlyInvoices = async (req, res) => {
  try {
    const { classIds, month, year } = req.body;
    const connection = await getConnection(req.headers["x-school-id"]);
    
    const Student = getStudentModel(connection);
    const FeeStructure = getFeeStructureModel(connection);
    const FeeInvoice = getFeeInvoiceModel(connection);
    
    const invoices = [];
    
    for (const classId of classIds) {
      // Get fee structure for class
      const feeStructure = await FeeStructure.findOne({
        class: classId,
        status: 'Active'
      });
      
      if (!feeStructure) continue;
      
      // Get all students in class
      const students = await Student.find({ class: classId });
      
      for (const student of students) {
        // Calculate fee items for the month
        const feeItems = feeStructure.feeHeads
          .filter(head => head.frequency === 'Monthly')
          .map(head => ({
            headName: head.headName,
            amount: head.amount,
            frequency: head.frequency
          }));
        
        const subtotal = feeItems.reduce((sum, item) => sum + item.amount, 0);
        
        // Apply discounts (e.g., sibling discount)
        const discounts = [];
        // ... discount logic
        
        const totalDiscount = discounts.reduce((sum, d) => sum + d.discountAmount, 0);
        const totalAmount = subtotal - totalDiscount;
        
        // Create invoice
        const invoice = new FeeInvoice({
          invoiceNumber: await generateInvoiceNumber(connection),
          student: student._id,
          class: classId,
          academicYear: feeStructure.academicYear,
          feeStructure: feeStructure._id,
          invoicePeriod: 'Monthly',
          periodMonth: month,
          feeItems,
          subtotal,
          discounts,
          totalDiscount,
          totalAmount,
          balanceAmount: totalAmount,
          issueDate: new Date(),
          dueDate: new Date(year, month - 1, 10), // 10th of the month
          status: 'Issued',
          createdBy: req.user._id
        });
        
        await invoice.save();
        invoices.push(invoice);
      }
    }
    
    res.status(201).json({
      success: true,
      message: `${invoices.length} invoices generated successfully`,
      data: invoices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function
async function generateInvoiceNumber(connection) {
  const FeeInvoice = getFeeInvoiceModel(connection);
  const year = new Date().getFullYear();
  const count = await FeeInvoice.countDocuments({
    invoiceNumber: new RegExp(`^INV-${year}`)
  });
  return `INV-${year}-${String(count + 1).padStart(4, '0')}`;
}
```

### Calculate Class Ranks
```javascript
exports.calculateClassRanks = async (req, res) => {
  try {
    const { examinationId, classId } = req.params;
    const connection = await getConnection(req.headers["x-school-id"]);
    const ExamResult = getExamResultModel(connection);
    
    // Get all results for the class, sorted by percentage
    const results = await ExamResult.find({
      examination: examinationId,
      class: classId,
      isPassed: true // Only rank students who passed
    }).sort({ overallPercentage: -1 });
    
    // Assign ranks
    let currentRank = 1;
    let previousPercentage = null;
    let studentsWithSamePercentage = 0;
    
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      
      if (previousPercentage === result.overallPercentage) {
        // Same percentage, same rank
        studentsWithSamePercentage++;
      } else {
        // Different percentage, new rank
        currentRank += studentsWithSamePercentage;
        studentsWithSamePercentage = 1;
      }
      
      result.classRank = currentRank;
      await result.save();
      
      previousPercentage = result.overallPercentage;
    }
    
    res.status(200).json({
      success: true,
      message: "Ranks calculated successfully",
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

---

## 🎨 Frontend Integration Tips

### Using Axios
```javascript
// Create Fee Structure
const createFeeStructure = async (formData) => {
  try {
    const response = await axios.post('/api/fee-structure', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-School-Id': schoolId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating fee structure:', error);
    throw error;
  }
};

// Mark Attendance
const markAttendance = async (attendanceData) => {
  try {
    const response = await axios.post('/api/attendance/student', attendanceData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-School-Id': schoolId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error marking attendance:', error);
    throw error;
  }
};
```

### React Form Example
```jsx
import React, { useState } from 'react';

function CreateFeeStructureForm() {
  const [formData, setFormData] = useState({
    class: '',
    academicYear: '2023-2024',
    feeHeads: [
      { headName: 'Tuition Fee', amount: 0, frequency: 'Monthly', isMandatory: true }
    ],
    effectiveFrom: '',
    status: 'Draft'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createFeeStructure(formData);
      alert('Fee structure created successfully!');
    } catch (error) {
      alert('Error creating fee structure');
    }
  };

  const addFeeHead = () => {
    setFormData({
      ...formData,
      feeHeads: [
        ...formData.feeHeads,
        { headName: '', amount: 0, frequency: 'Monthly', isMandatory: true }
      ]
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit">Create Fee Structure</button>
    </form>
  );
}
```

---

## 🐛 Debugging Tips

### Enable Mongoose Debug Mode
```javascript
mongoose.set('debug', true);
```

### Log Request/Response
```javascript
// Add to controller
console.log('Request Body:', req.body);
console.log('User:', req.user);
console.log('School ID:', req.headers['x-school-id']);
```

### Common Errors

**Error: Cast to ObjectId failed**
- Check if IDs are valid MongoDB ObjectIds
- Use `mongoose.Types.ObjectId.isValid(id)` to validate

**Error: Duplicate key error**
- Check unique indexes (invoiceNumber, receiptNumber)
- Ensure auto-generation logic is working

**Error: Validation failed**
- Check required fields
- Verify enum values
- Check min/max constraints

---

## 📚 Additional Resources

- **Mongoose Documentation**: https://mongoosejs.com/docs/
- **Express.js Guide**: https://expressjs.com/en/guide/routing.html
- **MongoDB Aggregation**: https://docs.mongodb.com/manual/aggregation/

---

## ✅ Checklist for Each Module

- [ ] Create controller with CRUD operations
- [ ] Create routes with proper middleware
- [ ] Add permissions to `utils/permissions.js`
- [ ] Test all endpoints with Postman/curl
- [ ] Add validation middleware
- [ ] Implement business logic
- [ ] Add error handling
- [ ] Write unit tests
- [ ] Update API documentation
- [ ] Create frontend forms

---

**Happy Coding! 🚀**

For questions or issues, refer to:
- `PHASE2_IMPLEMENTATION_GUIDE.md` - Detailed module documentation
- `PHASE2_FORM_STRUCTURES.md` - Form structure reference
- `PHASE2_SCHEMA_RELATIONSHIPS.md` - Database relationships

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-21  
**Target Audience:** Backend Developers
