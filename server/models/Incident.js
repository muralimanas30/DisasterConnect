const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true }
    },
    victims: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    reports: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        message: String,
        createdAt: { type: Date, default: Date.now },
        assignedVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    }],
    resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
    createdAt: { type: Date, default: Date.now }
});

incidentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Incident', incidentSchema);
