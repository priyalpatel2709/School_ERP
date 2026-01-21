# Parent Portal - Get My Children API

## Overview

When a parent logs in, they can use this endpoint to find all students they are guardians for. This endpoint searches for all students where the logged-in user's ID is listed in the `guardianInfo.user` field.

---

## Endpoint
**GET** `/api/v1/student/my-children`

## Authentication
**Required**: Yes - Parent must be logged in with a valid JWT token

---

## How It Works

1. Parent logs in with their credentials
2. Parent calls `/my-children` endpoint
3. System searches all students where `guardianInfo.user` matches the parent's user ID
4. Returns complete information about all their children

---

## Request

### Headers
```
Authorization: Bearer <JWT_TOKEN>
X-School-Id: <SCHOOL_ID>
```

### No Request Body Required
This is a GET request - no body needed. The system automatically uses the logged-in user's ID from the JWT token.

---

## Response

### Success (200 OK)

```json
{
  "message": "Children retrieved successfully",
  "parentInfo": {
    "_id": "65f1234567890abcdef12345",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "roleName": "Parent"
  },
  "totalChildren": 2,
  "children": [
    {
      "_id": "6960f23ff5893a81946da95a",
      "studentInfo": {
        "user": {
          "_id": "65f9876543210fedcba98765",
          "name": "Alice Doe",
          "email": "alice.doe@school.com",
          "phone": "1234567890"
        },
        "roleNumber": 101,
        "admissionNumber": 2024001,
        "admissionDate": "2024-01-15T00:00:00.000Z",
        "academicYear": "2024-2025",
        "studentImage": "https://example.com/images/alice.jpg"
      },
      "classes": [
        {
          "_id": "65fclass1234567890",
          "classNumber": 10,
          "division": "A",
          "academicYear": "2024-2025"
        }
      ],
      "relationToParent": "Father",
      "allGuardians": [
        {
          "relation": "Father",
          "name": "John Doe",
          "email": "john.doe@example.com",
          "phone": "9876543210",
          "isPrimaryContact": true,
          "hasUserAccount": true
        },
        {
          "relation": "Mother",
          "name": "Jane Doe",
          "email": "jane.doe@example.com",
          "phone": "9876543211",
          "isPrimaryContact": false,
          "hasUserAccount": true
        }
      ],
      "siblings": ["65fsibling1234567890"]
    },
    {
      "_id": "6960f23ff5893a81946da95b",
      "studentInfo": {
        "user": {
          "_id": "65f9876543210fedcba98766",
          "name": "Bob Doe",
          "email": "bob.doe@school.com",
          "phone": "1234567891"
        },
        "roleNumber": 102,
        "admissionNumber": 2024002,
        "admissionDate": "2024-01-15T00:00:00.000Z",
        "academicYear": "2024-2025",
        "studentImage": "https://example.com/images/bob.jpg"
      },
      "classes": [
        {
          "_id": "65fclass1234567891",
          "classNumber": 8,
          "division": "B",
          "academicYear": "2024-2025"
        }
      ],
      "relationToParent": "Father",
      "allGuardians": [
        {
          "relation": "Father",
          "name": "John Doe",
          "email": "john.doe@example.com",
          "phone": "9876543210",
          "isPrimaryContact": true,
          "hasUserAccount": true
        },
        {
          "relation": "Mother",
          "name": "Jane Doe",
          "email": "jane.doe@example.com",
          "phone": "9876543211",
          "isPrimaryContact": false,
          "hasUserAccount": true
        }
      ],
      "siblings": ["6960f23ff5893a81946da95a"]
    }
  ]
}
```

### No Children Found (200 OK)

```json
{
  "message": "No children found for this parent account",
  "children": []
}
```

### Error Responses

#### 401 Unauthorized
```json
{
  "error": "Not authorized, token failed"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Error fetching children: <error_message>"
}
```

---

## cURL Examples

### Basic Request

```bash
curl -X GET http://localhost:2709/api/v1/student/my-children \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-School-Id: school_001"
```

### With Pretty Print (using jq)

```bash
curl -X GET http://localhost:2709/api/v1/student/my-children \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-School-Id: school_001" | jq
```

---

## PowerShell Example

```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_JWT_TOKEN"
    "X-School-Id" = "school_001"
}

$response = Invoke-RestMethod -Uri "http://localhost:2709/api/v1/student/my-children" `
    -Method GET `
    -Headers $headers

# Display the response
$response | ConvertTo-Json -Depth 10
```

---

## Response Fields Explained

### Parent Info
| Field | Type | Description |
|-------|------|-------------|
| `_id` | String | Parent's user ID |
| `name` | String | Parent's full name |
| `email` | String | Parent's email address |
| `roleName` | String | Always "Parent" |

