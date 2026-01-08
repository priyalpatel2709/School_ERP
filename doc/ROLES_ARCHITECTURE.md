# Enterprise Roles & Permissions Architecture 👮‍♂️

To run a complete Enterprise School ERP, you need the following **7 Standard Roles**.
This structure ensures security and proper segregation of duties.

## 1. 🎓 Core Roles (Existing)
| Role | Responsibility | Dashboard Access |
| :--- | :--- | :--- |
| **Admin** | Full System Access, Settings, User Management | `/admin/dashboard` |
| **Teacher** | Homework, Attendance, Exams, Students (Class) | `/teacher/dashboard` |
| **Student** | View Homework, Grades, Pay Fees | `/student/dashboard` |
| **Parent** | View Children Linked, Pay Fees, Communications | `/parent/dashboard` |

## 2. 🏢 Enterprise Staff Roles (Required for Sales)
*These roles are critical for the administrative functioning of the school.*

### 💰 Accountant (Finance Officer)
*Crucial for the Fee Module*
- **Responsibilities**:
  - Create Fee Structures.
  - Generate Invoices (Demand Notes).
  - Collect Payments (Cash/Cheque/Online).
  - Manage Salary Payouts.
- **Dashboard**: `/finance/dashboard`
- **Access**: `Fee Management`, `Expense Management`, `Staff Payroll`.

### 📚 Librarian
- **Responsibilities**:
  - Manage Books Inventory.
  - Issue/Return Books.
  - Fine Collection.
- **Dashboard**: `/library/dashboard`

### 💼 Admin Staff (Receptionist / Registrar)
- **Responsibilities**:
  - Admission Enquiries.
  - Visitor Management.
  - Student Attendance Correction.
  - Transport Management.
- **Dashboard**: `/office/dashboard`

---

## 🔐 Implementation Plan
1.  **Create Roles**: Use the `POST /api/v1/role` endpoint to seed these roles.
2.  **Assign Roles**: When creating users, assign strict `roleName`.
3.  **Frontend Redirects**: Update the Login Helper to handle these new redirects.
