'use strict';

const Joi = require('@hapi/joi');

const createPlaceSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().min(5).required(),
    address: Joi.string().required(),
    userId: Joi.string().required(),
    file: Joi.required()
});

module.exports = createPlaceSchema;