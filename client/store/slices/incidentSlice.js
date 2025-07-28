// Incident slice logic removed for rebuild.
// TODO: Implement incident slice as per backend and prompt.txt guidelines.

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import extractError from "../../lib/extractError";

function getErrorMsg(err) {
    return extractError(err);
}

// Thunks
const createIncidentThunk = createAsyncThunk(
    "incidents/createIncident",
    async (data, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/incidents", data);
            return res.data.incident;
        } catch (err) {
            console.error("[createIncidentThunk]", extractError(err));
            return rejectWithValue(getErrorMsg(err));
        }
    }
);

const getAllIncidentsThunk = createAsyncThunk(
    "incidents/getAllIncidents",
    async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/incidents", { params: { page, limit } });
            return {
                incidents: res.data.incidents,
                pagination: res.data.pagination || null
            };
        } catch (err) {
            console.error("[getAllIncidentsThunk]", extractError(err));
            return rejectWithValue(getErrorMsg(err));
        }
    }
);

const getIncidentByIdThunk = createAsyncThunk(
    "incidents/getIncidentById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/incidents/${id}`);
            return res.data.incident;
        } catch (err) {
            console.error("[getIncidentByIdThunk]", extractError(err));
            return rejectWithValue(getErrorMsg(err));
        }
    }
);

const updateIncidentThunk = createAsyncThunk(
    "incidents/updateIncident",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.patch(`/incidents/${id}`, data);
            return res.data.incident;
        } catch (err) {
            console.error("[updateIncidentThunk]", extractError(err));
            return rejectWithValue(getErrorMsg(err));
        }
    }
);

const deleteIncidentThunk = createAsyncThunk(
    "incidents/deleteIncident",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.delete(`/incidents/${id}`);
            return res.data;
        } catch (err) {
            console.error("[deleteIncidentThunk]", extractError(err));
            return rejectWithValue(getErrorMsg(err));
        }
    }
);

const assignVolunteerThunk = createAsyncThunk(
    "incidents/assignVolunteer",
    async (incidentId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(`/incidents/${incidentId}/assign`);
            return res.data.incident;
        } catch (err) {
            console.error("[assignVolunteerThunk]", extractError(err));
            return rejectWithValue(getErrorMsg(err));
        }
    }
);

const addVictimReportThunk = createAsyncThunk(
    "incidents/addVictimReport",
    async ({ incidentId, message }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(`/incidents/${incidentId}/reports`, { message });
            return res.data.report;
        } catch (err) {
            console.error("[addVictimReportThunk]", extractError(err));
            return rejectWithValue(getErrorMsg(err));
        }
    }
);

const getIncidentReportsThunk = createAsyncThunk(
    "incidents/getIncidentReports",
    async ({ incidentId, page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/incidents/${incidentId}/reports`, { params: { page, limit } });
            return {
                reports: res.data.reports,
                pagination: res.data.pagination || null
            };
        } catch (err) {
            console.error("[getIncidentReportsThunk]", extractError(err));
            return rejectWithValue(getErrorMsg(err));
        }
    }
);

const updateIncidentStatusThunk = createAsyncThunk(
    "incidents/updateIncidentStatus",
    async ({ incidentId, status }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.patch(`/incidents/${incidentId}/status`, { status });
            return res.data.incident;
        } catch (err) {
            console.error("[updateIncidentStatusThunk]", extractError(err));
            return rejectWithValue(getErrorMsg(err));
        }
    }
);

const fetchVictimIncidentsThunk = createAsyncThunk(
    "incidents/fetchVictimIncidents",
    async ({ userId, page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/users/${userId}/incident-history`, { params: { page, limit } });
            return {
                history: res.data.history,
                pagination: res.data.pagination || null
            };
        } catch (err) {
            console.error("[fetchVictimIncidentsThunk]", extractError(err));
            return rejectWithValue(getErrorMsg(err));
        }
    }
);

