# School ERP - Enterprise Requirements & Roadmap

This document outlines the necessary feature set and enhancements required to transform the current codebase into a commercially viable ("Sale-Ready") Enterprise School ERP.

## 🟢 Phase 1: Critical Enhancements (Current Modules)
*Existing modules are basic and require these upgrades to handle real-world scenarios.*

### 1. Homework Module 📚
- **Current Gap**: No subject link, only single file, incorrect logic for student view.
- **Requirements**:
  - [ ] **Subject Linking**: Link homework to `Subject` (not just Class/Teacher).
  - [ ] **Multiple Attachments**: Allow array of file URLs (PDFs, Images).
  - [ ] **Status Workflow**: `Draft` -> `Published/Assigned` -> `Archived`.
  - [ ] **Correct Student API**: `getHomeworkByStudent` must fetch **all** homework assigned to their class, not just what they submitted.
  - [ ] **Submission Window**: Add `lateSubmission` flag if submitted after `dueDate`.

### 2. Teacher/Staff Module 👩‍🏫
- **Current Gap**: Missing professional details and employment history.
- **Requirements**:
  - [ ] **Qualifications**: Degree (B.Ed, M.Sc), University, Year of Passing.
  - [ ] **Employment Details**: Date of Joining, Job Type (Permanent/Contract), status (Active/Resigned).
  - [ ] **Subjects Mapping**: Strict validation on which subjects a teacher *can* teach vs *is* teaching.

### 3. Class Module 🏫
- **Current Gap**: No academic year binding or capacity limits.
- **Requirements**:
  - [ ] **Academic Year**: Bind classes to a Session (e.g., "2023-2024"). Crucial for year-end promotions.
  - [ ] **Capacity Management**: Define `maxStudents`. Prevent admission if full.
  - [ ] **Section/Division Management**: Better handling of Class 10 -> Sections A, B, C.

### 4. Student Module 🎓
- **Current Gap**: Basic profile.
- **Requirements**:
  - [ ] **Parent Portal Access**: Explicit link to `User` accounts for Parents (Father/Mother separate logins).
  - [ ] **Siblings Mapping**: Link brothers/sisters for Fee Discounts.

---

## 🟡 Phase 2: Missing Core Modules (Must-Have for Sales)
*These modules are standard in every school request for proposal (RFP).*

### 1. Fee Management & Finance 💰 (High Priority)
- **Fee Structures**: Define heads (Tuition, Lab, Transport) per class.
- **Invoicing**: Auto-generate monthly/quarterly invoices for all students.
- **Payments**: Record partial/full payments, support Cash/Online modes.
- **Receipts**: PDF Receipt generation.
- **Reports**: Outstanding Dues (Defaulters List), Daily Collection Report.

### 2. Attendance System 📅 (High Priority)
- **Student Attendance**:
  - Daily Mode (Morning/Evening).
  - Subject-wise Mode (for Higher Grades).
- **Staff Attendance**: Check-in/Check-out times.
- **Leave Management**: Leave application workflow (Parent applies -> Teacher approves).
- **Reports**: Monthly % for Report Cards.

### 3. Examination & Results 📝
- **Exam Configuration**: Create Terms (Mid-term, Finals) and Tests (Unit Test 1).
- **Mark Entry**: Teachers enter marks for their subjects.
- **Grading System**: Configurable logic (90% = A+, 80% = A).
- **Report Cards**: Auto-generate PDF report cards with graphs/remarks.

### 4. Timetable Management 🕐
- **Schedule**: Auto-generate or drag-and-drop slots.
- **Conflict Detection**: Prevent assigning the same teacher to two classes at once.
- **Substitution**: Manage free teachers when someone is on leave.

---

## 🔵 Phase 3: Enterprise Add-ons (Value Generators)
*Features that justify "Premium" pricing.*

### 1. Admissions Management
- Online Enquiry Form -> Entrance Test -> Interview -> Merit List -> Admission.

### 2. HR & Payroll
- Salary Structure (Basic + DA + HRA).
- Monthly Salary Slip Generation.

### 3. Communication (SMS/Email)
- Auto-alerts for Absent students (Message to Parent).
- Fee Reminders.

### 4. Transport & Library
- **Library**: Book Issue/Return tracking, Fine calculation.
- **Transport**: Route management, Bus tracking, Driver allocation.

---

## 🟠 Phase 4: Technical & Non-Functional (In Progress)
- [x] **Security**: Helmet, Rate Limiting, HPP (Implemented).
- [x] **Logging**: File-based rotation logging (Implemented).
- [ ] **Caching**: Implement Redis for frequently accessed data (Timetable, Fee Structure).
- [ ] **Backup**: Automated daily DB backups.
- [ ] **Tenancy**: Ensure strict data isolation between schools (if SaaS).

---

## 🟣 Phase 5: Sales Enablers (The "Closer" Features)
*These are not "daily use" features, but you cannot sign a new school up without them.*

### 1. Simple Onboarding (Bulk Import) 📥
**Requirement**: Schools have thousands of existing students. They will **not** enter them manually.
- **Feature**: Excel/CSV Upload for:
  - Students & Parents.
  - Staff details.
  - Previous Fee Balances.
- **Why it matters**: Without this, the school Admin will refuse to switch to your software.

### 2. Executive Dashboards 📊
**Requirement**: The Principal/Owner needs to see the "Health" of the school in 5 seconds.
- **Feature**:
  - **Fee Stats**: Today's Collection vs Expected. Total Outstanding.
  - **Attendance**: Today's Absenteeism (Staff & Student).
  - **Admission Funnel**: New Enquiries vs Conversions.
- **Why it matters**: This is the screen that sells the product to the Decision Maker.

---

## 🔮 Phase 6: Long-Term Vision (Enterprise Differentiation)
*Capabilities that large multi-branch school networks require.*

### 1. Mobile App Support 📱
- **Parent App API**: Endpoints for push notifications, homework view, fee payment.
- **Teacher App API**: Quick attendance marking from phone.

### 2. Multi-Branch Support 🏢
- **Central Admin**: One Super-Admin controlling 5 different schools.
- **Inter-branch Transfer**: Moving a student from "Branch A" to "Branch B" without re-entry.

### 3. Inventory & Asset Management 📦
- Track Desks, Computers, Lab Equipment.
- Stock alerts (e.g., Chalk, Paper).

### 4. Alumni Management 👨‍🎓
- Database of passed-out students.
- Event planning and donation tracking.
