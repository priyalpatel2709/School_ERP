# Guardian Management API Guide

## Problem Diagnosis

The error you received indicates that the student with ID `6960f23ff5893a81946da95a` doesn't have a guardian with relation "Father" in their `guardianInfo` array.

**Error Message:**
```
Guardian with relation 'Father' not found in student profile
```

This means either:
1. The student has no guardians added to their profile
2. The student has guardians, but none with the relation "Father" (might have "Mother" or "Guardian" instead)

---

## Solution: Step-by-Step Workflow

### Step 1: Check Student's Guardian Information

First, check what guardians (if any) exist for this student:

```bash
curl -X GET http://localhost:2709/api/v1/student/6960f23ff5893a81946da95a/guardian-info \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "X-School-Id: school_001"
```

**Expected Response:**
```json
{
  "studentId": "6960f23ff5893a81946da95a",
  "guardianInfo": [
    {
      "relation": "Mother",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "phone": "1234567890",
      "occupation": "Teacher",
      "address": "123 Main St",
      "isPrimaryContact": true,
      "hasUserAccount": false,
      "userAccount": null
    }
  ]
}
```

Or if no guardians exist:
```json
{
  "studentId": "6960f23ff5893a81946da95a",
  "guardianInfo": []
}
```

---

### Step 2: Add Guardian Information (if missing)

If the student has no guardian with relation "Father", add it:

```bash
curl -X POST http://localhost:2709/api/v1/student/add-guardian-info \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "X-School-Id: school_001" \
  -d '{
    "studentId": "6960f23ff5893a81946da95a",
    "guardianData": {
      "relation": "Father",
      "name": "parent",
      "email": "parent@example.com",
      "phone": "123123",
      "occupation": "Engineer",
      "address": "123123",
      "isPrimaryContact": false
    }
  }'
```

**Response:**
```json
{
  "message": "Guardian information added successfully",
  "student": {
    "_id": "6960f23ff5893a81946da95a",
    "guardianInfo": [
      {
        "relation": "Father",
        "name": "parent",
        "email": "parent@example.com",
        "phone": "123123",
        "occupation": "Engineer",
        "address": "123123",
        "isPrimaryContact": false
      }
    ]
  }
}
```

---

### Step 3: Create Parent Account

Now that the guardian information exists, create the user account:

```bash
curl -X POST http://localhost:2709/api/v1/student/create-parent-account \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "X-School-Id: school_001" \
  -d '{
    "studentId": "6960f23ff5893a81946da95a",
    "guardianRelation": "Father",
    "userData": {
      "name": "parent",
      "email": "parent@example.com",
      "password": "123123",
      "phone": "123123",
      "address": "123123"
    }
  }'
```

**Success Response:**
```json
{
  "message": "Parent account created successfully",
  "user": {
    "_id": "65f1234567890abcdef12345",
    "name": "parent",
    "email": "parent@example.com",
    "roleName": "Parent",
    "schoolID": "school_001"
  },
  "student": {
    "_id": "6960f23ff5893a81946da95a",
    "guardianInfo": [
      {
        "relation": "Father",
        "name": "parent",
        "email": "parent@example.com",
        "phone": "123123",
        "user": {
          "_id": "65f1234567890abcdef12345",
          "name": "parent",
          "email": "parent@example.com",
          "roleName": "Parent"
        }
      }
    ]
  }
}
```

---

## All Available Endpoints

### 1. Get Student Guardian Info
**GET** `/api/v1/student/:id/guardian-info`

View all guardians for a specific student.

```bash
curl -X GET http://localhost:2709/api/v1/student/{STUDENT_ID}/guardian-info \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-School-Id: school_001"
```

---

### 2. Add or Update Guardian Info
**POST** `/api/v1/student/add-guardian-info`

Add new guardian or update existing guardian information.

```bash
curl -X POST http://localhost:2709/api/v1/student/add-guardian-info \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-School-Id: school_001" \
  -d '{
    "studentId": "STUDENT_ID",
    "guardianData": {
      "relation": "Father|Mother|Guardian",
      "name": "Guardian Name",
      "email": "email@example.com",
      "phone": "1234567890",
      "occupation": "Occupation",
      "address": "Address",
      "isPrimaryContact": true
    }
  }'
```

**Valid Relations:** `"Father"`, `"Mother"`, `"Guardian"`

