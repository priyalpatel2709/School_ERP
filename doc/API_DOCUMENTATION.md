# School ERP API Documentation

## Base Information

- Base URL: `http://localhost:3000`
- API version prefix: `/api/v1`
- Swagger UI: `http://localhost:3000/api-docs`
- Health check: `GET /`

## Authentication and Tenant Usage

Most endpoints require:

1. **Tenant identification** using one of:
   - Header: `X-School-Id: <schoolId>`
   - Query: `?schoolId=<schoolId>`
   - Body field: `schoolId`
2. **Authentication cookie** (`token`) set after login.

> Note: current auth middleware checks cookie token (`req.cookies.token`) for protected routes.

## Quick Start Flow

### 1) Login

`POST /api/v1/user/login`

Request:

```json
{
  "email": "admin@school.com",
  "password": "your-password",
  "schoolId": "school_abc"
}
```

Response (example):

```json
{
  "message": "Login successful",
  "user": {
    "_id": "..."
  }
}
```

### 2) Call protected endpoints

Send `X-School-Id` and include the `token` cookie returned by login.

---

## Common Response Patterns

Depending on controller, responses are usually one of:

```json
{ "message": "Success message", "data": {} }
```

```json
{ "_id": "...", "name": "...", "createdAt": "..." }
```

Common errors:

```json
{ "message": "School ID is required" }
```

```json
{ "error": "Not authorized, No token provided" }
```

```json
{ "error": "Not authorized, token invalid" }
```

---

## Endpoint Catalog

Each row contains: **Method | Endpoint | Use | Request | Response**

### System

- `GET | / | Health check | No body | status/health payload`

### User (`/api/v1/user`)

- `POST | /login | Authenticate user | body: credentials + schoolId | auth result + cookie`
- `POST | /logout | Logout user | no body | logout confirmation`
- `POST | / | Register user | body: user fields (+ optional schoolId) | created user`
- `GET | /users/school | List users by school | query/header schoolId | users[]`
- `GET | /users | List users | query/header schoolId | users[]`
- `POST | /users/profile-image | Upload own profile image | multipart: image | updated user/image info`
- `POST | /users/:id/profile-image | Upload image for specific user (self/admin) | multipart: image | updated user/image info`
- `GET | /users/:id | Get user by id | param: id | user object`
- `PUT | /users/:id | Update user | param: id, body: update fields | updated user`
- `DELETE | /users/:id | Delete user | param: id | delete confirmation`
- `DELETE | /users | Delete all users | no body | delete summary`
- `POST | /users/role | Assign role to user | body: userId, role info | assignment result`

### Role (`/api/v1/role`)

- `POST | / | Create role | body: role fields | created role`
- `GET | / | Get all roles | no body | roles[]`
- `GET | /:id | Get role by id | param: id | role`
- `PUT | /:id | Update role | param: id, body | updated role`
- `DELETE | /:id | Delete role | param: id | delete confirmation`
- `DELETE | / | Delete all roles | no body | delete summary`

### School Info (`/api/v1/schoolInfo`)

- `POST | / | Create school detail | body: school detail fields | created detail`
- `GET | / | Get school detail | no body | school detail`
- `PUT | /:id | Update school detail | param: id, body | updated detail`

### Student (`/api/v1/student`)

- `POST | / | Create student | body: student fields | created student`
- `GET | / | Get all students | query filters optional | students[]`
- `DELETE | / | Delete all students | no body | delete summary`
- `GET | /my-time-table | Get logged-in student timetable | no body | timetable`
- `GET | /my-children | Get children for parent user | no body | students[]`
- `POST | /createStudentWithUser | Create student with linked user | body: student + user | created records`
- `POST | /link-sibling | Link sibling records | body: relationship fields | updated result`
- `POST | /create-parent-account | Create parent account | body: parent details | created parent user`
- `POST | /add-guardian-info | Add/update guardian info | body: guardian fields | updated student`
- `GET | /:id/guardian-info | Get guardian info | param: id | guardian data`
- `GET | /:id | Get student by id | param: id | student`
- `PUT | /:id | Update student | param: id, body | updated student`
- `DELETE | /:id | Delete student | param: id | delete confirmation`

