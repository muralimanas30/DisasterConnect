import axiosInstance from "./axiosInstance";

// Create Incident
// Get All Incidents
export async function getAllIncidents({ page = 1, limit = 10 } = {}) {
    const res = await axiosInstance.get("/incidents", { params: { page, limit } });
    return {
        incidents: res.data.incidents,
        pagination: res.data.pagination || null
    };
}

// Get Incident by ID
export async function getIncidentById(id) {
    const res = await axiosInstance.get(`/incidents/${id}`);
    return res.data.incident;
}

// Update Incident
export async function updateIncident(id, data) {
    const res = await axiosInstance.patch(`/incidents/${id}`, data);
    return res.data.incident;
}

// Delete Incident
export async function deleteIncident(id) {
    const res = await axiosInstance.delete(`/incidents/${id}`);
    return res.data;
}

// Assign Volunteer to Incident
export async function assignVolunteer(incidentId) {
    const res = await axiosInstance.post(`/incidents/${incidentId}/assign`);
    return res.data.incident;
}

// Get All Reports for Incident (with pagination)
export async function getIncidentReports(incidentId, { page = 1, limit = 10 } = {}) {
    const res = await axiosInstance.get(`/incidents/${incidentId}/reports`, { params: { page, limit } });
    return {
        reports: res.data.reports,
        pagination: res.data.pagination || null
    };
}

// Update Incident Status
export async function updateIncidentStatus(incidentId, status) {
    const res = await axiosInstance.patch(`/incidents/${incidentId}/status`, { status });
    return res.data.incident;
}

// Get Incident History for User (with pagination)
export async function getIncidentHistory(userId, { page = 1, limit = 10 } = {}) {
    const url = userId ? `/users/${userId}/incident-history` : `/users/incident-history`;
    const res = await axiosInstance.get(url, { params: { page, limit } });
    return {
        history: res.data.history,
        pagination: res.data.pagination || null
    };
}

// Get Assigned Incident for User
export async function getAssignedIncident(userId) {
    const res = await axiosInstance.get(`/users/${userId}/assigned-incident`);
    return res.data.incident;
}

// Fetch incidents by type
export function fetchIncidents(type) {
    // Volunteers should use "all" to get all incidents, then filter in frontend if needed
    if (type === "all" || type === "volunteer" || type === "victim") {
        return axiosInstance.get("/incidents").then(r => r.data.incidents);
    }
    if (type === "nearby") {
        return axiosInstance.get("/incidents/nearby").then(r => r.data.incidents);
    }
    // Add more types as needed, but do not use /incidents/available
    return [];
}

// Fetch single incident by id (must be valid ObjectId)
export function fetchIncidentById(incidentId) {
    if (!incidentId || typeof incidentId !== "string" || incidentId.length !== 24) {
        throw new Error("Invalid incidentId");
    }
    return axiosInstance.get(`/incidents/${incidentId}`).then(r => r.data.incident);
}

// Assign to incident (volunteer) - incidentId must be valid
export function assignToIncident(incidentId) {
    if (!incidentId || typeof incidentId !== "string" || incidentId.length !== 24) {
        throw new Error("Invalid incidentId");
    }
    // Use the backend's assign route: POST /incidents/:incidentId/assign
    return axiosInstance.post(`/incidents/${incidentId}/assign`).then(r => r.data);
}

// Add this function if missing
export function addVictimReport(incidentId, message) {
    if (!incidentId || typeof incidentId !== "string" || incidentId.length !== 24) {
        throw new Error("Invalid incidentId");
    }
    return axiosInstance.post(`/incidents/${incidentId}/reports`, { message }).then(r => r.data.report);
}

// Get all reports/messages for an incident
export function getReportsForIncident(incidentId) {
    if (!incidentId || typeof incidentId !== "string" || incidentId.length !== 24) {
        throw new Error("Invalid incidentId");
    }
    return axiosInstance.get(`/incidents/${incidentId}/reports`).then(r => r.data.reports);
}

// Fetch assigned incident for current user (volunteer or victim)
export function fetchAssignedIncidentForUser(userId) {
    if (!userId || typeof userId !== "string" || userId.length !== 24) {
        throw new Error("Invalid userId");
    }
    return axiosInstance
        .get(`/users/${userId}/assigned-incident`)
        .then((r) => r.data.incident);
}

// Fetch victims for an incident (with pagination)
export async function fetchVictimsForIncident(incidentId, { page = 1, limit = 10 } = {}) {
    const res = await axiosInstance.get(`/incidents/${incidentId}/victims`, { params: { page, limit } });
    return {
        victims: res.data.victims,
        pagination: res.data.pagination || null
    };
}

// Fetch volunteers for an incident (with pagination)
export async function fetchVolunteersForIncident(incidentId, { page = 1, limit = 10 } = {}) {
    const res = await axiosInstance.get(`/incidents/${incidentId}/volunteers`, { params: { page, limit } });
    return {
        volunteers: res.data.volunteers,
        pagination: res.data.pagination || null
    };
}

// Add victim to incident (POST /api/incidents/:incidentId/add-victim)
export async function addVictimToIncident(incidentId, userId) {
    if (!incidentId || typeof incidentId !== "string" || incidentId.length !== 24) {
        throw new Error("Invalid incidentId");
    }
    if (!userId || typeof userId !== "string" || userId.length !== 24) {
        throw new Error("Invalid userId");
    }
    const res = await axiosInstance.post(`/incidents/${incidentId}/add-victim`, { userId });
    if (res.data.status !== "success") {
        throw new Error(res.data.error || "Failed to join incident");
    }
    return res.data.incident;
}
