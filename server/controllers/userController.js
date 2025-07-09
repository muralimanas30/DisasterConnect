// NOTE: This controller expects authentication/authorization middlewares (e.g., JWT, role checks) to be used in routes.
// All business logic is delegated to service files in the 'services' folder.

const userService = require('../services/userService');
const { CustomError } = require('../errorHandler/errorHandler');
const { StatusCodes } = require('http-status-codes');

const register = async (req, res, next) => {
    try {
        const user = await userService.register(req.body);
        const token = user.generateJWT();
        res.status(StatusCodes.CREATED).json({ user, token }); // 201
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to register.",
            StatusCodes.BAD_REQUEST, // 400 for validation/duplicate errors
            error
        ));
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await userService.login(email, password);
        // Remove password field before sending user object in response
        const userObj = user.toObject ? user.toObject() : { ...user };
        delete userObj.password;
        res.status(StatusCodes.OK).json({ user: userObj, token }); // 200
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to login.",
            StatusCodes.UNAUTHORIZED, // 401 for invalid credentials
            error
        ));
    }
};

const getProfile = async (req, res, next) => {
    try {
        const user = await userService.getUser(req.user._id);
        res.status(StatusCodes.OK).json({ status: 'success', user });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to get profile.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const user = await userService.updateUser(req.user._id, req.body);
        res.status(StatusCodes.OK).json({ status: 'success', user });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to update profile.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

const listUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        res.status(StatusCodes.OK).json({ status: 'success', users });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to list users.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

const deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req.params.userId);
        res.status(StatusCodes.OK).json({ status: 'success', message: 'User deleted' });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to delete user.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

const acceptGatheringInvitation = async (req, res, next) => {
    try {
        const result = await userService.acceptGatheringInvitation(req.user._id, req.body.invitationId);
        res.status(StatusCodes.OK).json({ status: 'success', result });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to accept invitation.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

const getIncidentHistory = async (req, res, next) => {
    try {
        const history = await userService.getIncidentHistory(req.user._id);
        res.status(StatusCodes.OK).json({ status: 'success', history });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to fetch incident history.",
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error
        ));
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    listUsers,
    deleteUser,
    acceptGatheringInvitation,
    getIncidentHistory,
};
