const volunteerService = require('../services/volunteerService');
const { CustomError } = require('../errorHandler/errorHandler');
const { StatusCodes } = require('http-status-codes');

const getVolunteers = async (req, res, next) => {
    try {
        const volunteers = await volunteerService.getVolunteers(req.query);
        res.status(StatusCodes.OK).json({ status: 'success', volunteers });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to fetch volunteers.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

const assignVolunteer = async (req, res, next) => {
    try {
        const { incidentId, volunteerId } = req.body;
        const result = await volunteerService.assignVolunteer(incidentId, volunteerId);
        res.status(StatusCodes.OK).json({ status: 'success', ...result });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to assign volunteer.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

const updateVolunteerLocation = async (req, res, next) => {
    try {
        const updated = await volunteerService.updateVolunteerLocation(req.user._id, req.body.currentLocation);
        res.status(StatusCodes.OK).json({ status: 'success', volunteer: updated });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to update volunteer location.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

const markVolunteerReached = async (req, res, next) => {
    try {
        const { incidentId } = req.body;
        const result = await volunteerService.markVolunteerReached(incidentId, req.user._id);
        res.status(StatusCodes.OK).json({ status: 'success', result });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to mark volunteer as reached.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

const getAssignedIncidents = async (req, res, next) => {
    try {
        const incidents = await volunteerService.getAssignedIncidents(req.user._id);
        res.status(StatusCodes.OK).json({ status: 'success', incidents });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to fetch assigned incidents.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

const getProfile = async (req, res, next) => {
    try {
        const volunteer = await volunteerService.getVolunteerByUserId(req.user._id);
        res.status(StatusCodes.OK).json({ status: 'success', volunteer });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to get volunteer profile.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const volunteer = await volunteerService.updateVolunteerProfile(req.user._id, req.body);
        res.status(StatusCodes.OK).json({ status: 'success', volunteer });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to update volunteer profile.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

module.exports = {
    getVolunteers,
    assignVolunteer,
    updateVolunteerLocation,
    markVolunteerReached,
    getAssignedIncidents,
    getProfile,
    updateProfile,
};
