const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    currentLocation: Joi.object({
        type: Joi.string().valid('Point').default('Point'),
        coordinates: Joi.array().items(
            Joi.number().min(-180).max(180)
        ).length(2).required()
    }).required(),
    skills: Joi.array().items(Joi.string()).optional()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const profileSchema = Joi.object({
    status: Joi.string().valid('available', 'busy', 'inactive').optional(),
    skills: Joi.array().items(Joi.string()).optional(),
    currentLocation: Joi.object({
        type: Joi.string().valid('Point').default('Point'),
        coordinates: Joi.array().items(
            Joi.number().min(-180).max(180)
        ).length(2).optional()
    }).optional()
});

const statusSchema = Joi.object({
    status: Joi.string().valid('available', 'busy', 'inactive').required()
});

const validateRegister = (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) return next(new (require('../errorHandler/errorHandler').CustomError)(error.details[0].message, 400));
    next();
};

const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) return next(new (require('../errorHandler/errorHandler').CustomError)(error.details[0].message, 400));
    next();
};

const validateProfile = (req, res, next) => {
    const { error } = profileSchema.validate(req.body);
    if (error) return next(new (require('../errorHandler/errorHandler').CustomError)(error.details[0].message, 400));
    next();
};

const validateStatus = (req, res, next) => {
    const { error } = statusSchema.validate(req.body);
    if (error) return next(new (require('../errorHandler/errorHandler').CustomError)(error.details[0].message, 400));
    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validateProfile,
    validateStatus,
};
