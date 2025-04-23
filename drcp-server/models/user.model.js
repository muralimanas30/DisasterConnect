const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
    },
    role: {
        type: String,
        enum: ["volunteer", "victim", "admin"],
        required: true,
    },
    phone_number: {
        type: String,
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
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    is_google_login: {
        type: Boolean,
        required:false,
        default: false,
    },
    prevIncidents :{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Incident",
    }
});

// Geospatial index
userSchema.index({ location: "2dsphere" });

userSchema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id }, process.env.SECRET, {
        expiresIn: "24h",
    });
};

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Hashes password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Auto-update timestamp
userSchema.pre("save", function (next) {
    this.updated_at = new Date();
    next();
});

// Hide password in responses
userSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    },
});

module.exports = mongoose.model("User", userSchema);
