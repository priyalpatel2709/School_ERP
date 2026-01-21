# 🍪 Cookie-Based Authentication Guide

This guide explains how the School ERP now supports cookie-based authentication for easier frontend integration.

---

## 🔐 How It Works

The system now supports **dual authentication modes**:
1. **Header-based** (Traditional): Send token in `Authorization: Bearer <token>` header
2. **Cookie-based** (New): Automatically handled via httpOnly cookies

---

## 📋 API Endpoints

### 1. Login
**Endpoint**: `POST /api/v1/user/login`

**Request Body**:
```json
{
  "email": "teacher@school.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "_id": "64b...",
  "name": { "firstName": "John", "lastName": "Doe" },
  "email": "teacher@school.com",
  "token": "eyJhbGc...",
  "schoolID": "school_demo",
  "roleName": "Teacher"
}
```

**Cookies Set** (httpOnly, secure in production):
- `token`: JWT authentication token (30 days expiry)
- `X-School-Id`: School/Tenant identifier **without** the `school_` prefix (30 days expiry)
  - Example: If user's schoolID is `school_ABC`, cookie stores just `ABC`
  - The backend automatically adds the `school_` prefix when reading from cookies

---

### 2. Logout
**Endpoint**: `POST /api/v1/user/logout`

**Response**:
```json
{
  "message": "Logged out successfully"
}
```

**Effect**: Clears both `token` and `X-School-Id` cookies

---

## 🎯 Frontend Integration

### Option 1: Cookie-Based (Recommended for Web Apps)

After login, cookies are automatically set. No need to manually handle tokens!

```javascript
// Login
const response = await fetch('/api/v1/user/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Important: Include cookies
  body: JSON.stringify({ email, password })
});

// All subsequent requests automatically include cookies
const students = await fetch('/api/v1/student', {
  credentials: 'include' // Always include this
});

// Logout
await fetch('/api/v1/user/logout', {
  method: 'POST',
  credentials: 'include'
});
```

### Option 2: Header-Based (For Mobile Apps/APIs)

Traditional approach still works:

```javascript
const { token, schoolID } = await login(email, password);

// Store in localStorage/AsyncStorage
localStorage.setItem('token', token);
localStorage.setItem('schoolID', schoolID);

// Use in subsequent requests
fetch('/api/v1/student', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'X-School-Id': schoolID
  }
});
```

---

## 🔒 Security Features

1. **httpOnly Cookies**: Cannot be accessed via JavaScript (XSS protection)
2. **Secure Flag**: Cookies only sent over HTTPS in production
3. **SameSite**: Set to 'strict' to prevent CSRF attacks
4. **30-Day Expiry**: Automatic logout after 30 days of inactivity

---

## 🌐 CORS Configuration

For cookie-based auth to work with frontend on different domain:

```javascript
// In your frontend CORS setup
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true // Allow cookies
}));
```

---

## 📝 Middleware Priority

The authentication system checks for tokens in this order:
1. `Authorization` header (if present)
2. `token` cookie (fallback)

The tenant identification checks for schoolId in this order:
1. Request body (`req.body.schoolId`)
2. Header (`X-School-Id`)
3. Query parameter (`?schoolId=...`)
4. Cookie (`X-School-Id`)

---

## ✅ Testing with cURL

### Login and save cookies:
```bash
curl -X POST http://localhost:3000/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@school.com","password":"pass123"}' \
  -c cookies.txt
```

### Use cookies in subsequent requests:
```bash
curl http://localhost:3000/api/v1/student \
  -b cookies.txt
```

### Logout:
```bash
curl -X POST http://localhost:3000/api/v1/user/logout \
  -b cookies.txt
```

---

## 🚀 Benefits

1. **Simpler Frontend Code**: No manual token management
2. **Better Security**: httpOnly cookies prevent XSS attacks
3. **Automatic Expiry**: Built-in session management
4. **Backward Compatible**: Header-based auth still works
5. **Multi-Tab Support**: Cookies shared across browser tabs
