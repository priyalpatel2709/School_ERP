# Admission Route Complete Documentation

This document explains `admissionRoute.js` in detail: how to use each API, where to use it in your admission process, request examples, and stage workflow.

## Module Overview

- Route file: `routes/admissionRoute.js`
- Controller file: `controllers/admissionController.js`
- Model file: `models/admissionApplicationModel.js`
- Base API path: `/api/v1/admissions`

Main purpose:

- Manage admission applications from enquiry to final enrollment/rejection
- Track stage transitions and admission decision pipeline

---

## Middleware and Access

All admission endpoints currently use:

1. `identifyTenant`
2. `protect`

Important note:

- No `authorize(...)` permission guard is applied in `admissionRoute.js`.
- Any authenticated user in tenant context can access these endpoints unless role checks are added.

---

## Admission Data Model

Key fields in `AdmissionApplication`:

- `academicYear` (String, required)
- `applicantName` (String, required)
- `dateOfBirth` (Date, optional)
- `gradeApplying` (String, required)
- `parentName` (String, required)
- `phone` (String, optional)
- `email` (String, optional)
- `stage` (Enum, default `Enquiry`):
  - `Enquiry`
  - `EntranceTest`
  - `Interview`
  - `MeritList`
  - `Offered`
  - `Enrolled`
  - `Rejected`
- `testScore` (Number, optional)
- `interviewNotes` (String, optional)
- `meritRank` (Number, optional)
- `enrolledStudent` (ObjectId -> Student, optional)
- `metaData[]`

---

## Endpoints (How to Use + Where to Use)

## 1) Create Admission Application

### `POST /api/v1/admissions/`

- Purpose: Create new admission record
- Controller: `createAdmission`

Request example:

```json
{
  "academicYear": "2026-2027",
  "applicantName": "Aarav Sharma",
  "dateOfBirth": "2015-09-10",
  "gradeApplying": "Grade 6",
  "parentName": "Rohit Sharma",
  "phone": "+919876543210",
  "email": "parent@example.com",
  "stage": "Enquiry"
}
```

Where to use:

- Admission enquiry form
- Front-desk/new application entry screen
- Parent application intake workflow

---

## 2) List Admission Applications

### `GET /api/v1/admissions/`

- Purpose: Fetch admission applications list
- Controller: `listAdmissions`
- Optional filters:
  - `stage`
  - `academicYear`

Example queries:

- `GET /api/v1/admissions?stage=Interview`
- `GET /api/v1/admissions?academicYear=2026-2027`
- `GET /api/v1/admissions?stage=Offered&academicYear=2026-2027`

Behavior:

- Sorts by latest created first (`createdAt: -1`)
- Returns:

```json
{
  "success": true,
  "count": 0,
  "data": []
}
```

Where to use:

- Admissions dashboard table
- Stage-specific work queues
- Academic-year admission reports

---

## 3) Get Admission by ID

### `GET /api/v1/admissions/:id`

- Purpose: Fetch one admission record
- Controller: `getAdmissionById`
- Param:
  - `id` = admission document id

Behavior:

- Returns `404 Not found` if record does not exist

Where to use:

- Admission detail page
- Counselor review page

---

## 4) Update Full Admission Record

### `PUT /api/v1/admissions/:id`

- Purpose: Update admission details (profile + stage data)
- Controller: `updateAdmission`
- Param:
  - `id`
- Uses:
  - `new: true`
  - `runValidators: true`

Request example:

```json
{
  "testScore": 84,
  "interviewNotes": "Good communication and subject basics.",
  "meritRank": 12,
  "stage": "MeritList"
}
```

Where to use:

- Admissions operations updates
- Counselor/committee updates after test or interview

---

## 5) Update Admission Stage Only

### `PATCH /api/v1/admissions/:id/stage`

- Purpose: Fast stage transition endpoint
- Controller: `updateAdmissionStage`
- Param:
  - `id`
- Required body:
  - `stage`

Request example:

```json
{
  "stage": "Interview"
}
```

Behavior:

- Returns `400 stage required` if missing
- Returns `404 Not found` if id invalid/nonexistent

Where to use:

- Kanban-style stage movement
- One-click stage update actions in admissions dashboard

---

## 6) Delete Admission

### `DELETE /api/v1/admissions/:id`

- Purpose: Remove admission record
- Controller: `deleteAdmission`
- Param:
  - `id`

Response:

```json
{ "success": true }
```

Where to use:

- Duplicate/invalid application cleanup
- Admin-only record maintenance

---

## Stage Workflow (Where and When to Use)

Recommended stage sequence:

1. `Enquiry` - initial lead captured
2. `EntranceTest` - test scheduled/completed
3. `Interview` - interview stage
4. `MeritList` - ranked for selection
5. `Offered` - offer issued
6. Final outcome:
   - `Enrolled` (joined school), or
   - `Rejected`

How to operate this:

- Use `PATCH /:id/stage` for quick stage transitions
- Use `PUT /:id` when stage change must include extra details (`testScore`, `interviewNotes`, `meritRank`)

---

## End-to-End Admission Flow Example

1. Parent enquiry is submitted:
   - `POST /admissions`
2. Team lists and processes enquiries:
   - `GET /admissions?stage=Enquiry`
3. Move applicant to test:
   - `PATCH /admissions/:id/stage` -> `EntranceTest`
4. Update test score:
   - `PUT /admissions/:id` with `testScore`
5. Move to interview then merit list:
   - `PATCH /admissions/:id/stage`
6. Offer decision:
   - `PATCH /admissions/:id/stage` -> `Offered`
7. Final result:
   - `PATCH /admissions/:id/stage` -> `Enrolled` or `Rejected`
8. Optional:
   - Set `enrolledStudent` id once student record is created

---

## Common Errors and Validations

Common errors:

- `404 Not found` for unknown id in get/update/delete/stage update
- `400 stage required` for stage patch without `stage`
- Mongoose validation failures for required create fields:
  - `academicYear`
  - `applicantName`
  - `gradeApplying`
  - `parentName`
- Invalid `stage` enum values are rejected by model validation

---

## Security Recommendations

Current implementation is authenticated but not role-restricted.

Recommended production controls:

- Add permission/role guards for admission operations
- Restrict delete and final decision stage updates to admin/admission manager
- Add audit log for stage transitions and decision updates

---

## Quick Reference Table

| Method | Endpoint | Current Guard | Use Case |
|---|---|---|---|
| POST | `/api/v1/admissions/` | `identifyTenant + protect` | Create application |
| GET | `/api/v1/admissions/` | `identifyTenant + protect` | List applications (with filters) |
| GET | `/api/v1/admissions/:id` | `identifyTenant + protect` | Get application detail |
| PUT | `/api/v1/admissions/:id` | `identifyTenant + protect` | Update full admission record |
| PATCH | `/api/v1/admissions/:id/stage` | `identifyTenant + protect` | Stage-only update |
| DELETE | `/api/v1/admissions/:id` | `identifyTenant + protect` | Delete application |
