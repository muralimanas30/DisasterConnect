const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
    resource_id: {
        type: Number,
        unique: true,
        required: true,
    },
    resource_type: {
        type: String,
        enum: ["food", "medical", "transport", "shelter", "other"],
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    status: {
        type: String,
        enum: ["available", "in_use", "donated", "depleted"],
        required: true,
    },
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

resourceSchema.index({ location: "2dsphere" });


module.exports = mongoose.model("Resource", resourceSchema);
