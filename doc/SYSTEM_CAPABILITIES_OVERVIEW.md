# 🎯 School ERP: System Capabilities Overview

This document provides a high-level summary of the features available to **Admins** and **Teachers**. For detailed API implementation, refer to the specific role guides.

---

## 👑 Admin: The Orchestrator
The Admin acts as the system architect, setting up the foundation for the school's operations.

| Category | Capability | Primary API Endpoints |
| :--- | :--- | :--- |
| **Identity** | Create authenticated users (Teachers/Students) | `/teacher/createTeacherWithUser`, `/student/createStudentWithUser` |
| **Structure** | Create Classes, Sections, and Subjects | `/api/v1/class`, `/api/v1/subject` |
| **Logic** | Assign Subjects to Teachers & Build Timetables | `/teacher/assign-subjects`, `/api/v1/timeTable` |
| **Family** | Link Siblings and Create Parent Portals | `/student/link-sibling`, `/student/create-parent-account` |
| **Core** | Manage School Branding & Basic Info | `/api/v1/schoolInfo` |

---

## 👩‍🏫 Teacher: The Academic Lead
Teachers manage the daily educational flow and student performance.

| Category | Capability | Primary API Endpoints |
| :--- | :--- | :--- |
| **Routine** | View Personal Lecture Schedule & Timetable | `/teacher/getTimeTableByTeacherId/:userId` |
| **LMS** | Create, Publish, and View Homework | `/api/v1/homeWork`, `/homeWork/by-teacher/:userId` |
| **Grading** | Evaluate Student Submissions | `/api/v1/homeWork/grade` |
| **Profile** | View Personal HR, Qualifications & Salary | `/api/v1/teacher/:id` |
| **Alerts** | Receive School-wide Notifications | `/api/v1/notification` |

---

## 🧭 Which Documentation to Read?

*   **For Frontend Developers building the Admin Panel**: Read [ADMIN_CAPABILITIES.md](./ADMIN_CAPABILITIES.md)
*   **For Frontend Developers building the Teacher App**: Read [TEACHER_CAPABILITIES.md](./TEACHER_CAPABILITIES.md)
*   **For Timetable Implementation Guide**: Read [TIMETABLE_FRONTEND_GUIDE.md](./TIMETABLE_FRONTEND_GUIDE.md)
*   **For API Integration & Examples**: Read [CURL_EXAMPLES.md](./CURL_EXAMPLES.md) and [FRONTEND_API_GUIDE.md](./FRONTEND_API_GUIDE.md)
*   **For Understanding RBAC**: Read [ROLES_ARCHITECTURE.md](./ROLES_ARCHITECTURE.md)
