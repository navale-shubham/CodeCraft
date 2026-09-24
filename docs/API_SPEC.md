# Issue Reporting API Documentation

## 1. Authentication APIs

### 1.1 Register a New User

**Endpoint:** `POST /api/auth/register`

**Description:** Registers a new user in the application.

**Request Body:**
```json
{
  "name": "Full Name",
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```

**Responses:**
- `201 Created` — User registered successfully.
- `400 Bad Request` — Invalid registration data.
- `409 Conflict` — User already exists.

### 1.2 User Login

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticates a user and returns an access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```

**Successful Response (200 OK):**
```json
{
  "access_token": "<JWT_TOKEN>",
  "token_type": "bearer"
}
```

**Other Responses:**
- `401 Unauthorized` — Invalid username or password.

---

## 2. Issue Management APIs

### 2.1 Retrieve All Issues

**Endpoint:** `GET /api/issues`

**Description:** Retrieves a list of reported issues along with their details.

**Successful Response (200 OK):**
```json
[
  {
    "id": "#idofthisissue",
    "reported_by": "User Full Name",
    "name": "Damaged street light",
    "description": "Street light is not working near the main road.",
    "category": "Infrastructure",
    "photo_evidence": "https://example.com/images/issue1.jpg",
    "location": "Pune, Maharashtra",
    "status": "Pending",
    "support_count": 25,
    "assigned_to": 5,
    "resolution_note": "Resolution note.",
    "resolution_photo_evidence": "https://example.com/images/issue1_resolved.jpg"
  }
]
```

**Other Response:**
- `500 Internal Server Error` — An unexpected server error occurred.

### 2.2 Report a New Issue

**Endpoint:** `POST /api/issues`

**Description:** Creates a new issue report in the application.

**Request Body:**
```json
{
  "name": "Damaged street light",
  "description": "Street light is not working near the main road.",
  "category": "Infrastructure",
  "photo_evidence": "BASE64_ENCODED_IMAGE",
  "location": {
    "latitude": 18.5204,
    "longitude": 73.8567,
    "accuracy": 23.5,
    "captured_at": "2026-09-24T20:10:00Z"
  }
}
```

**Successful Response (201 Created):**
```json
{
  "id": "#idofthisissue",
  "reported_by": "User Full Name",
  "name": "Damaged street light",
  "description": "Street light is not working near the main road.",
  "category": "Infrastructure",
  "photo_evidence": "https://example.com/images/issue1.jpg",
  "location": "Pune, Maharashtra",
  "status": "Pending",
  "support_count": 0,
  "assigned_to": null,
  "resolution_note": "Resolution note.",
  "resolution_photo_evidence": "https://example.com/images/issue1_resolved.jpg"
}
```

**Other Responses:**
- `400 Bad Request` — Invalid issue data.
- `401 Unauthorized` — Authentication is required.

---

## 3. Issue Updates API

### 3.1 Retrieve Issue Updates

**Endpoint:** `GET /api/updates`

**Description:** Retrieves updates related to reported issues, such as assignment notifications, status changes, or progress reports.

**Successful Response (200 OK):**
```json
[
  {
    "id": "#idofthisissue",
    "message": "Issue has been assigned to the maintenance department.",
    "created_at": "2026-09-22T10:30:00Z"
  }
]
```

**Other Response:**
- `500 Internal Server Error` — An unexpected server error occurred.

---
