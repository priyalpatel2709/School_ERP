# 📬 User Notification Guide

This guide explains how users can retrieve and manage their notifications.

---

## 🎯 User Endpoints

All endpoints require authentication (user must be logged in).

---

## 1️⃣ Get My Notifications

Retrieve all notifications for the logged-in user.

**Endpoint**: `GET /api/v1/notification/my-notifications`

**Headers**:
```
Authorization: Bearer <token>
X-School-Id: <schoolId>
```

Or use cookies (if cookie-based auth is enabled).

**Response**:
```json
{
  "notifications": [
    {
      "_id": "64b...",
      "type": "info",
      "message": "School will be closed tomorrow for a public holiday",
      "createdAt": "2026-01-20T10:30:00.000Z",
      "expireDate": "2026-01-27T10:30:00.000Z",
      "status": "unread",
      "readAt": null
    },
    {
      "_id": "64c...",
      "type": "warning",
      "message": "Fee payment due by end of month",
      "createdAt": "2026-01-19T14:00:00.000Z",
      "expireDate": "2026-01-26T14:00:00.000Z",
      "status": "read",
      "readAt": "2026-01-20T09:15:00.000Z"
    }
  ],
  "unreadCount": 1
}
```

**Features**:
- Returns only non-expired notifications
- Sorted by most recent first
- Includes read/unread status for each notification
- Provides total unread count

---

## 2️⃣ Mark Notification as Read

Mark a specific notification as read.

**Endpoint**: `PUT /api/v1/notification/mark-read/:notificationId`

**Example**: `PUT /api/v1/notification/mark-read/64b...`

**Response**:
```json
{
  "message": "Notification marked as read",
  "notificationId": "64b..."
}
```

**Error Responses**:
- `404`: Notification not found
- `403`: Notification not addressed to you

---

## 3️⃣ Mark All Notifications as Read

Mark all unread notifications as read for the logged-in user.

**Endpoint**: `PUT /api/v1/notification/mark-all-read`

**Response**:
```json
{
  "message": "All notifications marked as read",
  "modifiedCount": 5
}
```

---

## 🎨 Frontend Integration Examples

### React Example

```javascript
import { useEffect, useState } from 'react';

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const response = await fetch('/api/v1/notification/my-notifications', {
      credentials: 'include' // For cookie-based auth
    });
    const data = await response.json();
    setNotifications(data.notifications);
    setUnreadCount(data.unreadCount);
  };

  const markAsRead = async (notificationId) => {
    await fetch(`/api/v1/notification/mark-read/${notificationId}`, {
      method: 'PUT',
      credentials: 'include'
    });
    fetchNotifications(); // Refresh
  };

  const markAllAsRead = async () => {
    await fetch('/api/v1/notification/mark-all-read', {
      method: 'PUT',
      credentials: 'include'
    });
    fetchNotifications(); // Refresh
  };

  return (
    <div>
      <div className="notification-bell">
        🔔 {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </div>
      
      <div className="notification-list">
        {notifications.map(notif => (
          <div 
            key={notif._id} 
            className={notif.status === 'unread' ? 'unread' : 'read'}
            onClick={() => markAsRead(notif._id)}
          >
            <span className={`type-${notif.type}`}>{notif.type}</span>
            <p>{notif.message}</p>
            <small>{new Date(notif.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
      
      {unreadCount > 0 && (
        <button onClick={markAllAsRead}>Mark All as Read</button>
      )}
    </div>
  );
}
```

---

## 📱 Mobile App Example (React Native)

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

const getNotifications = async () => {
  const token = await AsyncStorage.getItem('token');
  const schoolId = await AsyncStorage.getItem('schoolId');
  
  const response = await fetch('/api/v1/notification/my-notifications', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-School-Id': schoolId
    }
  });
  
  return await response.json();
};
```

---

## 🔄 Polling vs WebSocket

### Option 1: Polling (Simple)
Fetch notifications every 30 seconds:

```javascript
useEffect(() => {
  const interval = setInterval(fetchNotifications, 30000);
  return () => clearInterval(interval);
}, []);
```

### Option 2: WebSocket (Real-time)
For real-time updates, consider implementing WebSocket/Socket.io:

```javascript
// Backend would emit events when new notifications are sent
socket.on('new-notification', (notification) => {
  setNotifications(prev => [notification, ...prev]);
  setUnreadCount(prev => prev + 1);
});
```

---

## 🎯 Notification Types & UI Colors

Display different colors based on notification type:

```javascript
const getNotificationColor = (type) => {
  switch(type) {
    case 'info': return '#2196F3';    // Blue
    case 'success': return '#4CAF50'; // Green
    case 'warning': return '#FF9800'; // Orange
    case 'error': return '#F44336';   // Red
    default: return '#757575';        // Gray
  }
};
```

---

## 📊 Notification Status Flow

```
1. Notification Sent
   ↓
2. User receives (status: "unread")
   ↓
3. User clicks notification
   ↓
4. Call mark-read endpoint
   ↓
5. Status changes to "read"
   ↓
6. readAt timestamp recorded
```

---

## ⏰ Automatic Cleanup

Expired notifications are automatically hidden from the `my-notifications` endpoint.

To manually trigger cleanup (admin only):
```
DELETE /api/v1/notification/cleanupExpiredNotifications
```

---

## 🔐 Security Notes

1. Users can only see notifications addressed to them
2. Users cannot see who else received the same notification
3. Marking as read only affects the logged-in user's status
4. Expired notifications are filtered out automatically

---

## 💡 Best Practices

### For Frontend Developers:

1. **Show Unread Count**: Display the badge with unread count prominently
2. **Auto-refresh**: Poll for new notifications every 30-60 seconds
3. **Visual Distinction**: Make unread notifications visually distinct (bold, different background)
4. **Click to Mark Read**: Automatically mark as read when user clicks
5. **Bulk Actions**: Provide "Mark All as Read" button
6. **Notification Center**: Create a dedicated page/modal for viewing all notifications
7. **Sound/Vibration**: Consider adding alerts for new notifications (with user preference)
8. **Persistence**: Cache notifications locally to reduce API calls

### Example UI Flow:
```
Header
  └─ Bell Icon (🔔)
      └─ Badge (unread count)
      └─ Dropdown
          ├─ Notification 1 (unread - bold)
          ├─ Notification 2 (read - normal)
          ├─ ...
          └─ "Mark All as Read" button
          └─ "View All" link → Notification Center Page
```

---

## 🧪 Testing

### Test as a Teacher:
```bash
# Login as teacher
curl -X POST http://localhost:3000/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@school.com","password":"pass123"}' \
  -c cookies.txt

# Get notifications
curl http://localhost:3000/api/v1/notification/my-notifications \
  -b cookies.txt

# Mark one as read
curl -X PUT http://localhost:3000/api/v1/notification/mark-read/64b... \
  -b cookies.txt

# Mark all as read
curl -X PUT http://localhost:3000/api/v1/notification/mark-all-read \
  -b cookies.txt
```
