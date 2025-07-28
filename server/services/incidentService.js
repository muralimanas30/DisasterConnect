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
const getAllIncidents = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [incidents, totalItems] = await Promise.all([
        Incident.find()
            .skip(skip)
            .limit(limit)
            .populate('victims')
            .populate('volunteers'),
        Incident.countDocuments()
    ]);
    return {
        incidents,
        pagination: {
            page,
            limit,
            totalPages: Math.ceil(totalItems / limit),
            totalItems
        }
    };
};

// Report a new incident (victim)
const reportIncident = async (incidentData, user) => {
    // Prevent victim from reporting if assignedIncident is active
    if (user.role === 'victim' && user.assignedIncident) {
        const activeIncident = await Incident.findOne({
            _id: user.assignedIncident,
            status: { $ne: 'resolved' }
        });
        if (activeIncident) {
            throw new CustomError('You cannot report a new incident while assigned to an active incident.', 400);
        }
    }
    const incident = new Incident({
        ...incidentData,
        victims: [user._id]
    });
    await incident.save();
    // Set assignedIncident for reporting user
    user.assignedIncident = incident._id;
    await user.save();
    // Return populated incident
    return await Incident.findById(incident._id)
        .populate('victims')
        .populate('volunteers');
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

// Assign a volunteer to an incident
const assignVolunteerToIncident = async (incidentId, userId) => {
    const objectId = toObjectId(incidentId);
    await require('./volunteerService').assignToIncident(userId, objectId);
    // Set assignedIncident for volunteer
    const user = await require('../models/User').findById(userId);
    if (user) {
        user.assignedIncident = objectId;
        await user.save();
    }
    // Return populated incident
    return await Incident.findById(objectId)
        .populate('victims')
        .populate('volunteers');
};

// Update incident status
const updateIncidentStatus = async (incidentId, status, user) => {
    const incident = await Incident.findById(incidentId);
    if (!incident) throw new CustomError('Incident not found', 404);

    const User = require('../models/User');

    // Remove user from victims or volunteers if they resolve
    if (status === 'resolved') {
        let changed = false;
        if (user.role === 'victim') {
            const before = incident.victims.length;
            incident.victims = incident.victims.filter(
                v => v.toString() !== user._id.toString()
            );
            if (incident.victims.length < before) changed = true;
        }
        if (user.role === 'volunteer') {
            const before = incident.volunteers.length;
            incident.volunteers = incident.volunteers.filter(
                v => v.toString() !== user._id.toString()
            );
            if (incident.volunteers.length < before) changed = true;
        }
        // Remove assignedIncident from user if changed
        if (changed) {
            await User.findByIdAndUpdate(user._id, { assignedIncident: null });
        }
    }

    // If all victims and volunteers are resolved (arrays empty), mark incident as resolved
    if (incident.victims.length === 0 && incident.volunteers.length === 0) {
        incident.status = 'resolved';
        await require('./userService').clearAssignedIncidentForUsers(incident);
    } else if (status !== 'resolved') {
        incident.status = status;
    }

    await incident.save();
    // Return populated incident
    return await Incident.findById(incidentId)
        .populate('victims')
        .populate('volunteers');
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
    return await Incident.findById(incidentId)
        .populate("victims", "name currentLocation")
        .populate("volunteers", "name currentLocation");
};

const updateIncident = async (incidentId, updateData) => {
    const objectId = toObjectId(incidentId);
    const incident = await Incident.findByIdAndUpdate(objectId, updateData, { new: true });
    if (!incident) throw new CustomError('Incident not found', 404);
    // Return populated incident
    return await Incident.findById(objectId)
        .populate('victims')
        .populate('volunteers');
};

const deleteIncident = async (incidentId) => {
    const objectId = toObjectId(incidentId);
    const incident = await Incident.findByIdAndDelete(objectId);
    if (!incident) throw new CustomError('Incident not found', 404);
    return incident;
};

// Get available incidents for a volunteer (not assigned and not resolved)
const getAvailableIncidentsForVolunteer = async (userId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const query = {
        status: { $ne: 'resolved' },
        volunteers: { $ne: userId }
    };
    const [incidents, totalItems] = await Promise.all([
        Incident.find(query)
            .skip(skip)
            .limit(limit)
            .populate('victims')
            .populate('volunteers'),
        Incident.countDocuments(query)
    ]);
    return {
        incidents,
        pagination: {
            page,
            limit,
            totalPages: Math.ceil(totalItems / limit),
            totalItems
        }
    };
};

// Add a victim to an incident
const addVictimToIncident = async (incidentId, userId) => {
    const incident = await Incident.findById(incidentId);
    if (!incident) throw new CustomError('Incident not found', 404);

    // Ensure user exists
    const User = require('../models/User');
    const user = await User.findById(userId);
    if (!user) throw new CustomError('User not found', 404);

    // Add victim if not already present
    if (!incident.victims.map(v => v.toString()).includes(userId.toString())) {
        incident.victims.push(userId);
        await incident.save();
        // Optionally, update user's assignedIncident if you want to track this
        user.assignedIncident = incident._id;
        await user.save();
    }
    // Return populated incident
    return await Incident.findById(incidentId)
        .populate('victims')
        .populate('volunteers');
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
    getAvailableIncidentsForVolunteer,
    addVictimToIncident,
};
