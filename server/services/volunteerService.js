const Volunteer = require('../models/Volunteer');
const User = require('../models/User');
const Incident = require('../models/Incident');
const bcrypt = require('bcryptjs');
const { CustomError } = require('../errorHandler/errorHandler');
const mongoose = require('mongoose');

function toObjectId(id) {
    if (id instanceof mongoose.Types.ObjectId) return id;
    if (typeof id === 'string' && mongoose.Types.ObjectId.isValid(id)) {
        return new mongoose.Types.ObjectId(id);
    }
    throw new CustomError('Invalid ObjectId', 400);
}

// Register a new volunteer
const register = async (data) => {
    // Create user and volunteer profile
    const existing = await User.findOne({ email: data.email });
    if (existing) throw new CustomError('Email already registered', 400);
    const user = new User({ ...data, role: 'volunteer' });
    await user.save();
    const volunteer = new Volunteer({ user: user._id, ...data });
    await volunteer.save();
    volunteer.generateJWT = user.generateJWT.bind(user);
    return volunteer;
};

// Volunteer login
const login = async (email, password) => {
    const user = await User.findOne({ email, role: 'volunteer' });
    if (!user) throw new CustomError('Invalid credentials', 401);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new CustomError('Invalid credentials', 401);
    const volunteer = await Volunteer.findOne({ user: user._id });
    if (!volunteer) throw new CustomError('Volunteer profile not found', 404);
    volunteer.generateJWT = user.generateJWT.bind(user);
    const token = user.generateJWT();
    return { volunteer, token };
};

// Get volunteer by User ID
const getVolunteerByUserId = async (userId) => {
    const volunteer = await Volunteer.findOne({ user: userId }).populate('user');
    if (!volunteer) throw new CustomError('Volunteer not found', 404);
    return volunteer;
};

// Update volunteer profile
const updateProfile = async (userId, updateData) => {
    const volunteer = await Volunteer.findOneAndUpdate({ user: userId }, updateData, { new: true });
    if (!volunteer) throw new CustomError('Volunteer not found', 404);
    return volunteer;
};

// Assign volunteer to an incident
const assignToIncident = async (userId, incidentId) => {
    const objectId = toObjectId(incidentId);
    console.log('Assigning user', userId, 'to incident', objectId);
    const unresolved = await Incident.findOne({
        _id: { $ne: objectId },
        volunteers: userId,
        status: { $ne: 'resolved' }
    });
    if (unresolved) {
        throw new CustomError('You can only be assigned to one unresolved incident at a time.', 400);
    }

    const incident = await Incident.findById(objectId);
    if (!incident) throw new CustomError('Incident not found', 404);

    if (!incident.volunteers.some(v => v.toString() === userId.toString())) {
        incident.volunteers.push(userId);
        await incident.save();
    }
    return true;
};

// Update volunteer status
const updateStatus = async (userId, status) => {
    const volunteer = await Volunteer.findOneAndUpdate({ user: userId }, { status }, { new: true });
    if (!volunteer) throw new CustomError('Volunteer not found', 404);
    return volunteer;
};

// Update volunteer location
const updateLocation = async (userId, location) => {
    const volunteer = await Volunteer.findOneAndUpdate({ user: userId }, { currentLocation: location }, { new: true });
    if (!volunteer) throw new CustomError('Volunteer not found', 404);
    return volunteer;
};

// Get assigned incidents for a volunteer
const getAssignedIncidents = async (userId) => {
    const objectId = toObjectId(userId);
    return await Incident.find({ volunteers: objectId });
};

module.exports = {
    register,
    login,
    getVolunteerByUserId,
    updateProfile,
    assignToIncident,
    updateStatus,
    updateLocation,
    getAssignedIncidents,
};
