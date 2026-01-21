# Phase 2 - Form Structures Quick Reference

This document provides ready-to-use form structures for implementing Phase 2 features in the frontend.

---

## 1. Fee Management Forms

### 1.1 Create Fee Structure Form

```javascript
{
  // Basic Information
  "class": "ObjectId",                    // Required - Dropdown
  "academicYear": "2023-2024",           // Required - Text/Dropdown
  "effectiveFrom": "2023-04-01",         // Required - Date Picker
  "effectiveTo": "2024-03-31",           // Optional - Date Picker
  
  // Fee Heads (Array - Dynamic Add/Remove)
  "feeHeads": [
    {
      "headName": "Tuition Fee",         // Required - Dropdown
      "amount": 5000,                    // Required - Number
      "frequency": "Monthly",            // Required - Dropdown
      "isMandatory": true,               // Checkbox
      "description": "Monthly tuition fee" // Optional - Textarea
    },
    {
      "headName": "Lab Fee",
      "amount": 1000,
      "frequency": "Yearly",
      "isMandatory": true,
      "description": "Annual lab fee"
    }
  ],
  
  // Discounts (Array - Dynamic Add/Remove)
  "discounts": [
    {
      "discountName": "Sibling Discount",  // Required - Text
      "discountType": "Percentage",        // Required - Radio
      "discountValue": 10,                 // Required - Number
      "applicableFor": "Siblings",         // Required - Dropdown
      "description": "10% off for siblings" // Optional - Textarea
    }
  ],
  
  // Late Fee Configuration
  "lateFeeConfig": {
    "enabled": true,                     // Checkbox
    "gracePeriodDays": 5,               // Number
    "lateFeeType": "Fixed",             // Radio
    "lateFeeValue": 100                 // Number
  },
  
  "status": "Active"                     // Dropdown
}
```

**Dropdown Options:**
- **headName**: Tuition Fee, Lab Fee, Library Fee, Sports Fee, Transport Fee, Examination Fee, Development Fee, Computer Fee, Activity Fee, Other
- **frequency**: Monthly, Quarterly, Half-Yearly, Yearly, One-Time
- **discountType**: Percentage, Fixed
- **applicableFor**: Siblings, Merit, Staff Children, Early Payment, Custom
- **lateFeeType**: Percentage, Fixed
- **status**: Draft, Active, Archived

---

### 1.2 Generate Invoice Form

```javascript
{
  // Single Invoice
  "student": "ObjectId",                 // Required - Dropdown/Search
  "class": "ObjectId",                   // Auto-filled from student
  "academicYear": "2023-2024",          // Auto-filled
  "feeStructure": "ObjectId",           // Auto-selected based on class
  "invoicePeriod": "Monthly",           // Required - Dropdown
  "periodMonth": 4,                     // Required if Monthly - Dropdown (1-12)
  "periodQuarter": null,                // Required if Quarterly - Dropdown (1-4)
  "issueDate": "2023-04-01",           // Required - Date Picker
  "dueDate": "2023-04-10",             // Required - Date Picker
  
  // Discounts (Optional - Array)
  "discounts": [
    {
      "discountName": "Early Payment",
      "discountType": "Percentage",
      "discountValue": 5,
      "discountAmount": 250,            // Auto-calculated
      "reason": "Paid before due date"
    }
  ],
  
  "notes": "Please pay before due date" // Optional - Textarea
}
```

**Bulk Invoice Generation:**
```javascript
{
  "classes": ["ObjectId1", "ObjectId2"], // Required - Multi-select
  "academicYear": "2023-2024",          // Required
  "invoicePeriod": "Monthly",           // Required
  "periodMonth": 4,                     // Conditional
  "issueDate": "2023-04-01",           // Required
  "dueDate": "2023-04-10"              // Required
}
```

---

### 1.3 Record Payment Form

```javascript
{
  "invoice": "ObjectId",                 // Required - Search by Invoice Number
  "student": "ObjectId",                 // Auto-filled from invoice
  "paymentDate": "2023-04-05",          // Required - Date Picker (default: today)
  "amount": 5000,                       // Required - Number (max: balance amount)
  "paymentMode": "Cash",                // Required - Dropdown
  
  // Transaction Details (Conditional based on payment mode)
  "transactionDetails": {
    // For Online/UPI
    "transactionId": "TXN123456",       // Text
    "upiId": "parent@upi",              // Text
    
    // For Cheque
    "chequeNumber": "123456",           // Text
    "chequeDate": "2023-04-05",        // Date Picker
    "bankName": "HDFC Bank",           // Text
    
    // For Card
    "cardLastFour": "1234"             // Text (4 digits)
  },
  
  "remarks": "Full payment received",   // Optional - Textarea
  "collectedBy": "ObjectId"             // Auto-filled (current user)
}
```

