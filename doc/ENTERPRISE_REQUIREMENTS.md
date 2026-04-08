# School ERP - Enterprise Requirements & Roadmap

This document outlines the feature set for a “sale-ready” School ERP **backend**.  
**Last updated:** April 2026 (implementation pass).

**Legend**

- `[x]` Implemented (APIs + models; validate in your environment).
- `[~]` Partially implemented / requires configuration (SMTP, real SMS provider, etc.).
- `[ ]` Not targeted in this backend scope.

**Core API base:** `/api/v1/...`

---

## Phase 1: Critical Enhancements

### 1. Homework Module

- [x] Subject linking, multiple attachments, status workflow, late submission.
- [x] Student listing resolves **Student `_id` or linked `user` id**.
- [x] Hardening: submission matching uses canonical student document id.

### 2. Teacher / Staff Module

- [x] Qualifications and employment on teacher profile.
- [x] **Qualified subjects** (`qualifiedSubjects`) vs assigned `subjects`: `POST /teacher/qualified-subjects` sets the allowed list; `POST /teacher/assign-subjects` rejects assignments outside that list when the list is non-empty.

### 3. Class Module

- [x] Academic year, capacity (`maxStudents`), division/section.

### 4. Student Module

- [x] Guardian / parent portal hooks and sibling links.
- [x] **Sibling fee discounts**: bulk invoice generation applies `FeeStructure.discounts` rules with `applicableFor: "Siblings"` when the student has linked siblings.

---

## Phase 2: Core Modules

### 1. Fee Management & Finance

- [x] Structures, invoices, payments, overdue and daily collection.
- [x] **Receipt PDFs**: on `POST /fee/payments`, a PDF is written under `/uploads/receipts/...` and `receiptPdfUrl` is set (served via `GET /uploads/...`).

### 2. Attendance System

- [x] Daily (morning/evening), subject-wise, staff check-in/out, leave workflow, monthly reports *(existing)*.

### 3. Examination & Results

- [x] Exams, marks, grading, ranks.
- [x] **Report card PDF**: `POST /examination/results/:id/report-card` (result status must be `Verified` or `Published`).

### 4. Timetable Management

- [x] CRUD *(existing)*.
- [x] **Conflict detection**: `GET /timeTable/conflicts?academicYear=` — flags same teacher overlapping in two classes on the same day.
- [x] **Auto / template week**: `POST /timeTable/auto-generate` — empty week, custom `slotTemplate`, or clone from `templateTimeTableId`.
- [ ] **Drag-and-drop UI** — front-end concern.
- [x] **Substitution records**: `POST /api/v1/substitution` (and CRUD) for planned cover lessons.

---

## Phase 3: Enterprise Add-ons

- [x] **Admissions pipeline**: `GET/POST /api/v1/admissions`, stage updates `PATCH .../stage`, stages `Enquiry` → `EntranceTest` → `Interview` → `MeritList` → `Offered` / `Enrolled` / `Rejected`.
- [x] **HR & payroll**: `POST /api/v1/payroll/runs/draft` (active teachers from `salary`), `POST .../runs/:id/finalize` generates **payslip PDFs** per line under `/uploads/payslips/`.
- [x] **Communication**: `POST /api/v1/communication/email`, `/sms` (stub logs if SMTP/SMS not configured), `/fee-reminder`, `/absence-alert`.
- [x] **Transport**: `/api/v1/transport/bus-routes` and `/api/v1/transport/vehicles` (stops, vehicle assignment, driver fields — **tracking** = store `gpsDeviceId`; live GPS not included).
- [x] **Library**: `/api/v1/library` *(requires `X-School-Id` + auth)* — items, checkout/return/renew, borrowings, fines fields; **librarian** gate uses `roleName` (`librarian` / `admin`).

---

## Phase 4–6

Unchanged from earlier roadmap: Redis, automated backups, strict SaaS tenancy audit, bulk Excel import, executive dashboards, multi-branch, alumni, etc.

---

## Environment (optional)

| Variable | Purpose |
|----------|---------|
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Real email via `nodemailer` |
| `JWT_SECRET` | Auth *(existing)* |

SMS remains a **stub** (logged) until you plug a provider.

---

## New / adjusted routes (summary)

| Method | Path |
|--------|------|
| POST | `/teacher/qualified-subjects` |
| GET | `/timeTable/conflicts` |
| POST | `/timeTable/auto-generate` |
| POST | `/examination/results/:id/report-card` |
| `*` | `/substitution`, `/admissions`, `/payroll/runs/...`, `/transport/...`, `/communication/...`, `/library/...` |

Static files: `/uploads/**` from project `uploads/` directory.