const fetchAvailableIncidentsThunk = createAsyncThunk(
    "incidents/fetchAvailableIncidents",
    async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/incidents", { params: { page, limit } });
            const available = Array.isArray(res.data.incidents)
                ? res.data.incidents.filter(
                    inc =>
                        (inc.status === "open" || inc.status === "active")
                )
                : [];
            return {
                incidents: available,
                pagination: res.data.pagination || null
            };
        } catch (err) {
            console.error("[fetchAvailableIncidentsThunk]", extractError(err));
            return rejectWithValue(getErrorMsg(err));
        }
    }
);

const fetchAssignedIncidentThunk = createAsyncThunk(
    "incidents/fetchAssignedIncident",
    async (userId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/users/${userId}/assigned-incident`);
            return res.data.incident;
        } catch (err) {
            console.error("[fetchAssignedIncidentThunk]", extractError(err));
            return rejectWithValue(getErrorMsg(err));
        }
    }
);

const fetchIncidentByIdThunk = createAsyncThunk(
    "incidents/fetchIncidentById",
    async (incidentId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/incidents/${incidentId}`);
            return res.data.incident;
        } catch (err) {
            console.error("[fetchIncidentByIdThunk]", extractError(err));
            return rejectWithValue(getErrorMsg(err));
        }
    }
);

const assignVictimToIncidentThunk = createAsyncThunk(
    "incidents/assignVictimToIncident",
    async ({ incidentId }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(`/incidents/${incidentId}/join`);
            return res.data.incident;
        } catch (err) {
            console.error("[assignVictimToIncidentThunk]", extractError(err));
            return rejectWithValue(getErrorMsg(err));
        }
    }
);

const fetchIncidentChatThunk = createAsyncThunk(
    "incidents/fetchIncidentChat",
    async (incidentId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/chat/incident/${incidentId}`);
            // Expecting res.data.messages or res.data.chatMessages
            return res.data.messages || res.data.chatMessages || [];
        } catch (err) {
            console.error("[fetchIncidentChatThunk]", extractError(err));
            return rejectWithValue(getErrorMsg(err));
        }
    }
);

const fetchIncidentLocationsThunk = createAsyncThunk(
    "incidents/fetchIncidentLocations",
    async (incidentId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/incidents/${incidentId}/locations`);
            // Expecting res.data.locations: [{ userId, location, name, role }]
            return res.data.locations || [];
        } catch (err) {
            console.error("[fetchIncidentLocationsThunk]", extractError(err));
            return rejectWithValue(getErrorMsg(err));
        }
    }
);

const initialState = {
    incidents: [],
    pagination: null,
    incident: null,
    assignedIncident: null,
    victimIncidents: [],
    victimIncidentsPagination: null,
    reports: [],
    reportsPagination: null,
    loading: false,
    error: null,
    success: null,
    chatMessages: [],
    chatLoading: false,
    chatError: null,
    liveLocations: [],
};