### Class (`/api/v1/class`)

- `POST | / | Create class | body: class fields | created class`
- `GET | / | Get all classes | no body | classes[]`
- `GET | /:id | Get class by id | param: id | class`
- `PUT | /:id | Update class | param: id, body | updated class`
- `DELETE | /:id | Delete class by id | param: id | delete confirmation`
- `DELETE | / | Delete all classes | no body | delete summary`

### Homework (`/api/v1/homeWork`)

- `POST | / | Create homework | body: homework data | created homework`
- `GET | / | Get all homework | query optional | homework[]`
- `GET | /:id | Get homework by id | param: id | homework`
- `PUT | /:id | Update homework | param: id, body | updated homework`
- `DELETE | /:id | Delete homework by id | param: id | delete confirmation`
- `DELETE | / | Delete all homework | no body | delete summary`
- `POST | /submit | Submit homework | body: submission data | submission result`
- `POST | /grade | Grade homework | body: marks/grade info | grading result`
- `GET | /by-student/:studentId | Homework by student | param: studentId | homework[]`
- `GET | /by-teacher/:teacherId | Homework by teacher | param: teacherId | homework[]`
- `GET | /submission-status/:homeworkId | Submission status | param: homeworkId | status payload`

### Teacher (`/api/v1/teacher`)

- `POST | / | Create teacher | body: teacher fields | created teacher`
- `GET | / | Get all teachers | query optional | teachers[]`
- `GET | /search | Search teachers | query filters | teachers[]`
- `POST | /assign-subjects | Assign subjects to teacher | body: teacherId + subjects | update result`
- `POST | /qualified-subjects | Set qualified subjects | body: teacherId + subjects | update result`
- `GET | /getTimeTableByTeacherId/:teacherId | Teacher timetable | param: teacherId | timetable`
- `POST | /createTeacherWithUser | Create teacher with linked user | body: teacher + user | created records`
- `GET | /byUser/:id | Get teacher by user id | param: id | teacher`
- `GET | /:id | Get teacher by id | param: id | teacher`
- `PUT | /:id | Update teacher | param: id, body | updated teacher`
- `DELETE | /:id | Delete teacher by id | param: id | delete confirmation`
- `DELETE | / | Delete all teachers | no body | delete summary`

### Subject (`/api/v1/subject`)

- `POST | / | Create subject | body: subject fields | created subject`
- `GET | / | Get all subjects | no body | subjects[]`
- `GET | /:id | Get subject by id | param: id | subject`
- `PUT | /:id | Update subject | param: id, body | updated subject`
- `DELETE | /:id | Delete subject by id | param: id | delete confirmation`
- `DELETE | / | Delete all subjects | no body | delete summary`

### Timetable (`/api/v1/timeTable`)

- `POST | / | Create timetable | body: timetable fields | created timetable`
- `GET | / | Get all timetables | query optional | timetables[]`
- `GET | /conflicts | Detect timetable conflicts | query optional | conflicts[]`
- `POST | /auto-generate | Auto-generate timetable | body: generation config | generated timetable`
- `GET | /class/:classId | Get timetable by class | param: classId | timetable`
- `GET | /:id | Get timetable by id | param: id | timetable`
- `PUT | /:id | Update timetable | param: id, body | updated timetable`
- `DELETE | /:id | Delete timetable by id | param: id | delete confirmation`
- `DELETE | /:id/:day/:lectureIndex | Delete lecture slot | params: id/day/lectureIndex | update result`
- `DELETE | / | Delete all timetables | no body | delete summary`

### Notification (`/api/v1/notification`)

