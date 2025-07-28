const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { CustomError } = require('../errorHandler/errorHandler');

module.exports = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log(`[AUTH] No token provided for ${req.method} ${req.originalUrl}`);
        return next(new CustomError('No token provided', 401));
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || require('../config').JWT_SECRET);
        req.user = await User.findById(payload._id);
        if (!req.user) {
            console.log(`[AUTH] User not found for token on ${req.method} ${req.originalUrl}`);
            throw new CustomError('User not found', 401);
        }
        next();
    } catch (err) {
        console.log(`[AUTH] Invalid token for ${req.method} ${req.originalUrl}`);
        next(new CustomError('Invalid token', 401));
    }
};
