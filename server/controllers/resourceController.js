const resourceService = require('../services/resourceService');
const { CustomError } = require('../errorHandler/errorHandler');

const donate = async (req, res, next) => {
    try {
        const donation = await resourceService.donate(req.body, req.user);
        res.status(201).json({ status: 'success', donation });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to process donation.",
            error.statusCode || 500,
            error
        ));
    }
};

const getResources = async (req, res, next) => {
    try {
        const resources = await resourceService.getResources(req.query);
        res.status(200).json({ status: 'success', resources });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to fetch resources.",
            error.statusCode || 500,
            error
        ));
    }
};

const allocateResource = async (req, res, next) => {
    try {
        const resource = await resourceService.allocateResource(req.body);
        res.status(200).json({ status: 'success', resource });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to allocate resource.",
            error.statusCode || 500,
            error
        ));
    }
};

const bulkAllocateResources = async (req, res, next) => {
    try {
        const results = await resourceService.bulkAllocateResources(req.body);
        res.status(200).json({ status: 'success', results });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to allocate resources.",
            error.statusCode || 500,
            error
        ));
    }
};

const getDonationHistory = async (req, res, next) => {
    try {
        const history = await resourceService.getDonationHistory(req.user._id);
        res.status(200).json({ status: 'success', history });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to fetch donation history.",
            error.statusCode || 500,
            error
        ));
    }
};

const getResourceById = async (req, res, next) => {
    try {
        const resource = await resourceService.getResourceById(req.params.resourceId);
        res.status(200).json({ status: 'success', resource });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to fetch resource details.",
            error.statusCode || 500,
            error
        ));
    }
};

module.exports = {
    donate,
    getResources,
    allocateResource,
    bulkAllocateResources,
    getDonationHistory,
    getResourceById,
};
