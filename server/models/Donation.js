const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' },
    incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident' },
    quantity: { type: Number },
    status: { type: String, enum: ['pending', 'allocated', 'completed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    paymentType: { type: String, enum: ['physical', 'monetary'], default: 'physical' },
    paymentId: { type: String }, // Stripe payment intent ID
    amount: { type: Number }, // For monetary
    currency: { type: String } // For monetary
});

module.exports = mongoose.model('Donation', donationSchema);
