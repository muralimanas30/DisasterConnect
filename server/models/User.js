const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['victim', 'volunteer', 'admin'], default: 'victim' },
    phone: { type: String },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] }
    },
    createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT method
userSchema.methods.generateJWT = function() {
    return jwt.sign(
        { _id: this._id, email: this.email, role: this.role },
        process.env.JWT_SECRET || require('../config').JWT_SECRET,
        { expiresIn: '7d' }
    );
};

userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);
