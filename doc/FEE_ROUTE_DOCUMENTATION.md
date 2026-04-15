# Fee Route Documentation

This document describes all endpoints defined in `routes/feeRoute.js`, including fee structures, invoices, and payments.

## Route Base

- Base module path: `/api/v1/fee`
- Router file: `routes/feeRoute.js`
- Controller file: `controllers/feeController.js`

## Middleware and Access Control

All routes in this module use:

1. `identifyTenant`
2. `protect`
3. `authorize(...)` on most endpoints

Common requirements:

- Tenant context via `X-School-Id` header (or query/body fallback).
- Auth token in cookie.

### Permission Keys Used

- `fee:structure:view`
- `fee:structure:update`
- `fee:structure:delete`
- `fee:invoice:create`
- `fee:invoice:view`
- `fee:payment:record`
- `fee:payment:view`

### Important Route Guard Note

In current route code, the following two structure endpoints are protected by auth but do not include `authorize(...)`:

- `POST /structures`
- `GET /structures`

All other fee endpoints include permission guards.

---

## 1) Fee Structure APIs

## Model Summary (`FeeStructure`)

Key fields:

- `class` (ObjectId, required)
- `academicYear` (String, required)
- `feeHeads[]`:
  - `headName` enum: `Tuition Fee`, `Lab Fee`, `Library Fee`, `Sports Fee`, `Transport Fee`, `Examination Fee`, `Development Fee`, `Computer Fee`, `Activity Fee`, `Other`
  - `amount` (Number, required)
  - `frequency` enum: `Monthly`, `Quarterly`, `Half-Yearly`, `Yearly`, `One-Time`
  - `isMandatory` (Boolean)
- `discounts[]` with type/value/applicability
- `lateFeeConfig`
- `status` enum: `Draft`, `Active`, `Archived`
- `effectiveFrom` (Date, required), `effectiveTo` (Date, optional)
- `totalAnnualFee` (auto-calculated in pre-save)

### `POST /structures`

- **Purpose:** Create fee structure.
- **Auth:** `protect` only (no permission guard currently).
- **Controller:** `createFeeStructure`
- **Body example:**

```json
{
  "class": "661111111111111111111111",
  "academicYear": "2026-2027",
  "feeHeads": [
    {
      "headName": "Tuition Fee",
      "amount": 2500,
      "frequency": "Monthly",
      "isMandatory": true
    },
    {
      "headName": "Examination Fee",
      "amount": 1500,
      "frequency": "Yearly"
    }
  ],
  "discounts": [
    {
      "discountName": "Sibling Discount",
      "discountType": "Percentage",
      "discountValue": 10,
      "applicableFor": "Siblings"
    }
  ],
  "lateFeeConfig": {
    "enabled": true,
    "gracePeriodDays": 5,
    "lateFeeType": "Fixed",
    "lateFeeValue": 100
  },
  "status": "Active",
  "effectiveFrom": "2026-04-01T00:00:00.000Z"
}
```

---

### `GET /structures`

- **Purpose:** List all fee structures.
- **Auth:** `protect` only (no permission guard currently).
- **Controller:** `getAllFeeStructures`
- **Behavior:** Populates class (`classNumber`, `division`).

---

### `GET /structures/:id`

- **Purpose:** Get fee structure by id.
- **Permission:** `fee:structure:view`
- **Controller:** `getFeeStructureById`
- **Params:** `id` (FeeStructure ObjectId)

---

### `GET /structures/class/:classId`

- **Purpose:** Get active fee structure for one class and academic year.
- **Permission:** `fee:structure:view`
- **Controller:** `getFeeStructureByClass`
- **Params:** `classId`
- **Query:** `academicYear` (required by controller logic)
- **Behavior:** Finds by `{ class, academicYear, status: "Active" }`.
- **Errors:** `404 Fee structure not found for this class`.

---

### `PUT /structures/:id`

- **Purpose:** Update fee structure.
- **Permission:** `fee:structure:update`
- **Controller:** `updateFeeStructure`
- **Params:** `id`

---

### `DELETE /structures/:id`

- **Purpose:** Delete fee structure.
- **Permission:** `fee:structure:delete`
- **Controller:** `deleteFeeStructure`
- **Params:** `id`

---

## 2) Fee Invoice APIs

## Model Summary (`FeeInvoice`)

Key fields:

- `invoiceNumber` (String, unique, required)
- `student`, `class`, `feeStructure` (ObjectId, required)
- `academicYear` (String, required)
- `invoicePeriod` enum: `Monthly`, `Quarterly`, `Half-Yearly`, `Yearly`
- `periodMonth` (1-12), `periodQuarter` (1-4)
- `feeItems[]`
- Amounts:
  - `subtotal`
  - `totalDiscount`
  - `lateFee`
  - `totalAmount`
  - `paidAmount`
  - `balanceAmount`
