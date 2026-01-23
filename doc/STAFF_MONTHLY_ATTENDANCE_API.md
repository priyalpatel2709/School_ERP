# Staff Attendance Monthly Report API Guide

## Endpoint
**GET** `/api/attendance/staff/:staffId/monthly`

## Description
Retrieves a comprehensive monthly attendance report for a specific staff member, including:
- Total working days
- Present days count
- Total late minutes
- Average working hours per day
- Detailed daily attendance records

## Authentication & Authorization
- **Authentication**: Required (`protect` middleware)
- **Authorization**: Requires `ATTENDANCE_STAFF_MARK` permission
- **Tenant Identification**: Required (multi-tenant support)

## Request Parameters

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `staffId` | ObjectId | Yes | The MongoDB ObjectId of the staff member |

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
  "summary": {
    "totalDays": 22,
    "presentDays": 20,
    "totalLateMinutes": 45,
    "avgWorkingHours": "7.85"
  },
  "data": [
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
}
```

### Error Responses

#### 400 Bad Request
Missing or invalid query parameters.

#### 401 Unauthorized
No valid authentication token provided.

#### 403 Forbidden
User doesn't have `ATTENDANCE_STAFF_MARK` permission.

#### 404 Not Found
Staff member not found.

## Example Requests

### Using cURL
```bash
# Get January 2026 report
curl -X GET "http://localhost:5000/api/attendance/staff/679193cf4fc85e2ad8f7a456/monthly?month=1&year=2026" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-School-Id: school_ABC123"

# Get December 2025 report
curl -X GET "http://localhost:5000/api/attendance/staff/679193cf4fc85e2ad8f7a456/monthly?month=12&year=2025" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-School-Id: school_ABC123"
```

### Using JavaScript (Fetch API)
```javascript
const getStaffMonthlyReport = async (staffId, month, year) => {
  const response = await fetch(
    `http://localhost:5000/api/attendance/staff/${staffId}/monthly?month=${month}&year=${year}`,
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
const report = await getStaffMonthlyReport(
  '679193cf4fc85e2ad8f7a456',
  1,  // January
  2026
);

console.log('Total Days:', report.summary.totalDays);
console.log('Present Days:', report.summary.presentDays);
console.log('Average Hours:', report.summary.avgWorkingHours);
```

### Using Axios
```javascript
import axios from 'axios';

const getStaffMonthlyReport = async (staffId, month, year) => {
  try {
    const response = await axios.get(
      `/api/attendance/staff/${staffId}/monthly`,
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

## Summary Fields Explained

| Field | Type | Description |
|-------|------|-------------|
| `totalDays` | Integer | Total number of attendance records in the month |
| `presentDays` | Integer | Number of days marked as "Present" |
| `totalLateMinutes` | Integer | Sum of all late minutes across the month |
| `avgWorkingHours` | String | Average hours worked per day (formatted to 2 decimal places) |

## Attendance Data Fields

Each attendance record in the `data` array contains:

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique identifier for the attendance record |
| `staff` | ObjectId | Reference to the staff user |
| `date` | Date | Attendance date (normalized to midnight) |
| `academicYear` | String | Academic year (e.g., "2025-2026") |
| `checkIn` | Object | Check-in details (time, location, method, markedBy) |
| `checkOut` | Object | Check-out details (time, location, method, markedBy) |
| `status` | String | Status: "Present", "Absent", "Half Day", "On Leave" |
| `lateByMinutes` | Number | Minutes late (if applicable) |
| `totalHours` | Number | Total hours worked that day |
| `remarks` | String | Optional remarks |
| `createdAt` | Date | Record creation timestamp |
| `updatedAt` | Date | Last update timestamp |

## Notes

1. **Date Range**: The endpoint automatically calculates the first and last day of the specified month/year.

2. **Sorting**: Results are sorted by date in ascending order (oldest first).

3. **Empty Results**: If no attendance records exist for the specified month, the response will have:
   - `totalDays: 0`
   - `presentDays: 0`
   - `totalLateMinutes: 0`
   - `avgWorkingHours: "0.00"`
   - `data: []`

4. **Performance**: For large datasets, consider implementing pagination if needed.

5. **Permissions**: Only users with `ATTENDANCE_STAFF_MARK` permission can access this endpoint. You may want to also allow `ATTENDANCE_STAFF_VIEW` permission for read-only access.

## Use Cases

- **HR Reports**: Generate monthly attendance reports for payroll processing
- **Performance Reviews**: Analyze staff punctuality and attendance patterns
- **Compliance**: Maintain records for labor law compliance
- **Analytics**: Identify trends in staff attendance over time
- **Staff Dashboards**: Display individual attendance summaries to staff members

## Related Endpoints

- `POST /api/attendance/staff/check-in` - Staff check-in
- `POST /api/attendance/staff/check-out` - Staff check-out
- `GET /api/attendance/staff/:id` - Get single attendance record
- `GET /api/attendance/staff` - Get all staff attendance records
