const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    assignedIncidents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Incident' }],
    currentLocation: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] }
    },
    status: { type: String, enum: ['available', 'assigned', 'busy'], default: 'available' },
    skills: [{ type: String }]
});

volunteerSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model('Volunteer', volunteerSchema);
