const incidentService = require('../services/incidentService');
const { CustomError } = require('../errorHandler/errorHandler');
const { StatusCodes } = require('http-status-codes');
const Volunteer = require('../models/Volunteer');

// Create a new incident
const createIncident = async (req, res, next) => {
    try {
        const incident = await incidentService.createIncident(req.body);
        res.status(StatusCodes.CREATED).json({ status: 'success', incident });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to create incident.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

// Get all incidents
const getIncidents = async (req, res, next) => {
    try {
        const incidents = await incidentService.getAllIncidents();
        res.status(StatusCodes.OK).json({ status: 'success', incidents });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to fetch incidents.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

// Report a new incident (for victims)
const reportIncident = async (req, res, next) => {
    try {
        const incident = await incidentService.reportIncident(req.body, req.user);
        res.status(StatusCodes.CREATED).json({ status: 'success', incident });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to report incident.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

// Get nearby incidents for a user (by location)
const getNearbyIncidents = async (req, res, next) => {
    try {
        const incidents = await incidentService.getNearbyIncidents(req.user.location);
        res.status(StatusCodes.OK).json({ status: 'success', incidents });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to fetch nearby incidents.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

// Update incident status
const updateIncidentStatus = async (req, res, next) => {
    try {
        const updated = await incidentService.updateIncidentStatus(req.params.incidentId, req.body.status, req.user);
        res.status(StatusCodes.OK).json({ status: 'success', incident: updated });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to update incident status.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

// Add a victim report to an incident
const addVictimReport = async (req, res, next) => {
    try {
        const report = await incidentService.addVictimReport(req.params.incidentId, req.body, req.user);
        res.status(StatusCodes.OK).json({ status: 'success', report });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to add victim report.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

// Send a gathering invitation for an incident
const sendGatheringInvitation = async (req, res, next) => {
    try {
        const invitation = await incidentService.sendGatheringInvitation(req.params.incidentId, req.body, req.user);
        res.status(StatusCodes.CREATED).json({ status: 'success', invitation });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to send gathering invitation.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

// Fetch volunteers' live locations for a given incident
const listVolunteersForIncident = async (req, res, next) => {
    try {
        const volunteers = await incidentService.listVolunteersForIncident(req.params.incidentId);
        res.status(StatusCodes.OK).json({ status: 'success', volunteers });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to fetch volunteers for incident.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

// Assign a volunteer to an incident
const assignVolunteerToIncident = async (req, res, next) => {
    try {
        const incident = await incidentService.assignVolunteerToIncident(
            req.params.incidentId,
            req.body.volunteerId // expects { volunteerId: ... }
        );
        res.status(StatusCodes.OK).json({ status: 'success', incident });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to assign volunteer.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

// Accept a report for an incident
const acceptReport = async (req, res, next) => {
    try {
        const { incidentId, reportIndex } = req.params;
        const volunteerId = req.user._id;
        const updatedReport = await incidentService.acceptReport(incidentId, reportIndex, volunteerId);
        res.status(StatusCodes.OK).json({ status: 'success', report: updatedReport });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to accept report.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

// Get incident by ID
const getIncidentById = async (req, res, next) => {
    try {
        const incident = await incidentService.getIncidentById(req.params.incidentId);
        if (!incident) {
            throw new CustomError('Incident not found', 404);
        }
        res.status(StatusCodes.OK).json({ status: 'success', incident });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to get incident details.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

// Update an incident
const updateIncident = async (req, res, next) => {
    try {
        const incident = await incidentService.updateIncident(req.params.incidentId, req.body);
        res.status(StatusCodes.OK).json({ status: 'success', incident });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to update incident.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

// Delete an incident
const deleteIncident = async (req, res, next) => {
    try {
        await incidentService.deleteIncident(req.params.incidentId);
        res.status(StatusCodes.OK).json({ status: 'success', message: 'Incident deleted' });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to delete incident.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

// List victims for an incident
const listVictimsForIncident = async (req, res, next) => {
    try {
        const incident = await incidentService.getIncidentById(req.params.incidentId);
        if (!incident) {
            throw new CustomError('Incident not found', 404);
        }
        res.status(StatusCodes.OK).json({ status: 'success', victims: incident.victims });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to list victims for incident.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

module.exports = {
    createIncident,
    getIncidents,
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
    listVictimsForIncident,
    // ...add more exports as needed
};
