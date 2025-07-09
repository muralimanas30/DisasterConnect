const mongoose = require('mongoose');
const User = require('../models/User');
const Incident = require('../models/Incident');
const { CustomError } = require('../errorHandler/errorHandler');

// Register a new user
const register = async (userData) => {
    // Remove username if present
    if ('username' in userData) delete userData.username;
    const existing = await User.findOne({ email: userData.email });
    if (existing) throw new CustomError('Email already registered', 400);
    const user = new User(userData);
    await user.save();
    return user;
};

// Login user
const login = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new CustomError('Invalid credentials', 401);
    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new CustomError('Invalid credentials', 401);
    const token = user.generateJWT();
    return { user, token };
};

function toObjectId(id) {
    if (id instanceof mongoose.Types.ObjectId) return id;
    if (typeof id === 'string' && mongoose.Types.ObjectId.isValid(id)) {
        return new mongoose.Types.ObjectId(id);
    }
    throw new CustomError('Invalid ObjectId', 400);
}

// Get user by ID
const getUser = async (id) => {
    const objectId = toObjectId(id);
    const user = await User.findById(objectId);
    if (!user) throw new CustomError('User not found.', 404);
    return user;
};

// Update user by ID
const updateUser = async (id, updateData) => {
    const objectId = toObjectId(id);
    const user = await User.findById(objectId);
    if (!user) throw new CustomError('User not found.', 404);

    // Only update allowed fields
    const allowed = ['name', 'email', 'role', 'phone', 'currentLocation'];
    allowed.forEach(field => {
        if (updateData[field] !== undefined) user[field] = updateData[field];
    });
    await user.save();
    return user;
};

// Delete user by ID
const deleteUser = async (id) => {
    const objectId = toObjectId(id);

    // Check if user is assigned to any open/in-progress incidents
    const assignedIncident = await Incident.findOne({
        $or: [
            { victims: objectId },
            { volunteers: objectId }
        ],
        status: { $in: ['open', 'in_progress'] }
    });
    if (assignedIncident) {
        throw new CustomError('Cannot delete user assigned to an active incident.', 400);
    }

    const user = await User.findByIdAndDelete(objectId);
    if (!user) throw new CustomError('User not found.', 404);
    return user;
};

// Get all users
const getAllUsers = async () => {
    return await User.find();
};

// Delete all users
const deleteAllUsers = async () => {
    await User.deleteMany();
};

// Accept gathering invitation
const acceptGatheringInvitation = async (userId, invitationId) => {
    // Example: Mark invitation as accepted for user (expand as needed)
    // This is a stub; actual logic depends on how invitations are stored
    return { userId, invitationId, accepted: true };
};

// Get incident history
const getIncidentHistory = async (userId) => {
    const objectId = toObjectId(userId);
    const incidents = await Incident.find({
        $or: [
            { victims: objectId },
            { volunteers: objectId }
        ]
    });
    return incidents;
};

module.exports = {
    register,
    login,
    getUser,
    updateUser,
    deleteUser,
    getAllUsers,
    deleteAllUsers,
    acceptGatheringInvitation,
    getIncidentHistory,
};