**Dropdown Options:**
- **paymentMode**: Cash, Cheque, Online Transfer, UPI, Credit Card, Debit Card, Net Banking, Demand Draft

---

## 2. Attendance Forms

### 2.1 Mark Daily Student Attendance Form

```javascript
{
  "class": "ObjectId",                   // Required - Dropdown
  "date": "2023-04-05",                 // Required - Date Picker (default: today)
  "academicYear": "2023-2024",          // Auto-filled
  "attendanceMode": "Daily",            // Fixed
  
  // Bulk attendance for all students in class
  "students": [
    {
      "student": "ObjectId",
      "dailyStatus": {
        "morning": {
          "status": "Present"           // Required - Radio/Dropdown
        },
        "evening": {
          "status": "Present"           // Required - Radio/Dropdown
        }
      },
      "remarks": ""                     // Optional - Text
    }
    // ... repeat for all students
  ]
}
```

**Status Options:**
- **Morning**: Present, Absent, Late, Half-Day, On Leave
- **Evening**: Present, Absent, Left Early, Half-Day

---

### 2.2 Mark Subject-Wise Attendance Form

```javascript
{
  "class": "ObjectId",                   // Required - Dropdown
  "subject": "ObjectId",                 // Required - Dropdown
  "period": 1,                          // Required - Number (1-8)
  "date": "2023-04-05",                 // Required - Date Picker
  "academicYear": "2023-2024",          // Auto-filled
  "attendanceMode": "Subject-Wise",     // Fixed
  
  // Bulk attendance
  "students": [
    {
      "student": "ObjectId",
      "status": "Present"               // Required - Radio/Dropdown
    }
    // ... repeat for all students
  ]
}
```

**Status Options:** Present, Absent, Late

---

### 2.3 Staff Check-In/Check-Out Form

```javascript
// Check-In
{
  "staff": "ObjectId",                   // Auto-filled (current user)
  "date": "2023-04-05",                 // Auto-filled (today)
  "academicYear": "2023-2024",          // Auto-filled
  "checkIn": {
    "time": "2023-04-05T09:00:00",     // Auto-filled (current time)
    "location": "Main Campus",          // Optional - Text/GPS
    "method": "Mobile App"              // Auto-filled
  }
}

// Check-Out
{
  "attendanceId": "ObjectId",            // Reference to check-in record
  "checkOut": {
    "time": "2023-04-05T17:00:00",     // Auto-filled (current time)
    "location": "Main Campus",          // Optional - Text/GPS
    "method": "Mobile App"              // Auto-filled
  }
}
```

---

### 2.4 Leave Application Form

```javascript
{
  "applicantType": "Student",            // Required - Auto-filled based on user role
  "student": "ObjectId",                 // Required if Student - Dropdown (for parent)
  "staff": "ObjectId",                   // Required if Staff - Auto-filled
  
  "leaveType": "Sick Leave",            // Required - Dropdown
  "fromDate": "2023-04-10",             // Required - Date Picker
  "toDate": "2023-04-12",               // Required - Date Picker
  "reason": "Fever and cold",           // Required - Textarea
  
  // Attachments (Optional - File Upload)
  "attachments": [
    {
      "fileName": "medical_certificate.pdf",
      "fileUrl": "https://...",
      "fileType": "application/pdf"
    }
  ],
  
  "appliedBy": "ObjectId"                // Auto-filled (current user)
}
```

**Dropdown Options:**
- **leaveType**: Sick Leave, Casual Leave, Earned Leave, Emergency, Maternity, Paternity, Medical Leave, Other

---

### 2.5 Approve/Reject Leave Form

```javascript
{
  "leaveApplicationId": "ObjectId",      // Required
  "status": "Approved",                  // Required - Radio (Approved/Rejected)
  "reviewComments": "Approved. Get well soon.", // Optional - Textarea
  "reviewedBy": "ObjectId"               // Auto-filled (current user)
}
```

---

## 3. Examination Forms

### 3.1 Create Examination Form

