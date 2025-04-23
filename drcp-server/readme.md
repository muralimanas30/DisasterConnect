# API Documentation

This document describes all the endpoints defined within the project.

---

## Base URL

```
http://localhost:4000
```

All endpoints, except registration and login, require an Authorization header with a valid JWT token. The header format is:

```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Register User

**URL:** `/api/users/register`  
**Method:** `POST`  
**Authentication:** Not required

#### Request Body

All fields are required:

```json
{
    "username": "string",
    "password": "string",
    "email": "string",
    "location": {
        "coordinates": [longitude, latitude]
    },
    "role": "volunteer" // or "victim", "admin"
}
```

#### Success Response

- **Status:** `201 Created`
- **Response Body:**

```json
{
    "success": true,
    "msg": "user registered",
    "user": {
        "_id": "user_id",
        "username": "string",
        "email": "string",
        "role": "volunteer",
        "location": {
            "type": "Point",
            "coordinates": [longitude, latitude]
        },
        "is_google_login": false,
        "created_at": "date-string",
        "updated_at": "date-string"
    },
    "token": "jwt_token"
}
```

#### Error Responses

- **400 Bad Request:** When any required field is missing.
- **409 Conflict:** If the username already exists.

---

### 2. Login User

**URL:** `/api/users/login`  
**Method:** `POST`  
**Authentication:** Not required

#### Request Body

```json
{
    "username": "string",
    "password": "string"
}
```

#### Success Response

- **Status:** `200 OK`
- **Response Body:**

```json
{
    "success": true,
    "msg": "user logged in",
    "user": {
        "_id": "user_id",
        "username": "string",
        "email": "string",
        "role": "volunteer",
        "location": {
            "type": "Point",
            "coordinates": [longitude, latitude]
        },
        "is_google_login": false,
        "created_at": "date-string",
        "updated_at": "date-string"
    },
    "token": "jwt_token"
}
```

#### Error Responses

- **400 Bad Request:** If `username` or `password` is missing.
- **404 Not Found:** If the user is not found.
- **401 Unauthorized:** If the password does not match.

---

### 3. Get User

**URL:** `/api/users/:id`  
**Method:** `GET`  
**Authentication:** Required

#### URL Parameters

- `id`: The user identifier.

#### Success Response

- **Status:** `200 OK`
- **Response Body:**

```json
{
    "msg": "user data fetched",
    "user": {
        "_id": "user_id",
        "username": "string",
        "email": "string",
        "role": "volunteer",
        "phone_number": "optional string",
        "location": {
            "type": "Point",
            "coordinates": [longitude, latitude]
        },
        "is_google_login": false,
        "created_at": "date-string",
        "updated_at": "date-string"
    }
}
```

#### Error Responses

- **400 Bad Request:** If the `id` is not provided.
- **404 Not Found:** If the user does not exist.

---

### 4. Update User

**URL:** `/api/users/:id`  
**Method:** `PATCH`  
**Authentication:** Required

#### URL Parameters

- `id`: The user identifier.

#### Request Body

Fields that can be updated:

```json
{
    "username": "string",
    "email": "string",
    "role": "volunteer", // or "victim", "admin"
    "phone_number": "string",
    "location": {
        "coordinates": [longitude, latitude]
    }
}
```

_Note: At least one valid field must be provided._

#### Success Response

- **Status:** `200 OK`
- **Response Body:**

```json
{
    "msg": "user updated",
    "user": {
        "_id": "user_id",
        "username": "possibly updated username",
        "email": "possibly updated email",
        "role": "updated role",
        "phone_number": "updated phone number",
        "location": {
            "type": "Point",
            "coordinates": [new_longitude, new_latitude]
        },
        "is_google_login": false,
        "created_at": "original date",
        "updated_at": "new update date"
    }
}
```

#### Error Responses

- **400 Bad Request:** If no valid fields are provided or `id` is missing.
- **404 Not Found:** If the user does not exist.

---

### 5. Delete User

**URL:** `/api/users/:id`  
**Method:** `DELETE`  
**Authentication:** Required

#### URL Parameters

- `id`: The user identifier.

#### Success Response

- **Status:** `200 OK`
- **Response Body:**

```json
{
    "success": true,
    "msg": "user deleted",
    "user": {
        "_id": "user_id",
        "username": "string",
        "email": "string",
        "role": "volunteer",
        "location": {
            "type": "Point",
            "coordinates": [longitude, latitude]
        },
        "is_google_login": false,
        "created_at": "date-string",
        "updated_at": "date-string"
    }
}
```

#### Error Responses

- **400 Bad Request:** If the `id` is not provided.
- **404 Not Found:** If the user does not exist.

---

### 6. Get All Users (Admin)

**URL:** `/api/users/`  
**Method:** `GET`  
**Authentication:** Required (admin privileges typically)

#### Success Response

- **Status:** `200 OK`
- **Response Body:**

```json
{
    "msg": "all users fetched",
    "users": [
        {
            "_id": "user_id",
            "username": "string",
            "email": "string",
            "role": "volunteer",
            "location": {
                "type": "Point",
                "coordinates": [longitude, latitude]
            },
            "is_google_login": false,
            "created_at": "date-string",
            "updated_at": "date-string"
        },
        {
            "...": "..."
        }
    ]
}
```

---

### 7. Delete All Users (Admin)

**URL:** `/api/users/`  
**Method:** `DELETE`  
**Authentication:** Required (admin privileges typically)

#### Success Response

- **Status:** `200 OK`
- **Response Body:**

```json
{
    "msg": "all users deleted"
}
```

---

## Error Handling

When an error occurs, the API returns a JSON response with the following structure:

```json
{
    "success": false,
    "msg": "error message"
}
```

The HTTP status codes correspond to the error types. Examples include:

- **400 Bad Request:** Missing or invalid fields.
- **401 Unauthorized:** Invalid or missing token.
- **404 Not Found:** Resource or user not found.
- **409 Conflict:** Duplicate records.

---

This documentation covers all currently implemented user endpoints. For any updates or additional endpoints, follow the same conventions as outlined above.