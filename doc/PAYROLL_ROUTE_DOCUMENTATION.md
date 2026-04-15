# Payroll Route Complete Documentation

This document explains `payrollRoute.js` in detail, including how to use each endpoint and where to use it in your school ERP workflows.

## Module Overview

- Route file: `routes/payrollRoute.js`
- Controller file: `controllers/payrollController.js`
- Model file: `models/payrollRunModel.js`
- Base API path: `/api/v1/payroll`

Main purpose of this module:

- Create monthly payroll run drafts from active teachers
- View payroll runs and details
- Finalize payroll runs and generate payslip PDFs

---

## Middleware and Access

All routes in this module currently use:

1. `identifyTenant`
2. `protect`

Important note:

- No `authorize(...)` permission guard is currently applied in `payrollRoute.js`.
- Any authenticated user with tenant context can hit these endpoints unless you add role/permission checks.

---

## Data Model

Payroll model uses `PayrollRun` with embedded `lines`.

## `PayrollRun` fields

- `month` (Number, required, 1-12)
- `year` (Number, required)
- `academicYear` (String, required)
- `status` (`Draft` or `Finalized`)
- `lines[]` (array of payroll lines)
- `finalizedAt` (Date)
- `metaData[]`

## `lines[]` fields

- `teacher` (Teacher ObjectId, required)
- `basic` (Number, required)
- `allowances` (Number, default 0)
- `deductions` (Number, default 0)
- `net` (Number, required)
- `payslipPdfUrl` (String, set during finalize)

---

## Endpoints (How to Use + Where to Use)

## 1) Create Payroll Run Draft

### `POST /api/v1/payroll/runs/draft`

- Purpose: Build a payroll draft for one month/year from active teachers
- Controller: `createPayrollRunDraft`
- Required body:
  - `month`
  - `year`
  - `academicYear`

### Request example

```json
{
  "month": 4,
  "year": 2026,
  "academicYear": "2026-2027"
}
```

### Controller logic

- Validates required fields
- Fetches teachers where `employment.status = "Active"`
- For each teacher:
  - `basic = teacher.salary.basic || 0`
  - `allowances = teacher.salary.allowances || 0`
  - `deductions = 0` (default in current logic)
  - `net = basic + allowances - deductions`
- Creates payroll run with `status: "Draft"`

### Success response

- Returns created payroll run document (`201`)

### Where to use

- HR “Generate monthly payroll” button
- Admin payroll cycle initialization

---

## 2) List Payroll Runs

### `GET /api/v1/payroll/runs`

- Purpose: Get all payroll runs
- Controller: `listPayrollRuns`

### Behavior

- Returns all runs sorted by newest year/month first
- Response shape:

```json
{
  "success": true,
  "data": []
}
```

### Where to use

- Payroll dashboard run history table
- Finance/admin monthly run tracking

---

## 3) Get Payroll Run by ID

### `GET /api/v1/payroll/runs/:id`

- Purpose: Get one payroll run with line details
- Controller: `getPayrollRunById`
- Param:
  - `id` = payroll run id

### Behavior

- Populates `lines.teacher`
- Nested populate teacher user details (`name`, `email`)
- Returns `404` if not found

### Where to use

- Payroll run details page
- “Review before finalize” screen

---

## 4) Finalize Payroll Run

### `POST /api/v1/payroll/runs/:id/finalize`

- Purpose: Finalize a draft and generate payslip PDFs for each payroll line
- Controller: `finalizePayrollRun`
- Param:
  - `id` = payroll run id

### Controller logic

- Finds payroll run by id
- Returns `404` if run not found
- Returns `400` if already finalized
- For each line:
  - Loads teacher + user name
  - Generates payslip PDF via `generateAndSavePayslipPdf(...)`
  - Stores URL in `line.payslipPdfUrl`
- Sets:
  - `status = "Finalized"`
  - `finalizedAt = now`
- Saves updated run

### Success response

```json
{
  "success": true,
  "data": {}
}
```

### Where to use

- HR/Finance “Finalize payroll” action
- End-of-month payroll lock process

---

## End-to-End Usage Flow

Typical payroll monthly flow:

1. HR creates draft:
   - `POST /payroll/runs/draft`
2. HR reviews all runs:
   - `GET /payroll/runs`
3. HR opens draft details:
   - `GET /payroll/runs/:id`
4. HR finalizes and generates payslips:
   - `POST /payroll/runs/:id/finalize`
5. Client app uses `payslipPdfUrl` in each line to view/download payslips.

---

## Errors and Validation

Common errors:

- `400 month, year, academicYear required` (draft creation)
- `404 Not found` (run id not found)
- `400 Already finalized` (finalize endpoint)

Potential runtime considerations:

- If a teacher has missing salary data, current logic falls back to 0.
- Finalize can take longer for large runs because payslip PDFs are generated line-by-line.

---

## Security and Role Recommendation

Current route only requires authentication. Recommended production controls:

- Add permission guard to payroll endpoints (for example admin/hr role)
- Restrict finalize endpoint to finance/payroll admin
- Add audit logging for draft/finalize actions

---

## Quick Reference Table

| Method | Endpoint | Current Guard | Use |
|---|---|---|---|
| POST | `/api/v1/payroll/runs/draft` | `identifyTenant + protect` | Create monthly payroll draft |
| GET | `/api/v1/payroll/runs` | `identifyTenant + protect` | List payroll runs |
| GET | `/api/v1/payroll/runs/:id` | `identifyTenant + protect` | View run details |
| POST | `/api/v1/payroll/runs/:id/finalize` | `identifyTenant + protect` | Finalize run + generate payslips |
