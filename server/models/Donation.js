const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
    incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident' },
    quantity: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'received', 'allocated'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', donationSchema);
