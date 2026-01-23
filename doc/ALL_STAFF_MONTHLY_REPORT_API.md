# All Staff Monthly Attendance Report API

## Endpoint
**GET** `/api/attendance/staff/monthly-report`

## Description
Retrieves a comprehensive monthly attendance report for **ALL staff members** in the school. This endpoint provides:
- Individual summaries for each staff member
- School-wide statistics
- Detailed attendance records for each staff member

Perfect for generating school-wide HR reports, payroll processing, and administrative oversight.

## Authentication & Authorization
- **Authentication**: Required (`protect` middleware)
- **Authorization**: Requires `ATTENDANCE_STAFF_MARK` permission
- **Tenant Identification**: Required (multi-tenant support)

## Request Parameters

### Query Parameters
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `month` | Integer | Yes | Month number (1-12) | `1` for January, `12` for December |
| `year` | Integer | Yes | Four-digit year | `2026` |

## Response Format

### Success Response (200 OK)
```json
{
  "success": true,
  "month": "1",
  "year": "2026",
  "schoolSummary": {
    "totalStaff": 45,
    "totalAttendanceRecords": 990,
    "avgAttendancePercentage": "92.35",
    "totalLateMinutes": 1250
  },
  "staffReports": [
    {
      "staff": {
        "_id": "679193cf4fc85e2ad8f7a456",
        "name": "John Doe",
        "email": "john.doe@school.com",
        "roleName": "Teacher"
      },
      "summary": {
        "totalDays": 22,
        "presentDays": 20,
        "absentDays": 1,
        "halfDays": 0,
        "leaveDays": 1,
        "totalLateMinutes": 45,
        "totalWorkingHours": "172.75",
        "avgWorkingHours": "7.85",
        "attendancePercentage": "90.91"
      },
      "attendanceRecords": [
        {
          "_id": "679193cf4fc85e2ad8f7b123",
          "staff": "679193cf4fc85e2ad8f7a456",
          "date": "2026-01-01T00:00:00.000Z",
          "academicYear": "2025-2026",
          "checkIn": {
            "time": "2026-01-01T09:05:00.000Z",
            "location": "School",
            "method": "Manual",
            "markedBy": "679193cf4fc85e2ad8f7a789"
          },
          "checkOut": {
            "time": "2026-01-01T17:00:00.000Z",
            "location": "School",
            "method": "Manual",
            "markedBy": "679193cf4fc85e2ad8f7a789"
          },
          "status": "Present",
          "lateByMinutes": 5,
          "totalHours": 7.92,
          "createdAt": "2026-01-01T09:05:00.000Z",
          "updatedAt": "2026-01-01T17:00:00.000Z"
        }
        // ... more attendance records
      ]
    },
    {
      "staff": {
        "_id": "679193cf4fc85e2ad8f7a457",
        "name": "Jane Smith",
        "email": "jane.smith@school.com",
        "roleName": "Principal"
      },
      "summary": {
        "totalDays": 22,
        "presentDays": 22,
        "absentDays": 0,
        "halfDays": 0,
        "leaveDays": 0,
        "totalLateMinutes": 0,
        "totalWorkingHours": "184.50",
        "avgWorkingHours": "8.39",
        "attendancePercentage": "100.00"
      },
      "attendanceRecords": [
        // ... attendance records for Jane Smith
      ]
    }
    // ... more staff members
  ]
}
```

### Error Responses

#### 400 Bad Request
Missing or invalid query parameters.
```json
{
  "success": false,
  "message": "Month and year are required"
}
```

#### 401 Unauthorized
No valid authentication token provided.

#### 403 Forbidden
User doesn't have `ATTENDANCE_STAFF_MARK` permission.

## School Summary Fields

The `schoolSummary` object provides aggregate statistics for the entire school:

| Field | Type | Description |
|-------|------|-------------|
| `totalStaff` | Integer | Number of staff members with attendance records |
| `totalAttendanceRecords` | Integer | Total number of attendance records across all staff |
| `avgAttendancePercentage` | String | Average attendance percentage across all staff (2 decimal places) |
| `totalLateMinutes` | Integer | Sum of all late minutes across all staff |

## Staff Report Fields

Each item in the `staffReports` array contains:

### Staff Info
| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Staff user ID |
| `name` | String | Staff member's full name |
| `email` | String | Staff member's email |
| `roleName` | String | Staff member's role (e.g., "Teacher", "Principal") |

### Summary Statistics
| Field | Type | Description |
|-------|------|-------------|
| `totalDays` | Integer | Total attendance records for this staff member |
| `presentDays` | Integer | Number of days marked as "Present" |
| `absentDays` | Integer | Number of days marked as "Absent" |
| `halfDays` | Integer | Number of days marked as "Half Day" |
| `leaveDays` | Integer | Number of days marked as "On Leave" |
| `totalLateMinutes` | Integer | Sum of all late minutes |
| `totalWorkingHours` | String | Total hours worked (2 decimal places) |
| `avgWorkingHours` | String | Average hours per day (2 decimal places) |
| `attendancePercentage` | String | Percentage of present days (2 decimal places) |

### Attendance Records
Array of detailed daily attendance records (same format as single staff endpoint).

## Example Requests

