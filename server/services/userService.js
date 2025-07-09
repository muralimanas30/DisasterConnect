const User = require('../models/User');
const Incident = require('../models/Incident');
const { CustomError } = require('../errorHandler/errorHandler');

// Register a new user
const register = async (userData) => {
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

// Get user by ID
const getUser = async (id) => {
    const user = await User.findById(id);
    if (!user) throw new CustomError('User not found.', 404);
    return user;
};

// Update user by ID
const updateUser = async (id, updateData) => {
    const user = await User.findById(id);
    if (!user) throw new CustomError('User not found.', 404);

    // Only update allowed fields
    const allowed = ['username', 'email', 'role', 'phone_number', 'location'];
    allowed.forEach(field => {
        if (updateData[field] !== undefined) user[field] = updateData[field];
    });
    await user.save();
    return user;
};

// Delete user by ID
const deleteUser = async (id) => {
    const user = await User.findByIdAndDelete(id);
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
    // Find all incidents where user is a victim or volunteer
    const incidents = await Incident.find({
        $or: [
            { victims: userId },
            { volunteers: userId }
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