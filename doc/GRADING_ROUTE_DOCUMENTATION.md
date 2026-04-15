# Grading Route Documentation

This document describes all endpoints defined in `routes/gradingRoute.js`.

## Route Base

- Base module path: `/api/v1/grading`
- Router file: `routes/gradingRoute.js`
- Controller file: `controllers/gradingController.js`
- Model file: `models/gradingSystemModel.js`

## Middleware and Access Control

All grading routes use middleware in this order:

1. `identifyTenant`
2. `protect`
3. `authorize(...)`

Common requirements:

- Tenant context must be provided (`X-School-Id` header recommended).
- Auth cookie token is required.

### Permission Mapping

- Create grading system: `exam:create`
- Read grading systems: `exam:view`
- Update grading system: `exam:create`
- Delete grading system: `exam:create`

---

## Grading System Data Model

Main fields in `GradingSystem`:

- `systemName` (String, required)
- `academicYear` (String, required)
- `classes` (Array of Class ObjectIds)
- `gradingScale[]`:
  - `grade` (String, required) - e.g., `A+`, `A`, `B`
  - `gradePoint` (Number, required)
  - `minPercentage` (Number, required, 0-100)
  - `maxPercentage` (Number, required, 0-100)
  - `description` (String, optional)
  - `isPassing` (Boolean, default `true`)
- `defaultPassingPercentage` (Number, default `33`)
- `isActive` (Boolean, default `true`)
- `createdBy` (User ObjectId, optional)
- `metaData[]` (key-value pairs)

Indexes:

- `{ academicYear: 1, isActive: 1 }`

Model helper method:

- `getGradeForPercentage(percentage)`:
  - Finds the grade range containing the given percentage.
  - Returns matching grade object or `null`.

---

## Endpoints

### `POST /`

- **Purpose:** Create a grading system.
- **Permission:** `exam:create`
- **Controller:** `createGradingSystem`
- **Body example:**

```json
{
  "systemName": "CBSE Grading 2026",
  "academicYear": "2026-2027",
  "classes": [
    "661111111111111111111111",
    "661111111111111111111112"
  ],
  "gradingScale": [
    {
      "grade": "A1",
      "gradePoint": 10,
      "minPercentage": 91,
      "maxPercentage": 100,
      "description": "Outstanding",
      "isPassing": true
    },
    {
      "grade": "B1",
      "gradePoint": 8,
      "minPercentage": 71,
      "maxPercentage": 80,
      "description": "Very Good",
      "isPassing": true
    },
    {
      "grade": "E",
      "gradePoint": 0,
      "minPercentage": 0,
      "maxPercentage": 32,
      "description": "Needs Improvement",
      "isPassing": false
    }
  ],
  "defaultPassingPercentage": 33,
  "isActive": true
}
```

Behavior:

- Uses generic `crudOperations.create`.
- Populates `classes` with selected fields (`classNumber`, `division`) in configured CRUD operation.

---

### `GET /`

- **Purpose:** List all grading systems.
- **Permission:** `exam:view`
- **Controller:** `getAllGradingSystems`
- **Behavior:** Uses generic list operation with class population.

Common filters/pagination support may depend on `crudOperations` implementation used across the project.

---

### `GET /:id`

- **Purpose:** Get one grading system by id.
- **Permission:** `exam:view`
- **Controller:** `getGradingSystemById`
- **Params:**
  - `id` (GradingSystem ObjectId)
- **Behavior:** Returns single grading system, with class population.

---

### `PUT /:id`

- **Purpose:** Update grading system.
- **Permission:** `exam:create`
- **Controller:** `updateGradingSystem`
- **Params:**
  - `id` (GradingSystem ObjectId)
- **Body:** Any updatable grading system fields.

---

### `DELETE /:id`

- **Purpose:** Delete grading system.
- **Permission:** `exam:create`
- **Controller:** `deleteGradingSystem`
- **Params:**
  - `id` (GradingSystem ObjectId)

---

## Common Response Patterns

This module uses shared `crudOperations`, so responses typically follow one of these patterns:

```json
{
  "message": "Created successfully",
  "data": {}
}
```

```json
{
  "data": []
}
```

or direct document-style payloads depending on the CRUD helper implementation.

## Common Error Cases

- Missing tenant context.
- Missing/invalid auth token.
- Permission denied by `authorize`.
- Invalid ObjectId for `:id`.
- Validation failure for required fields:
  - missing `systemName`
  - missing `academicYear`
  - invalid `gradingScale` entries (missing grade/points/range)
- Out-of-range `minPercentage` / `maxPercentage` values.

## Usage Notes and Best Practices

- Keep grading ranges non-overlapping to avoid ambiguity.
- Ensure full coverage (for example 0-100) to prevent unmatched percentages.
- Mark fail grade bands with `isPassing: false`.
- Maintain one active grading system per academic year/class set (project convention recommendation).

## Quick Endpoint Reference

| Method | Endpoint | Permission | Purpose |
|---|---|---|---|
| POST | `/` | `exam:create` | Create grading system |
| GET | `/` | `exam:view` | List grading systems |
| GET | `/:id` | `exam:view` | Get grading system by id |
| PUT | `/:id` | `exam:create` | Update grading system |
| DELETE | `/:id` | `exam:create` | Delete grading system |
