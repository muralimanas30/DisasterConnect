const volunteerService = require('../services/volunteerService');
const { CustomError } = require('../errorHandler/errorHandler');
const { StatusCodes } = require('http-status-codes');

// Only volunteer-specific logic

const assignToIncident = async (req, res, next) => {
    try {
        const result = await volunteerService.assignToIncident(
            req.user._id,
            req.body.incidentId || req.params.incidentId
        );
        res.status(200).json({ assigned: result });
    } catch (error) {
        console.error('Assign to incident error:', error); // Add this line
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to assign to incident.",
            error.statusCode || 500,
            error
        ));
    }
};

const getAssignedIncidents = async (req, res, next) => {
    try {
        const incidents = await volunteerService.getAssignedIncidents(req.user._id);
        res.status(StatusCodes.OK).json({ incidents });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to get assigned incidents.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

module.exports = {
    assignToIncident,
    getAssignedIncidents,
};