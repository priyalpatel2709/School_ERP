# Leave Route Complete Documentation

This document explains `leaveRoute` in detail: what each API does, how to use it, where to use it in your ERP flow, and who should call it.

## Module Overview

- Route file: `routes/leaveRoute.js`
- Controller file: `controllers/leaveController.js`
- Model file: `models/leaveApplicationModel.js`
- Base URL prefix: `/api/v1/leave`

Use this module to manage leave applications for:

- Students (usually applied by parent/guardian or authorized user)
- Staff (self-application or HR/admin workflow)

Typical lifecycle:

1. Create leave application (`Pending`)
2. Review by approver (`Approved` or `Rejected`)
3. Optional updates/deletion before final review (as per your policy)

---

## Authentication, Tenant, and Permission Rules

All leave endpoints require:

1. `identifyTenant`
2. `protect`
3. `authorize(...)`

### Tenant requirement

Provide school context via:

- Header: `X-School-Id: <schoolId>`
- or query/body fallback supported by your middleware

### Permissions used

- `leave:application:apply`
- `leave:application:approve`

### Access matrix (current route behavior)

- Apply/create leave: `leave:application:apply`
- Approve/reject/pending list: `leave:application:approve`
- List/get/update (broad): apply OR approve permission
- Delete: apply permission

---

## Data Model (LeaveApplication)

Main fields used by this API:

- `applicantType`: `Student` or `Staff` (required)
- `student`: ObjectId (when applicantType is Student)
- `staff`: ObjectId (when applicantType is Staff)
- `leaveType`: one of:
  - `Sick Leave`
  - `Casual Leave`
  - `Earned Leave`
  - `Emergency`
  - `Maternity`
  - `Paternity`
  - `Medical Leave`
  - `Other`
- `fromDate`, `toDate` (required)
- `totalDays` (auto-calculated in pre-save hook)
- `reason` (required)
- `attachments[]` (optional documents)
- `status`: `Pending`, `Approved`, `Rejected`, `Cancelled` (default `Pending`)
- `appliedBy` (required user reference)
- `reviewedBy`, `reviewedAt`, `reviewComments` (set in review flow)
- `notificationSent` (used for downstream notification process)

Important model behavior:

- `totalDays` is recalculated automatically before save from `fromDate` and `toDate` (inclusive days).

---

## Endpoints (How to Use)

## 1) Create Leave

### `POST /api/v1/leave/`

- Purpose: Create a new leave request
- Permission: `leave:application:apply`
- Controller: `createLeaveApplication`

### Request body example (Student)

```json
{
  "applicantType": "Student",
  "student": "661111111111111111111111",
  "leaveType": "Sick Leave",
  "fromDate": "2026-04-20",
  "toDate": "2026-04-22",
  "reason": "Viral fever and doctor-advised rest",
  "appliedBy": "662222222222222222222222",
  "attachments": [
    {
      "fileName": "medical-note.pdf",
      "fileUrl": "https://example.com/docs/medical-note.pdf",
      "fileType": "application/pdf"
    }
  ]
}
```

### Request body example (Staff)

```json
{
  "applicantType": "Staff",
  "staff": "663333333333333333333333",
  "leaveType": "Casual Leave",
  "fromDate": "2026-05-03",
  "toDate": "2026-05-03",
  "reason": "Personal work",
  "appliedBy": "663333333333333333333333"
}
```

Where to use:

- Parent/student portal leave apply screen
- Staff self-service leave apply screen

---

## 2) List All Leave Applications

### `GET /api/v1/leave/`

- Purpose: Get all leave applications
- Permission: `leave:application:apply` OR `leave:application:approve`
- Controller: `getAllLeaveApplications`

Where to use:

- Admin/HR leave dashboard
- Principal/approver central review table

Notes:

- Populates student, staff, appliedBy, reviewedBy for richer listing.

---

## 3) Get Pending Leave Applications

### `GET /api/v1/leave/pending`

- Purpose: Fetch only `Pending` applications
- Permission: `leave:application:approve`
- Controller: `getPendingLeaveApplications`

Where to use:

- Approver’s pending queue
- Daily approval worklist

---

## 4) Get Leave by Student

### `GET /api/v1/leave/student/:studentId`

- Purpose: Fetch leave history for a specific student
- Permission: `leave:application:apply` OR `leave:application:approve`
- Controller: `getStudentLeaveApplications`

Where to use:

- Student profile page
- Parent app “My child leaves”

---

## 5) Get Leave by Staff

### `GET /api/v1/leave/staff/:staffId`

- Purpose: Fetch leave history for a specific staff member
- Permission: `leave:application:apply` OR `leave:application:approve`
- Controller: `getStaffLeaveApplications`

