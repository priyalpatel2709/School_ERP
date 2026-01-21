# Enterprise Homework Module - cURL Examples

Use these examples to test the new Homework workflows.

**Prerequisites:**
- Replace `{{TOKEN}}` with a valid JWT Token.
- Replace `{{SCHOOL_ID}}` with your target school ID (e.g., `school1`).
- Replace IDs (`{{TEACHER_ID}}`, `{{CLASS_ID}}`, `{{SUBJECT_ID}}`, etc.) with actual Mongo ObjectIds.

## 1. 👩‍🏫 Teacher Workflows

### Create New Homework (Enterprise)
*Create a homework with Subject link, multiple attachments, and Draft status.*
```bash
curl -X POST http://localhost:3000/api/v1/homeWork \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "X-School-Id: {{SCHOOL_ID}}" \
  -d '{
    "title": "Algebra Linear Equations",
    "description": "Complete Exercise 4.1 to 4.3 from the textbook. See attached PDF.",
    "dueDate": "2026-01-15T23:59:59Z",
    "status": "Published",
    "class": "{{CLASS_ID}}",
    "subject": "{{SUBJECT_ID}}",
    "assignedBy": "{{TEACHER_ID}}",
    "attachments": [
        "https://school-cloud-storage.com/math-worksheet-1.pdf",
        "https://school-cloud-storage.com/reference-image.png"
    ]
}'
```

### Get Homework Created by Teacher (New API)
*Fetch all homework assigned by a specific teacher.*
```bash
curl -X GET "http://localhost:3000/api/v1/homeWork/by-teacher/{{TEACHER_ID}}" \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "X-School-Id: {{SCHOOL_ID}}"
```

### Grade a Submission
```bash
curl -X POST http://localhost:3000/api/v1/homeWork/grade \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "X-School-Id: {{SCHOOL_ID}}" \
  -d '{
    "homeworkId": "{{HOMEWORK_ID}}",
    "studentId": "{{STUDENT_ID}}",
    "grade": "A+",
    "feedback": "Excellent work on the equations!"
}'
```

---

## 2. 🎓 Student Workflows

### Get Student's Homework List (Smart View)
*Fetches all homework for the student class, with dynamic status (Pending, Overdue, Submitted).*
```bash
curl -X GET "http://localhost:3000/api/v1/homeWork/by-student/{{STUDENT_ID}}" \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "X-School-Id: {{SCHOOL_ID}}"
```

### Submit Homework
*Student submits multiple attachments.*
```bash
curl -X POST http://localhost:3000/api/v1/homeWork/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "X-School-Id: {{SCHOOL_ID}}" \
  -d '{
    "homeworkId": "{{HOMEWORK_ID}}",
    "studentId": "{{STUDENT_ID}}",
    "attachments": [
        "https://my-drive.com/homework-page1.jpg",
        "https://my-drive.com/homework-page2.jpg"
    ]
}'

---

## 3. 🏫 Class & Admission Workflows (New)

### Create Class (with Capacity & Academic Year)
```bash
curl -X POST http://localhost:3000/api/v1/class \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "X-School-Id: {{SCHOOL_ID}}" \
  -d '{
    "classNumber": "10",
    "division": "A",
    "academicYear": "2023-2024",
    "maxStudents": 40,
    "classTeacher": "{{TEACHER_ID}}"
}'
```

### Admit Student (Checks Capacity)
*This will fail if Class 10-A has 40 students.*
```bash
curl -X POST http://localhost:3000/api/v1/student/createStudentWithUser \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "X-School-Id: {{SCHOOL_ID}}" \
  -d '{
    "user": {
        "name": { "firstName": "John", "lastName": "Doe" },
        "email": "john.doe@student.com",
        "username": "john2023",
        "password": "Password123",
        "roleName": "Student"
    },
    "roleNumber": 101,
    "admissionNumber": 2023001,
    "class": ["{{CLASS_ID}}"]
}'
```

---

## 4. 👩‍🏫 Teacher Management (New)

### Create Teacher (Enterprise Details)
```bash
curl -X POST http://localhost:3000/api/v1/teacher/createTeacherWithUser \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "X-School-Id: {{SCHOOL_ID}}" \
  -d '{
    "user": {
        "name": { "firstName": "Alice", "lastName": "Smith" },
        "email": "alice.smith@school.com",
        "username": "alice_teacher",
        "password": "Password123",
        "roleName": "Teacher"
    },
    "salary": { "basic": 50000 },
    "employment": {
        "dateOfJoining": "2023-01-01",
        "jobType": "Permanent",
        "status": "Active"
    },
    "qualifications": [
        { "degree": "M.Sc Mathematics", "university": "MIT", "yearOfPassing": 2018 }
    ]
}'
```

### Assign Subjects to Teacher
```bash
curl -X POST http://localhost:3000/api/v1/teacher/assign-subjects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "X-School-Id: {{SCHOOL_ID}}" \
  -d '{
    "teacherId": "{{TEACHER_ID}}",
    "subjectIds": ["{{SUBJECT_ID_MATH}}", "{{SUBJECT_ID_PHYSICS}}"]
}'
```

---

## 5. 👨‍👩‍👧 Student & Parent Advanced (New)

### Create Parent Portal Account
*Creates a login for the Father/Mother and links to student profile.*
```bash
curl -X POST http://localhost:3000/api/v1/student/create-parent-account \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "X-School-Id: {{SCHOOL_ID}}" \
  -d '{
    "studentId": "{{STUDENT_ID}}",
    "guardianRelation": "Father",
    "userData": {
        "name": { "firstName": "Robert", "lastName": "Doe" },
        "email": "robert.doe@parent.com",
        "username": "robert_dad",
        "password": "Password123"
    }
}'
```

### Link Siblings (Bi-directional)
*Links Student A and Student B as siblings for fee discounts.*
```bash
curl -X POST http://localhost:3000/api/v1/student/link-sibling \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "X-School-Id: {{SCHOOL_ID}}" \
  -d '{
    "studentId": "{{STUDENT_ID_A}}",
    "siblingId": "{{STUDENT_ID_B}}"
}'
```
```
