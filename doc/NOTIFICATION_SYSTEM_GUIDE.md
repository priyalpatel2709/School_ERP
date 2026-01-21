# 🔔 Enhanced Notification System Guide

This guide explains how to use the flexible notification system to send targeted messages to different user groups.

---

## 📋 Overview

The notification system supports four targeting modes:
1. **All Users**: Send to everyone in the school
2. **Role-Based**: Target specific roles (Teachers, Students, Parents, etc.)
3. **Class-Based**: Target specific classes (students, teachers, and optionally parents)
4. **Specific Users**: Send to handpicked individual users

---

## 🎯 API Endpoint

**POST** `/api/v1/notification/sendNotification`

---

## 📝 Request Body Structure

```json
{
  "message": "Your notification message here",
  "type": "info | warning | error | success",
  "targetType": "all | role | class | specific",
  "targetRoles": ["Teacher", "Student", "Parent"],
  "targetClasses": ["classId1", "classId2"],
  "targetUserIds": ["userId1", "userId2"],
  "includeParents": true,
  "expireDate": "2026-02-01T00:00:00.000Z"
}
```

### Required Fields:
- `message` (string): The notification content
- `type` (string): Notification type - `info`, `warning`, `error`, or `success`
- `targetType` (string): How to target recipients

### Optional Fields:
- `expireDate` (date): When notification expires (default: 7 days)
- `includeParents` (boolean): Include parents when targeting students/classes

---

## 🎨 Usage Examples

### 1. Send to ALL Users
Send a school-wide announcement to everyone:

```json
{
  "message": "School will be closed tomorrow for a public holiday",
  "type": "info",
  "targetType": "all"
}
```

---

### 2. Send to Specific Roles

#### All Teachers
```json
{
  "message": "Staff meeting at 3 PM in the conference room",
  "type": "info",
  "targetType": "role",
  "targetRoles": ["Teacher"]
}
```

#### All Students
```json
{
  "message": "Sports day practice starts next week",
  "type": "info",
  "targetType": "role",
  "targetRoles": ["Student"]
}
```

#### All Parents
```json
{
  "message": "Parent-teacher meeting scheduled for next Friday",
  "type": "info",
  "targetType": "role",
  "targetRoles": ["Parent"]
}
```

#### Students + Parents
```json
{
  "message": "Annual exam schedule has been published",
  "type": "warning",
  "targetType": "role",
  "targetRoles": ["Student", "Parent"]
}
```

#### All Teachers + All Parents
```json
{
  "message": "Important: School policy update",
  "type": "warning",
  "targetType": "role",
  "targetRoles": ["Teacher", "Parent"]
}
```

---

### 3. Send to Specific Classes

#### Class 10-A Students Only
```json
{
  "message": "Class 10-A: Extra math class tomorrow at 8 AM",
  "type": "info",
  "targetType": "class",
  "targetClasses": ["<class_10A_id>"]
}
```

#### Class 10-A Students + Parents
```json
{
  "message": "Class 10-A field trip permission forms due by Friday",
  "type": "warning",
  "targetType": "class",
  "targetClasses": ["<class_10A_id>"],
  "includeParents": true
}
```

#### Multiple Classes (e.g., all Class 10 sections)
```json
{
  "message": "Class 10 board exam preparation workshop this Saturday",
  "type": "info",
  "targetType": "class",
  "targetClasses": ["<class_10A_id>", "<class_10B_id>", "<class_10C_id>"],
  "includeParents": true
}
```

**Note**: When targeting classes, the system automatically includes:
- All students in those classes
- Class teachers
- Subject teachers teaching those classes
- Parents (if `includeParents: true`)

---

### 4. Send to Specific Users
For individual or custom groups:

```json
{
  "message": "Your report card is ready for collection",
  "type": "success",
  "targetType": "specific",
  "targetUserIds": ["userId1", "userId2", "userId3"]
}
```

---

## 🔍 Real-World Scenarios

### Scenario 1: Emergency School Closure
Send to everyone:
```json
{
  "message": "URGENT: School closed due to weather. Stay safe!",
  "type": "error",
  "targetType": "all"
}
```

### Scenario 2: Class 10 Parents Meeting
Send to all Class 10 parents:
```json
{
  "message": "Class 10 parent-teacher meeting on Friday at 4 PM",
  "type": "info",
  "targetType": "class",
  "targetClasses": ["<class_10A_id>", "<class_10B_id>"],
  "includeParents": true
}
```

### Scenario 3: Teacher Training
Send to all teachers only:
```json
{
  "message": "Mandatory teacher training workshop this Saturday",
  "type": "warning",
  "targetType": "role",
  "targetRoles": ["Teacher"]
}
```

### Scenario 4: Fee Reminder to Parents
Send to all parents:
```json
{
  "message": "Reminder: School fees due by end of month",
  "type": "warning",
  "targetType": "role",
  "targetRoles": ["Parent"]
}
```

### Scenario 5: Exam Results
Send to specific class students and their parents:
```json
{
  "message": "Mid-term exam results are now available",
  "type": "success",
  "targetType": "class",
  "targetClasses": ["<class_9A_id>"],
  "includeParents": true
}
```

---

## 📊 Response Format

```json
{
  "message": "Notification sent successfully",
  "recipientCount": 245,
  "notificationId": "64b..."
}
```

---

## 🎯 Who Gets Notified?

### When `targetType = "all"`
- Every user in the system

### When `targetType = "role"` with `targetRoles = ["Teacher"]`
- All teachers

### When `targetType = "role"` with `targetRoles = ["Student"]`
- All students
- All parents (if `includeParents: true`)

### When `targetType = "role"` with `targetRoles = ["Parent"]`
- All parents (from student guardian info)

### When `targetType = "class"` with specific class IDs
- All students in those classes
- Class teachers of those classes
- Subject teachers teaching those classes
- Parents of students in those classes (if `includeParents: true`)

### When `targetType = "specific"`
- Only the users specified in `targetUserIds`

---

## ⚙️ Advanced Features

### Parent Inclusion
The `includeParents` flag works with:
- `targetType: "role"` + `targetRoles: ["Student"]`
- `targetType: "class"`

It automatically finds and includes all parent accounts linked to students.

### Automatic Deduplication
If a user qualifies for notification through multiple paths (e.g., they're both a class teacher and subject teacher), they receive only ONE notification.

### Batch Processing
The system efficiently handles large recipient lists (1000+ users) using batch updates.

---

## 🚫 Error Handling

### No Recipients Found
```json
{
  "message": "No valid recipients found for the notification"
}
```

### Missing Required Fields
```json
{
  "message": "Message and type are required"
}
```

---

## 💡 Best Practices

1. **Use Appropriate Type**:
   - `info`: General announcements
   - `warning`: Important reminders, deadlines
   - `error`: Urgent/critical alerts
   - `success`: Positive news, achievements

2. **Set Expiry Dates**: For time-sensitive notifications, set a reasonable `expireDate`

3. **Include Parents**: For student-related matters, always set `includeParents: true`

4. **Be Specific**: Use class-based targeting for class-specific announcements

5. **Test First**: Send to a specific user (`targetType: "specific"`) to test formatting
