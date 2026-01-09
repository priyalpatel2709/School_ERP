# 📚 LMS Workflow Guide: From Assignment to Grading

This document details the **exact API lifecycle** of a Homework assignment in the School ERP.
It explains how data flows from the **Teacher** to the **Class** and finally to the **Student**.

---

## 🔄 The Flow Overview
1.  **Teacher** creates Homework → Linked to `Class ID`.
2.  **Student** (in that Class) opens Dashboard → System fetches logic.
3.  **Student** Uploads work → Status updates to `Submitted`.
4.  **Teacher** checks Status → Sees who is Pending/Overdue.

---

## 1. 👩‍🏫 Teacher Assigns Homework
**Scenario**: Teacher wants to assign "Math Algebra" to **Class 10-A** and **10-B**.

*   **Endpoint**: `POST /api/v1/homeWork`
*   **Request**:
    ```json
    {
      "title": "Algebra Chapter 5 Exercises",
      "description": "Complete page 40-42",
      "subject": "64f1...", // Math Subject ID
      "class": ["64f2...", "64f3..."], // IDs of Class 10-A and 10-B
      "assignedBy": "64f4...", // Teacher Profile ID
      "dueDate": "2024-03-01T23:59:00",
      "status": "Published",
      "attachments": ["https://school.com/math_worksheet.pdf"]
    }
    ```
*   **Response (201 Created)**:
    ```json
    {
      "_id": "64h99...",
      "title": "Algebra Chapter 5 Exercises",
      "status": "Published",
      "createdAt": "2024-02-20T10:00:00"
    }
    ```

---

## 2. 🎓 Student View (Smart Dashboard)
**Scenario**: Student "Bob" (from Class 10-A) logs in. He wants to know "Do I have homework?".

*   **Endpoint**: `GET /api/v1/homeWork/by-student/:studentId`
*   **Logic**: The system finds all homework for Class 10-A and checks if Bob has submitted yet.
*   **Request**: `GET /api/v1/homeWork/by-student/64s11...` (Bob's ID)
*   **Response**:
    ```json
    [
      {
        "_id": "64h99...",
        "title": "Algebra Chapter 5 Exercises",
        "subject": { "name": "Math", "code": "M101" },
        "teacher": "Mr. Smith",
        "dueDate": "2024-03-01T23:59:00",
        "attachments": ["https://school.com/math_worksheet.pdf"],
        "status": "Pending",  // <--- 🟡 Bob hasn't done it yet!
        "mySubmission": null
      },
      {
        "_id": "64h88...",
        "title": "History Essay",
        "status": "Overdue",  // <--- 🔴 Date passed!
      }
    ]
    ```

---

## 3. 📝 Student Submits Work
**Scenario**: Bob uploads his answer sheet.

*   **Endpoint**: `POST /api/v1/homeWork/submit`
*   **Request**:
    ```json
    {
      "homeworkId": "64h99...",
      "studentId": "64s11...", // Bob's ID
      "attachments": ["https://drive.com/bob_answers.jpg"]
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "message": "Submission Successful",
      "status": "Submitted"
    }
    ```

---

## 4. 📊 Teacher Tracks Progress
**Scenario**: Teacher wants to see "Who hasn't submitted yet?".

*   **Endpoint**: `GET /api/v1/homeWork/submission-status/:homeworkId`
*   **Request**: `GET .../submission-status/64h99...`
*   **Response**:
    ```json
    {
      "homeworkTitle": "Algebra Chapter 5 Exercises",
      "totalStudents": 40,
      "submittedCount": 1,
      "students": [
        {
          "name": "Bob",
          "rollNumber": 12,
          "status": "Submitted", // 🟢 Bob is done
          "submissionDate": "2024-02-21T14:00:00",
          "attachments": ["https://drive.com/bob_answers.jpg"]
        },
        {
          "name": "Alice",
          "rollNumber": 13,
          "status": "Pending", // 🟡 Alice is waiting
          "submissionDate": null
        }
      ]
    }
    ```

---

## 5. ✅ Teacher Grades Work
**Scenario**: Teacher gives Bob an "A".

*   **Endpoint**: `POST /api/v1/homeWork/grade`
*   **Request**:
    ```json
    {
      "homeworkId": "64h99...",
      "studentId": "64s11...",
      "grade": "A",
      "feedback": "Great job on the equations!"
    }
    ```
*   **Result**: When Bob checks his dashboard again, his status will change from `Submitted` to `Graded`.
