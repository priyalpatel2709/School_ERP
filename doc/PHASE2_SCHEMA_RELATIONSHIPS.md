# Phase 2 - Database Schema Relationships

This document visualizes the relationships between all Phase 2 models and existing models.

---

## 📊 Entity Relationship Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         PHASE 2 MODULES                                  │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                      1. FEE MANAGEMENT MODULE                             │
└──────────────────────────────────────────────────────────────────────────┘

    ┌─────────────┐
    │   Class     │◄────────┐
    └─────────────┘         │
                            │ references
                    ┌───────┴────────┐
                    │ FeeStructure   │
                    ├────────────────┤
                    │ - class        │
                    │ - academicYear │
                    │ - feeHeads[]   │
                    │ - discounts[]  │
                    │ - lateFeeConfig│
                    └───────┬────────┘
                            │ referenced by
                            │
                    ┌───────▼────────┐
                    │  FeeInvoice    │◄─────────┐
                    ├────────────────┤          │
                    │ - student      │──────┐   │
                    │ - feeStructure │      │   │
                    │ - feeItems[]   │      │   │
                    │ - discounts[]  │      │   │
                    │ - totalAmount  │      │   │
                    │ - paidAmount   │      │   │
                    │ - balanceAmount│      │   │
                    └───────┬────────┘      │   │
                            │               │   │
                            │ referenced by │   │
                            │               │   │
                    ┌───────▼────────┐      │   │
                    │  FeePayment    │      │   │
                    ├────────────────┤      │   │
                    │ - invoice      │──────┘   │
                    │ - student      │──────────┘
                    │ - amount       │
                    │ - paymentMode  │
                    │ - receiptPdfUrl│
                    └────────────────┘
                            │
                            │ references
                            ▼
                    ┌─────────────┐
                    │   Student   │
                    └─────────────┘


┌──────────────────────────────────────────────────────────────────────────┐
│                      2. ATTENDANCE MODULE                                 │
└──────────────────────────────────────────────────────────────────────────┘

    ┌─────────────┐
    │   Student   │◄────────┐
    └─────────────┘         │
                            │ references
                    ┌───────┴──────────┐
                    │StudentAttendance │
                    ├──────────────────┤
                    │ - student        │
                    │ - class          │
                    │ - date           │
                    │ - dailyStatus    │
                    │ - subjectAtt[]   │
                    │ - overallStatus  │
                    │ - leaveInfo      │──┐
                    └──────────────────┘  │
                                          │
                                          │ references
    ┌─────────────┐                      │
    │    User     │◄────────┐            │
    │   (Staff)   │         │            │
    └─────────────┘         │            │
                            │ references │
                    ┌───────┴─────────┐  │
                    │StaffAttendance  │  │
                    ├─────────────────┤  │
                    │ - staff         │  │
                    │ - date          │  │
                    │ - checkIn       │  │
                    │ - checkOut      │  │
                    │ - totalHours    │  │
                    │ - status        │  │
                    │ - leaveInfo     │──┤
                    └─────────────────┘  │
                                         │
                                         │ both reference
                                         │
                                ┌────────▼────────┐
                                │LeaveApplication │
                                ├─────────────────┤
                                │ - applicantType │
                                │ - student       │
                                │ - staff         │
                                │ - leaveType     │
                                │ - fromDate      │
                                │ - toDate        │
                                │ - status        │
                                │ - appliedBy     │
                                │ - reviewedBy    │
                                └─────────────────┘


┌──────────────────────────────────────────────────────────────────────────┐
│                   3. EXAMINATION & RESULTS MODULE                         │
└──────────────────────────────────────────────────────────────────────────┘

    ┌─────────────┐
    │   Class     │◄────────┐
    └─────────────┘         │
                            │
    ┌─────────────┐         │
    │   Subject   │◄────┐   │
    └─────────────┘     │   │
                        │   │ references
                ┌───────┴───┴──────┐
                │   Examination    │
                ├──────────────────┤
                │ - examName       │
                │ - examType       │
                │ - classes[]      │
                │ - subjects[]     │
                │ - startDate      │
                │ - endDate        │
                │ - gradingSystem  │──┐
                │ - status         │  │
                └───────┬──────────┘  │
                        │             │
                        │ referenced  │
                        │ by          │
                        │             │
                ┌───────▼──────────┐  │
                │   ExamResult     │  │
                ├──────────────────┤  │
                │ - examination    │  │
                │ - student        │──┤
                │ - class          │  │
                │ - subjectMarks[] │  │
                │ - totalMarks     │  │
                │ - percentage     │  │
                │ - grade          │  │
                │ - isPassed       │  │
                │ - classRank      │  │
                │ - reportCardUrl  │  │
                └──────────────────┘  │
                                      │
                                      │ references
                              ┌───────▼────────┐
                              │ GradingSystem  │
                              ├────────────────┤
                              │ - systemName   │
                              │ - academicYear │
                              │ - classes[]    │
                              │ - gradingScale[]│
                              │ - isPassing%   │
                              └────────────────┘
                                      │
                                      │ references
                                      ▼
                              ┌─────────────┐
                              │   Student   │
                              └─────────────┘
