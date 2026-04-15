# Examination Route Documentation

This document describes all endpoints defined in `routes/examinationRoute.js`.

## Route Base

- Base module path: `/api/v1/examination`
- Router file: `routes/examinationRoute.js`
- Controller file: `controllers/examinationController.js`

## Middleware and Access Control

All routes in this module are protected with the same middleware order:

1. `identifyTenant`
2. `protect`
3. `authorize(...)`

Common requirements:

- Tenant context is required via `X-School-Id` header, query, or body.
- Auth token is required (cookie token).
- Permission is checked using `authorize`.

### Permission Keys Used

- `exam:create`
- `exam:view`
- `marks:enter`
- `marks:verify`
- `result:publish`
- `reportcard:generate`

---

## 1) Examination Endpoints

### `POST /exams`

- **Purpose:** Create a new examination.
- **Permission:** `exam:create`
- **Controller:** `createExamination`
- **Body (minimum required fields):**

```json
{
  "examName": "Mid-Term Exam",
  "examType": "Term Exam",
  "academicYear": "2026-2027",
  "classes": ["<classObjectId>"],
  "startDate": "2026-09-10T00:00:00.000Z",
  "endDate": "2026-09-20T00:00:00.000Z",
  "subjects": [
    {
      "subject": "<subjectObjectId>",
      "examDate": "2026-09-12T00:00:00.000Z",
      "maxMarks": 100,
      "passingMarks": 35
    }
  ]
}
```

Notes:

- `examType` must be one of: `Term Exam`, `Unit Test`, `Monthly Test`, `Final Exam`, `Practice Test`.
- Optional fields include `gradingSystem`, `generalInstructions`, `internalNotes`, `markEntryStartDate`, `markEntryEndDate`, and subject-level timing details.

---

### `GET /exams`

- **Purpose:** Fetch all examinations.
- **Permission:** `exam:view`
- **Controller:** `getAllExaminations`
- **Behavior:** Returns examination list with populated relations:
  - `classes` (`classNumber`, `division`)
  - `subjects.subject` (`name`, `code`)
  - `gradingSystem` (`systemName`)

---

### `GET /exams/class/:classId`

- **Purpose:** Get examinations applicable to one class.
- **Permission:** `exam:view`
- **Controller:** `getExaminationsByClass`
- **Params:**
  - `classId` (Class ObjectId)
- **Behavior:** Sorted by `startDate` descending.

---

### `GET /exams/:id`

- **Purpose:** Get one examination by id.
- **Permission:** `exam:view`
- **Controller:** `getExaminationById`
- **Params:**
  - `id` (Examination ObjectId)

---

### `PUT /exams/:id`

- **Purpose:** Update examination details.
- **Permission:** `exam:create`
- **Controller:** `updateExamination`
- **Params:**
  - `id` (Examination ObjectId)
- **Body:** Any updatable examination fields.

---

### `PUT /exams/:id/publish`

- **Purpose:** Publish results for an examination.
- **Permission:** `result:publish`
- **Controller:** `publishExamResults`
- **Params:**
  - `id` (Examination ObjectId)
- **Validation rules in controller:**
  - Examination must exist.
  - `markEntryStatus` must be `Completed`.
- **On success:**
  - Sets `resultPublished = true`
  - Sets `resultPublishedDate = now`

---

### `DELETE /exams/:id`

- **Purpose:** Delete examination.
- **Permission:** `exam:create`
- **Controller:** `deleteExamination`
- **Params:**
  - `id` (Examination ObjectId)

---

## 2) Exam Result Endpoints

### `POST /results`

- **Purpose:** Create one exam result entry.
- **Permission:** `marks:enter`
- **Controller:** `createExamResult`
- **Body (core fields):**

```json
{
  "examination": "<examinationObjectId>",
  "student": "<studentObjectId>",
  "class": "<classObjectId>",
  "academicYear": "2026-2027",
  "subjectMarks": [
    {
      "subject": "<subjectObjectId>",
      "marksObtained": 78,
      "maxMarks": 100,
      "passingMarks": 35,
      "enteredBy": "<userObjectId>"
    }
  ]
}
```

Important:

- There is a unique index on `{ examination, student }`; duplicate creation for same exam and student can fail.

---

### `POST /results/bulk`

- **Purpose:** Enter/update marks in bulk for one exam, class, and subject.
- **Permission:** `marks:enter`
- **Controller:** `bulkMarkEntry`
- **Body:**

```json
{
  "examinationId": "<examinationObjectId>",
  "classId": "<classObjectId>",
  "subjectId": "<subjectObjectId>",
  "marks": [
    { "studentId": "<studentObjectId>", "marks": 82 },
    { "studentId": "<studentObjectId>", "marks": 65 }
  ]
}
```

- For each student:
  - Existing result is updated if found.
  - Otherwise a new result is created.

---

### `GET /results`

- **Purpose:** Fetch all exam results.
- **Permission:** `exam:view`
- **Controller:** `getAllExamResults`
- **Behavior:** Populates examination, student, and class references.