```javascript
{
  "examName": "Mid-Term Examination",    // Required - Text
  "examType": "Term Exam",              // Required - Dropdown
  "academicYear": "2023-2024",          // Required - Dropdown
  "classes": ["ObjectId1", "ObjectId2"], // Required - Multi-select
  
  "startDate": "2023-09-15",            // Required - Date Picker
  "endDate": "2023-09-25",              // Required - Date Picker
  
  // Subjects (Array - Dynamic Add/Remove)
  "subjects": [
    {
      "subject": "ObjectId",             // Required - Dropdown
      "examDate": "2023-09-15",         // Required - Date Picker
      "startTime": "09:00 AM",          // Required - Time Picker
      "duration": 180,                  // Required - Number (minutes)
      "maxMarks": 100,                  // Required - Number
      "passingMarks": 33,               // Required - Number
      "weightage": 100,                 // Optional - Number (default: 100)
      "syllabus": "Chapters 1-5",       // Optional - Textarea
      "instructions": "Calculators allowed" // Optional - Textarea
    }
    // ... repeat for all subjects
  ],
  
  "gradingSystem": "ObjectId",          // Required - Dropdown
  
  "markEntryStartDate": "2023-09-26",   // Optional - Date Picker
  "markEntryEndDate": "2023-10-05",     // Optional - Date Picker
  
  "generalInstructions": "Bring admit card", // Optional - Textarea
  "status": "Scheduled"                  // Dropdown
}
```

**Dropdown Options:**
- **examType**: Term Exam, Unit Test, Monthly Test, Final Exam, Practice Test
- **status**: Scheduled, Ongoing, Completed, Cancelled

---

### 3.2 Enter Marks Form

```javascript
{
  "examination": "ObjectId",             // Required - Dropdown
  "class": "ObjectId",                   // Required - Dropdown
  "subject": "ObjectId",                 // Required - Dropdown
  "academicYear": "2023-2024",          // Auto-filled
  
  // Marks for all students (Bulk Entry)
  "students": [
    {
      "student": "ObjectId",
      "marksObtained": 85,              // Required - Number (0 to maxMarks)
      "remarks": "Excellent performance" // Optional - Text
    }
    // ... repeat for all students
  ],
  
  "enteredBy": "ObjectId"                // Auto-filled (current user)
}
```

---

### 3.3 Add Teacher/Principal Remarks Form

```javascript
{
  "examResultId": "ObjectId",            // Required
  "classTeacherRemarks": "Good progress. Keep it up!", // Optional - Textarea
  "principalRemarks": "Excellent performance." // Optional - Textarea
}
```

---

### 3.4 Create Grading System Form

```javascript
{
  "systemName": "CBSE Grading System",   // Required - Text
  "academicYear": "2023-2024",          // Required - Dropdown
  "classes": ["ObjectId1", "ObjectId2"], // Optional - Multi-select
  
  // Grading Scale (Array - Dynamic Add/Remove)
  "gradingScale": [
    {
      "grade": "A+",                    // Required - Text
      "gradePoint": 10,                 // Required - Number
      "minPercentage": 91,              // Required - Number (0-100)
      "maxPercentage": 100,             // Required - Number (0-100)
      "description": "Outstanding",     // Optional - Text
      "isPassing": true                 // Checkbox
    },
    {
      "grade": "A",
      "gradePoint": 9,
      "minPercentage": 81,
      "maxPercentage": 90,
      "description": "Excellent",
      "isPassing": true
    }
    // ... repeat for all grades
  ],
  
  "defaultPassingPercentage": 33,       // Required - Number
  "isActive": true                      // Checkbox
}
```

---

## 4. Common Form Patterns

### Date Range Picker
```javascript
{
  "fromDate": "2023-04-01",
  "toDate": "2023-04-30"
}
```

### File Upload
```javascript
{
  "attachments": [
    {
      "fileName": "document.pdf",
      "fileUrl": "https://storage.../document.pdf",
      "fileType": "application/pdf"
    }
  ]
}
```

### Search/Autocomplete (for Student/Teacher selection)
```javascript
{
  "searchQuery": "John Doe",
  "searchType": "student",              // student, teacher, staff
  "results": [
    {
      "id": "ObjectId",
      "name": "John Doe",
      "class": "Class 10-A",
      "rollNumber": 101
    }
  ]
}
```

### Dynamic Array Fields (Add/Remove)
```html
<!-- Example for Fee Heads -->
<div id="fee-heads-container">
  <div class="fee-head-item">
    <select name="headName[]">...</select>
    <input type="number" name="amount[]" />
    <button type="button" class="remove-item">Remove</button>
  </div>
</div>
<button type="button" id="add-fee-head">Add Fee Head</button>
```

---

## 5. Validation Rules

### Fee Structure
- `amount` must be >= 0
- `effectiveFrom` must be before `effectiveTo`
- At least one fee head required
- `discountValue` must be > 0
- If `discountType` is "Percentage", `discountValue` must be <= 100