- `status` enum: `Draft`, `Issued`, `Partially Paid`, `Paid`, `Overdue`, `Cancelled`
- `issueDate`, `dueDate`, `paidDate`
- `payments[]` (FeePayment references)

Pre-save behavior:

- Calculates `balanceAmount = totalAmount - paidAmount`
- Auto-updates invoice status based on payment and due date.

### `POST /invoices`

- **Purpose:** Create a fee invoice.
- **Permission:** `fee:invoice:create`
- **Controller:** `createFeeInvoice`
- **Body example:**

```json
{
  "invoiceNumber": "INV-2026-0001",
  "student": "661111111111111111111111",
  "class": "662222222222222222222222",
  "academicYear": "2026-2027",
  "feeStructure": "663333333333333333333333",
  "invoicePeriod": "Monthly",
  "periodMonth": 4,
  "feeItems": [
    { "headName": "Tuition Fee", "amount": 2500, "frequency": "Monthly" }
  ],
  "subtotal": 2500,
  "discounts": [],
  "totalDiscount": 0,
  "lateFee": 0,
  "totalAmount": 2500,
  "balanceAmount": 2500,
  "issueDate": "2026-04-01T00:00:00.000Z",
  "dueDate": "2026-04-10T00:00:00.000Z",
  "status": "Issued"
}
```

---

### `POST /invoices/bulk-generate`

- **Purpose:** Auto-generate monthly invoices for students across classes.
- **Permission:** `fee:invoice:create`
- **Controller:** `generateBulkInvoices`
- **Body:**

```json
{
  "classIds": ["662222222222222222222222", "662222222222222222222223"],
  "month": 4,
  "year": 2026,
  "academicYear": "2026-2027"
}
```

Controller behavior:

- Loads active fee structure for each class and academic year.
- Includes fee heads with frequency `Monthly` or `Quarterly`.
- Applies sibling discounts via `computeSiblingDiscounts(...)`.
- Auto-generates invoice numbers like `INV-<year>-0001`.
- Sets due date to 10th of provided month.

---

### `GET /invoices`

- **Purpose:** List all fee invoices.
- **Permission:** `fee:invoice:view`
- **Controller:** `getAllFeeInvoices`
- **Behavior:** Populates student (name/admission/roll) and class.

---

### `GET /invoices/overdue`

- **Purpose:** Get defaulters list (overdue invoices).
- **Permission:** `fee:invoice:view`
- **Controller:** `getOverdueInvoices`
- **Filter logic:**
  - `status` in `Issued`, `Overdue`, `Partially Paid`
  - `balanceAmount > 0`
  - `dueDate < today`
- **Sort:** due date ascending.

---

### `GET /invoices/student/:studentId`

- **Purpose:** Get all invoices for a student.
- **Permission:** `fee:invoice:view`
- **Controller:** `getStudentInvoices`
- **Params:** `studentId`
- **Behavior:** Populates `feeStructure` and `payments`.

---

### `GET /invoices/:id`

- **Purpose:** Get invoice by id.
- **Permission:** `fee:invoice:view`
- **Controller:** `getFeeInvoiceById`
- **Params:** `id`
- **Behavior:** Populates student, class, feeStructure, and payments.

---

### `PUT /invoices/:id`

- **Purpose:** Update invoice.
- **Permission:** `fee:invoice:create`
- **Controller:** `updateFeeInvoice`
- **Params:** `id`
- **Note:** Current update path uses generic CRUD update logic.

---

### `DELETE /invoices/:id`

- **Purpose:** Delete invoice.
- **Permission:** `fee:invoice:create`
- **Controller:** `deleteFeeInvoice`
- **Params:** `id`

---

## 3) Fee Payment APIs

## Model Summary (`FeePayment`)

Key fields:

- `receiptNumber` (String, unique, required)
- `invoice`, `student` (ObjectId, required)
- `paymentDate` (Date, defaults now)
- `amount` (Number, required)
- `paymentMode` enum:
  - `Cash`, `Cheque`, `Online Transfer`, `UPI`, `Credit Card`, `Debit Card`, `Net Banking`, `Demand Draft`
- `transactionDetails`
- `receiptPdfUrl`
- `status` enum: `Success`, `Pending`, `Failed`, `Cancelled`, `Refunded`
- `chequeStatus` enum: `Pending`, `Cleared`, `Bounced`
- `collectedBy` (ObjectId, required)

### `POST /payments`

- **Purpose:** Record fee payment and generate receipt PDF.
- **Permission:** `fee:payment:record`
- **Controller:** `createFeePayment`
- **Body example:**

```json
{
  "invoice": "664444444444444444444444",
  "student": "661111111111111111111111",
  "paymentDate": "2026-04-06T10:00:00.000Z",
  "amount": 2500,
  "paymentMode": "UPI",
  "transactionDetails": {
    "transactionId": "UPI-TXN-12345",
    "upiId": "school@upi"
  },
  "status": "Success",
  "remarks": "April fee paid"
}
```