- `GET | /my-notifications | Get logged-in user notifications | no body | notifications[]`
- `PUT | /mark-read/:notificationId | Mark one as read | param: notificationId | update confirmation`
- `PUT | /mark-all-read | Mark all as read | no body | update confirmation`
- `POST | / | Create notification | body: notification fields | created notification`
- `GET | / | Get all notifications | query optional | notifications[]`
- `GET | /:id | Get notification by id | param: id | notification`
- `PUT | /:id | Update notification | param: id, body | updated notification`
- `POST | /sendNotification | Send notification | body: message/type/target | send result`
- `DELETE | /cleanupExpiredNotifications | Cleanup expired notifications | no body | cleanup summary`
- `DELETE | /:id | Delete notification by id | param: id | delete confirmation`
- `DELETE | / | Delete all notifications | no body | delete summary`

### Fee (`/api/v1/fee`)

- `POST | /structures | Create fee structure | body: structure fields | created structure`
- `GET | /structures | List fee structures | query optional | structures[]`
- `GET | /structures/:id | Get fee structure by id | param: id | structure`
- `GET | /structures/class/:classId | Get structures by class | param: classId | structures[]`
- `PUT | /structures/:id | Update fee structure | param: id, body | updated structure`
- `DELETE | /structures/:id | Delete fee structure | param: id | delete confirmation`
- `POST | /invoices | Create fee invoice | body: invoice fields | created invoice`
- `POST | /invoices/bulk-generate | Bulk generate invoices | body: class/student criteria | generation summary`
- `GET | /invoices | List invoices | query optional | invoices[]`
- `GET | /invoices/overdue | List overdue invoices | query optional | overdue[]`
- `GET | /invoices/student/:studentId | Invoices by student | param: studentId | invoices[]`
- `GET | /invoices/:id | Get invoice by id | param: id | invoice`
- `PUT | /invoices/:id | Update invoice | param: id, body | updated invoice`
- `DELETE | /invoices/:id | Delete invoice | param: id | delete confirmation`
- `POST | /payments | Record payment | body: payment fields | created payment`
- `GET | /payments | List fee payments | query optional | payments[]`
- `GET | /payments/student/:studentId | Payment history by student | param: studentId | payments[]`
- `GET | /payments/reports/daily | Daily collection report | query date optional | report`
- `GET | /payments/:id | Get payment by id | param: id | payment`
- `PUT | /payments/:id | Update payment | param: id, body | updated payment`
- `DELETE | /payments/:id | Delete payment | param: id | delete confirmation`

### Attendance (`/api/v1/attendance`)

- `POST | /student | Mark student attendance | body: attendance row | created record`
- `POST | /student/bulk | Bulk mark student attendance | body: records[] | summary`
- `GET | /student | List student attendance | query filters | attendance[]`
- `GET | /student/:id | Get student attendance by id | param: id | attendance`
- `GET | /student/:studentId/monthly | Monthly student report | params + query month | report`
- `GET | /student/class/:classId/date/:date | Class attendance by date | params: classId/date | attendance[]`
- `PUT | /student/:id | Update student attendance | param: id, body | updated record`
- `DELETE | /student/:id | Delete student attendance | param: id | delete confirmation`
- `POST | /staff | Mark staff attendance | body: attendance row | created record`
- `POST | /staff/check-in | Staff check in | body: staff/date/time | check-in result`
- `POST | /staff/check-out | Staff check out | body: staff/date/time | check-out result`
- `GET | /staff | List staff attendance | query filters | attendance[]`
- `GET | /staff/monthly-report | Staff monthly report (all) | query month | report`
- `GET | /staff/:id | Get staff attendance by id | param: id | attendance`
- `GET | /staff/:staffId/monthly | Monthly report by staff | param: staffId + month | report`
- `PUT | /staff/:id | Update staff attendance | param: id, body | updated record`
- `DELETE | /staff/:id | Delete staff attendance | param: id | delete confirmation`

### Leave (`/api/v1/leave`)