**Note:** If a guardian with the same relation already exists, it will be updated. Otherwise, a new guardian will be added.

---

### 3. Create Parent Account
**POST** `/api/v1/student/create-parent-account`

Create a user account for an existing guardian.

```bash
curl -X POST http://localhost:2709/api/v1/student/create-parent-account \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-School-Id: school_001" \
  -d '{
    "studentId": "STUDENT_ID",
    "guardianRelation": "Father|Mother|Guardian",
    "userData": {
      "name": "Guardian Name",
      "email": "unique@email.com",
      "password": "SecurePassword123",
      "phone": "1234567890",
      "address": "Address"
    }
  }'
```

---

## Error Handling Improvements

The `createParentAccount` endpoint now provides detailed error messages:

### Enhanced Error Response
If a guardian is not found, you'll now get:

```json
{
  "error": {
    "message": "Guardian with relation 'Father' not found in student profile",
    "availableGuardians": [
      {
        "relation": "Mother",
        "name": "Jane Doe",
        "hasAccount": false
      }
    ],
    "hint": "Available guardian relations: Mother"
  }
}
```

Or if no guardians exist:

```json
{
  "error": {
    "message": "Guardian with relation 'Father' not found in student profile",
    "availableGuardians": [],
    "hint": "This student has no guardians in their profile. Please add guardian information first."
  }
}
```

---

## PowerShell Examples

### Check Guardian Info
```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_JWT_TOKEN"
    "X-School-Id" = "school_001"
}

Invoke-RestMethod -Uri "http://localhost:2709/api/v1/student/6960f23ff5893a81946da95a/guardian-info" `
    -Method GET `
    -Headers $headers
```

### Add Guardian Info
```powershell
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer YOUR_JWT_TOKEN"
    "X-School-Id" = "school_001"
}

$body = @{
    studentId = "6960f23ff5893a81946da95a"
    guardianData = @{
        relation = "Father"
        name = "parent"
        email = "parent@example.com"
        phone = "123123"
        address = "123123"
        isPrimaryContact = $false
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:2709/api/v1/student/add-guardian-info" `
    -Method POST `
    -Headers $headers `
    -Body $body
```

### Create Parent Account
```powershell
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer YOUR_JWT_TOKEN"
    "X-School-Id" = "school_001"
}

$body = @{
    studentId = "6960f23ff5893a81946da95a"
    guardianRelation = "Father"
    userData = @{
        name = "parent"
        email = "parent@example.com"
        password = "123123"
        phone = "123123"
        address = "123123"
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:2709/api/v1/student/create-parent-account" `
    -Method POST `
    -Headers $headers `
    -Body $body
```

---

## Quick Fix for Your Current Error

Based on your error, here's the exact sequence to fix it:

**1. Check what guardians exist:**
```bash
curl -X GET http://localhost:2709/api/v1/student/6960f23ff5893a81946da95a/guardian-info \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-School-Id: YOUR_SCHOOL_ID"
```

**2. Add Father guardian info:**
```bash
curl -X POST http://localhost:2709/api/v1/student/add-guardian-info \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-School-Id: YOUR_SCHOOL_ID" \
  -d '{
    "studentId": "6960f23ff5893a81946da95a",
    "guardianData": {
      "relation": "Father",
      "name": "parent",
      "email": "parent@example.com",
      "phone": "123123",
      "address": "123123"
    }
  }'
```

**3. Create the parent account:**
```bash
curl -X POST http://localhost:2709/api/v1/student/create-parent-account \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-School-Id: YOUR_SCHOOL_ID" \
  -d '{
    "studentId": "6960f23ff5893a81946da95a",
    "guardianRelation": "Father",
    "userData": {
      "name": "parent",
      "email": "parent@example.com",
      "password": "123123"
    }
  }'
```

---

## Summary of Changes

### ✅ Fixed Issues:
1. **Enhanced error messages** - Now shows available guardians when one is not found
2. **Added guardian info endpoint** - View all guardians for a student
3. **Added add/update guardian endpoint** - Manage guardian information
4. **Better validation** - Validates relation types and required fields
5. **Improved debugging** - Detailed error responses help identify issues

### 🆕 New Endpoints:
- `GET /api/v1/student/:id/guardian-info` - View guardians
- `POST /api/v1/student/add-guardian-info` - Add/update guardian info

### 🔧 Improved Endpoint:
- `POST /api/v1/student/create-parent-account` - Now with better error messages