### Invoice
- `dueDate` must be after `issueDate`
- `amount` in payment must be <= `balanceAmount`
- Invoice number must be unique

### Attendance
- Cannot mark future dates
- One attendance record per student per day
- For subject-wise: period must be 1-8

### Examination
- `endDate` must be after `startDate`
- `passingMarks` must be <= `maxMarks`
- `markEntryStartDate` should be after `endDate`
- Each subject's `examDate` must be between `startDate` and `endDate`

### Exam Result
- `marksObtained` must be between 0 and `maxMarks`
- Cannot enter marks if exam status is not "Completed"
- Cannot publish results if mark entry is not complete

### Grading System
- `maxPercentage` must be > `minPercentage`
- Grade ranges must not overlap
- At least one passing grade required

---

## 6. UI Components Needed

### Dropdowns/Select
- Class selector
- Academic year selector
- Student search/selector
- Teacher search/selector
- Subject selector
- Payment mode selector
- Leave type selector
- Exam type selector

### Date/Time Pickers
- Single date picker
- Date range picker
- Time picker
- Date-time picker

### File Upload
- Single file upload
- Multiple file upload
- File type validation
- File size validation

### Dynamic Arrays
- Add/Remove items
- Reorder items (drag-and-drop)

### Tables
- Student list with checkboxes
- Mark entry table
- Payment history table
- Attendance register

### Status Badges
- Invoice status (Paid, Overdue, etc.)
- Attendance status (Present, Absent, etc.)
- Leave status (Pending, Approved, etc.)
- Exam status (Scheduled, Completed, etc.)

---

## 7. Auto-Calculations

### Fee Management
- Total annual fee (sum of all fee heads × frequency)
- Invoice total (subtotal - discounts + late fee)
- Balance amount (total - paid amount)

### Examination
- Subject percentage (marks obtained / max marks × 100)
- Overall percentage (total marks / total max marks × 100)
- Grade (based on grading system)
- Pass/Fail status

### Attendance
- Overall status (based on morning/evening or subject-wise)
- Total days (leave application)
- Working hours (staff check-out - check-in)
- Monthly attendance percentage

---

## 8. Required Permissions

Map these to your RBAC system:

```javascript
const PHASE2_PERMISSIONS = {
  // Fee Management
  FEE_STRUCTURE_VIEW: "fee:structure:view",
  FEE_STRUCTURE_CREATE: "fee:structure:create",
  FEE_STRUCTURE_UPDATE: "fee:structure:update",
  FEE_STRUCTURE_DELETE: "fee:structure:delete",
  
  FEE_INVOICE_VIEW: "fee:invoice:view",
  FEE_INVOICE_CREATE: "fee:invoice:create",
  FEE_INVOICE_UPDATE: "fee:invoice:update",
  FEE_INVOICE_DELETE: "fee:invoice:delete",
  
  FEE_PAYMENT_VIEW: "fee:payment:view",
  FEE_PAYMENT_RECORD: "fee:payment:record",
  FEE_PAYMENT_REFUND: "fee:payment:refund",
  
  // Attendance
  ATTENDANCE_STUDENT_VIEW: "attendance:student:view",
  ATTENDANCE_STUDENT_MARK: "attendance:student:mark",
  ATTENDANCE_STUDENT_UPDATE: "attendance:student:update",
  
  ATTENDANCE_STAFF_VIEW: "attendance:staff:view",
  ATTENDANCE_STAFF_MARK: "attendance:staff:mark",
  
  LEAVE_APPLICATION_VIEW: "leave:application:view",
  LEAVE_APPLICATION_APPLY: "leave:application:apply",
  LEAVE_APPLICATION_APPROVE: "leave:application:approve",
  
  // Examination
  EXAM_VIEW: "exam:view",
  EXAM_CREATE: "exam:create",
  EXAM_UPDATE: "exam:update",
  EXAM_DELETE: "exam:delete",
  
  MARKS_VIEW: "marks:view",
  MARKS_ENTER: "marks:enter",
  MARKS_VERIFY: "marks:verify",
  
  RESULT_VIEW: "result:view",
  RESULT_PUBLISH: "result:publish",
  
  REPORT_CARD_VIEW: "reportcard:view",
  REPORT_CARD_GENERATE: "reportcard:generate",
  
  GRADING_SYSTEM_VIEW: "grading:view",
  GRADING_SYSTEM_CREATE: "grading:create",
  GRADING_SYSTEM_UPDATE: "grading:update"
};
```

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-21  
**Purpose:** Frontend Development Reference