---

### `GET /results/exam/:examinationId/class/:classId`

- **Purpose:** Fetch results for one exam in one class.
- **Permission:** `exam:view`
- **Controller:** `getExamResultsByClass`
- **Params:**
  - `examinationId`
  - `classId`
- **Behavior:** Sorted by `classRank` ascending.

---

### `GET /results/student/:studentId`

- **Purpose:** Fetch all exam results of a student.
- **Permission:** `exam:view`
- **Controller:** `getStudentExamResults`
- **Params:**
  - `studentId`
- **Behavior:** Sorted by `createdAt` descending.

---

### `GET /results/:id`

- **Purpose:** Get one exam result by id.
- **Permission:** `exam:view`
- **Controller:** `getExamResultById`
- **Params:**
  - `id` (ExamResult ObjectId)

---

### `PUT /results/:id`

- **Purpose:** Update an exam result.
- **Permission:** Any one of:
  - `marks:enter`
  - `marks:verify`
  - `result:publish`
  - `reportcard:generate`
- **Controller:** `updateExamResult`
- **Params:**
  - `id` (ExamResult ObjectId)

---

### `PUT /results/:id/verify`

- **Purpose:** Verify an exam result.
- **Permission:** `marks:verify`
- **Controller:** `verifyExamResult`
- **Params:**
  - `id` (ExamResult ObjectId)
- **Controller action:**
  - Sets result `status` to `Verified`
  - Sets `verifiedBy` and `verifiedAt` on each subject mark

---

### `POST /results/:id/report-card`

- **Purpose:** Generate report card PDF for one result.
- **Permission:** `reportcard:generate`
- **Controller:** `generateReportCardPdf`
- **Params:**
  - `id` (ExamResult ObjectId)
- **Preconditions in controller:**
  - Result must exist.
  - Result status must be `Verified` or `Published`.
- **On success:**
  - Generates PDF file and URL.
  - Updates `reportCardGenerated`, `reportCardUrl`, `reportCardGeneratedAt`.

---

### `DELETE /results/:id`

- **Purpose:** Delete one exam result.
- **Permission:** `exam:create`
- **Controller:** `deleteExamResult`
- **Params:**
  - `id` (ExamResult ObjectId)

---

## 3) Rankings and Analysis Endpoints

### `POST /results/exam/:examinationId/class/:classId/calculate-ranks`

- **Purpose:** Calculate class ranks for passed students.
- **Permission:** `result:publish`
- **Controller:** `calculateExamRanks`
- **Params:**
  - `examinationId`
  - `classId`
- **Logic summary:**
  - Fetches results with `isPassed: true`.
  - Sorts by `overallPercentage` descending.
  - Assigns rank with tie handling.

---

### `GET /results/exam/:examinationId/class/:classId/performance`

- **Purpose:** Return performance analytics for one exam and class.
- **Permission:** `exam:view`
- **Controller:** `getClassPerformanceAnalysis`
- **Params:**
  - `examinationId`
  - `classId`
- **Response includes:**
  - `totalStudents`
  - `passedStudents`
  - `failedStudents`
  - `passPercentage`
  - `avgPercentage`
  - `highestPercentage`
  - `lowestPercentage`

---

## Common Success Response Patterns

Common patterns used in this module include:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

or

```json
{
  "success": true,
  "count": 12,
  "data": []
}
```

or for analysis:

```json
{
  "success": true,
  "analysis": {},
  "data": []
}
```

## Common Error Cases

- Missing/invalid tenant context.
- Missing/invalid auth token.
- Insufficient permission for route guard.
- Not found:
  - `Examination not found`
  - `Exam result not found`
- Validation/state errors:
  - `Mark entry must be completed before publishing results`
  - `Result must be verified or published`

## Quick Endpoint Reference

| Method | Endpoint | Permission |
|---|---|---|
| POST | `/exams` | `exam:create` |
| GET | `/exams` | `exam:view` |
| GET | `/exams/class/:classId` | `exam:view` |
| GET | `/exams/:id` | `exam:view` |
| PUT | `/exams/:id` | `exam:create` |
| PUT | `/exams/:id/publish` | `result:publish` |
| DELETE | `/exams/:id` | `exam:create` |
| POST | `/results` | `marks:enter` |
| POST | `/results/bulk` | `marks:enter` |
| GET | `/results` | `exam:view` |
| GET | `/results/exam/:examinationId/class/:classId` | `exam:view` |
| GET | `/results/student/:studentId` | `exam:view` |
| GET | `/results/:id` | `exam:view` |
| PUT | `/results/:id` | `marks:enter \| marks:verify \| result:publish \| reportcard:generate` |
| PUT | `/results/:id/verify` | `marks:verify` |
| POST | `/results/:id/report-card` | `reportcard:generate` |
| DELETE | `/results/:id` | `exam:create` |
| POST | `/results/exam/:examinationId/class/:classId/calculate-ranks` | `result:publish` |
| GET | `/results/exam/:examinationId/class/:classId/performance` | `exam:view` |
