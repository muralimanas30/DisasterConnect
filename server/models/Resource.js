const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true }, // e.g., food, water, medicine, etc.
    quantity: { type: Number, required: true },
    donatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    allocated: { type: Boolean, default: false },
    incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resource', resourceSchema);
module.exports = mongoose.model('Resource', resourceSchema);
