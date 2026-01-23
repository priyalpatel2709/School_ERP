# Phase 2 API Testing Guide

Quick reference for testing all Phase 2 API endpoints using curl.

---

## Environment Setup

```bash
# Set your environment variables
BASE_URL="http://localhost:3000/api"
TOKEN="your_jwt_token_here"
SCHOOL_ID="school_123"
```

---

## 1. Fee Management APIs

### Bulk Generate Invoices
```bash
curl -X POST $BASE_URL/fees/invoices/bulk-generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-School-Id: $SCHOOL_ID" \
  -d '{
    "classIds": ["class_id_1", "class_id_2"],
    "month": 1,
    "year": 2024,
    "academicYear": "2023-2024"
  }'
```

### Get Overdue Invoices (Defaulters)
```bash
curl -X GET "$BASE_URL/fees/invoices/overdue" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-School-Id: $SCHOOL_ID"
```

### Get Student Invoices
```bash
curl -X GET "$BASE_URL/fees/invoices/student/STUDENT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-School-Id: $SCHOOL_ID"
```

### Get Fee Structure by Class
```bash
curl -X GET "$BASE_URL/fees/structures/class/CLASS_ID?academicYear=2023-2024" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-School-Id: $SCHOOL_ID"
```

### Get Student Payment History
```bash
curl -X GET "$BASE_URL/fees/payments/student/STUDENT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-School-Id: $SCHOOL_ID"
```

### Daily Collection Report
```bash
curl -X GET "$BASE_URL/fees/payments/reports/daily?date=2024-01-22" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-School-Id: $SCHOOL_ID"
```

---

## 2. Attendance APIs

### Bulk Mark Student Attendance
```bash
curl -X POST $BASE_URL/attendance/student/bulk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-School-Id: $SCHOOL_ID" \
  -d '{
    "classId": "CLASS_ID",
    "date": "2024-01-22",
    "academicYear": "2023-2024",
    "attendanceRecords": [
      {
        "studentId": "STUDENT_ID_1",
        "attendanceMode": "Daily",
        "dailyStatus": {
          "morning": { "status": "Present" },
          "evening": { "status": "Present" }
        }
      },
      {
        "studentId": "STUDENT_ID_2",
        "attendanceMode": "Daily",
        "dailyStatus": {
          "morning": { "status": "Absent" },
          "evening": { "status": "Absent" }
        }
      }
    ]
  }'
```

### Get Monthly Attendance Report
```bash
curl -X GET "$BASE_URL/attendance/student/STUDENT_ID/monthly?month=1&year=2024" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-School-Id: $SCHOOL_ID"
```

### Get Class Attendance by Date
```bash
curl -X GET "$BASE_URL/attendance/student/class/CLASS_ID/date/2024-01-22" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-School-Id: $SCHOOL_ID"
```

### Staff Check-In
```bash
curl -X POST $BASE_URL/attendance/staff/check-in \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-School-Id: $SCHOOL_ID" \
  -d '{
    "staffId": "STAFF_USER_ID",
    "location": "School",
    "method": "Manual",
    "academicYear": "2023-2024"
  }'
```

### Staff Check-Out
```bash
curl -X POST $BASE_URL/attendance/staff/check-out \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-School-Id: $SCHOOL_ID" \
  -d '{
    "staffId": "STAFF_USER_ID",
    "location": "School",
    "method": "Manual"
  }'
```

### Staff Monthly Report
```bash
curl -X GET "$BASE_URL/attendance/staff/STAFF_ID/monthly?month=1&year=2024" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-School-Id: $SCHOOL_ID"
```

---

## 3. Leave Management APIs

### Apply for Leave
```bash
curl -X POST $BASE_URL/leave \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-School-Id: $SCHOOL_ID" \
  -d '{
    "applicantType": "Student",
    "student": "STUDENT_ID",
    "leaveType": "Sick Leave",
    "fromDate": "2024-01-23",
    "toDate": "2024-01-25",
    "reason": "Fever",
    "appliedBy": "PARENT_USER_ID"
  }'
```

### Get Pending Leave Applications
```bash
curl -X GET "$BASE_URL/leave/pending" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-School-Id: $SCHOOL_ID"
```

### Approve Leave
```bash
curl -X PUT $BASE_URL/leave/LEAVE_ID/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-School-Id: $SCHOOL_ID" \
  -d '{
    "reviewComments": "Approved. Get well soon."
  }'
```

### Reject Leave
```bash
curl -X PUT $BASE_URL/leave/LEAVE_ID/reject \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-School-Id: $SCHOOL_ID" \
  -d '{
    "reviewComments": "Please provide medical certificate."
  }'
```

### Get Student Leave History
```bash
curl -X GET "$BASE_URL/leave/student/STUDENT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-School-Id: $SCHOOL_ID"
```

### Get Staff Leave History
```bash
curl -X GET "$BASE_URL/leave/staff/STAFF_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-School-Id: $SCHOOL_ID"
```

