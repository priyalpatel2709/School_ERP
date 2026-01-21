# 👩‍🏫 Teacher Role: Capabilities & API Guide

This document outlines everything a logged-in **Teacher** can do in the School ERP.
Use this to build the **Teacher Dashboard**.

---

## 1. 🗓️ Daily Schedule (TimeTable)
**Goal**: "What classes do I need to teach today?"
*   **Action**: The teacher logs in and sees their weekly/daily schedule grid.
*   **API**: `GET /api/v1/teacher/getTimeTableByTeacherId/:userId`
    *   *Note*: You can pass the logged-in `userId` here. The backend automatically resolves it to the Teacher Profile.
*   **Frontend Display**:
    *   Show a Weekly Calendar View.
    *   Highlight "Today's" lectures.
    *   Display: `Class` (e.g., 10-A), `Subject` (Math), `Time` (09:00 - 10:00), and `Room`.

---

## 2. 📚 Homework Management (LMS)
**Goal**: "Assign work to my students and check their submissions."

### A. Assign New Homework
*   **Action**: Teacher clicks "Create Assignment".
*   **API**: `POST /api/v1/homeWork`
*   **Payload**:
    ```json
    {
        "title": "Algebra Chapter 5",
        "description": "Solve exercise 5.1",
        "subject": "subject_id_math", 
        "class": ["class_id_10A", "class_id_10B"], // Assign to Multiple Classes!
        "dueDate": "2024-02-20",
        "status": "Published", 
        "assignedBy": "teacher_profile_id", 
        "attachments": ["http://link-to-pdf.com"]
    }
    ```

### B. View "My Assignments"
*   **Action**: Teacher views a list of all homework they have given.
*   **API**: `GET /api/v1/homeWork/by-teacher/:userId`
    *   *Note*: Use the logged-in `userId`.
*   **Frontend Display**:
    *   List of cards: title, class, due date.
    *   Show status: `Draft` (Grey), `Published` (Green).

### C. Track Submission Status
*   **Action**: Teacher sees a breakdown of who in the class has submitted, is late, or is overdue.
*   **API**: `GET /api/v1/homeWork/submission-status/:homeworkId`
*   **Response**: Detailed list of students with their submission dates and attachments.

### D. Grade Student Work
*   **Action**: Teacher clicks on a specific Homework, sees a list of students, and grades one.
*   **API**: `POST /api/v1/homeWork/grade`
*   **Payload**:
    ```json
    {
        "homeworkId": "homework_mongo_id",
        "studentId": "student_mongo_id",
        "grade": "A+",
        "feedback": "Excellent work!"
    }
    ```

---

## 3. 👤 Profile & Employment
**Goal**: "View my official employment details."
*   **Action**: Teacher views their profile page.
*   **API**: `GET /api/v1/teacher/:profileId` (or search by their user ID)
    *   *Note*: To get this ID, check the `profileId` returned during Login.
*   **Data Available**:
    *   **Personal**: Name, Email, Address.
    *   **Professional**: Qualifications (Degrees), Experience.
    *   **HR**: Date of Joining, Job Type, Basic Salary.

---

## 4. 🔔 Notifications
**Goal**: "Check announcements from the Principal/Admin."
*   **Action**: Teacher checks the "Bell Icon".
*   **API**: `GET /api/v1/notification`
*   **Logic**: Displays alerts sent specifically to "Teachers" or "All Users".

---

## 🚧 Upcoming Features (Phase 2)
*   **Attendance**: Mark student attendance for the day. (Coming Soon)
*   **Exams**: Enter marks for Term Exams. (Coming Soon)
