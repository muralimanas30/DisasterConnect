# DRCP Chat Module – Flows & Use Cases

## 1. **Purpose**
- Enables real-time and historical communication between victims, volunteers, and (optionally) admins for each incident.
- Supports coordination, status updates, and help requests within the context of a specific disaster event.

---

## 2. **Core Flows**

### A. **Sending a Chat Message**
- **Endpoint:** `POST /api/chat/incident/:incidentId/message`
- **Who:** Any authenticated user (victim, volunteer, admin) assigned to the incident.
- **How:** User sends a message (text) to the incident chat.
- **What happens:**
  1. Message is saved in the `Chat` collection with sender, incident, and timestamp.
  2. Message is available for all other users in the same incident.

---

### B. **Fetching Chat History**
- **Endpoint:** `GET /api/chat/incident/:incidentId`
- **Who:** Any authenticated user assigned to the incident.
- **How:** User fetches all messages for an incident.
- **What happens:**
  1. All messages for the incident are returned, sorted by time.
  2. Each message includes sender info (name, email, role).

---

### C. **Real-Time Messaging (Socket.io, future)**
- **Who:** All users in the incident room.
- **How:** When a message is sent, it is broadcast in real-time to all connected clients in the incident's chat room.
- **What happens:**
  1. User sends message via WebSocket.
  2. Server saves message and emits it to all clients in the room.
  3. All users see the new message instantly.

---

## 3. **Use Cases**

- **Victim requests help:** Victim posts a message describing their situation.
- **Volunteer coordinates:** Volunteer updates status, asks for more info, or confirms help is on the way.
- **Group coordination:** Multiple volunteers and victims discuss logistics, needs, or updates.
- **Admin monitoring:** Admin can monitor or participate in chats for oversight.

---

## 4. **Security & Access**
- Only authenticated users can send/read messages.
- Users can only access chats for incidents they are assigned to (enforced via middleware or service logic).

---

## 5. **Data Model**
- Each chat message links to:
  - `incident` (Incident ObjectId)
  - `sender` (User ObjectId)
  - `message` (text)
  - `sentAt` (timestamp)

---

## 6. **Testing**
- Tests cover:
  - Sending a message (success, unauthorized)
  - Fetching chat history (success, unauthorized)
  - Edge cases (invalid incident, empty message, etc.)

---

## 7. **Extensibility**
- Can add attachments, message types, or reactions.
- Can integrate with notifications or escalation workflows.
- Ready for real-time (Socket.io) integration.

---

**Summary:**  
The chat module enables secure, incident-centric communication for all stakeholders, supporting both REST and real-time flows for disaster coordination.
