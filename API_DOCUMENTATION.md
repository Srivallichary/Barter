# Barter — Backend API Documentation

⚠️ This document is updated as the backend evolves — always check the "Last updated" date at the bottom.

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

You get this token from the `/api/auth/login` response after a successful login.

---

## Auth Endpoints

### 1. Register a new user

**POST** `/api/auth/register`

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
  "user": {
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

**POST** `/api/auth/login`

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

**GET** `/api/auth/profile`

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
    "rating": 0,
    "completedTrades": 0,
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

## Database Models Reference

### User
| Field | Type | Notes |
|---|---|---|
| name | String | required |
| email | String | required, unique |
| password | String | required, hashed with bcrypt, min 6 characters |
| rating | Number | defaults to 0 |
| completedTrades | Number | defaults to 0 |
| createdAt / updatedAt | Date | auto-generated |

### Item
| Field | Type | Notes |
|---|---|---|
| title | String | required |
| description | String | required |
| category | String | required, must be one of: Books, Electronics, Clothing, Furniture, Sports, Accessories, Home Appliances, Others |
| condition | String | optional, defaults to "Good". One of: New, Like New, Good, Fair, Used, Refurbished |
| images | [String] | array of file paths, supports multiple images |
| owner | ObjectId (User) | required |
| status | String | `available` / `traded` / `pending`, defaults to `available` |
| location | String | optional |
| tags | [String] | optional |
| estimatedValue | Number | optional |
| createdAt / updatedAt | Date | auto-generated |

### Trade
| Field | Type | Notes |
|---|---|---|
| fromUser | ObjectId (User) | required |
| toUser | ObjectId (User) | required |
| offeredItem | ObjectId (Item) | required |
| requestedItem | ObjectId (Item) | required |
| status | String | `pending` / `accepted` / `rejected` / `cancelled` / `completed` / `expired`, defaults to `pending` |
| createdAt / updatedAt | Date | auto-generated |

### Wishlist
| Field | Type | Notes |
|---|---|---|
| user | ObjectId (User) | required, one wishlist per user |
| items | [ObjectId] (Item) | array of saved items |
| createdAt / updatedAt | Date | auto-generated |

*(Note: no controller/routes built yet for this model — coming soon)*

### Notification
| Field | Type | Notes |
|---|---|---|
| user | ObjectId (User) | required |
| type | String | one of: trade_request, trade_accepted, trade_rejected, new_message, item_liked, item_removed |
| message | String | required |
| relatedTrade | ObjectId (Trade) | optional |
| relatedItem | ObjectId (Item) | optional |
| isRead | Boolean | defaults to false |
| createdAt / updatedAt | Date | auto-generated |

*(Note: no controller/routes built yet for this model — coming soon)*

### Message
| Field | Type | Notes |
|---|---|---|
| trade | ObjectId (Trade) | required |
| sender | ObjectId (User) | required |
| receiver | ObjectId (User) | required |
| text | String | required |
| isRead | Boolean | defaults to false |
| createdAt / updatedAt | Date | auto-generated |

*(Note: no controller/routes built yet for this model — coming soon)*

---

## Image Uploads

Image files are handled via multer and saved to the `uploads/` folder. Only the file path is stored in the database (e.g. `uploads/image-1699999999999-123456789.jpg`) — not the actual image data.

- Allowed formats: jpg, jpeg, png, webp
- Max file size: 5MB per file
- Items support multiple images (up to 5)

---

## Notes for Frontend Team

- Base URL during development: `http://localhost:5000`
- Auth routes are prefixed with `/api/auth`
- Item routes are prefixed with `/api/items` (see Member 1 for item-specific endpoint documentation, including Smart Match)
- Store the JWT token securely after login — send it with every request to protected routes
- If you get a `401` response, the token is missing, invalid, or expired — redirect the user to login again
- Category and condition fields are strict lists (enums) — sending an unlisted value will be rejected by the database

---

## Status

Last updated: July 11, 2026
Backend models & auth by: Member 3 (Database & Authentication)
Item/Trade controllers & routes by: Member 1