- `POST | / | Create leave application | body: leave fields | created application`
- `GET | / | Get all leave applications | query filters | applications[]`
- `GET | /pending | Get pending leave applications | no body | pending[]`
- `GET | /student/:studentId | Get student leaves | param: studentId | applications[]`
- `GET | /staff/:staffId | Get staff leaves | param: staffId | applications[]`
- `GET | /:id | Get leave by id | param: id | application`
- `PUT | /:id | Update leave application | param: id, body | updated application`
- `PUT | /:id/approve | Approve leave | param: id | approval result`
- `PUT | /:id/reject | Reject leave | param: id | rejection result`
- `DELETE | /:id | Delete leave application | param: id | delete confirmation`

### Examination (`/api/v1/examination`)

- `POST | /exams | Create exam | body: exam fields | created exam`
- `GET | /exams | List exams | query optional | exams[]`
- `GET | /exams/class/:classId | Exams by class | param: classId | exams[]`
- `GET | /exams/:id | Get exam by id | param: id | exam`
- `PUT | /exams/:id | Update exam | param: id, body | updated exam`
- `PUT | /exams/:id/publish | Publish exam results | param: id | publish result`
- `DELETE | /exams/:id | Delete exam | param: id | delete confirmation`
- `POST | /results | Create exam result | body: result fields | created result`
- `POST | /results/bulk | Bulk mark entry | body: results[] | summary`
- `GET | /results | List exam results | query optional | results[]`
- `GET | /results/exam/:examinationId/class/:classId | Results by exam/class | params | results[]`
- `GET | /results/student/:studentId | Results by student | param: studentId | results[]`
- `GET | /results/:id | Get exam result by id | param: id | result`
- `PUT | /results/:id | Update exam result | param: id, body | updated result`
- `PUT | /results/:id/verify | Verify exam result | param: id | verification result`
- `POST | /results/:id/report-card | Generate report card PDF | param: id | file/url payload`
- `DELETE | /results/:id | Delete exam result | param: id | delete confirmation`
- `POST | /results/exam/:examinationId/class/:classId/calculate-ranks | Calculate class ranks | params | ranking result`
- `GET | /results/exam/:examinationId/class/:classId/performance | Class performance analysis | params | analytics`

### Grading (`/api/v1/grading`)

- `POST | / | Create grading system | body: grading rules | created grading system`
- `GET | / | Get all grading systems | no body | gradingSystems[]`
- `GET | /:id | Get grading system by id | param: id | grading system`
- `PUT | /:id | Update grading system | param: id, body | updated grading system`
- `DELETE | /:id | Delete grading system | param: id | delete confirmation`

### Substitution (`/api/v1/substitution`)

- `POST | / | Create substitution | body: substitution fields | created substitution`
- `GET | / | List substitutions | query optional | substitutions[]`
- `GET | /:id | Get substitution by id | param: id | substitution`
- `PUT | /:id | Update substitution | param: id, body | updated substitution`
- `DELETE | /:id | Delete substitution | param: id | delete confirmation`

### Admissions (`/api/v1/admissions`)

- `POST | / | Create admission | body: admission fields | created admission`
- `GET | / | List admissions | query optional | admissions[]`
- `GET | /:id | Get admission by id | param: id | admission`
- `PUT | /:id | Update admission | param: id, body | updated admission`
- `PATCH | /:id/stage | Update admission stage | param: id, body: stage | updated admission`
- `DELETE | /:id | Delete admission | param: id | delete confirmation`

### Payroll (`/api/v1/payroll`)

- `POST | /runs/draft | Create payroll run draft | body: pay period/rules | created payroll run`
- `GET | /runs | List payroll runs | query optional | payrollRuns[]`
- `GET | /runs/:id | Get payroll run by id | param: id | payroll run`
- `POST | /runs/:id/finalize | Finalize payroll run | param: id | finalize result`

### Transport (`/api/v1/transport`)