Where to use:

- Staff profile page
- HR employee leave ledger

---

## 6) Get Leave by ID

### `GET /api/v1/leave/:id`

- Purpose: Fetch one leave application in detail
- Permission: `leave:application:apply` OR `leave:application:approve`
- Controller: `getLeaveApplicationById`

Where to use:

- Leave details screen
- Approval details modal

---

## 7) Update Leave Application

### `PUT /api/v1/leave/:id`

- Purpose: Update leave request fields
- Permission: `leave:application:apply` OR `leave:application:approve`
- Controller: `updateLeaveApplication`

Where to use:

- Edit leave before review
- Admin correction workflow

Recommendation:

- In UI/business rules, allow edit mainly while status is `Pending`.

---

## 8) Approve Leave Application

### `PUT /api/v1/leave/:id/approve`

- Purpose: Approve pending leave
- Permission: `leave:application:approve`
- Controller: `approveLeaveApplication`

### Request body example

```json
{
  "reviewComments": "Approved. Please share class handover for missed periods."
}
```

Controller behavior:

- Fails if application not found (`404`)
- Fails if already reviewed (`400`)
- Sets:
  - `status = Approved`
  - `reviewedBy = req.user._id`
  - `reviewedAt = now`
  - `reviewComments`
  - `notificationSent = false`

Where to use:

- Principal/HOD/HR approval action

---

## 9) Reject Leave Application

### `PUT /api/v1/leave/:id/reject`

- Purpose: Reject pending leave
- Permission: `leave:application:approve`
- Controller: `rejectLeaveApplication`

### Request body example

```json
{
  "reviewComments": "Rejected due to exam week attendance requirement."
}
```

Controller behavior:

- Same guard checks as approve
- Sets:
  - `status = Rejected`
  - `reviewedBy`, `reviewedAt`
  - `reviewComments` (defaults to "No reason provided")
  - `notificationSent = false`

Where to use:

- Approver review decision action

---

## 10) Delete Leave Application

### `DELETE /api/v1/leave/:id`

- Purpose: Delete a leave application
- Permission: `leave:application:apply`
- Controller: `deleteLeaveApplication`

Where to use:

- Applicant cancels mistaken request (if allowed by policy)
- Admin cleanup action

---

## Example End-to-End Flows

## Student leave flow

1. Parent submits leave using `POST /leave`
2. Approver sees it in `GET /leave/pending`
3. Approver decides with:
   - `PUT /leave/:id/approve`, or
   - `PUT /leave/:id/reject`
4. Parent/student checks final status via:
   - `GET /leave/student/:studentId`, or
   - `GET /leave/:id`

## Staff leave flow

1. Staff applies using `POST /leave`
2. HR/Admin reviews pending queue
3. Approve/reject via review endpoints
4. Staff checks leave history from `GET /leave/staff/:staffId`

---

## Common Errors and Handling

Common responses from current controller logic:

- `404 Leave application not found` (approve/reject by unknown id)
- `400 Leave application has already been reviewed` (approve/reject on non-pending)
- Generic auth/permission errors from middleware

Implementation note:

- `crudOperations` handles generic create/get/update/delete responses.
- Approve/reject endpoints return `{ success, message, data }` format.

---

## Best Practice Usage Guidance

- Use `student` only when `applicantType = Student`; use `staff` only when `applicantType = Staff`.
- Always set `appliedBy` to current authenticated user.
- Keep approval actions restricted to users with `leave:application:approve`.
- Trigger notification service when `notificationSent` is false after review.
- Restrict updates/deletes after approval/rejection at policy/UI layer if required.

---

## Quick Reference Table

| Method | Endpoint | Permission | Use Case |
|---|---|---|---|
| POST | `/api/v1/leave/` | `leave:application:apply` | Apply leave |
| GET | `/api/v1/leave/` | apply OR approve | Admin/all listing |
| GET | `/api/v1/leave/pending` | `leave:application:approve` | Approver queue |
| GET | `/api/v1/leave/student/:studentId` | apply OR approve | Student leave history |
| GET | `/api/v1/leave/staff/:staffId` | apply OR approve | Staff leave history |
| GET | `/api/v1/leave/:id` | apply OR approve | Leave detail |
| PUT | `/api/v1/leave/:id` | apply OR approve | Edit leave |
| PUT | `/api/v1/leave/:id/approve` | `leave:application:approve` | Approve leave |
| PUT | `/api/v1/leave/:id/reject` | `leave:application:approve` | Reject leave |
| DELETE | `/api/v1/leave/:id` | `leave:application:apply` | Delete/cancel leave |
