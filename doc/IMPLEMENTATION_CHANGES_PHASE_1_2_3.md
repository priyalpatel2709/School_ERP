# Implementation Changes - Phase 1, 2, 3

This document explains the new backend changes that were added recently, why they were added, and how they are used.

## 1) Platform Wiring and Shared Infrastructure

- `index.js`
  - Added static file hosting for generated documents: `GET /uploads/**`.
  - Added startup directory creation for uploads via `ensureUploadsDirs()`.
  - Mounted new route groups:
    - `/api/v1/substitution`
    - `/api/v1/admissions`
    - `/api/v1/payroll`
    - `/api/v1/transport`
    - `/api/v1/communication`
    - `/api/v1/library`
  - **Use:** enables all new Phase 2/3 modules and file serving for PDFs.

- `routes/index.js`
  - Exported new route bundles for substitution, admissions, payroll, transport, communication, and library.
  - **Use:** central route registry now includes all newly implemented modules.

- `.gitignore`
  - Added `/uploads`.
  - **Use:** generated receipt/report-card/payslip PDFs are not committed to git.

- `helper/uploadPaths.js` (new)
  - Provides upload root constants and folder creation helpers.
  - **Use:** keeps file storage paths consistent and avoids duplicate path code.

- `helper/pdfDocuments.js` (new)
  - Added PDF generators:
    - fee receipt PDF
    - report card PDF
    - payroll payslip PDF
  - **Use:** creates printable documents and returns URL paths stored in DB.

- `package.json` / `package-lock.json`
  - Added `pdfkit` and `nodemailer`.
  - **Use:** PDF generation and email service integration.

## 2) Phase 1 Changes

### Homework hardening

- `controllers/homeWorkController.js`
  - `getHomeworkByStudent` now accepts either:
    - student document id, or
    - linked user id
  - Submission matching now compares against canonical student document id.
  - **Use:** prevents missing homework/submission data when clients send user id instead of student id.

### Teacher subject compliance

- `models/teacherModel.js`
  - Added `qualifiedSubjects` field.
  - **Use:** separates "teacher is qualified for" vs "teacher is currently assigned".

- `controllers/teacherController.js`
  - Added `setQualifiedSubjects`.
  - Updated `assignSubjects` to reject subjects outside `qualifiedSubjects` when list is configured.
  - **Use:** enforces stricter academic assignment policy.

- `routes/teacherRoute.js`
  - Added `POST /api/v1/teacher/qualified-subjects`.
  - Reordered static routes before `/:id` to avoid accidental route shadowing.
  - **Use:** safe routing and explicit endpoint for qualification mapping.

### Sibling discount support in billing flow

- `helper/feeDiscountHelpers.js` (new)
  - Added sibling discount computation helper.
  - **Use:** central rule engine for discount lines in invoices.

- `controllers/feeController.js`
  - `generateBulkInvoices` now applies sibling discount rules from fee structure when student has siblings.
  - **Use:** automatic discount generation during bulk invoicing.

## 3) Phase 2 Changes

### Fee receipt PDF generation

- `controllers/feeController.js`
  - `createFeePayment` now:
    - auto-generates `receiptNumber` when missing
    - updates linked invoice `paidAmount` and payment references
    - generates receipt PDF and sets `receiptPdfUrl`
  - **Use:** complete payment lifecycle with downloadable receipt artifact.

### Report card PDF generation

- `controllers/examinationController.js`
  - Added `generateReportCardPdf`.
  - Requires result status `Verified` or `Published`.
  - Sets:
    - `reportCardGenerated`
    - `reportCardUrl`
    - `reportCardGeneratedAt`
  - **Use:** one-click report card generation from exam result records.

- `routes/examinationRoute.js`
  - Added `POST /api/v1/examination/results/:id/report-card`.
  - **Use:** endpoint for admin/teacher report card generation workflow.

### Timetable conflict detection and auto-generate

- `utils/timeTableConflicts.js` (new)
  - Added overlap detection utilities for teacher slot collisions.
  - **Use:** reusable timetable validation logic.

- `controllers/timeTableController.js`
  - Added `getTimeTableConflicts` (`GET /conflicts`).
  - Added `autoGenerateTimeTable` (`POST /auto-generate`):
    - clone from template timetable, or
    - use provided slot template, or
    - create empty week scaffold
  - **Use:** identifies schedule problems and speeds up timetable setup.

- `routes/timeTableRoute.js`
  - Added:
    - `GET /api/v1/timeTable/conflicts`
    - `POST /api/v1/timeTable/auto-generate`
  - **Use:** exposes new scheduling capabilities.

### Substitution module

- `models/substitutionModel.js` (new)
- `controllers/substitutionController.js` (new)
- `routes/substitutionRoute.js` (new)
  - Provides CRUD for substitution records.
  - **Use:** manages cover teacher assignments for absent staff scenarios.

## 4) Phase 3 Changes

### Admissions module

- `models/admissionApplicationModel.js` (new)
- `controllers/admissionController.js` (new)
- `routes/admissionRoute.js` (new)
  - Supports admission workflow stages and stage updates.
  - **Use:** tracks enquiry-to-enrollment pipeline.

### Payroll module

- `models/payrollRunModel.js` (new)
- `controllers/payrollController.js` (new)
- `routes/payrollRoute.js` (new)
  - Draft payroll run generation from active teacher salary fields.
  - Finalize payroll run creates payslip PDFs for each line item.
  - **Use:** salary processing and downloadable payslip generation.

### Communication module

- `services/communicationService.js` (new)
  - Email via nodemailer (when SMTP configured).
  - SMS stub logger for provider-agnostic integration.
  - **Use:** common communication adapter layer.

- `controllers/communicationController.js` (new)
- `routes/communicationRoute.js` (new)
  - Added endpoints:
    - `POST /api/v1/communication/email`
    - `POST /api/v1/communication/sms`
    - `POST /api/v1/communication/fee-reminder`
    - `POST /api/v1/communication/absence-alert`
  - **Use:** operational messaging and parent alert workflows.

### Transport module

- `models/transportRouteModel.js` (new)
- `models/transportVehicleModel.js` (new)
- `controllers/transportController.js` (new)
- `routes/transportRoute.js` (new)
  - Route and vehicle CRUD with assignment support.
  - **Use:** manages school transport entities and route planning data.

### Library module activation and implementation

- `models/libraryItemModel.js` (new)
- `models/libraryBorrowingModel.js` (new)
- `controllers/library/itemController.js` (new)
- `controllers/library/borrowingController.js` (new)
- `routes/library.js` (updated)
  - Added tenant middleware + auth handling for library routes.
  - Implemented item and borrowing lifecycle operations:
    - checkout/return/renew
    - reservations
    - fines/payment/waiver
    - overdue and due-soon reports
  - **Use:** complete library circulation management.

- `middleware/roleMiddleware.js`
  - `librarianAccess` now checks `req.user.roleName`.
  - **Use:** aligns role checks with current user model fields.

## 5) Model Registry Updates

- `models/index.js`
  - Exported new model factories:
    - substitution
    - admission application
    - payroll run
    - transport route
    - transport vehicle
    - library item
    - library borrowing
  - **Use:** enables clean imports from `../models` in controllers.

## 6) Operational Notes

- Generated files are saved under `uploads/` and served statically.
- Email delivery requires SMTP environment variables:
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_USER`
  - `SMTP_PASS`
  - `SMTP_FROM` (optional)
- SMS is currently stubbed (logged), ready to connect to a provider.

