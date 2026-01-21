# Create Parent Account API - Updated Guide

## Overview

The `create-parent-account` endpoint now **automatically creates guardian information** if it doesn't exist. This is a **ONE-STEP process** - no need to add guardian info separately!

---

## Endpoint
**POST** `/api/v1/student/create-parent-account`

## How It Works

1. **If guardian info exists** → Creates user account and links it
2. **If guardian info doesn't exist** → Creates guardian info THEN creates user account

---

## Simple Usage (Recommended)

### One-Step: Create Guardian Info + User Account

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
      "password": "123123",
      "phone": "123123",
      "address": "123123"
    }
  }'
```

**That's it!** The endpoint will:
- ✅ Create guardian info if it doesn't exist
- ✅ Create the user account
- ✅ Link them together

---

## Request Body

### Required Fields

```json
{
  "studentId": "string (MongoDB ObjectId)",
  "guardianRelation": "Father | Mother | Guardian",
  "userData": {
    "name": "string (required)",
    "email": "string (required)",
    "password": "string (optional)",
    "phone": "string (optional)",
    "address": "string (optional)",
    "occupation": "string (optional)"
  }
}
```

### Optional: Separate Guardian Data

If you want different information for the guardian profile vs the user account:

```json
{
  "studentId": "6960f23ff5893a81946da95a",
  "guardianRelation": "Father",
  "userData": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "SecurePass123",
    "phone": "+1234567890"
  },
  "guardianData": {
    "name": "John Michael Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "occupation": "Software Engineer",
    "address": "123 Main Street, City, State",
    "isPrimaryContact": true
  }
}
```

**Note:** If `guardianData` is not provided, the endpoint uses `userData` for both.

---

## Response

### Success (201 Created)

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
        "address": "123123",
        "isPrimaryContact": true,
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

## Error Responses

### 400 - Missing Required Fields
```json
{
  "error": "Missing required fields: studentId, guardianRelation, and userData are required"
}
```

### 400 - Invalid Guardian Relation
```json
{
  "error": "Invalid guardianRelation. Must be one of: Father, Mother, Guardian"
}
```

### 400 - Guardian Already Has Account
```json
{
  "error": "Guardian (Father) already has a user account linked"
}
```

### 400 - Email Already Exists
```json
{
  "error": "A user with this email already exists"
}
```

### 404 - Student Not Found
```json
{
  "error": "Student not found"
}
```

---

## Complete Examples

### Example 1: Basic (Most Common)

```bash
curl -X POST http://localhost:2709/api/v1/student/create-parent-account \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-School-Id: school_001" \
  -d '{
    "studentId": "6960f23ff5893a81946da95a",
    "guardianRelation": "Father",
    "userData": {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "password": "SecurePassword123"
    }
  }'
```

### Example 2: With All User Fields

```bash
curl -X POST http://localhost:2709/api/v1/student/create-parent-account \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-School-Id: school_001" \
  -d '{
    "studentId": "6960f23ff5893a81946da95a",
    "guardianRelation": "Mother",
    "userData": {
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "password": "SecurePassword123",
      "phone": "+1234567890",
      "address": "123 Main Street, City, State",
      "occupation": "Doctor"
    }
  }'
```

### Example 3: With Separate Guardian Data

```bash
curl -X POST http://localhost:2709/api/v1/student/create-parent-account \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-School-Id: school_001" \
  -d '{
    "studentId": "6960f23ff5893a81946da95a",
    "guardianRelation": "Guardian",
    "userData": {
      "name": "Robert Smith",
      "email": "robert.smith@example.com",
      "password": "SecurePassword123"
    },
    "guardianData": {
      "name": "Robert James Smith",
      "email": "robert.smith@example.com",
      "phone": "+9876543210",
      "occupation": "Legal Guardian",
      "address": "456 Oak Avenue",
      "isPrimaryContact": false
    }
  }'
```

---

## PowerShell Example

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

## How It Works Internally

### Scenario 1: Guardian Info Doesn't Exist (First Time)

1. **Checks** if guardian with relation exists
2. **Creates** guardian info automatically using `userData`
3. **Creates** user account
4. **Links** user to guardian
5. **Returns** complete information

### Scenario 2: Guardian Info Already Exists

1. **Finds** existing guardian with relation
2. **Checks** if guardian already has a user account (prevents duplicates)
3. **Creates** user account
4. **Links** user to existing guardian
5. **Updates** guardian email/phone if they were empty
6. **Returns** complete information

---

## Field Mapping

When guardian info doesn't exist and `guardianData` is not provided:

| userData Field | → | guardianInfo Field |
|---------------|---|-------------------|
| name | → | name |
| email | → | email |
| phone | → | phone |
| address | → | address |
| occupation | → | occupation |
| - | → | isPrimaryContact (auto: true if first guardian) |

---

## Important Notes

### ✅ Automatic Features
- **Auto-creates guardian info** if missing
- **Sets first guardian as primary contact** automatically
- **Validates guardian relation** (Father/Mother/Guardian only)
- **Prevents duplicate accounts** for same guardian
- **Prevents duplicate emails** across all users
- **Auto-assigns schoolID** from authenticated user

### ⚠️ Validations
- Student must exist
- Guardian relation must be valid (Father, Mother, or Guardian)
- Email must be unique across all users
- Guardian can't already have a user account
- userData must contain name and email

### 🔒 Security
- Password is hashed automatically (if User model has pre-save hook)
- Password is excluded from all responses
- Requires authentication (JWT token)
- Requires school identification (X-School-Id header)

---

## Quick Reference

### Valid Guardian Relations
- `"Father"`
- `"Mother"`
- `"Guardian"`

### Required Headers
- `Authorization: Bearer <JWT_TOKEN>`
- `X-School-Id: <SCHOOL_ID>`
- `Content-Type: application/json`

### Minimum Request Body
```json
{
  "studentId": "STUDENT_ID",
  "guardianRelation": "Father",
  "userData": {
    "name": "Name",
    "email": "email@example.com"
  }
}
```

---

## Troubleshooting

### Error: "Guardian already has a user account linked"
**Solution:** This guardian already has login access. Use a different relation or check existing accounts.

### Error: "A user with this email already exists"
**Solution:** Use a different email address. Each user must have a unique email.

### Error: "Invalid guardianRelation"
**Solution:** Use exactly "Father", "Mother", or "Guardian" (case-sensitive).

### Error: "Student not found"
**Solution:** Verify the studentId is correct and the student exists in the database.

---

## Summary of Changes

### ✅ What's New
1. **No pre-requisites** - Guardian info is created automatically
2. **One API call** - Everything happens in one request
3. **Smart defaults** - First guardian becomes primary contact
4. **Better validation** - Validates relation types upfront
5. **Flexible input** - Optional separate guardianData

### 🎯 Benefits
- **Simpler workflow** - No need to call add-guardian-info first
- **Fewer errors** - Less chance of missing guardian info
- **Better UX** - One-step parent account creation
- **Backward compatible** - Still works if guardian info exists

---

## Your Exact Use Case

For your request with student ID `6960f23ff5893a81946da95a`:

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
      "password": "123123",
      "phone": "123123",
      "address": "123123"
    }
  }'
```

This will now work **even if the student has no guardian info**! 🎉