### Child Object
| Field | Type | Description |
|-------|------|-------------|
| `_id` | String | Student's MongoDB ID |
| `studentInfo` | Object | Student's personal information |
| `classes` | Array | Classes the student is enrolled in |
| `relationToParent` | String | How the student is related to the logged-in parent (Father/Mother/Guardian) |
| `allGuardians` | Array | All guardians for this student |
| `siblings` | Array | IDs of the student's siblings |

### Student Info
| Field | Type | Description |
|-------|------|-------------|
| `user` | Object | Student's user account information |
| `roleNumber` | Number | Student's role number |
| `admissionNumber` | Number | Unique admission number |
| `admissionDate` | Date | Date of admission |
| `academicYear` | String | Current academic year |
| `studentImage` | String | URL to student's photo |

---

## Use Cases

### 1. Parent Dashboard
When a parent logs in, immediately call this endpoint to display all their children on the dashboard.

```javascript
// After parent login
const getChildren = async (token, schoolId) => {
  const response = await fetch('http://localhost:2709/api/v1/student/my-children', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-School-Id': schoolId
    }
  });
  const data = await response.json();
  return data.children;
};
```

### 2. Child Selector
Allow parents to switch between children if they have multiple kids.

```javascript
// Display child selector
children.forEach(child => {
  console.log(`${child.studentInfo.user.name} - Class ${child.classes[0].classNumber}${child.classes[0].division}`);
});
```

### 3. Relationship Display
Show how the parent is related to each child.

```javascript
children.forEach(child => {
  console.log(`You are the ${child.relationToParent} of ${child.studentInfo.user.name}`);
});
```

---

## Complete Workflow Example

### Step 1: Parent Login
```bash
curl -X POST http://localhost:2709/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "loginID": "parent@example.com",
    "password": "123123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65f1234567890abcdef12345",
    "name": "John Doe",
    "email": "parent@example.com",
    "roleName": "Parent",
    "schoolID": "school_001"
  }
}
```

### Step 2: Get Children
```bash
curl -X GET http://localhost:2709/api/v1/student/my-children \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "X-School-Id: school_001"
```

### Step 3: Use Child Data
Now you have all the information about the parent's children and can:
- Display their names and photos
- Show their classes
- Access their academic information
- View all guardians
- See sibling relationships

---

## Frontend Integration Example

### React/Flutter Example

```javascript
import { useState, useEffect } from 'react';

function ParentDashboard() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const schoolId = localStorage.getItem('schoolId');
        
        const response = await fetch('http://localhost:2709/api/v1/student/my-children', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-School-Id': schoolId
          }
        });
        
        const data = await response.json();
        setChildren(data.children);
      } catch (error) {
        console.error('Error fetching children:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>My Children</h1>
      {children.map(child => (
        <div key={child._id}>
          <h2>{child.studentInfo.user.name}</h2>
          <p>Class: {child.classes[0]?.classNumber}{child.classes[0]?.division}</p>
          <p>Admission Number: {child.studentInfo.admissionNumber}</p>
          <p>Relation: {child.relationToParent}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## Important Notes

### ✅ Features
- **Automatic Detection**: Uses logged-in user's ID from JWT token
- **Multiple Children**: Returns all children the parent is guardian for
- **Complete Information**: Includes student details, classes, and all guardians
- **Relationship Info**: Shows how parent is related to each child
- **Sibling Links**: Includes sibling relationships

### 🔒 Security
- **Authentication Required**: Must have valid JWT token
- **Role-Based**: Works for users with "Parent" role
- **School Isolation**: Only returns students from the same school
- **Data Privacy**: Only shows children the parent is guardian for

### ⚠️ Important
- Parent must have a user account (created via `create-parent-account`)
- Parent's user ID must be linked in student's `guardianInfo.user` field
- Returns empty array if no children found (not an error)
- Requires both JWT token and X-School-Id header

---

## Troubleshooting

### Issue: Empty children array returned
**Possible Causes:**
1. Parent account not properly linked to any student
2. Parent's user ID not in any student's `guardianInfo.user` field
3. Wrong school ID in header

**Solution:**
- Verify parent account was created using `create-parent-account` endpoint
- Check student's guardian info using `/:id/guardian-info` endpoint
- Ensure X-School-Id matches the parent's schoolID

### Issue: 401 Unauthorized
**Cause:** Invalid or expired JWT token

**Solution:**
- Re-login to get a fresh token
- Verify token is included in Authorization header

### Issue: No relation shown
**Cause:** Guardian entry doesn't have user field populated

**Solution:**
- Ensure `create-parent-account` was used to create the link
- Manually verify the student's guardianInfo has the user field set

---

## Summary

This endpoint provides a simple way for parents to:
1. ✅ Find all their children in the school
2. ✅ See complete student information
3. ✅ View class assignments
4. ✅ Check their relationship to each child
5. ✅ Access guardian and sibling information

**One API call gives parents everything they need to access their children's information!** 🎉
