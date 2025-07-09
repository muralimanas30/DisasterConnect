const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String },
    type: { type: String, enum: ['food', 'water', 'medicine', 'shelter', 'other'], default: 'other' },
    incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident' },
    donatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    allocated: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resource', resourceSchema);
