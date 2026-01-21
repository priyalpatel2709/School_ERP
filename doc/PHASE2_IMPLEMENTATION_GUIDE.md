# Phase 2 Implementation Guide - Core Modules

This document provides a comprehensive guide to the **Phase 2** implementation of the School ERP system, covering all four critical modules that are must-haves for commercial viability.

## 📋 Table of Contents

1. [Fee Management & Finance](#1-fee-management--finance-)
2. [Attendance System](#2-attendance-system-)
3. [Examination & Results](#3-examination--results-)
4. [Timetable Management](#4-timetable-management-)

---

## 1. Fee Management & Finance 💰

### Overview
Complete fee management system with structure definition, invoice generation, payment tracking, and receipt generation.

### Models Created

#### 1.1 Fee Structure (`feeStructureModel.js`)
Defines fee heads and configurations per class.

**Key Features:**
- Multiple fee heads (Tuition, Lab, Transport, etc.)
- Frequency-based fees (Monthly, Quarterly, Yearly)
- Discount rules (Siblings, Merit, Staff Children, Early Payment)
- Late fee configuration
- Automatic annual fee calculation

**Schema Structure:**
```javascript
{
  class: ObjectId,              // Reference to Class
  academicYear: String,         // e.g., "2023-2024"
  feeHeads: [{
    headName: String,           // Enum: Tuition Fee, Lab Fee, etc.
    amount: Number,
    frequency: String,          // Monthly, Quarterly, etc.
    isMandatory: Boolean,
    description: String
  }],
  discounts: [{
    discountName: String,
    discountType: String,       // Percentage or Fixed
    discountValue: Number,
    applicableFor: String       // Siblings, Merit, etc.
  }],
  lateFeeConfig: {
    enabled: Boolean,
    gracePeriodDays: Number,
    lateFeeType: String,
    lateFeeValue: Number
  },
  totalAnnualFee: Number,       // Auto-calculated
  status: String,               // Draft, Active, Archived
  effectiveFrom: Date,
  effectiveTo: Date
}
```

**API Endpoints (To Be Implemented):**
```
POST   /api/fee-structure              - Create fee structure
GET    /api/fee-structure              - List all fee structures
GET    /api/fee-structure/:id          - Get specific fee structure
PUT    /api/fee-structure/:id          - Update fee structure
DELETE /api/fee-structure/:id          - Delete fee structure
GET    /api/fee-structure/class/:classId - Get fee structure by class
```

---

#### 1.2 Fee Invoice (`feeInvoiceModel.js`)
Auto-generated invoices for students based on fee structure.

**Key Features:**
- Auto-generated invoice numbers (INV-2024-0001)
- Period-based invoicing (Monthly, Quarterly, etc.)
- Discount application
- Late fee calculation
- Payment tracking
- Automatic status updates

**Schema Structure:**
```javascript
{
  invoiceNumber: String,        // Unique, auto-generated
  student: ObjectId,
  class: ObjectId,
  academicYear: String,
  feeStructure: ObjectId,
  invoicePeriod: String,        // Monthly, Quarterly, etc.
  periodMonth: Number,          // 1-12 for monthly
  periodQuarter: Number,        // 1-4 for quarterly
  feeItems: [{
    headName: String,
    amount: Number,
    frequency: String
  }],
  subtotal: Number,
  discounts: [{
    discountName: String,
    discountAmount: Number,
    reason: String
  }],
  totalDiscount: Number,
  lateFee: Number,
  totalAmount: Number,          // subtotal - discount + lateFee
  paidAmount: Number,
  balanceAmount: Number,        // Auto-calculated
  status: String,               // Draft, Issued, Partially Paid, Paid, Overdue
  issueDate: Date,
  dueDate: Date,
  paidDate: Date,
  payments: [ObjectId]          // References to FeePayment
}
```

**API Endpoints (To Be Implemented):**
```
POST   /api/fee-invoice                    - Create invoice
POST   /api/fee-invoice/bulk-generate      - Generate invoices for all students
GET    /api/fee-invoice                    - List all invoices
GET    /api/fee-invoice/:id                - Get specific invoice
GET    /api/fee-invoice/student/:studentId - Get student's invoices
GET    /api/fee-invoice/overdue            - Get overdue invoices (Defaulters)
PUT    /api/fee-invoice/:id                - Update invoice
DELETE /api/fee-invoice/:id                - Delete invoice
```

---

#### 1.3 Fee Payment (`feePaymentModel.js`)
Records all fee payments with receipt generation.

**Key Features:**
- Auto-generated receipt numbers (RCP-2024-0001)
- Multiple payment modes (Cash, Online, UPI, Cheque, etc.)
- Transaction tracking
- Cheque clearance tracking
- Refund management
- PDF receipt generation

**Schema Structure:**
```javascript
{
  receiptNumber: String,        // Unique, auto-generated
  invoice: ObjectId,
  student: ObjectId,
  paymentDate: Date,
  amount: Number,
  paymentMode: String,          // Cash, Cheque, Online, UPI, etc.
  transactionDetails: {
    transactionId: String,
    chequeNumber: String,
    chequeDate: Date,
    bankName: String,
    upiId: String,
    cardLastFour: String
  },
  receiptPdfUrl: String,
  status: String,               // Success, Pending, Failed, Refunded
  chequeStatus: String,         // Pending, Cleared, Bounced
  refundDetails: {
    refundDate: Date,
    refundAmount: Number,
    refundReason: String
  },
  collectedBy: ObjectId,        // User who collected payment
  verifiedBy: ObjectId,
  verifiedAt: Date
}
```

**API Endpoints (To Be Implemented):**
```
POST   /api/fee-payment                - Record payment
GET    /api/fee-payment                - List all payments
GET    /api/fee-payment/:id            - Get specific payment
GET    /api/fee-payment/invoice/:id    - Get payments for invoice
GET    /api/fee-payment/student/:id    - Get student's payment history
GET    /api/fee-payment/receipt/:id/pdf - Generate PDF receipt
POST   /api/fee-payment/:id/refund     - Process refund
GET    /api/fee-payment/reports/daily  - Daily collection report
```

---

### Fee Management Workflows

#### Workflow 1: Setting Up Fee Structure
```
1. Admin creates Fee Structure for a class
   → Define fee heads (Tuition, Lab, etc.)
   → Set amounts and frequencies
   → Configure discounts
   → Set late fee rules
   → Set effective dates

2. System auto-calculates total annual fee

3. Admin activates the fee structure
```

#### Workflow 2: Invoice Generation
```
1. Admin triggers bulk invoice generation
   → System creates invoices for all students in selected classes
   → Applies fee structure
   → Applies applicable discounts (siblings, merit, etc.)
   → Sets due dates

2. Invoices are issued to students/parents

3. System tracks payment status
```

#### Workflow 3: Payment Recording
```
1. Accountant receives payment from parent
   → Selects invoice
   → Enters payment amount
   → Selects payment mode
   → Enters transaction details

2. System updates invoice
   → Reduces balance amount
   → Updates status (Partially Paid/Paid)
   → Generates receipt

3. PDF receipt is generated and can be printed/emailed
```

---

## 2. Attendance System 📅

### Overview
Comprehensive attendance tracking for both students and staff with leave management.

### Models Created

#### 2.1 Student Attendance (`studentAttendanceModel.js`)
Tracks daily and subject-wise attendance for students.

**Key Features:**
- Two modes: Daily and Subject-Wise
- Morning/Evening tracking for daily mode
- Period-wise tracking for subject mode
- Leave application integration
- Automatic overall status calculation
- Parent notification support

**Schema Structure:**
```javascript
{
  student: ObjectId,
  class: ObjectId,
  date: Date,
  academicYear: String,
  attendanceMode: String,       // Daily or Subject-Wise
  
  // For Daily Mode
  dailyStatus: {
    morning: {
      status: String,           // Present, Absent, Late, Half-Day, On Leave
      markedAt: Date,
      markedBy: ObjectId
    },
    evening: {
      status: String,
      markedAt: Date,
      markedBy: ObjectId
    }
  },
  
  // For Subject-Wise Mode
  subjectAttendance: [{
    subject: ObjectId,
    period: Number,             // 1-8
    status: String,             // Present, Absent, Late
    markedAt: Date,
    markedBy: ObjectId
  }],
  
  overallStatus: String,        // Present, Absent, Partial, On Leave (auto-calculated)
  
  leaveInfo: {
    isOnLeave: Boolean,
    leaveType: String,
    leaveApplication: ObjectId,
    leaveReason: String
  },
  
  parentNotified: Boolean,
  notifiedAt: Date
}
```

**API Endpoints (To Be Implemented):**
```
POST   /api/attendance/student                     - Mark attendance
POST   /api/attendance/student/bulk                - Bulk mark for class
GET    /api/attendance/student                     - List attendance records
GET    /api/attendance/student/:studentId          - Get student's attendance
GET    /api/attendance/student/class/:classId/date/:date - Get class attendance for date
GET    /api/attendance/student/:studentId/monthly  - Monthly attendance report
PUT    /api/attendance/student/:id                 - Update attendance
DELETE /api/attendance/student/:id                 - Delete attendance record
```

---

#### 2.2 Staff Attendance (`staffAttendanceModel.js`)
Tracks check-in/check-out times for staff members.

**Key Features:**
- Check-in/Check-out tracking
- Multiple marking methods (Manual, Biometric, Mobile App)
- Automatic working hours calculation
- Late/Early leave detection
- Leave integration

**Schema Structure:**
```javascript
{
  staff: ObjectId,
  date: Date,
  academicYear: String,
  
  checkIn: {
    time: Date,
    location: String,
    method: String,             // Manual, Biometric, Mobile App, Web
    markedBy: ObjectId
  },
  
  checkOut: {
    time: Date,
    location: String,
    method: String,
    markedBy: ObjectId
  },
  
  totalHours: Number,           // Auto-calculated
  expectedHours: Number,        // Default: 8
  
  status: String,               // Present, Absent, Half-Day, On Leave, Late, Early Leave
  
  isLate: Boolean,
  lateByMinutes: Number,
  leftEarly: Boolean,
  earlyByMinutes: Number,
  
  leaveInfo: {
    isOnLeave: Boolean,
    leaveType: String,
    leaveApplication: ObjectId
  },
  
  approvedBy: ObjectId,
  approvedAt: Date
}
```

**API Endpoints (To Be Implemented):**
```
POST   /api/attendance/staff/check-in      - Check in
POST   /api/attendance/staff/check-out     - Check out
GET    /api/attendance/staff               - List staff attendance
GET    /api/attendance/staff/:staffId      - Get staff's attendance
GET    /api/attendance/staff/date/:date    - Get all staff attendance for date
GET    /api/attendance/staff/:staffId/monthly - Monthly report
PUT    /api/attendance/staff/:id           - Update attendance
```

---

#### 2.3 Leave Application (`leaveApplicationModel.js`)
Handles leave applications for both students and staff.

**Key Features:**
- Supports both student and staff leaves
- Approval workflow
- Multiple leave types
- Document attachments
- Automatic day calculation

**Schema Structure:**
```javascript
{
  applicantType: String,        // Student or Staff
  student: ObjectId,            // If student
  staff: ObjectId,              // If staff
  
  leaveType: String,            // Sick Leave, Casual Leave, etc.
  fromDate: Date,
  toDate: Date,
  totalDays: Number,            // Auto-calculated
  reason: String,
  
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String
  }],
  
  status: String,               // Pending, Approved, Rejected, Cancelled
  
  appliedBy: ObjectId,          // Parent for student, self for staff
  appliedAt: Date,
  
  reviewedBy: ObjectId,
  reviewedAt: Date,
  reviewComments: String,
  
  notificationSent: Boolean
}
```

**API Endpoints (To Be Implemented):**
```
POST   /api/leave-application              - Apply for leave
GET    /api/leave-application              - List all applications
GET    /api/leave-application/:id          - Get specific application
GET    /api/leave-application/student/:id  - Get student's applications
GET    /api/leave-application/staff/:id    - Get staff's applications
GET    /api/leave-application/pending      - Get pending applications
PUT    /api/leave-application/:id/approve  - Approve leave
PUT    /api/leave-application/:id/reject   - Reject leave
PUT    /api/leave-application/:id          - Update application
DELETE /api/leave-application/:id          - Cancel application
```

---

### Attendance Workflows

#### Workflow 1: Daily Student Attendance (Primary Classes)
```
1. Teacher opens class attendance for the day
2. System shows list of all students in class
3. Teacher marks each student as Present/Absent/Late
4. System auto-calculates overall status
5. For absent students:
   → System checks if leave application exists
   → Sends notification to parents
6. Attendance is saved
```

#### Workflow 2: Subject-Wise Attendance (Higher Grades)
```
1. Subject teacher opens attendance for their period
2. Marks students period-wise
3. System tracks attendance per subject
4. At end of day, overall status is calculated
5. Attendance report generated
```

#### Workflow 3: Leave Application
```
1. Parent/Staff applies for leave
   → Selects dates
   → Provides reason
   → Uploads supporting documents (optional)

2. Application goes to Class Teacher/Admin

3. Teacher/Admin reviews and approves/rejects

4. If approved:
   → Attendance is auto-marked as "On Leave"
   → Applicant is notified

5. If rejected:
   → Applicant is notified with reason
```

---

## 3. Examination & Results 📝

### Overview
Complete examination management with mark entry, grading, and report card generation.

### Models Created

#### 3.1 Examination (`examinationModel.js`)
Defines exam terms, tests, and configurations.

**Key Features:**
- Multiple exam types (Term, Unit Test, Monthly Test)
- Subject-wise scheduling
- Mark entry tracking
- Result publication control
- Grading system integration

**Schema Structure:**
```javascript
{
  examName: String,             // e.g., "Mid-Term Exam"
  examType: String,             // Term Exam, Unit Test, etc.
  academicYear: String,
  
  classes: [ObjectId],          // Applicable classes
  
  startDate: Date,
  endDate: Date,
  
  subjects: [{
    subject: ObjectId,
    examDate: Date,
    startTime: String,          // e.g., "09:00 AM"
    duration: Number,           // in minutes
    maxMarks: Number,
    passingMarks: Number,
    weightage: Number,          // Percentage in final grade
    syllabus: String,
    instructions: String
  }],
  
  gradingSystem: ObjectId,
  
  status: String,               // Scheduled, Ongoing, Completed, Cancelled
  
  markEntryStartDate: Date,
  markEntryEndDate: Date,
  markEntryStatus: String,      // Not Started, In Progress, Completed
  
  resultPublished: Boolean,
  resultPublishedDate: Date,
  
  generalInstructions: String
}
```

**API Endpoints (To Be Implemented):**
```
POST   /api/examination                - Create examination
GET    /api/examination                - List all examinations
GET    /api/examination/:id            - Get specific examination
GET    /api/examination/class/:classId - Get exams for class
PUT    /api/examination/:id            - Update examination
PUT    /api/examination/:id/publish    - Publish results
DELETE /api/examination/:id            - Delete examination
```

---

#### 3.2 Exam Result (`examResultModel.js`)
Stores marks entered by teachers for each student.

**Key Features:**
- Subject-wise mark entry
- Automatic percentage calculation
- Grade assignment
- Pass/Fail determination
- Class rank calculation
- Report card generation

**Schema Structure:**
```javascript
{
  examination: ObjectId,
  student: ObjectId,
  class: ObjectId,
  academicYear: String,
  
  subjectMarks: [{
    subject: ObjectId,
    marksObtained: Number,
    maxMarks: Number,
    passingMarks: Number,
    isPassed: Boolean,          // Auto-calculated
    grade: String,              // A+, A, B+, etc.
    gradePoint: Number,
    percentage: Number,         // Auto-calculated
    enteredBy: ObjectId,
    enteredAt: Date,
    verifiedBy: ObjectId,
    verifiedAt: Date,
    remarks: String
  }],
  
  totalMarksObtained: Number,   // Auto-calculated
  totalMaxMarks: Number,        // Auto-calculated
  overallPercentage: Number,    // Auto-calculated
  overallGrade: String,
  overallGradePoint: Number,
  
  isPassed: Boolean,            // All subjects must pass
  classRank: Number,
  attendancePercentage: Number,
  
  classTeacherRemarks: String,
  principalRemarks: String,
  
  reportCardGenerated: Boolean,
  reportCardUrl: String,
  
  status: String                // Draft, Submitted, Verified, Published
}
```

**API Endpoints (To Be Implemented):**
```
POST   /api/exam-result                        - Enter marks
POST   /api/exam-result/bulk                   - Bulk mark entry
GET    /api/exam-result                        - List all results
GET    /api/exam-result/:id                    - Get specific result
GET    /api/exam-result/exam/:examId           - Get all results for exam
GET    /api/exam-result/student/:studentId     - Get student's results
GET    /api/exam-result/exam/:examId/class/:classId - Get class results
PUT    /api/exam-result/:id                    - Update marks
PUT    /api/exam-result/:id/verify             - Verify marks
GET    /api/exam-result/:id/report-card        - Generate report card PDF
POST   /api/exam-result/exam/:examId/calculate-ranks - Calculate class ranks
```

---

#### 3.3 Grading System (`gradingSystemModel.js`)
Configurable grading logic.

**Key Features:**
- Customizable grade scales
- GPA calculation
- Multiple grading systems support
- Helper methods for grade determination

**Schema Structure:**
```javascript
{
  systemName: String,           // e.g., "CBSE Grading"
  academicYear: String,
  classes: [ObjectId],
  
  gradingScale: [{
    grade: String,              // A+, A, B+, etc.
    gradePoint: Number,         // GPA value (10, 9, 8)
    minPercentage: Number,
    maxPercentage: Number,
    description: String,        // "Outstanding", "Excellent"
    isPassing: Boolean
  }],
  
  defaultPassingPercentage: Number,
  isActive: Boolean
}
```

**Example Grading Scale:**
```javascript
[
  { grade: "A+", gradePoint: 10, minPercentage: 91, maxPercentage: 100, description: "Outstanding" },
  { grade: "A", gradePoint: 9, minPercentage: 81, maxPercentage: 90, description: "Excellent" },
  { grade: "B+", gradePoint: 8, minPercentage: 71, maxPercentage: 80, description: "Very Good" },
  { grade: "B", gradePoint: 7, minPercentage: 61, maxPercentage: 70, description: "Good" },
  { grade: "C+", gradePoint: 6, minPercentage: 51, maxPercentage: 60, description: "Above Average" },
  { grade: "C", gradePoint: 5, minPercentage: 41, maxPercentage: 50, description: "Average" },
  { grade: "D", gradePoint: 4, minPercentage: 33, maxPercentage: 40, description: "Pass" },
  { grade: "E", gradePoint: 0, minPercentage: 0, maxPercentage: 32, description: "Fail", isPassing: false }
]
```

**API Endpoints (To Be Implemented):**
```
POST   /api/grading-system             - Create grading system
GET    /api/grading-system             - List all grading systems
GET    /api/grading-system/:id         - Get specific grading system
PUT    /api/grading-system/:id         - Update grading system
DELETE /api/grading-system/:id         - Delete grading system
```

---

### Examination Workflows

#### Workflow 1: Creating an Examination
```
1. Admin creates examination
   → Sets exam name and type
   → Selects applicable classes
   → Defines date range

2. Admin adds subjects
   → For each subject:
     - Sets exam date and time
     - Defines max marks and passing marks
     - Sets weightage
     - Adds syllabus and instructions

3. Admin links grading system

4. Exam is scheduled
```

#### Workflow 2: Mark Entry
```
1. Exam is completed

2. Admin opens mark entry window

3. Subject teachers enter marks
   → Select examination and subject
   → Enter marks for each student
   → System auto-calculates percentage and grade
   → System checks pass/fail status

4. Class teacher verifies marks

5. Admin publishes results
```

#### Workflow 3: Report Card Generation
```
1. All marks are entered and verified

2. Admin triggers report card generation

3. System generates PDF report cards
   → Student details
   → Subject-wise marks and grades
   → Overall percentage and grade
   → Attendance percentage
   → Class rank
   → Teacher and Principal remarks
   → Graphs/charts

4. Report cards are available for download/print
```

---

## 4. Timetable Management 🕐

### Overview
The timetable management system is already partially implemented in `timeTableModel.js`. Here are the enhancements needed for Phase 2:

### Current Model
The existing `timeTableModel.js` has:
- Day-wise schedule
- Period-wise subject and teacher assignment
- Class reference

### Required Enhancements

#### 4.1 Conflict Detection
Add validation to prevent:
- Same teacher assigned to multiple classes at the same time
- Same classroom assigned to multiple classes at the same time
- Teacher assigned during their leave period

#### 4.2 Substitution Management
Add support for:
- Marking teachers as on leave
- Finding available substitute teachers
- Assigning substitutes to periods
- Tracking substitution history

#### 4.3 Auto-generation Support
Add features for:
- Template-based timetable creation
- Constraint-based scheduling
- Optimization algorithms

### Recommended New Model: Substitution

```javascript
{
  date: Date,
  period: Number,
  class: ObjectId,
  subject: ObjectId,
  originalTeacher: ObjectId,
  substituteTeacher: ObjectId,
  reason: String,
  status: String,              // Pending, Confirmed, Completed
  assignedBy: ObjectId,
  notes: String
}
```

---

## 🚀 Implementation Priority

### High Priority (Implement First)
1. **Fee Structure** - Foundation for entire fee management
2. **Student Attendance (Daily Mode)** - Most commonly used
3. **Examination** - Required for academic operations
4. **Grading System** - Required for examinations

### Medium Priority (Implement Second)
1. **Fee Invoice** - Depends on Fee Structure
2. **Leave Application** - Enhances attendance system
3. **Exam Result** - Depends on Examination and Grading System
4. **Staff Attendance** - Important but less critical than student attendance

### Lower Priority (Implement Third)
1. **Fee Payment** - Depends on Fee Invoice
2. **Student Attendance (Subject-Wise Mode)** - Advanced feature
3. **Timetable Enhancements** - Nice to have

---

## 📊 Database Indexes

All models include appropriate indexes for performance:

### Fee Management
- `FeeStructure`: `{ class: 1, academicYear: 1 }`
- `FeeInvoice`: `{ student: 1, academicYear: 1 }`, `{ status: 1, dueDate: 1 }`
- `FeePayment`: `{ student: 1, paymentDate: -1 }`, `{ invoice: 1 }`

### Attendance
- `StudentAttendance`: `{ student: 1, date: 1 }` (unique), `{ class: 1, date: 1 }`
- `StaffAttendance`: `{ staff: 1, date: 1 }` (unique)
- `LeaveApplication`: `{ student: 1, fromDate: 1 }`, `{ staff: 1, fromDate: 1 }`

### Examination
- `Examination`: `{ academicYear: 1, examType: 1 }`
- `ExamResult`: `{ examination: 1, student: 1 }` (unique), `{ class: 1, examination: 1 }`
- `GradingSystem`: `{ academicYear: 1, isActive: 1 }`

---

## 🔐 Permission Requirements

### Fee Management
- `fee:view` - View fee structures and invoices
- `fee:create` - Create fee structures
- `fee:update` - Update fee structures
- `fee:delete` - Delete fee structures
- `payment:record` - Record payments
- `payment:view` - View payment history
- `payment:refund` - Process refunds

### Attendance
- `attendance:mark` - Mark attendance
- `attendance:view` - View attendance records
- `attendance:update` - Update attendance
- `leave:apply` - Apply for leave
- `leave:approve` - Approve/reject leave applications

### Examination
- `exam:create` - Create examinations
- `exam:view` - View examinations
- `exam:update` - Update examinations
- `marks:enter` - Enter marks
- `marks:verify` - Verify marks
- `result:publish` - Publish results
- `reportcard:generate` - Generate report cards

---

## 📝 Next Steps

1. **Create Controllers** for each module
2. **Create Routes** and apply RBAC
3. **Implement Business Logic** for:
   - Auto-invoice generation
   - Receipt PDF generation
   - Report card PDF generation
   - Attendance notifications
   - Grade calculations
4. **Create API Documentation** with curl examples
5. **Build Frontend Forms** for data entry
6. **Add Validation** and error handling
7. **Write Unit Tests** for critical functions
8. **Create Seed Data** for testing

---

## 📚 Related Documentation

- `ENTERPRISE_REQUIREMENTS.md` - Overall roadmap
- `FRONTEND_API_GUIDE.md` - API documentation
- `ROUTE_ORDERING_GUIDE.md` - Route organization
- `NOTIFICATION_SYSTEM_GUIDE.md` - Notification integration

---

## ✅ Checklist

### Models ✓
- [x] Fee Structure Model
- [x] Fee Invoice Model
- [x] Fee Payment Model
- [x] Student Attendance Model
- [x] Staff Attendance Model
- [x] Leave Application Model
- [x] Examination Model
- [x] Exam Result Model
- [x] Grading System Model

### Controllers (To Do)
- [ ] Fee Management Controller
- [ ] Attendance Controller
- [ ] Leave Application Controller
- [ ] Examination Controller
- [ ] Exam Result Controller
- [ ] Grading System Controller

### Routes (To Do)
- [ ] Fee Management Routes
- [ ] Attendance Routes
- [ ] Examination Routes

### Business Logic (To Do)
- [ ] Auto-invoice generation
- [ ] PDF generation (Receipts, Report Cards)
- [ ] Notification triggers
- [ ] Rank calculation
- [ ] Grade assignment

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-21  
**Status:** Models Complete, Controllers Pending
