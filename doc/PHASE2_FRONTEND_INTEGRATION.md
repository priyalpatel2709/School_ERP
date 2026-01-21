# Phase 2 Frontend Integration Guide

This document provides a consolidated reference for integrating the new Phase 2 modules into the frontend application. It details the API endpoints, required permissions, and integration flows, including **Request** and **Response** examples.

**Base URL**: `http://localhost:3000/api/v1`

---

## 1. Fee Management Module
**Base Path**: `/fee`

### 💰 Fee Structures
Used to configure fee heads (tuition, transport, etc.) for classes.

#### Create Fee Structure
*   **Endpoint**: `POST /fee/structures`
*   **Permission**: `fee:structure:create`

**Request Body**:
```json
{
  "class": "65af2b...", 
  "academicYear": "2023-2024",
  "effectiveFrom": "2023-04-01",
  "feeHeads": [
    {
      "headName": "Tuition Fee",
      "amount": 5000,
      "frequency": "Monthly",
      "isMandatory": true
    },
    {
      "headName": "Lab Fee",
      "amount": 1000,
      "frequency": "Yearly"
    }
  ],
  "lateFeeConfig": {
    "enabled": true,
    "gracePeriodDays": 5,
    "lateFeeType": "Fixed",
    "lateFeeValue": 100
  },
  "status": "Active"
}
```

**Response (201 Created)**:
```json
{
  "_id": "65b0c1...",
  "class": "65af2b...",
  "academicYear": "2023-2024",
  "feeHeads": [
    {
      "headName": "Tuition Fee",
      "amount": 5000,
      "_id": "65b0c1...1",
      "frequency": "Monthly"
    }
  ],
  "totalAnnualFee": 61000, // Auto-calculated (5000*12 + 1000)
  "createdAt": "2026-01-21T10:00:00.000Z"
}
```

---

### 🧾 Fee Invoices
Used to generate fee invoices for students.

#### Generate Invoice
*   **Endpoint**: `POST /fee/invoices`
*   **Permission**: `fee:invoice:create`

**Request Body**:
```json
{
  "student": "65af3c...",
  "class": "65af2b...", 
  "academicYear": "2023-2024",
  "feeStructure": "65b0c1...",
  "invoicePeriod": "Monthly",
  "periodMonth": 4,
  "issueDate": "2023-04-01",
  "dueDate": "2023-04-10",
  "feeItems": [
    { "headName": "Tuition Fee", "amount": 5000 }
  ],
  "subtotal": 5000,
  "totalAmount": 5000,
  "balanceAmount": 5000
}
```

**Response (201 Created)**:
```json
{
  "_id": "65b0d2...",
  "invoiceNumber": "INV-2023-0001", // Auto-generated
  "student": {
     "_id": "65af3c...",
     "user": "65af3a..." // User ID reference
  },
  "totalAmount": 5000,
  "balanceAmount": 5000,
  "status": "Issued",
  "dueDate": "2023-04-10T00:00:00.000Z"
}
```

#### List Invoices
*   **Endpoint**: `GET /fee/invoices`
*   **Permission**: `fee:invoice:view`

**Response (200 OK)**:
```json
[
  {
    "_id": "65b0d2...",
    "invoiceNumber": "INV-2023-0001",
    "student": {
      "name": "John Doe",
      "roleNumber": "101"
    },
    "totalAmount": 5000,
    "status": "Paid"
  }
]
```

---

### 💳 Fee Payments
Used to record payments.

#### Record Payment
*   **Endpoint**: `POST /fee/payments`
*   **Permission**: `fee:payment:record`

**Request Body**:
```json
{
  "invoice": "65b0d2...",
  "student": "65af3c...",
  "amount": 5000,
  "paymentMode": "Cash",
  "remarks": "Paid in full",
  "collectedBy": "65af00..." // Typically auto-filled from session
}
```

**Response (201 Created)**:
```json
{
  "_id": "65b0e5...",
  "receiptNumber": "RCP-2023-0001",
  "amount": 5000,
  "status": "Success",
  "paymentDate": "2026-01-21T10:15:00.000Z"
}
```

---

## 2. Attendance Module
**Base Path**: `/attendance`

### 🧑‍🎓 Student Attendance

#### Mark Attendance (Bulk)
*   **Endpoint**: `POST /attendance/student`
*   **Permission**: `attendance:student:mark`

**Request Body**:
```json
{
  "class": "65af2b...",
  "date": "2023-04-05",
  "academicYear": "2023-2024",
  "attendanceMode": "Daily",
  "students": [ // Array of student attendance objects
    {
      "student": "65af3c...",
      "dailyStatus": {
        "morning": { "status": "Present" },
        "evening": { "status": "Present" }
      }
    },
    {
      "student": "65af3d...",
      "dailyStatus": {
        "morning": { "status": "Absent" },
        "evening": { "status": "Absent" }
      }
    }
  ]
}
```

