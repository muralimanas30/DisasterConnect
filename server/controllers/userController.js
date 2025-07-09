// NOTE: This controller expects authentication/authorization middlewares (e.g., JWT, role checks) to be used in routes.
// All business logic is delegated to service files in the 'services' folder.

const userService = require('../services/userService');
const { CustomError } = require('../errorHandler/errorHandler');
const { StatusCodes } = require('http-status-codes');

const register = async (req, res, next) => {
    try {
        const user = await userService.register(req.body);
        // If role is volunteer, create Volunteer doc if not exists
        if (user.role === 'volunteer') {
            const Volunteer = require('../models/Volunteer');
            const exists = await Volunteer.findOne({ user: user._id });
            if (!exists) {
                await Volunteer.create({
                    user: user._id,
                    status: 'available',
                    currentLocation: user.currentLocation,
                    skills: req.body.skills || []
                });
            }
        }
        const token = user.generateJWT();
        res.status(StatusCodes.CREATED).json({ user, token }); // 201
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to register.",
            StatusCodes.BAD_REQUEST,
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
        // console.log('PATCH /api/users/profile called');
        // console.log('Request user:', req.user);
        // console.log('Request body:', req.body);

        const user = await userService.updateUser(req.user._id, req.body);
        let mergedUser = user.toObject ? user.toObject() : { ...user };
        // console.log('User after updateUser:', mergedUser);

        if (user.role === 'volunteer') {
            const Volunteer = require('../models/Volunteer');
            // Always update and fetch the latest volunteer doc
            const volunteer = await Volunteer.findOneAndUpdate(
                { user: user._id },
                req.body,
                { new: true }
            );
            // console.log('Volunteer after findOneAndUpdate:', volunteer);
            if (volunteer) {
                // Merge all volunteer fields (except _id and user) into mergedUser
                const { _id, user: userRef, ...volFields } = volunteer.toObject();
                mergedUser = { ...mergedUser, ...volFields };
                // console.log('Merged user after merging volunteer fields:', mergedUser);
            } else {
                // console.log('No volunteer document found for user:', user._id);
            }
        }

        // console.log('Final response user:', mergedUser);
        res.status(200).json({ user: mergedUser });
    } catch (error) {
        // console.error('Error in updateProfile:', error);
        next(error);
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
