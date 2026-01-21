# 📘 Frontend Implementation Guide & API Blueprints

This document is the **single source of truth** for building the frontend of the School ERP.
It bridges the gap between the Backend APIs and the User Interface (UI).

## 🔑 Core Concepts for Frontend Devs

### 1. Multi-Tenancy (`X-School-Id`)
Every request requires an `X-School-Id` header. This is the **Tenant ID** (e.g., `school_demo`, `st_xaviers`).
*   **Login Screen**: Ask the user to enter their "School Code" or pick from a dropdown.
*   **Storage**: Save this in `localStorage` alongside the token.

### 2. Dual-Identity System (User vs. Profile)
We have two layers of identity:
*   **User ID (`_id`)**: Used for Authentication (Login/Password).
*   **Profile ID (`profileId`)**: Used for Business Logic.
    *   *Example*: A Teacher logs in with `User ID: 123`. Their actual teacher data (subjects, classes) is in `Teacher Profile ID: 999`.
    *   **Crucial**: When fetching "My Homework", you must send `profileId` (999), not `userId` (123).

---

## 🔐 Module 0: Authentication & Routing
*The Entry Point*

### 0.1 Login Flow
**Why?**: To authenticate users and route them to the correct dashboard.
- **Endpoint**: `POST /api/v1/user/login`
- **Payload**:
  ```json
  {
      "email": "teacher@school.com",
      "password": "secret_password"
  }
  ```
- **Response**:
  ```json
  {
      "token": "eyJhbGcV...", 
      "roleName": "Teacher",      // The Role (Control Access)
      "profileId": "64b..."       // The Profile ID (Use this for API calls!)
  }
  ```

**🧠 Frontend Logic (The Router):**
1.  **Success**: API returns 200 OK.
2.  **Storage**: Save `token`, `roleName`, and `profileId` in Redux/Context/LocalStorage.
3.  **Redirect**: Switch statement on `roleName`:
    *   `Teacher` → Go to `/teacher/dashboard`
    *   `Student` → Go to `/student/dashboard`
    *   `Parent`  → Go to `/parent/dashboard`
    *   `Admin`   → Go to `/admin/dashboard`
    *   `Accountant` → Go to `/finance/dashboard`

---

## 👩‍🏫 Module 1: Teacher Management
*Target User: Admin (HR Panel)*

### 1.1 Onboard New Teacher
**Why?**: A teacher isn't just a user; they have salaries, degrees, and employment history. This API creates both the Login Account and the HR Profile in one go.
- **Endpoint**: `POST /api/v1/teacher/createTeacherWithUser`
- **Payload**:
  ```json
  {
    "user": {
        "name": { "firstName": "Alice" },
        "email": "alice@school.com",
        "password": "tempPassword123",
        "roleName": "Teacher"
    },
    // Enterprise HR Fields
    "employment": {
        "dateOfJoining": "2024-01-01",
        "jobType": "Permanent", // Options: 'Permanent', 'Contract'
        "status": "Active"
    },
    "qualifications": [
        { "degree": "M.Sc Physics", "university": "Oxford", "yearOfPassing": 2019 }
    ],
    "salary": { "basic": 45000 }
  }
  ```

### 1.2 Assign Subjects
**Why?**: Before a teacher can upload homework, the system needs to know *what* they teach.
- **Endpoint**: `POST /api/v1/teacher/assign-subjects`
- **Frontend UI**: A Multi-Select dropdown of all Subjects.
- **Payload**: `{ "teacherId": "...", "subjectIds": ["math_id", "physics_id"] }`

---

## 🏫 Module 2: Class & Admissions
*Target User: Registrar / Admin*

### 2.1 Create Class (with Capacity)
**Why?**: Define the physical limits of a classroom to prevent overcrowding.
- **Endpoint**: `POST /api/v1/class`
- **Payload**:
  ```json
  {
    "classNumber": "10",
    "division": "A", 
    "maxStudents": 40, // The System will Block the 41st student!
    "academicYear": "2023-2024"
  }
  ```

### 2.2 Admit Student (Capacity Restricted)
**Why?**: Enrolls a student into a class.
- **Endpoint**: `POST /api/v1/student/createStudentWithUser`
- **Frontend Error Handling**:
  *   If API returns `400 Bad Request` with message "Class is full", you **MUST** display a Red Alert: *"Admission Denied: Class Capacity Reached."*

---

## 👨‍👩‍👧 Module 3: Student & Parent Portal
*Target User: Admin & Parents*

### 3.1 Create Parent Account
**Why?**: Parents need their OWN login to see grades and pay fees. This endpoint creates a Parent User > Links it to the specific Student.
- **Endpoint**: `POST /api/v1/student/create-parent-account`
- **Visual Flow**: Go to Student Profile > Click "Create Parent Login" > Enter Parent Email.
- **Payload**:
  ```json
  {
      "studentId": "...",
      "guardianRelation": "Father",
      "userData": { "email": "dad@gmail.com", "password": "..." }
  }
  ```

---

## 📚 Module 4: Homework (LMS)
*Target User: Teacher & Student*

### 4.1 Teacher: Create Assignment
**Why?**: To distribute work.
- **Endpoint**: `POST /api/v1/homeWork`
- **UI Tips**:
    *   **Status**: Default to `Draft`. Only show to students when switched to `Published`.
    *   **Attachments**: Allow multiple file uploads.
- **Payload**:
  ```json
  {
      "subject": "math_id",
      "class": "class_id",
      "status": "Published", 
      "attachments": ["link_to_pdf"]
  }
  ```

### 4.2 Student: Smart Dashboard
**Why?**: Students shouldn't just see a list; they need to know what's due.
- **Endpoint**: `GET /api/v1/homeWork/by-student/:studentId`
- **✨ Magic Feature**: The API calculates the status for you!
    *   `item.status == 'Overdue'` → Show: 🔴 Late!
    *   `item.status == 'Pending'` → Show: 🟡 Submit Now
    *   `item.status == 'Submitted'` → Show: 🟢 Done

---

## 📅 Module 5: TimeTable
*Target User: Admin*

### 5.1 set Weekly Schedule
**Why?**: Define who teaches what, when.
- **Endpoint**: `POST /api/v1/timeTable`
- **Frontend UI**: Build a Weekly Grid (Monday-Saturday).
- **Payload Structure**:
  ```json
  {
      "week": {
          "Monday": [
              { "startTime": "09:00", "subject": "math_id", "teacher": "teacher_id" }
          ]
      }
  }
  ```

---

## 🔔 Module 6: Notifications
*Target User: Admin*

### 6.1 Send Broadcast
**Why?**: Emergency alerts or announcements.
- **Endpoint**: `POST /api/v1/notification/sendNotification`
- **Target Logic**:
    *   `targetType: "Role"` + `roleName: "Student"` → Messages ALL Students.
    *   `targetType: "Class"` + `classId: "..."` → Messages specific class.

---

## 📘 Module 7: Admin Settings
*Target User: Admin*

### 7.1 School Branding
**Why?**: Update the logo and name that appears on Reports & Invoices.
- **Endpoint**: `PUT /api/v1/schoolDetail/:id`
