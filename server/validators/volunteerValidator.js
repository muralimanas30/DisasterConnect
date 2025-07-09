const Joi = require('joi');

const profileSchema = Joi.object({
    skills: Joi.array().items(Joi.string()).optional(),
    currentLocation: Joi.object({
        type: Joi.string().valid('Point').default('Point'),
        coordinates: Joi.array().items(
            Joi.number().min(-180).max(180)
        ).length(2).required()
    }).optional(),
    status: Joi.string().valid('available', 'assigned', 'busy').optional()
});

const validateProfile = (req, res, next) => {
    const { error } = profileSchema.validate(req.body);
    if (error) {
        return next(new (require('../errorHandler/errorHandler').CustomError)(
            error.details[0].message, 400
        ));
    }
    next();
};

module.exports = {
    validateProfile
};