Controller behavior:

- If `receiptNumber` missing, auto-generates `RCP-<year>-####`.
- Uses `collectedBy` from request body or fallback to `req.user._id`.
- Updates linked invoice:
  - increments `paidAmount`
  - pushes payment id to invoice `payments[]`
- Attempts receipt PDF generation and stores URL in `receiptPdfUrl`.

Response shape note:

- This endpoint returns the payment document directly (`201`), unlike some others that wrap in `{ success, data }`.

---

### `GET /payments`

- **Purpose:** List all fee payments.
- **Permission:** `fee:payment:view`
- **Controller:** `getAllFeePayments`
- **Behavior:** Populates student, invoice number, collectedBy.

---

### `GET /payments/student/:studentId`

- **Purpose:** Get payment history for student.
- **Permission:** `fee:payment:view`
- **Controller:** `getStudentPaymentHistory`
- **Params:** `studentId`
- **Sort:** payment date descending.

---

### `GET /payments/reports/daily`

- **Purpose:** Daily collection report.
- **Permission:** `fee:payment:view`
- **Controller:** `getDailyCollectionReport`
- **Query:** `date` (expected date string)
- **Filter logic:**
  - payment date between day start and day end
  - `status = Success`
- **Response includes:** `date`, `totalCollection`, `count`, `data`.

---

### `GET /payments/:id`

- **Purpose:** Get payment by id.
- **Permission:** `fee:payment:view`
- **Controller:** `getFeePaymentById`
- **Params:** `id`

---

### `PUT /payments/:id`

- **Purpose:** Update payment.
- **Permission:** `fee:payment:record`
- **Controller:** `updateFeePayment`
- **Params:** `id`

---

### `DELETE /payments/:id`

- **Purpose:** Delete payment.
- **Permission:** `fee:payment:record`
- **Controller:** `deleteFeePayment`
- **Params:** `id`

---

## Common Response Patterns

Typical patterns in this module:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

```json
{
  "success": true,
  "count": 12,
  "data": []
}
```

```json
{
  "success": true,
  "date": "2026-04-06",
  "totalCollection": 15750,
  "count": 8,
  "data": []
}
```

Some CRUD handlers can return plain document payloads depending on `crudOperations` behavior and endpoint implementation.

## Common Error Cases

- Tenant context missing.
- Auth token missing/invalid.
- Permission denied by `authorize(...)`.
- Validation errors from `express-validator` in payment creation.
- Not found cases:
  - Fee structure not found by class/year.
  - CRUD get/update/delete with invalid or non-existing id.
- Invoice/payment relationship mismatches if wrong ids are posted.

## Quick Endpoint Reference

| Method | Endpoint | Permission |
|---|---|---|
| POST | `/structures` | `protect` only |
| GET | `/structures` | `protect` only |
| GET | `/structures/:id` | `fee:structure:view` |
| GET | `/structures/class/:classId` | `fee:structure:view` |
| PUT | `/structures/:id` | `fee:structure:update` |
| DELETE | `/structures/:id` | `fee:structure:delete` |
| POST | `/invoices` | `fee:invoice:create` |
| POST | `/invoices/bulk-generate` | `fee:invoice:create` |
| GET | `/invoices` | `fee:invoice:view` |
| GET | `/invoices/overdue` | `fee:invoice:view` |
| GET | `/invoices/student/:studentId` | `fee:invoice:view` |
| GET | `/invoices/:id` | `fee:invoice:view` |
| PUT | `/invoices/:id` | `fee:invoice:create` |
| DELETE | `/invoices/:id` | `fee:invoice:create` |
| POST | `/payments` | `fee:payment:record` |
| GET | `/payments` | `fee:payment:view` |
| GET | `/payments/student/:studentId` | `fee:payment:view` |
| GET | `/payments/reports/daily` | `fee:payment:view` |
| GET | `/payments/:id` | `fee:payment:view` |
| POST | `/payments/:id/refund` | `fee:payment:record` |
| POST | `/payments/webhook` | `fee:payment:record` |
| PUT | `/payments/:id` | `fee:payment:record` |
| DELETE | `/payments/:id` | `fee:payment:record` |
| GET | `/invoices/summary` | `fee:invoice:view` |
| GET | `/invoices/export` | `fee:invoice:view` |
| POST | `/invoices/:id/reminder` | `fee:invoice:create` |
| POST | `/invoices/:id/waive-late-fee` | `fee:invoice:create` |
| GET | `/reconciliation` | `fee:payment:view` |
| POST | `/structures/:id/clone` | `fee:structure:create` |
| GET | `/audit-logs` | `fee:payment:view` |
| GET | `/delinquency-risk` | `fee:invoice:view` |
