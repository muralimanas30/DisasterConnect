const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { CustomError } = require('../errorHandler/errorHandler');

module.exports = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new CustomError('No token provided', 401));
    }
    const token = authHeader.split(' ')[1];
    console.log('TOKEN:', token);
    console.log('SECRET:', process.env.JWT_SECRET || require('../config').JWT_SECRET);
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || require('../config').JWT_SECRET);
        req.user = await User.findById(payload._id);
        if (!req.user) throw new CustomError('User not found', 401);
        next();
    } catch (err) {
        next(new CustomError('Invalid token', 401));
    }
};
