# Barter — Backend API Documentation

This document explains how to set up and use the backend (database + authentication) built by Member 3.

---

## Setup Instructions

1. Clone the repo and open the project folder
2. Run:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root folder (copy structure from `.env.example`)
4. Ask Member 3 privately for the real values (MongoDB connection string, JWT secret) — do not share these publicly
5. Run the server:
   ```bash
   node server.js
   ```
6. Server runs at: `http://localhost:5000`

---

## Response Format (applies to all routes)

**Success:**
```json
{
  "success": true,
  "message": "Description of what happened",
  "data": { }
}
```

**Error:**
```json
{
  "success": false,
  "message": "What went wrong"
}
```

---

## Authentication

Protected routes require a JWT token sent in the request header:
```
Authorization: Bearer <token>
```

You get this token from the `/api/login` response after a successful login.

---

## Endpoints

### 1. Register a new user

**POST** `/api/register`

**Body (JSON):**
```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "yourpassword"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Alice",
    "email": "alice@example.com"
  }
}
```

**Possible errors:**
- Missing required field (name/email/password)
- Email already registered (must be unique)
- Password less than 6 characters

---

### 2. Login

**POST** `/api/login`

**Body (JSON):**
```json
{
  "email": "alice@example.com",
  "password": "yourpassword"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "Alice",
      "email": "alice@example.com"
    }
  }
}
```

**Save the `token`** — you'll need it for any protected route.

**Possible errors (401):**
- Invalid email or password (used for both cases, so attackers can't tell which one was wrong)

---

### 3. Get logged-in user's profile (Protected)

**GET** `/api/profile`

**Headers required:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Alice",
    "email": "alice@example.com",
    "createdAt": "2026-07-09T08:37:27.324Z",
    "updatedAt": "2026-07-09T08:37:27.324Z"
  }
}
```

Note: password is never included in this response.

**Possible errors (401):**
- No token provided
- Invalid or expired token

---

### 4. Upload an image (e.g. item photo)

**POST** `/api/test-upload`

**Body type:** `form-data` (not JSON — this route accepts files)

**Field:**
- Key: `image`
- Type: File
- Choose any image file (jpg, jpeg, png, webp — max 5MB)

**Success Response (200):**
```json
{
  "success": true,
  "message": "File uploaded successfully!",
  "data": {
    "filename": "image-1699999999999-123456789.jpg",
    "path": "uploads/image-1699999999999-123456789.jpg",
    "size": 245678
  }
}
```

**Possible errors (400):**
- No file uploaded
- File type not allowed (only jpg, jpeg, png, webp accepted)
- File larger than 5MB

Note: this is currently a test route. It will be adapted into the real item-creation route once item upload UI is ready on frontend.

---

## Database Models Reference

### User
| Field | Type | Notes |
|---|---|---|
| name | String | required |
| email | String | required, unique |
| password | String | required, hashed with bcrypt, min 6 characters |
| createdAt / updatedAt | Date | auto-generated |

### Item
| Field | Type | Notes |
|---|---|---|
| title | String | required |
| description | String | required |
| category | String | required |
| image | String | file path, optional |
| owner | ObjectId (User) | required |
| status | String | `available` / `traded` / `pending`, defaults to `available` |
| createdAt / updatedAt | Date | auto-generated |

### Trade
| Field | Type | Notes |
|---|---|---|
| fromUser | ObjectId (User) | required |
| toUser | ObjectId (User) | required |
| offeredItem | ObjectId (Item) | required |
| requestedItem | ObjectId (Item) | required |
| status | String | `pending` / `accepted` / `rejected` / `completed`, defaults to `pending` |
| createdAt / updatedAt | Date | auto-generated |

---

## Notes for Frontend Team

- Base URL during development: `http://localhost:5000`
- All routes are prefixed with `/api`
- Store the JWT token securely (e.g. in memory or secure storage) after login — send it with every request to protected routes
- If you get a `401` response, the token is missing, invalid, or expired — redirect the user to login again

---

## Status

Last updated: July 11, 2026
Backend by: Member 3 (Database & Authentication)