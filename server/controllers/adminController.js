const adminService = require('../services/adminService');
const { CustomError } = require('../errorHandler/errorHandler');

const getDashboardStats = async (req, res, next) => {
    try {
        const stats = await adminService.getDashboardStats();
        res.status(200).json({ status: 'success', stats });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to fetch dashboard stats.",
            error.statusCode || 500,
            error
        ));
    }
};

// Add more admin-related controllers as needed (manage users, incidents, etc.)

module.exports = {
    getDashboardStats,
    // ...add more exports as needed
};
