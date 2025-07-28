// NOTE: This controller expects authentication/authorization middlewares (e.g., JWT, role checks) to be used in routes.
// All business logic is delegated to service files in the 'services' folder.

const userService = require('../services/userService');
const { CustomError } = require('../errorHandler/errorHandler');
const { StatusCodes } = require('http-status-codes');
const Incident = require("../models/Incident");
const Volunteer = require("../models/Volunteer");
const User = require("../models/User");

const register = async (req, res, next) => {
    try {
        // Log registration attempt
        console.log(`[USER] Register endpoint hit with data: ${JSON.stringify(req.body)}`);
        const user = await userService.register(req.body);
        // If role is volunteer, create Volunteer doc if not exists
        if (user.role === 'volunteer') {
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
        console.log(`[USER] Registration successful for user: ${user.email} (role: ${user.role})`);
        res.status(StatusCodes.CREATED).json({ user, token });
    } catch (error) {
        console.log(`[USER] Registration failed: ${error.message}`);
        res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

const login = async (req, res, next) => {
    try {
        console.log(`[USER] Login endpoint hit for email: ${req.body.email}`);
        const { email, password, currentLocation } = req.body;
        const { user, token } = await userService.login(email, password);

        // Update currentLocation if provided
        let updatedUser = user;
        if (currentLocation) {
            user.currentLocation = currentLocation;
            await user.save();
            // If user is a volunteer, update volunteer profile location too
            if (user.role === 'volunteer') {
                const Volunteer = require('../models/Volunteer');
                await Volunteer.findOneAndUpdate(
                    { user: user._id },
                    { currentLocation },
                    { new: true }
                );
            }
            updatedUser = await userService.getUser(user._id); // fetch updated user
        }

        // Remove password field before sending user object in response
        const userObj = updatedUser.toObject ? updatedUser.toObject() : { ...updatedUser };
        delete userObj.password;
        console.log(`[USER] Login successful for user: ${user.email}`);
        res.status(StatusCodes.OK).json({ user: userObj, token });
    } catch (error) {
        console.log(`[USER] Login failed for email: ${req.body.email} | Reason: ${error.message}`);
        res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
    }
};

const getProfile = async (req, res, next) => {
    try {
        const user = await userService.getUser(req.user._id);
        res.status(StatusCodes.OK).json({ status: 'success', user });
    } catch (error) {
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

const updateProfile = async (req, res, next) => {
    try {
        // Only allow updating allowed fields, including currentLocation
        const allowedFields = ["name", "email", "phone", "address", "currentLocation", "role"];
        const updateData = {};
        for (const key of allowedFields) {
            if (req.body[key] !== undefined) {
                updateData[key] = req.body[key];
            }
        }
        const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true });
        res.json(user);
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

const listUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await userService.getAllUsers(page, limit);
        res.status(StatusCodes.OK).json({ status: 'success', ...result });
    } catch (error) {
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

const deleteUser = async (req, res, next) => {
    try {
        console.log(`[USER] Delete endpoint hit for user: ${req.params.userId}`);
        await userService.deleteUser(req.params.userId);
        console.log(`[USER] User deleted: ${req.params.userId}`);
        res.status(StatusCodes.OK).json({ status: 'success', message: 'User deleted' });
    } catch (error) {
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

const acceptGatheringInvitation = async (req, res, next) => {
    try {
        const result = await userService.acceptGatheringInvitation(req.user._id, req.body.invitationId);
        res.status(StatusCodes.OK).json({ status: 'success', result });
    } catch (error) {
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

const getIncidentHistory = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await userService.getIncidentHistory(req.user._id, page, limit);
        res.status(StatusCodes.OK).json({ status: 'success', ...result });
    } catch (error) {
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

const getAssignedIncident = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        // Only allow self or admin to fetch
        if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const user = await userService.getUser(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const incident = await userService.getAssignedIncident(userId);
        res.json({ incident: incident || null });
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
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
    getAssignedIncident,
};