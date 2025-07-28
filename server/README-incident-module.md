# DRCP Incident Module – API Reference & Sample Payloads

## Overview

The Incident module enables users (victims, volunteers, admins) to report, view, update, and manage disaster incidents. It supports assignment, status updates, reporting, and history tracking.

---

## Endpoints & Sample Inputs/Outputs

### 1. Create Incident

**POST `/api/incidents`**

**Input:**
```json
{
  "title": "Flood in Area",
  "description": "Severe flooding reported",
  "location": { "type": "Point", "coordinates": [77, 12] }
}
```

**Output:**
```json
{
  "status": "success",
  "incident": {
    "_id": "incidentId123",
    "title": "Flood in Area",
    "description": "Severe flooding reported",
    "status": "open",
    "location": { "type": "Point", "coordinates": [77, 12] },
    "victims": [
      { "_id": "userId123", "name": "Alice", "email": "alice@example.com", ... }
    ],
    "volunteers": [],
    "reports": [ /* ... */ ],
    "resources": [],
    "createdAt": "2025-07-14T17:05:40.386Z"
  }
}
```

---

### 2. Get All Incidents

**GET `/api/incidents`**

**Output:**
```json
{
  "status": "success",
  "incidents": [
    {
      "_id": "incidentId123",
      "title": "Flood in Area",
      "description": "Severe flooding reported",
      "status": "open",
      "location": { "type": "Point", "coordinates": [77, 12] },
      "victims": [
        { "_id": "userId123", "name": "Alice", "email": "alice@example.com", ... }
      ],
      "volunteers": [
        { "_id": "volunteerId456", "name": "Bob", "email": "bob@example.com", ... }
      ],
      "reports": [ /* ... */ ],
      "resources": [],
      "createdAt": "2025-07-14T17:05:40.386Z"
    }
  ]
}
```

---

### 3. Get Incident by ID

**GET `/api/incidents/:incidentId`**

**Output:**
```json
{
  "status": "success",
  "incident": {
    "_id": "incidentId123",
    "title": "Flood in Area",
    "description": "Severe flooding reported",
    "status": "open",
    "location": { "type": "Point", "coordinates": [77, 12] },
    "victims": [ { "_id": "userId123", "name": "Alice", ... } ],
    "volunteers": [ { "_id": "volunteerId456", "name": "Bob", ... } ],
    "reports": [ /* ... */ ],
    "resources": [],
    "createdAt": "2025-07-14T17:05:40.386Z"
  }
}
```

---

### 4. Update Incident

**PATCH `/api/incidents/:incidentId`**

**Input:**
```json
{ "description": "Updated description" }
```

**Output:**
```json
{
  "status": "success",
  "incident": { /* updated incident object, with populated victims/volunteers */ }
}
```

---

### 5. Delete Incident

**DELETE `/api/incidents/:incidentId`**

**Output:**
```json
{
  "status": "success",
  "message": "Incident deleted"
}
```

---

### 6. Assign Volunteer to Incident

**POST `/api/incidents/:incidentId/assign`**

**Input:**
```json
{}
```
*(No body required, assignment is based on authenticated user)*

**Output:**
```json
{
  "status": "success",
  "incident": { /* incident object after assignment, with populated victims/volunteers */ }
}
```

---

### 7. Add Victim Report to Incident

**POST `/api/incidents/:incidentId/reports`**

**Input:**
```json
{ "message": "Need urgent help!" }
```

**Output:**
```json
{
  "status": "success",
  "report": { /* report object */ }
}
```

---

### 8. Get All Reports for Incident

**GET `/api/incidents/:incidentId/reports`**

**Output:**
```json
{
  "status": "success",
  "reports": [ /* array of report objects */ ]
}
```

---

### 9. Update Incident Status

**PATCH `/api/incidents/:incidentId/status`**

**Input:**
```json
{ "status": "resolved" }
```

**Output:**
```json
{
  "status": "success",
  "incident": { /* incident object with updated status, populated victims/volunteers */ }
}
```
**Special logic:**  
- If a victim sends this request, they are removed from the incident's victims array and their assignment is cleared.
- If all victims are removed, the incident is marked as resolved and all assignments are cleared.

---

### 10. Get Incident History for User

**GET `/api/users/incident-history`**  
*(Authenticated user only)*

**Output:**
```json
{
  "status": "success",
  "history": [ /* array of incident objects, with populated victims/volunteers */ ]
}
```

**GET `/api/users/:userId/incident-history`**  
*(Admin or self only)*

**Output:**
```json
{
  "status": "success",
  "history": [ /* array of incident objects, with populated victims/volunteers */ ]
}
```

---

### 11. Get Assigned Incident for User

**GET `/api/users/:userId/assigned-incident`**

**Output (assigned):**
```json
{
  "incident": { /* full incident object, with populated victims/volunteers */ }
}
```

**Output (not assigned):**
```json
{
  "incident": null
}
```

---

### 12. Add Victim to Incident

**POST `/api/incidents/:incidentId/add-victim`**

**Input:**
```json
{ "userId": "victimUserId123" }
```

**Output (success):**
```json
{
  "status": "success",
  "incident": { /* updated incident object with new victim, populated victims/volunteers */ }
}
```

**Output (error - incident not found):**
```json
{
  "status": "error",
  "error": "Incident not found"
}
```

**Output (error - user not found):**
```json
{
  "status": "error",
  "error": "User not found"
}
```

---

## Pagination

All list endpoints support pagination via `page` and `limit` query parameters.

**Example request:**  
`GET /api/incidents?page=2&limit=5`

**Example output:**
```json
{
  "status": "success",
  "incidents": [ /* array of incident objects */ ],
  "pagination": {
    "page": 2,
    "limit": 5,
    "totalPages": 4,
    "totalItems": 20
  }
}
```

**Endpoints supporting pagination:**
- GET `/api/incidents`
- GET `/api/users`
- GET `/api/users/incident-history`
- GET `/api/users/:userId/incident-history`
- GET `/api/incidents/:incidentId/reports` (if you add pagination there)
- GET `/api/incidents/:incidentId/victims` (if you add pagination there)
- GET `/api/incidents/:incidentId/volunteers` (if you add pagination there)

---

## Notes

- All endpoints require JWT authentication except registration/login.
- All responses are JSON.
- Error responses use `{ "error": "..." }` and appropriate HTTP status codes.
- All IDs are MongoDB ObjectIds as strings.
- All incident objects returned have victims and volunteers populated as full user objects.

---

## Usage Summary

- Victims report incidents and add reports.
- Volunteers assign themselves to incidents and accept reports.
- Admins can view, update, and delete incidents.
- All users can view their incident history and assigned incident.
- **Admins (or authorized users) can add additional victims to an incident using `/api/incidents/:incidentId/add-victim`.**
- **When a victim resolves, they are removed from the incident. When all victims are resolved, the incident is marked as resolved.**

---
