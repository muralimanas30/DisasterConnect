const Joi = require('joi');

const createIncidentSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(''),
    location: Joi.object({
        type: Joi.string().valid('Point').default('Point'),
        coordinates: Joi.array().items(
            Joi.number().min(-180).max(180)
        ).length(2).required()
    }).required(),
    // victims, volunteers, reports, resources are set by backend logic
});

const validateCreateIncident = (req, res, next) => {
    const { error } = createIncidentSchema.validate(req.body);
    if (error) {
        return next(new (require('../errorHandler/errorHandler').CustomError)(
            error.details[0].message, 400
        ));
    }
    next();
};

module.exports = {
    validateCreateIncident
};
