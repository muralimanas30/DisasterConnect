const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('victim', 'volunteer', 'admin').optional(),
    phone: Joi.string().optional(),
    location: Joi.object({
        type: Joi.string().valid('Point').default('Point'),
        coordinates: Joi.array().items(
            Joi.number().min(-180).max(180)
        ).length(2).required()
    }).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const validateRegister = (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return next(new (require('../errorHandler/errorHandler').CustomError)(
            error.details[0].message, 400
        ));
    }
    next();
};

const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return next(new (require('../errorHandler/errorHandler').CustomError)(
            error.details[0].message, 400
        ));
    }
    next();
};

module.exports = {
    validateRegister,
    validateLogin
};
