const Volunteer = require('../models/Volunteer');
const Incident = require('../models/Incident');
const { CustomError } = require('../errorHandler/errorHandler');

// Get all volunteers
const getVolunteers = async (query) => {
    return await Volunteer.find(query).populate('user');
};

// Assign volunteer to an incident
const assignVolunteer = async (incidentId, volunteerId) => {
    const volunteer = await Volunteer.findById(volunteerId);
    if (!volunteer) throw new CustomError('Volunteer not found', 404);
    const incident = await Incident.findById(incidentId);
    if (!incident) throw new CustomError('Incident not found', 404);

    if (!volunteer.assignedIncidents.includes(incidentId)) {
        volunteer.assignedIncidents.push(incidentId);
        volunteer.status = 'assigned';
        await volunteer.save();
    }
    if (!incident.volunteers.includes(volunteer.user)) {
        incident.volunteers.push(volunteer.user);
        await incident.save();
    }
    return { volunteer, incident };
};

// Update volunteer's live location
const updateVolunteerLocation = async (volunteerId, location) => {
    const volunteer = await Volunteer.findById(volunteerId);
    if (!volunteer) throw new CustomError('Volunteer not found', 404);
    volunteer.currentLocation = location;
    await volunteer.save();
    return volunteer;
};

// Mark volunteer as reached at incident
const markVolunteerReached = async (incidentId, volunteerId) => {
    const volunteer = await Volunteer.findById(volunteerId);
    if (!volunteer) throw new CustomError('Volunteer not found', 404);
    // You can add more logic here, e.g., update status, log time, etc.
    volunteer.status = 'busy';
    await volunteer.save();
    return { volunteer, incidentId };
};

// Get assigned incidents for a volunteer
const getAssignedIncidents = async (volunteerId) => {
    const volunteer = await Volunteer.findById(volunteerId).populate('assignedIncidents');
    if (!volunteer) throw new CustomError('Volunteer not found', 404);
    return volunteer.assignedIncidents;
};

const getVolunteerByUserId = async (userId) => {
    const volunteer = await Volunteer.findOne({ user: userId }).populate('user');
    if (!volunteer) throw new CustomError('Volunteer not found', 404);
    return volunteer;
};

const updateVolunteerProfile = async (userId, updateData) => {
    const volunteer = await Volunteer.findOneAndUpdate({ user: userId }, updateData, { new: true });
    if (!volunteer) throw new CustomError('Volunteer not found', 404);
    return volunteer;
};

module.exports = {
    getVolunteers,
    assignVolunteer,
    updateVolunteerLocation,
    markVolunteerReached,
    getAssignedIncidents,
    getVolunteerByUserId,
    updateVolunteerProfile,
};
