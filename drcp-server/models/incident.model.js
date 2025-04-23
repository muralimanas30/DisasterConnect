const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
    title: { // Add title field
        type: String,
        required: true,
    },
    incident_type: { // Rename to type for consistency
        type: String,
        required: true,
        maxlength: 100,
    },
    description: {
        type: String,
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    },
    reported_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "resolved", "closed"],
        required: true,
        default: "active",
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    live:{
        type:Boolean,
        default:true,
    }
});

incidentSchema.index({ location: "2dsphere" });
module.exports = mongoose.model("Incident", incidentSchema);
