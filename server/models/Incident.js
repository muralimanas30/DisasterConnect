const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true }
    },
    victims: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    reports: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        message: String,
        createdAt: { type: Date, default: Date.now },
        assignedVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    }],
    resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
    createdAt: { type: Date, default: Date.now }
});

incidentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Incident', incidentSchema);

// When a victim reports a disaster (incident):
// 1. A new Incident document is created in the 'incidents' collection.
// 2. The reporting user's ObjectId is added to the 'victims' array of the incident.
// 3. The incident's 'status' is set to 'open' (default).
// 4. The incident's 'location', 'title', 'description', and other fields are set from the report.
// 5. The 'createdAt' timestamp is set automatically.
// 6. Optionally, an initial report (message) may be added to the 'reports' array with the reporting user as author.

// Explanation of Incident vs Report and Assignment Hierarchy:

// - An "Incident" is a disaster event (e.g., flood, fire) reported by a victim or user.
//   - It has fields like title, description, status, location, victims, volunteers, resources, etc.
//   - Each incident can have multiple victims and multiple volunteers assigned.

// - A "Report" is a message or update related to an incident, usually submitted by a victim (or sometimes a volunteer).
//   - Reports are stored in the 'reports' array inside the Incident document.
//   - Each report has a user (author), message, timestamp, and an array of assignedVolunteers.

// Assignment/Hierarchy:
// - When an incident is created, it starts with at least one victim (the reporter).
// - Volunteers can view incidents and choose to assign themselves to one unresolved incident at a time.
// - Once assigned, a volunteer can see all reports for that incident.
// - Volunteers can "accept" (assign themselves to) specific reports within the incident, indicating they are handling that particular victim's request/message.
// - Multiple volunteers can be assigned to the same incident, but each volunteer can only be assigned to one unresolved incident at a time (enforced in service).
// - Each report can have multiple volunteers assigned (assignedVolunteers array), or none.

// In summary:
// - Incident = the overall disaster event (with victims, volunteers, reports, etc.)
// - Report = a specific message/request within an incident, usually from a victim
// - Assignment = volunteers are assigned to incidents, and can further accept/assign themselves to individual reports within that incident