```

---

## 🔗 Relationship Details

### Fee Management Relationships

| From Model | To Model | Type | Field | Description |
|------------|----------|------|-------|-------------|
| FeeStructure | Class | Many-to-One | `class` | Each fee structure belongs to one class |
| FeeInvoice | Student | Many-to-One | `student` | Each invoice is for one student |
| FeeInvoice | Class | Many-to-One | `class` | Each invoice belongs to one class |
| FeeInvoice | FeeStructure | Many-to-One | `feeStructure` | Each invoice uses one fee structure |
| FeeInvoice | FeePayment | One-to-Many | `payments[]` | One invoice can have multiple payments |
| FeePayment | FeeInvoice | Many-to-One | `invoice` | Each payment is for one invoice |
| FeePayment | Student | Many-to-One | `student` | Each payment is from one student |
| FeePayment | User | Many-to-One | `collectedBy` | Each payment is collected by one user |

### Attendance Relationships

| From Model | To Model | Type | Field | Description |
|------------|----------|------|-------|-------------|
| StudentAttendance | Student | Many-to-One | `student` | Each record is for one student |
| StudentAttendance | Class | Many-to-One | `class` | Each record belongs to one class |
| StudentAttendance | Subject | Many-to-Many | `subjectAttendance[].subject` | For subject-wise attendance |
| StudentAttendance | LeaveApplication | Many-to-One | `leaveInfo.leaveApplication` | Links to leave if applicable |
| StaffAttendance | User | Many-to-One | `staff` | Each record is for one staff member |
| StaffAttendance | LeaveApplication | Many-to-One | `leaveInfo.leaveApplication` | Links to leave if applicable |
| LeaveApplication | Student | Many-to-One | `student` | For student leaves |
| LeaveApplication | User | Many-to-One | `staff` | For staff leaves |
| LeaveApplication | User | Many-to-One | `appliedBy` | Who applied for leave |
| LeaveApplication | User | Many-to-One | `reviewedBy` | Who reviewed the application |

### Examination Relationships

| From Model | To Model | Type | Field | Description |
|------------|----------|------|-------|-------------|
| Examination | Class | Many-to-Many | `classes[]` | Exam can be for multiple classes |
| Examination | Subject | Many-to-Many | `subjects[].subject` | Exam includes multiple subjects |
| Examination | GradingSystem | Many-to-One | `gradingSystem` | Uses one grading system |
| ExamResult | Examination | Many-to-One | `examination` | Result is for one exam |
| ExamResult | Student | Many-to-One | `student` | Result is for one student |
| ExamResult | Class | Many-to-One | `class` | Result belongs to one class |
| ExamResult | Subject | Many-to-Many | `subjectMarks[].subject` | Marks for multiple subjects |
| ExamResult | User | Many-to-One | `subjectMarks[].enteredBy` | Teacher who entered marks |
| GradingSystem | Class | Many-to-Many | `classes[]` | Can apply to multiple classes |

---

## 📋 Compound Indexes

### Fee Management
```javascript
// FeeStructure
{ class: 1, academicYear: 1 }

// FeeInvoice
{ student: 1, academicYear: 1 }
{ status: 1, dueDate: 1 }
{ invoiceNumber: 1 } // unique

// FeePayment
{ student: 1, paymentDate: -1 }
{ invoice: 1 }
{ receiptNumber: 1 } // unique
{ paymentDate: 1, status: 1 }
```

### Attendance
```javascript
// StudentAttendance
{ student: 1, date: 1 } // unique
{ class: 1, date: 1 }
{ date: 1, overallStatus: 1 }

// StaffAttendance
{ staff: 1, date: 1 } // unique
{ date: 1, status: 1 }

// LeaveApplication
{ student: 1, fromDate: 1 }
{ staff: 1, fromDate: 1 }
{ status: 1, appliedAt: -1 }
```

### Examination
```javascript
// Examination
{ academicYear: 1, examType: 1 }
{ startDate: 1, status: 1 }

// ExamResult
{ examination: 1, student: 1 } // unique
{ class: 1, examination: 1 }
{ student: 1, academicYear: 1 }

// GradingSystem
{ academicYear: 1, isActive: 1 }
```

---

## 🔄 Data Flow Diagrams

### Fee Collection Flow
```
1. Admin creates FeeStructure for Class
   ↓
2. System generates FeeInvoices for all Students in Class
   ↓
3. Parent/Student views Invoice
   ↓
