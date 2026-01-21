# 👑 Admin Role: Capabilities & Management Guide

This document outlines the administrative powers and management capabilities of the **Admin** role in the School ERP. Use this to build the **Admin Dashboard**.

---

## 1. 👥 Advanced User Management
**Goal**: "Onboard staff and students and manage their access."

### A. Create Teacher with Credentials
*   **Action**: Create a teacher profile and their system user account in one step.
*   **API**: `POST /api/v1/teacher/createTeacherWithUser`
*   **Key Payload**:
    ```json
    {
      "user": { "firstName": "John", "lastName": "Doe", "email": "john@school.com", "password": "..." },
      "employment": { "dateOfJoining": "2024-01-01", "salary": { "basic": 50000 } }
    }
    ```

### B. Create Student with Credentials
*   **Action**: Create a student record and their associated user account.
*   **API**: `POST /api/v1/student/createStudentWithUser`

### C. Parent & Sibling Management
*   **Action**: Link siblings to the same parent or create parent accounts.
*   **APIs**: 
    *   `POST /api/v1/student/link-sibling`: Connect two students as siblings.
    *   `POST /api/v1/student/create-parent-account`: Generate a login for parents.

### D. System Users & RBAC
*   **Action**: Manage existing users and their permissions.
*   **APIs**:
    *   `GET /api/v1/user/users/school`: List all users belonging to current school.
    *   `POST /api/v1/user/users/role`: Assign or update roles for an existing user.
    *   `POST /api/v1/role`: Create new system roles (e.g. Librarian).

---

## 2. 🏛️ Academic Infrastructure Setup
**Goal**: "Define the rooms, grades, and subjects for the school."

### A. Class Management
*   **Action**: Create and manage the school's classes/sections.
*   **API**: `POST /api/v1/class` / `GET /api/v1/class`
*   **Fields**: Class name, sections, capacity, etc.

### B. Subject Management
*   **Action**: Define the curriculum.
*   **API**: `POST /api/v1/subject`
*   **Fields**: Name, Subject Code (e.g., MATH101), Subject Type (Theory/Practical).

### C. Subject Assignment
*   **Action**: Tell the system which teacher teaches which subject.
*   **API**: `POST /api/v1/teacher/assign-subjects`
*   **Payload**: `{ "teacherId": "...", "subjectIds": ["...", "..."] }`

---

## 3. 📅 Centralized Scheduling (Timetable)
**Goal**: "Organize the school's daily routine."
*   **Action**: Create the master timetable for the entire school.
*   **API**: `POST /api/v1/timeTable`
*   **Logic**: Assigns subjects, teachers, and classrooms to specific time slots and days for a particular class.

---

## 5. 🔔 Communications & Notifications
**Goal**: "Blast announcements to the school community."
*   **Action**: Send a notification to specific user roles (Teachers/Parents) or the entire school.
*   **API**: `POST /api/v1/notification/sendNotification`
*   **Payload**:
    ```json
    {
      "title": "School Holiday",
      "message": "Tomorrow is a public holiday.",
      "targetRoles": ["Teacher", "Student", "Parent"]
    }
    ```

---

## 6. 🏢 School Configuration & Info
**Goal**: "Manage permissions for staff."
*   **Action**: View system logs and manage roles for other staff (Librarian, Accountant).
*   **API**: `GET /api/v1/role`
*   **Logic**: Ensures users can only access the menus meant for their job.

---

## 🚀 Recommended Dashboard Widgets for Admin:
1.  **Quick Enrollment Count**: Total Students vs Total Teachers.
2.  **Recent Admissions**: List of students added today/this week.
3.  **Setup Progress**: Checklist for creating Classes -> Subjects -> Teachers -> Timetable.
4.  **System Healthy**: Database connection status.
