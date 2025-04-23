const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
    donor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    resource_type: {
        type: String,
        enum: ["food", "medical", "transport", "shelter", "other"],
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Donation", donationSchema);