**Response (201 Created)**:
```json
{
  "message": "Attendance marked successfully",
  "count": 25 // Number of records created
}
```

---

### 👨‍🏫 Staff Attendance

#### Staff Check-In
*   **Endpoint**: `POST /attendance/staff`
*   **Permission**: `attendance:staff:mark`

**Request Body**:
```json
{
  "staff": "65af00...", // User ID
  "date": "2023-04-05", // Today
  "checkIn": {
    "time": "2023-04-05T09:00:00.000Z",
    "location": "Front Gate",
    "method": "Biometric"
  }
}
```

**Response (201 Created)**:
```json
{
  "_id": "65b1a1...",
  "staff": "65af00...",
  "status": "Present",
  "checkIn": { "time": "..." }
}
```

---

## 3. Leave Management Module
**Base Path**: `/leave`

### 📝 Leave Applications

#### Apply for Leave
*   **Endpoint**: `POST /leave`
*   **Permission**: `leave:application:apply`

**Request Body**:
```json
{
  "applicantType": "Student",
  "student": "65af3c...",
  "leaveType": "Sick Leave",
  "fromDate": "2023-04-10",
  "toDate": "2023-04-12",
  "reason": "High fever",
  "appliedBy": "65af00..." // Parent User ID
}
```

**Response (201 Created)**:
```json
{
  "_id": "65b2b2...",
  "totalDays": 3,
  "status": "Pending",
  "leaveType": "Sick Leave"
}
```

#### Approve/Reject Leave
*   **Endpoint**: `PUT /leave/:id`
*   **Permission**: `leave:application:approve`

**Request Body**:
```json
{
  "status": "Approved",
  "reviewComments": "Get well soon",
  "reviewedBy": "65af99..." // Admin/Teacher ID
}
```

**Response (200 OK)**:
```json
{
  "_id": "65b2b2...",
  "status": "Approved",
  "reviewedAt": "2026-01-21T11:00:00.000Z"
}
```

---

## 4. Examination Module
**Base Path**: `/examination`

### 📅 Examinations

#### Create Examination
*   **Endpoint**: `POST /examination/exams`
*   **Permission**: `exam:create`

**Request Body**:
```json
{
  "examName": "Mid-Term 2023",
  "examType": "Term Exam",
  "academicYear": "2023-2024",
  "classes": ["65af2b..."],
  "startDate": "2023-09-15",
  "endDate": "2023-09-25",
  "gradingSystem": "65b3c3...",
  "subjects": [
    {
      "subject": "65af44...", // Math
      "examDate": "2023-09-15",
      "startTime": "09:00 AM",
      "duration": 180,
      "maxMarks": 100,
      "passingMarks": 33
    }
  ],
  "status": "Scheduled"
}
```

**Response (201 Created)**:
```json
{
  "_id": "65b4d4...",
  "examName": "Mid-Term 2023",
  "status": "Scheduled"
}
```

---

### 📊 Exam Results

#### Enter Marks
*   **Endpoint**: `POST /examination/results`
*   **Permission**: `marks:enter`

**Request Body**:
```json
{
  "examination": "65b4d4...",
  "class": "65af2b...",
  "student": "65af3c...", // Or array of students for bulk
  "academicYear": "2023-2024",
  "subjectMarks": [
    {
      "subject": "65af44...",
      "marksObtained": 85,
      "maxMarks": 100,
      "passingMarks": 33,
      "enteredBy": "65af00..."
    }
  ]
}
```

**Response (201 Created)**:
```json
{
  "_id": "65b5e5...",
  "student": "65af3c...",
  "totalMarksObtained": 85,
  "overallPercentage": 85,
  "isPassed": true
}
```

---

## 5. Grading Module
**Base Path**: `/grading`

### 🎓 Grading Systems

#### Create Grading System
*   **Endpoint**: `POST /grading`
*   **Permission**: `exam:create`

**Request Body**:
```json
{
  "systemName": "Standard Grading",
  "academicYear": "2023-2024",
  "gradingScale": [
    {
      "grade": "A",
      "gradePoint": 10,
      "minPercentage": 90,
      "maxPercentage": 100
    },
    {
      "grade": "B",
      "gradePoint": 8,
      "minPercentage": 80,
      "maxPercentage": 89
    }
  ],
  "defaultPassingPercentage": 33
}
```

**Response (201 Created)**:
```json
{
  "_id": "65b3c3...",
  "systemName": "Standard Grading",
  "isActive": true
}
```

---
**Document Version**: 1.1
**Created**: 2026-01-21
