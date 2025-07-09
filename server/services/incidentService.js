const mongoose = require('mongoose');
const Incident = require('../models/Incident');
const Volunteer = require('../models/Volunteer');
const { CustomError } = require('../errorHandler/errorHandler');

// Create a new incident
const createIncident = async (data) => {
    const incident = new Incident(data);
    await incident.save();
    return incident;
};

// Get all incidents
const getAllIncidents = async () => {
    return await Incident.find();
};

// Report a new incident (victim)
const reportIncident = async (incidentData, user) => {
    const incident = new Incident({
        ...incidentData,
        victims: [user._id]
    });
    await incident.save();
    return incident;
};

// Get nearby incidents by user location
const getNearbyIncidents = async (currentLocation) => {
    if (!currentLocation || !currentLocation.coordinates) {
        throw new CustomError('User location not provided', 400);
    }
    return await Incident.find({
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: currentLocation.coordinates
                },
                $maxDistance: 10000 // 10km, adjust as needed
            }
        }
    });
};

// Update incident status
const updateIncidentStatus = async (incidentId, status, user) => {
    const incident = await Incident.findById(incidentId);
    if (!incident) throw new CustomError('Incident not found', 404);
    incident.status = status;
    await incident.save();
    return incident;
};

// Add a victim report to an incident
const addVictimReport = async (incidentId, reportData, user) => {
    const incident = await Incident.findById(incidentId);
    if (!incident) throw new CustomError('Incident not found', 404);
    incident.reports.push({
        user: user._id,
        message: reportData.message,
        createdAt: new Date()
    });
    await incident.save();
    return incident.reports[incident.reports.length - 1];
};

// Send a gathering invitation (stub, expand as needed)
const sendGatheringInvitation = async (incidentId, invitationData, user) => {
    // This is a stub for demonstration; implement as needed
    return { incidentId, invitation: invitationData, sentBy: user._id };
};

// List volunteers for a given incident
const listVolunteersForIncident = async (incidentId) => {
    const incident = await Incident.findById(incidentId).populate('volunteers');
    if (!incident) throw new CustomError('Incident not found', 404);

    // Find Volunteer docs for each user in incident.volunteers
    const volunteers = await Volunteer.find({ user: { $in: incident.volunteers } })
        .populate('user', 'username email role')
        .select('user currentLocation status skills');

    return volunteers;
};

function toObjectId(id) {
    if (id instanceof mongoose.Types.ObjectId) return id;
    if (typeof id === 'string' && mongoose.Types.ObjectId.isValid(id)) {
        return new mongoose.Types.ObjectId(id);
    }
    throw new CustomError('Invalid ObjectId', 400);
}

// Assign a volunteer to an incident
const assignVolunteerToIncident = async (incidentId, userId) => {
    const objectId = toObjectId(incidentId);
    return await require('./volunteerService').assignToIncident(userId, objectId);
};

// Accept a report for an incident
const acceptReport = async (incidentId, reportIndex, volunteerId) => {
    const objectId = toObjectId(incidentId);
    const incident = await Incident.findById(objectId);
    if (!incident) throw new CustomError('Incident not found', 404);
    const report = incident.reports[reportIndex];
    if (!report) throw new CustomError('Report not found', 404);

    if (!report.assignedVolunteers) report.assignedVolunteers = [];
    if (!report.assignedVolunteers.includes(volunteerId)) {
        report.assignedVolunteers.push(volunteerId);
        await incident.save();
    }
    return report;
};

const getIncidentById = async (incidentId) => {
    const objectId = toObjectId(incidentId);
    return await Incident.findById(objectId);
};

const updateIncident = async (incidentId, updateData) => {
    const objectId = toObjectId(incidentId);
    const incident = await Incident.findByIdAndUpdate(objectId, updateData, { new: true });
    if (!incident) throw new CustomError('Incident not found', 404);
    return incident;
};

const deleteIncident = async (incidentId) => {
    const objectId = toObjectId(incidentId);
    const incident = await Incident.findByIdAndDelete(objectId);
    if (!incident) throw new CustomError('Incident not found', 404);
    return incident;
};

module.exports = {
    createIncident,
    getAllIncidents,
    reportIncident,
    getNearbyIncidents,
    updateIncidentStatus,
    addVictimReport,
    sendGatheringInvitation,
    listVolunteersForIncident,
    assignVolunteerToIncident,
    acceptReport,
    getIncidentById,
    updateIncident,
    deleteIncident,
};