### Using cURL
```bash
# Get January 2026 report for all staff
curl -X GET "http://localhost:5000/api/attendance/staff/monthly-report?month=1&year=2026" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-School-Id: school_ABC123"

# Get December 2025 report for all staff
curl -X GET "http://localhost:5000/api/attendance/staff/monthly-report?month=12&year=2025" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-School-Id: school_ABC123"
```

### Using JavaScript (Fetch API)
```javascript
const getAllStaffMonthlyReport = async (month, year) => {
  const response = await fetch(
    `http://localhost:5000/api/attendance/staff/monthly-report?month=${month}&year=${year}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-School-Id': 'school_ABC123'
      }
    }
  );
  
  const data = await response.json();
  return data;
};

// Usage
const report = await getAllStaffMonthlyReport(1, 2026);

console.log('Total Staff:', report.schoolSummary.totalStaff);
console.log('Average Attendance:', report.schoolSummary.avgAttendancePercentage + '%');

// Iterate through each staff member's report
report.staffReports.forEach(staffReport => {
  console.log(`${staffReport.staff.name}: ${staffReport.summary.attendancePercentage}% attendance`);
});
```

### Using Axios
```javascript
import axios from 'axios';

const getAllStaffMonthlyReport = async (month, year) => {
  try {
    const response = await axios.get(
      `/api/attendance/staff/monthly-report`,
      {
        params: { month, year },
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-School-Id': 'school_ABC123'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching report:', error.response?.data || error.message);
    throw error;
  }
};
```

## Use Cases

### 1. Monthly Payroll Processing
```javascript
const payrollReport = await getAllStaffMonthlyReport(12, 2025);

payrollReport.staffReports.forEach(report => {
  const salary = calculateSalary(
    report.summary.presentDays,
    report.summary.totalWorkingHours,
    report.summary.leaveDays
  );
  
  console.log(`${report.staff.name}: $${salary}`);
});
```

### 2. Identifying Top Performers
```javascript
const report = await getAllStaffMonthlyReport(1, 2026);

const topPerformers = report.staffReports
  .filter(r => parseFloat(r.summary.attendancePercentage) >= 95)
  .sort((a, b) => parseFloat(b.summary.attendancePercentage) - parseFloat(a.summary.attendancePercentage));

console.log('Top Performers:', topPerformers.map(r => r.staff.name));
```

### 3. Late Arrival Analysis
```javascript
const report = await getAllStaffMonthlyReport(1, 2026);

const frequentlyLate = report.staffReports
  .filter(r => r.summary.totalLateMinutes > 60) // More than 1 hour late in total
  .sort((a, b) => b.summary.totalLateMinutes - a.summary.totalLateMinutes);

frequentlyLate.forEach(staff => {
  console.log(`${staff.staff.name}: ${staff.summary.totalLateMinutes} minutes late`);
});
```

### 4. Export to Excel/CSV
```javascript
const report = await getAllStaffMonthlyReport(1, 2026);

const csvData = report.staffReports.map(r => ({
  Name: r.staff.name,
  Email: r.staff.email,
  Role: r.staff.roleName,
  'Total Days': r.summary.totalDays,
  'Present Days': r.summary.presentDays,
  'Absent Days': r.summary.absentDays,
  'Leave Days': r.summary.leaveDays,
  'Attendance %': r.summary.attendancePercentage,
  'Avg Working Hours': r.summary.avgWorkingHours,
  'Total Late (min)': r.summary.totalLateMinutes
}));

// Convert to CSV and download
exportToCSV(csvData, `staff_attendance_${month}_${year}.csv`);
```

## Performance Considerations

1. **Large Datasets**: For schools with many staff members (100+), consider:
   - Adding pagination support
   - Option to exclude detailed `attendanceRecords` (summary only)
   - Caching the response for frequently accessed months

2. **Memory Usage**: The endpoint loads all attendance records into memory. For very large schools, monitor server memory usage.

3. **Query Optimization**: The endpoint uses efficient MongoDB queries with proper indexing on:
   - `date` field (for date range queries)
   - `staff` field (for grouping)

## Filtering Options (Future Enhancement)

Consider adding these optional query parameters:

```javascript
// Filter by role
?month=1&year=2026&role=Teacher

// Filter by department
?month=1&year=2026&department=Science

// Summary only (exclude detailed records)
?month=1&year=2026&summaryOnly=true

// Filter by attendance threshold
?month=1&year=2026&minAttendance=90
```

## Related Endpoints

- `GET /api/attendance/staff/:staffId/monthly` - Get monthly report for a single staff member
- `POST /api/attendance/staff/check-in` - Staff check-in
- `POST /api/attendance/staff/check-out` - Staff check-out
- `GET /api/attendance/staff/:id` - Get single attendance record
- `GET /api/attendance/staff` - Get all staff attendance records

## Notes

1. **Date Range**: Automatically calculates first and last day of the specified month/year
2. **Sorting**: Staff reports are sorted by staff ID, attendance records by date
3. **Empty Month**: Returns empty arrays if no attendance records exist
4. **Population**: Staff information is automatically populated from the Users database
5. **Permissions**: Consider creating a separate `ATTENDANCE_STAFF_VIEW` permission for read-only access
