const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    status: { type: String, enum: ['available', 'busy', 'inactive'], default: 'available', required: true },
    currentLocation: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] }
    },
    skills: [String],
    // Add more volunteer-specific fields as needed
});

volunteerSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model('Volunteer', volunteerSchema);