const incidentSlice = createSlice({
    name: "incidents",
    initialState,
    reducers: {
        clearIncidentStatus(state) {
            state.error = null;
            state.success = null;
            console.log("[incidentSlice] clearIncidentStatus called");
        },
        resetIncidentState(state) {
            state.incident = null;
            state.assignedIncident = null;
            state.success = null;
            state.error = null;
            state.reports = [];
            console.log("[incidentSlice] resetIncidentState called");
        },
        addSocketChatMessage(state, action) {
            // Only add new chat message to chatMessages array
            if (!state.chatMessages) state.chatMessages = [];
            state.chatMessages.push(action.payload);
            console.log("[incidentSlice] addSocketChatMessage:", action.payload);
        },
        setChatMessages(state, action) {
            state.chatMessages = Array.isArray(action.payload) ? action.payload : [];
            console.log("[incidentSlice] setChatMessages:", action.payload);
        },
        setLiveLocations(state, action) {
            state.liveLocations = action.payload;
        },
        updateLiveLocation(state, action) {
            // Add or update a user's location in liveLocations
            const { userId, location, name, role } = action.payload;
            const others = state.liveLocations.filter(u => u.userId !== userId);
            state.liveLocations = [...others, { userId, location, name, role }];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createIncidentThunk.fulfilled, (state, action) => {
                state.incident = action.payload;
                state.success = "Incident created!";
            })
            .addCase(getAllIncidentsThunk.fulfilled, (state, action) => {
                state.incidents = action.payload.incidents;
                state.pagination = action.payload.pagination;
            })
            .addCase(getIncidentByIdThunk.fulfilled, (state, action) => {
                state.incident = action.payload;
            })
            .addCase(updateIncidentThunk.fulfilled, (state, action) => {
                state.incident = action.payload;
                state.success = "Incident updated!";
            })
            .addCase(deleteIncidentThunk.fulfilled, (state, action) => {
                state.success = "Incident deleted!";
            })
            .addCase(assignVolunteerThunk.fulfilled, (state, action) => {
                state.assignedIncident = action.payload;
                state.success = "Assigned to incident!";
            })
            .addCase(addVictimReportThunk.fulfilled, (state, action) => {
                state.success = "Report added!";
            })
            .addCase(getIncidentReportsThunk.fulfilled, (state, action) => {
                state.reports = action.payload.reports;
                state.reportsPagination = action.payload.pagination;
            })
            .addCase(updateIncidentStatusThunk.fulfilled, (state, action) => {
                state.incident = action.payload;
                state.success = "Incident status updated!";
                // If resolved, clear assignedIncident and incident
                if (action.payload.status === "resolved") {
                    state.assignedIncident = null;
                    state.incident = null;
                }
            })
            .addCase(fetchVictimIncidentsThunk.fulfilled, (state, action) => {
                state.victimIncidents = action.payload.history;
                state.victimIncidentsPagination = action.payload.pagination;
            })
            .addCase(fetchAvailableIncidentsThunk.fulfilled, (state, action) => {
                state.incidents = action.payload.incidents;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchAssignedIncidentThunk.fulfilled, (state, action) => {
                state.assignedIncident = action.payload;
            })
            .addCase(fetchIncidentByIdThunk.fulfilled, (state, action) => {
                state.incident = action.payload;
            })
            .addCase(assignVictimToIncidentThunk.fulfilled, (state, action) => {
                state.incident = action.payload;
                state.success = "Joined incident!";
            })
            .addCase(fetchIncidentChatThunk.pending, (state) => {
                state.chatLoading = true;
                state.chatError = null;
                console.log("[incidentSlice] fetchIncidentChatThunk.pending");
            })
            .addCase(fetchIncidentChatThunk.fulfilled, (state, action) => {
                state.chatLoading = false;
                state.chatMessages = action.payload;
                console.log("[incidentSlice] fetchIncidentChatThunk.fulfilled:", action.payload);
            })
            .addCase(fetchIncidentChatThunk.rejected, (state, action) => {
                state.chatLoading = false;
                state.chatError = action.payload || "Failed to fetch chat messages";
                console.error("[incidentSlice] fetchIncidentChatThunk.rejected:", action.payload);
            })
            .addCase(fetchIncidentLocationsThunk.fulfilled, (state, action) => {
                state.liveLocations = action.payload;
            })
            // Handle loading and error for all thunks
            .addMatcher(
                action => action.type.startsWith("incidents/") && action.type.endsWith("/pending"),
                (state) => { state.loading = true; state.error = null; state.success = null; }
            )
            .addMatcher(
                action => action.type.startsWith("incidents/") && action.type.endsWith("/rejected"),
                (state, action) => { state.loading = false; state.error = action.payload || "Error"; }
            )
            .addMatcher(
                action => action.type.startsWith("incidents/") && action.type.endsWith("/fulfilled"),
                (state) => { state.loading = false; }
            );
    },
});

export const { clearIncidentStatus, resetIncidentState, addSocketChatMessage, setChatMessages, setLiveLocations, updateLiveLocation } = incidentSlice.actions;
export default incidentSlice.reducer;
export {
    createIncidentThunk,
    getAllIncidentsThunk,
    getIncidentByIdThunk,
    updateIncidentThunk,
    deleteIncidentThunk,
    assignVolunteerThunk,
    addVictimReportThunk,
    getIncidentReportsThunk,
    updateIncidentStatusThunk,
    fetchVictimIncidentsThunk,
    fetchAvailableIncidentsThunk,
    fetchAssignedIncidentThunk,
    fetchIncidentByIdThunk,
    assignVictimToIncidentThunk,
    fetchIncidentChatThunk,
    fetchIncidentLocationsThunk,
};