const resourceService = require('../services/resourceService');
const { CustomError } = require('../errorHandler/errorHandler');
const { StatusCodes } = require('http-status-codes');

const donate = async (req, res, next) => {
    try {
        const donation = await resourceService.donate(req.body, req.user);
        res.status(StatusCodes.CREATED).json({ donation });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to donate resource.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

const getResources = async (req, res, next) => {
    try {
        const resources = await resourceService.getResources(req.query);
        res.status(StatusCodes.OK).json({ resources });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to fetch resources.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

const allocateResource = async (req, res, next) => {
    try {
        const resource = await resourceService.allocateResource(req.body);
        res.status(StatusCodes.OK).json({ resource });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to allocate resource.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

const bulkAllocateResources = async (req, res, next) => {
    try {
        const results = await resourceService.bulkAllocateResources(req.body);
        res.status(StatusCodes.OK).json({ results });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to bulk allocate resources.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

const getDonationHistory = async (req, res, next) => {
    try {
        const history = await resourceService.getDonationHistory(req.user._id);
        res.status(StatusCodes.OK).json({ history });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to fetch donation history.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

const getResourceById = async (req, res, next) => {
    try {
        const resource = await resourceService.getResourceById(req.params.resourceId);
        res.status(StatusCodes.OK).json({ resource });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to fetch resource.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

// Comment out donateMoney controller
// const donateMoney = async (req, res, next) => {
//     try {
//         const { amount, currency, incidentId, resourceType } = req.body;
//         const result = await resourceService.handleMonetaryDonation(
//             { amount, currency, incidentId, resourceType },
//             req.user
//         );
//         res.status(StatusCodes.CREATED).json(result);
//     } catch (error) {
//         next(error instanceof CustomError ? error : new CustomError(
//             error.message || "Failed to process monetary donation.",
//             error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
//             error
//         ));
//     }
// };

module.exports = {
    donate,
    getResources,
    allocateResource,
    bulkAllocateResources,
    getDonationHistory,
    getResourceById,
    // donateMoney,
};