- `POST | /bus-routes | Create bus route | body: route fields | created route`
- `GET | /bus-routes | List bus routes | query optional | routes[]`
- `GET | /bus-routes/:id | Get bus route by id | param: id | route`
- `PUT | /bus-routes/:id | Update bus route | param: id, body | updated route`
- `DELETE | /bus-routes/:id | Delete bus route | param: id | delete confirmation`
- `POST | /vehicles | Create vehicle | body: vehicle fields | created vehicle`
- `GET | /vehicles | List vehicles | query optional | vehicles[]`
- `GET | /vehicles/:id | Get vehicle by id | param: id | vehicle`
- `PUT | /vehicles/:id | Update vehicle | param: id, body | updated vehicle`
- `DELETE | /vehicles/:id | Delete vehicle | param: id | delete confirmation`

### Communication (`/api/v1/communication`)

- `POST | /email | Send email | body: recipients + subject + body | send result`
- `POST | /sms | Send SMS | body: recipients + message | send result`
- `POST | /fee-reminder | Send fee reminder | body: studentId/template | send result`
- `POST | /absence-alert | Send absence alert | body: studentId/date | send result`

### Library (`/api/v1/library`)

- `GET | /items | List library items | query filters optional | items[]`
- `POST | /items | Create library item | body: item fields | created item`
- `GET | /items/:id | Get item by id | param: id | item`
- `PATCH | /items/:id | Update item | param: id, body | updated item`
- `DELETE | /items/:id | Delete item | param: id | delete confirmation`
- `POST | /items/:id/checkout | Checkout item | param: id + borrower details | checkout result`
- `POST | /items/:id/return | Return item | param: id + return details | return result`
- `POST | /items/:id/renew | Renew item loan | param: id + renew details | renew result`
- `POST | /items/:id/reserve | Reserve item | param: id + borrower | reservation result`
- `POST | /items/:id/cancel-reservation | Cancel reservation | param: id | cancellation result`
- `POST | /items/:id/mark-lost | Mark item as lost | param: id + notes | update result`
- `GET | /statistics/items | Item statistics | no body | statistics`
- `GET | /items/due | Get due items | query date optional | due items[]`
- `GET | /borrowings | List borrowing records | query optional | borrowings[]`
- `POST | /borrowings | Create borrowing record | body: borrowing fields | created borrowing`
- `GET | /borrowings/:id | Get borrowing by id | param: id | borrowing`
- `POST | /borrowings/:id/return | Return borrowed item | param: id + return details | return result`
- `POST | /borrowings/:id/renew | Renew borrowing | param: id + renew details | renew result`
- `POST | /borrowings/:id/damage | Record damage | param: id + damage details | update result`
- `POST | /borrowings/:id/payment | Register payment | param: id + payment details | payment result`
- `POST | /borrowings/:id/waive-fee | Waive fee | param: id + reason | waiver result`
- `POST | /borrowings/:id/lost | Mark borrowing as lost | param: id + notes | update result`
- `POST | /borrowings/:id/reminder | Add reminder sent | param: id + reminder data | update result`
- `GET | /borrowers/:borrowerId/history | Borrower history | param: borrowerId | history[]`
- `GET | /borrowers/:borrowerId/active | Active checkouts | param: borrowerId | active[]`
- `GET | /borrowings/overdue | Overdue items | query date optional | overdue[]`
- `GET | /borrowings/due-soon | Items due soon | query window optional | dueSoon[]`
- `GET | /statistics/borrowings | Borrowing statistics | no body | statistics`

---

## Request/Response Example for Protected API

### Example: Create Class

`POST /api/v1/class`

Headers:

- `Content-Type: application/json`
- `X-School-Id: school_abc`
- `Cookie: token=<jwtToken>`

Request:

```json
{
  "name": "Grade 10",
  "section": "A"
}
```

Response (example):

```json
{
  "_id": "661f8b...",
  "name": "Grade 10",
  "section": "A",
  "createdAt": "2026-04-14T10:00:00.000Z"
}
```

---

## Role Guard and Access APIs

This project uses role/permission guards through:

- `protect` (requires logged-in user token cookie)
- `authorize(...)` (permission-based guard on selected modules)
- `librarianAccess` (Library write/circulation endpoints)

