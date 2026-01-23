# Staff Attendance API Quick Reference

## Endpoints Overview

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/api/attendance/staff/monthly-report` | GET | **All staff** monthly report | School summary + individual reports for all staff |
| `/api/attendance/staff/:staffId/monthly` | GET | **Single staff** monthly report | Summary + detailed records for one staff member |
| `/api/attendance/staff/check-in` | POST | Staff check-in | Check-in confirmation |
| `/api/attendance/staff/check-out` | POST | Staff check-out | Check-out confirmation |
| `/api/attendance/staff` | GET | All attendance records | Paginated list of all records |
| `/api/attendance/staff/:id` | POST | Create attendance | New attendance record |
| `/api/attendance/staff/:id` | GET | Get single record | Single attendance record |
| `/api/attendance/staff/:id` | PUT | Update attendance | Updated record |
| `/api/attendance/staff/:id` | DELETE | Delete attendance | Deletion confirmation |

## Quick Start Examples

### All Staff Monthly Report
```bash
# Get report for all staff for January 2026
curl -X GET "http://localhost:5000/api/attendance/staff/monthly-report?month=1&year=2026" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-School-Id: school_ABC123"
```

**Response Structure:**
```json
{
  "success": true,
  "month": "1",
  "year": "2026",
  "schoolSummary": { /* Aggregate stats */ },
  "staffReports": [ /* Array of individual staff reports */ ]
}
```

### Single Staff Monthly Report
```bash
# Get report for one staff member
curl -X GET "http://localhost:5000/api/attendance/staff/679193cf4fc85e2ad8f7a456/monthly?month=1&year=2026" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-School-Id: school_ABC123"
```

**Response Structure:**
```json
{
  "success": true,
  "summary": { /* Individual stats */ },
  "data": [ /* Array of attendance records */ ]
}
```

## Key Differences

### All Staff Report vs Single Staff Report

| Feature | All Staff (`/monthly-report`) | Single Staff (`/:staffId/monthly`) |
|---------|------------------------------|-----------------------------------|
| **Scope** | All staff members | One staff member |
| **School Summary** | ✅ Yes (aggregate stats) | ❌ No |
| **Staff Info** | ✅ Yes (name, email, role) | ❌ No (you already know the staff) |
| **Detailed Records** | ✅ Yes (per staff) | ✅ Yes |
| **Use Case** | HR reports, payroll, admin | Individual performance review |
| **Response Size** | Large (all staff) | Small (one staff) |
| **Performance** | Slower (more data) | Faster |

## Common Query Patterns

### JavaScript Examples

```javascript
// Get all staff report
const allStaffReport = await fetch(
  `/api/attendance/staff/monthly-report?month=1&year=2026`,
  { headers: { 'Authorization': `Bearer ${token}`, 'X-School-Id': schoolId } }
).then(r => r.json());

// Get single staff report
const singleStaffReport = await fetch(
  `/api/attendance/staff/${staffId}/monthly?month=1&year=2026`,
  { headers: { 'Authorization': `Bearer ${token}`, 'X-School-Id': schoolId } }
).then(r => r.json());

// Check-in
await fetch('/api/attendance/staff/check-in', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-School-Id': schoolId
  },
  body: JSON.stringify({
    staffId: '679193cf4fc85e2ad8f7a456',
    location: 'School',
    method: 'Manual',
    academicYear: '2025-2026'
  })
});

// Check-out
await fetch('/api/attendance/staff/check-out', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-School-Id': schoolId
  },
  body: JSON.stringify({
    staffId: '679193cf4fc85e2ad8f7a456',
    location: 'School',
    method: 'Manual'
  })
});
```

## Response Field Comparison

### All Staff Report Fields
```javascript
{
  schoolSummary: {
    totalStaff: number,
    totalAttendanceRecords: number,
    avgAttendancePercentage: string,
    totalLateMinutes: number
  },
  staffReports: [{
    staff: { _id, name, email, roleName },
    summary: {
      totalDays, presentDays, absentDays, 
      halfDays, leaveDays, totalLateMinutes,
      totalWorkingHours, avgWorkingHours, 
      attendancePercentage
    },
    attendanceRecords: [...]
  }]
}
```

### Single Staff Report Fields
```javascript
{
  summary: {
    totalDays, presentDays, 
    totalLateMinutes, avgWorkingHours
  },
  data: [ /* attendance records */ ]
}
```

## When to Use Which Endpoint?

### Use **All Staff Report** (`/monthly-report`) when:
- 📊 Generating school-wide HR reports
- 💰 Processing payroll for all staff
- 📈 Analyzing attendance trends across the school
- 🏆 Identifying top/bottom performers
- 📑 Creating administrative dashboards
- 📧 Sending summary emails to management

### Use **Single Staff Report** (`/:staffId/monthly`) when:
- 👤 Viewing individual staff member's attendance
- 📝 Performance reviews for specific staff
- 💬 Discussing attendance with individual staff
- 🔍 Investigating specific attendance issues
- 📱 Staff self-service portals
- 🎯 Focused, detailed analysis

## Permissions Required

Both endpoints require:
- ✅ Valid JWT token (Authentication)
- ✅ `ATTENDANCE_STAFF_MARK` permission (Authorization)
- ✅ Valid `X-School-Id` header (Multi-tenancy)

## Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | Success | Data retrieved successfully |
| 400 | Bad Request | Missing/invalid month or year |
| 401 | Unauthorized | Invalid or missing token |
| 403 | Forbidden | User lacks required permission |
| 404 | Not Found | Staff member not found (single staff endpoint only) |
| 500 | Server Error | Internal server error |

## Performance Tips

1. **All Staff Report**: Cache results for current month, refresh hourly
2. **Single Staff Report**: Can be called frequently with minimal impact
3. **Date Range**: Both endpoints efficiently query by date range with proper indexing
4. **Pagination**: Not currently implemented; consider if school has 200+ staff

## Real-World Usage Patterns

```javascript
// Pattern 1: Monthly HR Dashboard
async function generateHRDashboard(month, year) {
  const report = await getAllStaffMonthlyReport(month, year);
  
  return {
    overview: report.schoolSummary,
    topPerformers: report.staffReports
      .sort((a, b) => parseFloat(b.summary.attendancePercentage) - parseFloat(a.summary.attendancePercentage))
      .slice(0, 10),
    needsAttention: report.staffReports
      .filter(r => parseFloat(r.summary.attendancePercentage) < 80)
  };
}

// Pattern 2: Payroll Calculation
async function calculateMonthlyPayroll(month, year) {
  const report = await getAllStaffMonthlyReport(month, year);
  
  return report.staffReports.map(staff => ({
    staffId: staff.staff._id,
    name: staff.staff.name,
    workingDays: staff.summary.presentDays + (staff.summary.halfDays * 0.5),
    totalHours: parseFloat(staff.summary.totalWorkingHours),
    salary: calculateSalary(staff.summary)
  }));
}

// Pattern 3: Individual Performance Review
async function getStaffPerformanceData(staffId, months = 3) {
  const currentDate = new Date();
  const reports = [];
  
  for (let i = 0; i < months; i++) {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const report = await getSingleStaffMonthlyReport(
      staffId,
      targetDate.getMonth() + 1,
      targetDate.getFullYear()
    );
    reports.push(report);
  }
  
  return reports;
}
```
