const incidentService = require('../services/incidentService');
const { CustomError } = require('../errorHandler/errorHandler');
const { StatusCodes } = require('http-status-codes');
const Volunteer = require('../models/Volunteer');

// Create a new incident
const createIncident = async (req, res, next) => {
    try {
        console.log(`[INCIDENT] Create endpoint hit by user: ${req.user._id} with data: ${JSON.stringify(req.body)}`);
        // Create the incident with the reporting user as the first victim
        const incidentData = {
            ...req.body,
            victims: [req.user._id],
        };

        // Always add an initial report using the description/message and reporting user
        incidentData.reports = [{
            user: req.user._id,
            message: req.body.description || 'Initial report',
            createdAt: new Date(),
            assignedVolunteers: []
        }];

        const incident = await incidentService.createIncident(incidentData);
        console.log(`[INCIDENT] Incident created with id: ${incident._id}`);
        res.status(StatusCodes.CREATED).json({ status: 'success', incident });
    } catch (error) {
        console.log(`[INCIDENT] Create failed: ${error.message}`);
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        let result;
        if (req.user.role === 'volunteer') {
            result = await require('../services/incidentService').getAvailableIncidentsForVolunteer(req.user._id, page, limit);
        } else {
            result = await incidentService.getAllIncidents(page, limit);
        }
        res.status(StatusCodes.OK).json({
            status: 'success',
            incidents: result.incidents,
            pagination: result.pagination
        });
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        // You may need to update the service to support pagination for volunteers
        const volunteers = await incidentService.listVolunteersForIncident(req.params.incidentId, page, limit);
        res.status(StatusCodes.OK).json({
            status: 'success',
            volunteers: volunteers.items || volunteers,
            pagination: volunteers.pagination || undefined
        });
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
            req.user._id // <-- always use the logged-in user's id
        );
        res.status(200).json({ status: 'success', incident });
    } catch (error) {
        console.error('Assign to incident error:', error);
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to assign volunteer.",
            error.statusCode || 500,
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
        console.log(`[INCIDENT] Update endpoint hit for incident: ${req.params.incidentId} by user: ${req.user._id} with data: ${JSON.stringify(req.body)}`);
        const incident = await incidentService.updateIncident(req.params.incidentId, req.body);
        console.log(`[INCIDENT] Incident updated: ${incident._id}`);
        res.status(StatusCodes.OK).json({ status: 'success', incident });
    } catch (error) {
        console.log(`[INCIDENT] Update failed for incident: ${req.params.incidentId} | Reason: ${error.message}`);
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
        console.log(`[INCIDENT] Delete endpoint hit for incident: ${req.params.incidentId} by user: ${req.user._id}`);
        await incidentService.deleteIncident(req.params.incidentId);
        console.log(`[INCIDENT] Incident deleted: ${req.params.incidentId}`);
        res.status(StatusCodes.OK).json({ status: 'success', message: 'Incident deleted' });
    } catch (error) {
        console.log(`[INCIDENT] Delete failed for incident: ${req.params.incidentId} | Reason: ${error.message}`);
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        // You may need to update the service to support pagination for victims
        const incident = await incidentService.getIncidentById(req.params.incidentId);
        if (!incident) {
            throw new CustomError('Incident not found', 404);
        }
        const victims = incident.victims.slice((page - 1) * limit, page * limit);
        res.status(StatusCodes.OK).json({
            status: 'success',
            victims,
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(incident.victims.length / limit),
                totalItems: incident.victims.length
            }
        });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to list victims for incident.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

// Get all reports for an incident
const getReportsForIncident = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const incident = await incidentService.getIncidentById(req.params.incidentId);
        if (!incident) throw new CustomError('Incident not found', 404);
        const reports = incident.reports.slice((page - 1) * limit, page * limit);
        res.status(StatusCodes.OK).json({
            status: 'success',
            reports,
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(incident.reports.length / limit),
                totalItems: incident.reports.length
            }
        });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to get reports.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

// Add a victim to an incident
const addVictimToIncident = async (req, res, next) => {
    try {
        const { incidentId } = req.params;
        const { userId } = req.body;
        const incident = await require('../services/incidentService').addVictimToIncident(incidentId, userId);
        res.status(200).json({ status: 'success', incident });
    } catch (error) {
        res.status(error.statusCode || 400).json({ status: 'error', error: error.message });
    }
};

// Get incident locations
const getIncidentLocations = async (req, res, next) => {
    try {
        const incidentId = req.params.incidentId;
        const incident = await require('../services/incidentService').getIncidentById(incidentId);
        if (!incident) return res.status(404).json({ error: 'Incident not found' });

        // Collect locations for victims and volunteers
        const locations = [
            ...incident.victims.map(u => ({
                userId: u._id,
                name: u.name,
                role: u.role,
                location: u.currentLocation
            })),
            ...incident.volunteers.map(u => ({
                userId: u._id,
                name: u.name,
                role: u.role,
                location: u.currentLocation
            }))
        ];
        res.json({ locations });
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
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
    getReportsForIncident,
    addVictimToIncident,
    getIncidentLocations,
    // ...add more exports as needed
};
// ...add more exports as needed
// ...add more exports as needed
// ...add more exports as needed
// ...add more exports as needed