const Joi = require('joi');

const resourceSchema = Joi.object({
    name: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
    unit: Joi.string().optional(),
    type: Joi.string().valid('food', 'water', 'medicine', 'shelter', 'other').default('other'),
    incident: Joi.string().hex().length(24).optional()
});

const donateSchema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
    incident: Joi.string().optional()
});

const allocateSchema = Joi.object({
    resourceId: Joi.string().hex().length(24).required(),
    incidentId: Joi.string().hex().length(24).required()
});

const bulkAllocateSchema = Joi.object({
    resourceIds: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
    incidentId: Joi.string().hex().length(24).required()
});

const validateResource = (req, res, next) => {
    const { error } = resourceSchema.validate(req.body);
    if (error) {
        return next(new (require('../errorHandler/errorHandler').CustomError)(
            error.details[0].message, 400
        ));
    }
    next();
};

const validateDonate = (req, res, next) => {
    const { error } = donateSchema.validate(req.body);
    if (error) {
        return next(new (require('../errorHandler/errorHandler').CustomError)(
            error.details[0].message, 400
        ));
    }
    next();
};

const validateAllocate = (req, res, next) => {
    const { error } = allocateSchema.validate(req.body);
    if (error) {
        return next(new (require('../errorHandler/errorHandler').CustomError)(
            error.details[0].message, 400
        ));
    }
    next();
};

const validateBulkAllocate = (req, res, next) => {
    const { error } = bulkAllocateSchema.validate(req.body);
    if (error) {
        return next(new (require('../errorHandler/errorHandler').CustomError)(
            error.details[0].message, 400
        ));
    }
    next();
};

module.exports = {
    validateResource,
    validateDonate,
    validateAllocate,
    validateBulkAllocate
};