4. Accountant records FeePayment
   ↓
5. System updates Invoice (paidAmount, balanceAmount, status)
   ↓
6. System generates Receipt PDF
```

### Attendance Flow
```
1. Teacher marks StudentAttendance for Class
   ↓
2. System calculates overallStatus
   ↓
3. If absent and no LeaveApplication:
   ↓
4. System sends notification to Parent
   ↓
5. Parent applies for LeaveApplication
   ↓
6. Teacher approves LeaveApplication
   ↓
7. System updates StudentAttendance with leave info
```

### Examination Flow
```
1. Admin creates Examination with Subjects
   ↓
2. Admin links GradingSystem
   ↓
3. Exam is conducted
   ↓
4. Teachers enter marks in ExamResult
   ↓
5. System calculates percentage and grade
   ↓
6. System determines pass/fail status
   ↓
7. Admin publishes results
   ↓
8. System generates Report Card PDFs
```

---

## 🎯 Cascade Operations

### Delete Operations

| When Deleting | Cascade Action | Affected Models |
|---------------|----------------|-----------------|
| Class | Prevent if has FeeStructure | FeeStructure, FeeInvoice |
| Student | Prevent if has unpaid invoices | FeeInvoice, FeePayment |
| FeeStructure | Prevent if has invoices | FeeInvoice |
| FeeInvoice | Delete related payments | FeePayment |
| Examination | Delete related results | ExamResult |
| Subject | Prevent if in active exam | Examination, ExamResult |

### Update Operations

| When Updating | Cascade Action | Affected Models |
|---------------|----------------|----------------|
| FeeStructure.totalAnnualFee | Recalculate | Auto (pre-save hook) |
| FeeInvoice.paidAmount | Update balanceAmount, status | Auto (pre-save hook) |
| FeePayment (new) | Update Invoice.paidAmount | FeeInvoice |
| LeaveApplication.status | Update Attendance.leaveInfo | StudentAttendance, StaffAttendance |
| ExamResult.subjectMarks | Recalculate totals, grade | Auto (pre-save hook) |

---

## 📊 Query Patterns

### Common Queries

#### Fee Management
```javascript
// Get all unpaid invoices
FeeInvoice.find({ status: { $in: ['Issued', 'Overdue', 'Partially Paid'] } })

// Get student's payment history
FeePayment.find({ student: studentId }).sort({ paymentDate: -1 })

// Get daily collection report
FeePayment.find({ 
  paymentDate: { $gte: startOfDay, $lte: endOfDay },
  status: 'Success'
})

// Get defaulters list
FeeInvoice.find({ 
  status: 'Overdue',
  balanceAmount: { $gt: 0 }
}).populate('student')
```

#### Attendance
```javascript
// Get class attendance for a date
StudentAttendance.find({ class: classId, date: specificDate })

// Get student's monthly attendance
StudentAttendance.find({
  student: studentId,
  date: { $gte: monthStart, $lte: monthEnd }
})

// Get today's absentees
StudentAttendance.find({
  date: today,
  overallStatus: 'Absent'
}).populate('student')

// Get pending leave applications
LeaveApplication.find({ status: 'Pending' })
```

#### Examination
```javascript
// Get student's all results
ExamResult.find({ student: studentId }).populate('examination')

// Get class results for an exam
ExamResult.find({ 
  examination: examId,
  class: classId 
}).sort({ overallPercentage: -1 })

// Get subject-wise performance
ExamResult.aggregate([
  { $match: { examination: examId } },
  { $unwind: '$subjectMarks' },
  { $group: {
    _id: '$subjectMarks.subject',
    avgPercentage: { $avg: '$subjectMarks.percentage' }
  }}
])
```

---

## 🔐 Access Control Matrix

| Role | Fee Structure | Fee Invoice | Fee Payment | Attendance | Leave | Exam | Result |
|------|--------------|-------------|-------------|------------|-------|------|--------|
| Admin | CRUD | CRUD | CRUD | CRUD | Approve | CRUD | View |
| Accountant | View | CRUD | CRUD | - | - | - | - |
| Teacher | View | View | - | Mark | Approve | View | Enter |
| Student | View | View Own | - | View Own | Apply | View Own | View Own |
| Parent | View | View Child | Pay | View Child | Apply | View Child | View Child |

**Legend:** CRUD = Create, Read, Update, Delete

---

## 📈 Scalability Considerations

### Partitioning Strategy
- **By Academic Year**: Separate collections per year for historical data
- **By School**: Multi-tenancy support (already implemented)

### Archival Strategy
- Archive invoices older than 3 years
- Archive attendance older than 2 years
- Keep exam results permanently

### Caching Strategy
- Cache active fee structures
- Cache grading systems
- Cache class-student mappings

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-21  
**Purpose:** Database Schema Reference