### Permission Keys Used in Guards

- Fee: `fee:structure:view`, `fee:structure:create`, `fee:structure:update`, `fee:structure:delete`, `fee:invoice:view`, `fee:invoice:create`, `fee:payment:record`, `fee:payment:view`
- Attendance: `attendance:student:mark`, `attendance:student:view`, `attendance:staff:mark`
- Leave: `leave:application:apply`, `leave:application:approve`
- Examination: `exam:create`, `exam:view`, `marks:enter`, `marks:verify`, `result:publish`, `reportcard:generate`

> Important: Current `authorize(...)` middleware is implemented as pass-through (`next()`), so these permissions are documented as intended access policy.

### Admin Role APIs (recommended access set)

Admin users typically manage master data, operations, and approvals:

- Full CRUD modules: `/role`, `/schoolInfo`, `/class`, `/subject`, `/teacher`, `/student`
- Operational modules: `/timeTable`, `/notification`, `/admissions`, `/payroll`, `/transport`, `/communication`
- Finance and academic controls: `/fee`, `/attendance`, `/leave`, `/examination`, `/grading`
- User administration: `/user/users`, `/user/users/:id`, `/user/users/role`

Admin-only/high-privilege endpoints include examples like:

- `PUT /api/v1/examination/exams/:id/publish`
- `POST /api/v1/examination/results/exam/:examinationId/class/:classId/calculate-ranks`
- `PUT /api/v1/leave/:id/approve`
- `PUT /api/v1/leave/:id/reject`
- `POST /api/v1/payroll/runs/:id/finalize`

### Teacher Role APIs (recommended access set)

Teacher users typically handle classwork, attendance, and student performance:

- Homework:
  - `POST /api/v1/homeWork`
  - `PUT /api/v1/homeWork/:id`
  - `POST /api/v1/homeWork/grade`
  - `GET /api/v1/homeWork/by-teacher/:teacherId`
- Attendance:
  - `POST /api/v1/attendance/student`
  - `POST /api/v1/attendance/student/bulk`
  - `GET /api/v1/attendance/student/class/:classId/date/:date`
- Examination/Results:
  - `GET /api/v1/examination/exams`
  - `POST /api/v1/examination/results`
  - `POST /api/v1/examination/results/bulk`
  - `PUT /api/v1/examination/results/:id`
- Leave:
  - `POST /api/v1/leave`
  - `GET /api/v1/leave/staff/:staffId`

### Student Role APIs (recommended access set)

Student users usually get read access and self-service actions:

- Student self:
  - `GET /api/v1/student/my-time-table`
  - `GET /api/v1/student/:id`
  - `GET /api/v1/student/:id/guardian-info`
- Homework:
  - `GET /api/v1/homeWork/by-student/:studentId`
  - `POST /api/v1/homeWork/submit`
  - `GET /api/v1/homeWork/submission-status/:homeworkId`
- Exams and results:
  - `GET /api/v1/examination/results/student/:studentId`
  - `POST /api/v1/examination/results/:id/report-card` (if permitted)
- Notifications:
  - `GET /api/v1/notification/my-notifications`
  - `PUT /api/v1/notification/mark-read/:notificationId`
  - `PUT /api/v1/notification/mark-all-read`
- Leave application:
  - `POST /api/v1/leave`
  - `GET /api/v1/leave/student/:studentId`

### Library Role Guard

Library module has special role guard:

- Read endpoints are available to authenticated users.
- Write/circulation endpoints require `librarian` or `admin` role:
  - `POST/PATCH/DELETE /api/v1/library/items...`
  - `POST /api/v1/library/items/:id/checkout`
  - `POST /api/v1/library/borrowings/:id/return` and similar circulation actions

## Notes

- Permission checks (`authorize(...)`) are present on many modules (attendance, fee, exam, leave, grading).
- Keep request body fields aligned with controller/model validation for each endpoint.
- For exact live schema examples, cross-check the Swagger page at `/api-docs`.