---

## 4. Examination & Results APIs

### Create Examination
```bash
curl -X POST $BASE_URL/examinations/exams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-School-Id: $SCHOOL_ID" \
  -d '{
    "examName": "Mid-Term Examination",
    "examType": "Term Exam",
    "academicYear": "2023-2024",
    "classes": ["CLASS_ID_1", "CLASS_ID_2"],
    "startDate": "2024-02-15",
    "endDate": "2024-02-25",
    "subjects": [
      {
        "subject": "SUBJECT_ID",
        "examDate": "2024-02-15",
        "startTime": "09:00 AM",
        "duration": 180,
        "maxMarks": 100,
        "passingMarks": 33,
        "weightage": 50
      }
    ],
    "gradingSystem": "GRADING_SYSTEM_ID",
    "status": "Scheduled"
  }'
```

### Bulk Mark Entry
```bash
curl -X POST $BASE_URL/examinations/results/bulk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-School-Id: $SCHOOL_ID" \
  -d '{
    "examinationId": "EXAM_ID",
    "classId": "CLASS_ID",
    "subjectId": "SUBJECT_ID",
    "marks": [
      { "studentId": "STUDENT_ID_1", "marks": 85 },
      { "studentId": "STUDENT_ID_2", "marks": 92 },
      { "studentId": "STUDENT_ID_3", "marks": 78 }
    ]
  }'
```

### Calculate Class Ranks
```bash
curl -X POST "$BASE_URL/examinations/results/exam/EXAM_ID/class/CLASS_ID/calculate-ranks" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-School-Id: $SCHOOL_ID"
```

### Publish Results
```bash
curl -X PUT $BASE_URL/examinations/exams/EXAM_ID/publish \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-School-Id: $SCHOOL_ID"
```

### Get Class Results
```bash
curl -X GET "$BASE_URL/examinations/results/exam/EXAM_ID/class/CLASS_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-School-Id: $SCHOOL_ID"
```

### Get Student Results History
```bash
curl -X GET "$BASE_URL/examinations/results/student/STUDENT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-School-Id: $SCHOOL_ID"
```

### Verify Exam Result
```bash
curl -X PUT $BASE_URL/examinations/results/RESULT_ID/verify \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-School-Id: $SCHOOL_ID"
```

### Class Performance Analysis
```bash
curl -X GET "$BASE_URL/examinations/results/exam/EXAM_ID/class/CLASS_ID/performance" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-School-Id: $SCHOOL_ID"
```

### Get Examinations by Class
```bash
curl -X GET "$BASE_URL/examinations/exams/class/CLASS_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-School-Id: $SCHOOL_ID"
```

---

## 5. Grading System APIs

### Create Grading System
```bash
curl -X POST $BASE_URL/grading \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-School-Id: $SCHOOL_ID" \
  -d '{
    "systemName": "CBSE Grading 2024",
    "academicYear": "2023-2024",
    "classes": ["CLASS_ID_1", "CLASS_ID_2"],
    "gradingScale": [
      {
        "grade": "A+",
        "gradePoint": 10,
        "minPercentage": 91,
        "maxPercentage": 100,
        "description": "Outstanding",
        "isPassing": true
      },
      {
        "grade": "A",
        "gradePoint": 9,
        "minPercentage": 81,
        "maxPercentage": 90,
        "description": "Excellent",
        "isPassing": true
      },
      {
        "grade": "B+",
        "gradePoint": 8,
        "minPercentage": 71,
        "maxPercentage": 80,
        "description": "Very Good",
        "isPassing": true
      }
    ],
    "defaultPassingPercentage": 33,
    "isActive": true
  }'
```

---

## Response Format

All endpoints return responses in the following format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "count": 10,  // For list endpoints
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message here"
}
```

---

## Common Query Parameters

### Pagination (if implemented)
```
?page=1&limit=10
```

### Filtering
```
?status=Active&academicYear=2023-2024
```

### Sorting
```
?sort=createdAt&order=desc
```

---

## Testing Workflow

### 1. Fee Management Flow
```bash
# 1. Create fee structure
# 2. Generate bulk invoices
# 3. Record payment
# 4. Check daily collection report
```

### 2. Attendance Flow
```bash
# 1. Mark daily attendance (bulk)
# 2. Get class attendance for verification
# 3. Check monthly report
```

### 3. Leave Flow
```bash
# 1. Apply for leave
# 2. View pending applications
# 3. Approve/reject leave
# 4. Check leave history
```

### 4. Examination Flow
```bash
# 1. Create examination
# 2. Bulk enter marks
# 3. Verify results
# 4. Calculate ranks
# 5. Publish results
# 6. Get performance analysis
```

---

**Note:** Replace placeholder IDs (STUDENT_ID, CLASS_ID, etc.) with actual MongoDB ObjectIds from your database.

**Tip:** Use environment variables or a tool like Postman for easier testing.
